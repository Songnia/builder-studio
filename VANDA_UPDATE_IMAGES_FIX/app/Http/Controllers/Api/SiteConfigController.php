<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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
            ->get();

        return response()->json($configs);
    }

    /**
     * Store a newly created site config.
     */
    /**
     * Store a newly created site config.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:site_configs,slug|regex:/^[a-z0-9-]+$/',
            'config_data' => 'required|array',
            'is_published' => 'boolean',
        ]);

        // Set authenticated user's ID
        $validated['user_id'] = $request->user()->id;
        $validated['is_published'] = $request->input('is_published', true);

        $siteConfig = SiteConfig::create($validated);
        
        return response()->json([
            'message' => 'Site configuration created successfully',
            'data' => $siteConfig
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

        return response()->json($siteConfig);
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
            'site_name' => 'sometimes|string|max:255',
            'config_data' => 'sometimes|array',
            'slug' => 'nullable|string|unique:site_configs,slug,' . $id . '|regex:/^[a-z0-9-]+$/',
            'is_published' => 'boolean'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $siteConfig->update($request->only(['site_name', 'config_data', 'slug', 'is_published']));

        return response()->json([
            'message' => 'Site configuration updated successfully',
            'data' => $siteConfig
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
            'data' => $siteConfig
        ]);
    }

    /**
     * Récupérer la configuration publique d'un site par slug
     */
    public function getPublicConfig($slug)
    {
        $siteConfig = SiteConfig::where('slug', $slug)
            ->where('is_published', true)
            ->with('user')
            ->first();

        if (!$siteConfig) {
            return response()->json([
                'message' => 'Site non trouvé ou non publié'
            ], 404);
        }

        return response()->json([
            'site_name' => $siteConfig->site_name,
            'slug' => $siteConfig->slug,
            'config_data' => $siteConfig->config_data,
            'photographer' => [
                'name' => $siteConfig->user->name ?? 'Photographe',
                'bio' => $siteConfig->user->bio ?? '',
                'avatar' => $siteConfig->user->avatar ?? '',
            ],
            'created_at' => $siteConfig->created_at,
        ]);
    }
}
