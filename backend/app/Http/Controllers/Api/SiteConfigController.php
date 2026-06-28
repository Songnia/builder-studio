<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use App\Support\PublicMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SiteConfigController extends Controller
{
    /**
     * Display a listing of the authenticated user's site configs.
     */
    public function index(Request $request)
    {
        // Remove orderBy to avoid MySQL sort memory issues with large config_data JSON
        $configs = SiteConfig::ownedByCurrentUser()
            ->get()
            ->map(fn (SiteConfig $siteConfig) => $this->serializeSiteConfig($siteConfig));

        return response()->json($configs);
    }

    /**
     * Store a newly created site config.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'site_name'    => 'required|string|max:255',
            'slug'         => 'nullable|string|unique:site_configs,slug|regex:/^[a-z0-9-]+$/',
            'config_data'  => 'required|array',
            'is_published' => 'boolean',
        ]);

        // Auto-migrate any Base64 images to physical files
        $validated['config_data'] = $this->migrateBase64Images(
            $validated['config_data'],
            $request->user()->id
        );

        $validated['user_id']      = $request->user()->id;
        $validated['is_published'] = $request->input('is_published', true);

        $siteConfig = SiteConfig::create($validated);

        return response()->json([
            'message' => 'Site configuration created successfully',
            'data'    => $this->serializeSiteConfig($siteConfig),
        ], 201);
    }

    /**
     * Display the specified site config.
     */
    public function show(Request $request, $id)
    {
        $siteConfig = SiteConfig::ownedByCurrentUser()
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($this->serializeSiteConfig($siteConfig));
    }

    /**
     * Update the specified site config.
     */
    public function update(Request $request, $id)
    {
        $siteConfig = SiteConfig::ownedByCurrentUser()
            ->where('id', $id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'site_name'    => 'sometimes|string|max:255',
            'config_data'  => 'sometimes|array',
            'slug'         => 'nullable|string|unique:site_configs,slug,' . $id . '|regex:/^[a-z0-9-]+$/',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $data = $request->only(['site_name', 'config_data', 'slug', 'is_published']);

        // Auto-migrate any Base64 images to physical files
        if (isset($data['config_data'])) {
            $data['config_data'] = $this->migrateBase64Images(
                $data['config_data'],
                $request->user()->id
            );
        }

        $siteConfig->update($data);

        return response()->json([
            'message' => 'Site configuration updated successfully',
            'data'    => $this->serializeSiteConfig($siteConfig),
        ]);
    }

    /**
     * Remove the specified site config.
     */
    public function destroy(Request $request, $id)
    {
        $siteConfig = SiteConfig::ownedByCurrentUser()
            ->where('id', $id)
            ->firstOrFail();

        $siteConfig->delete();

        return response()->json(['message' => 'Site configuration deleted successfully']);
    }

    /**
     * Publish or unpublish a site config.
     */
    public function publish(Request $request, $id)
    {
        $siteConfig = SiteConfig::ownedByCurrentUser()
            ->where('id', $id)
            ->firstOrFail();

        $request->validate(['is_published' => 'required|boolean']);

        $siteConfig->update(['is_published' => $request->is_published]);

        return response()->json([
            'message' => 'Site status updated',
            'data'    => $this->serializeSiteConfig($siteConfig),
        ]);
    }

    /**
     * Récupérer la configuration publique d'un site par slug.
     */
    public function getPublicConfig($slug)
    {
        $siteConfig = SiteConfig::where('slug', $slug)
            ->where('is_published', true)
            ->with('user')
            ->first();

        if (! $siteConfig) {
            return response()->json(['message' => 'Site non trouvé ou non publié'], 404);
        }

        return response()->json([
            'site_name'   => $siteConfig->site_name,
            'slug'        => $siteConfig->slug,
            'config_data' => $this->normalizeConfigMediaUrls($siteConfig->config_data),
            'photographer' => [
                'name'   => $siteConfig->user->name   ?? 'Photographe',
                'bio'    => $siteConfig->user->bio    ?? '',
                'avatar' => $siteConfig->user->avatar ?? '',
            ],
            'created_at' => $siteConfig->created_at,
        ]);
    }

    // =========================================================================
    //  PRIVATE HELPERS
    // =========================================================================

    /**
     * Recursively scan $configData, detect Base64 image strings,
     * save them as physical files, and replace with public storage URLs.
     *
     * This eliminates 413 "Content Too Large" errors caused by large
     * Base64 strings embedded directly in the JSON config.
     * It also acts as a transparent migration for old data.
     *
     * @param  array $configData  The raw config_data array from the request.
     * @param  int   $userId      Owner's user ID (used for storage path).
     * @return array              Config data with Base64 replaced by URLs.
     */
    private function migrateBase64Images(array $configData, int $userId): array
    {
        array_walk_recursive($configData, function (&$value) use ($userId) {
            if (! is_string($value)) {
                return;
            }

            // Detect Base64 image pattern: data:image/png;base64,<data>
            if (! preg_match('/^data:(image\/[a-zA-Z+]+);base64,(.+)$/s', $value, $matches)) {
                return;
            }

            $mimeType  = $matches[1]; // e.g. "image/jpeg"
            $base64Raw = $matches[2];

            // Map MIME type to file extension
            $extension = match (true) {
                str_contains($mimeType, 'jpeg'),
                str_contains($mimeType, 'jpg')  => 'jpg',
                str_contains($mimeType, 'png')  => 'png',
                str_contains($mimeType, 'webp') => 'webp',
                str_contains($mimeType, 'gif')  => 'gif',
                default                         => 'jpg',
            };

            $decoded = base64_decode($base64Raw, strict: true);

            if ($decoded === false) {
                // Corrupt Base64 — clear to avoid storing garbage
                $value = '';
                return;
            }

            // Path: builder-media/{userId}/migrated/{uuid}.{ext}
            $path = "builder-media/{$userId}/migrated/" . Str::uuid() . ".{$extension}";

            try {
                Storage::disk('public')->put($path, $decoded);
                $value = PublicMedia::url($path);
            } catch (\Throwable $e) {
                // If storage fails, clear the field rather than keep a multi-MB Base64 string
                Log::warning("Base64 migration failed for user {$userId}: " . $e->getMessage());
                $value = '';
            }
        });

        return $configData;
    }

    private function normalizeConfigMediaUrls(array $configData): array
    {
        array_walk_recursive($configData, function (&$value) {
            if (! is_string($value)) {
                return;
            }

            $value = PublicMedia::normalizeUrlIfPublicMedia($value) ?? $value;
        });

        return $configData;
    }

    private function serializeSiteConfig(SiteConfig $siteConfig): array
    {
        $payload = $siteConfig->toArray();

        if (isset($payload['config_data']) && is_array($payload['config_data'])) {
            $payload['config_data'] = $this->normalizeConfigMediaUrls($payload['config_data']);
        }

        return $payload;
    }
}
