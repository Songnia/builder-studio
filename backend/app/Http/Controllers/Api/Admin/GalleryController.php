<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Services\SubscriptionEntitlementService;
use App\Services\OnboardingLifecycleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        return Gallery::ownedByCurrentUser()
            ->with([
                'user.siteConfigs',
                'photos' => function ($query) {
                    $query->withCount('likes as is_liked');
                },
            ])
            ->latest()
            ->paginate(20);
    }

    public function store(Request $request, SubscriptionEntitlementService $subscriptions, OnboardingLifecycleService $onboarding)
    {
        if ($denied = $subscriptions->authorize($request->user(), 'secure_gallery_delivery')) {
            return $denied;
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_phone' => 'nullable|string|max:20',
            'pin_code' => 'nullable|string|max:4',
            'zip_file' => 'sometimes|file|mimes:zip,rar,7z,tar|max:102400',
            'photos' => 'sometimes|array',
            'photos.*' => 'file|image|mimes:jpeg,jpg,png,webp|max:10240',
        ]);

        try {
            $gallery = DB::transaction(function () use ($request, $subscriptions, $validated) {
                // Serialize quota-consuming writes for this account.
                $request->user()->newQuery()->whereKey($request->user()->id)->lockForUpdate()->firstOrFail();

                $usage = $subscriptions->activeGalleryUsage($request->user());
                $limit = $subscriptions->limit($request->user(), 'active_galleries_monthly_limit');
                if ($limit !== null && $usage >= $limit) {
                    return $subscriptions->quotaExceeded('active_galleries_monthly_limit', $limit, $usage);
                }

                return Gallery::create([
                    'uuid' => Str::uuid(),
                    'user_id' => $request->user()->id,
                    'title' => $validated['title'],
                    'description' => $validated['description'] ?? null,
                    'client_phone' => $validated['client_phone'] ?? null,
                    'pin_code' => $validated['pin_code'] ?? null,
                    'status' => 'draft',
                ]);
            });

            if ($gallery instanceof JsonResponse) {
                return $gallery;
            }

            Log::info('Gallery created: '.$gallery->id);

            $eventName = $request->user()->galleries()->whereKeyNot($gallery->id)->exists()
                ? 'gallery_created'
                : 'first_gallery_created';
            $onboarding->recordAndTrigger($request->user(), $eventName, $gallery, ['gallery_uuid' => $gallery->uuid]);

            if ($request->hasFile('zip_file')) {
                Log::info('Processing zip file');
                $file = $request->file('zip_file');
                Log::info('Zip file details: '.json_encode([
                    'originalName' => $file->getClientOriginalName(),
                    'mimeType' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->getPathname(),
                    'error' => $file->getError(),
                ]));

                $path = $file->store('zips', 'public');
                $gallery->update(['zip_path' => $path]);
            }

            if ($request->hasFile('photos')) {
                Log::info('Processing photos count: '.count($request->file('photos')));
                foreach ($request->file('photos') as $photo) {
                    $media = $gallery->addMedia($photo)->toMediaCollection('photos');

                    // Stocker le chemin relatif (stable, indépendant de APP_URL)
                    $relativePath = $media->id.'/'.$media->file_name;
                    $gallery->photos()->create([
                        'file_path' => $relativePath,
                        'thumbnail_path' => $relativePath, // Sera généré via Spatie conversions
                        'order_column' => 0,
                    ]);
                }
            }

            return response()->json($gallery->load('photos'), 201);
        } catch (\Exception $e) {
            Log::error('Error creating gallery: '.$e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        return Gallery::ownedByCurrentUser()
            ->where(function ($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->with([
                'user.siteConfigs',
                'photos' => function ($query) {
                    $query->withCount('likes as is_liked');
                },
            ])
            ->firstOrFail();
    }

    public function recordShare(Request $request, $id, OnboardingLifecycleService $onboarding)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(fn ($query) => $query->where('uuid', $id)->orWhere('id', $id))
            ->firstOrFail();

        $validated = $request->validate(['channel' => 'required|in:clipboard,whatsapp']);
        $onboarding->recordOnce($request->user(), 'first_gallery_shared', $gallery, [
            'gallery_uuid' => $gallery->uuid,
            'channel' => $validated['channel'],
        ]);

        return response()->noContent();
    }

    public function update(Request $request, $id)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(function ($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'client_phone' => 'sometimes|nullable|string|max:20',
            'pin_code' => 'sometimes|nullable|string|max:4',
            'status' => 'sometimes|required|in:draft,published,archived',
        ]);

        $gallery->update($validated);

        return response()->json($gallery->fresh()->load('photos'));
    }

    public function destroy(Request $request, $id)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(function ($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->firstOrFail();

        $gallery->delete(); // Cascades photos and likes

        return response()->noContent();
    }

    public function uploadZip(Request $request, $id)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(function ($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->firstOrFail();

        $validated = $request->validate([
            'zip_file' => 'required|file|mimes:zip,rar,7z,tar|max:102400',
        ]);

        $file = $request->file('zip_file');
        $path = $file->store('zips', 'public');
        $gallery->update(['zip_path' => $path]);

        return response()->json(['message' => 'ZIP uploaded successfully', 'zip_path' => $path]);
    }

    public function addPhotos(Request $request, $id)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(function ($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->firstOrFail();

        $validated = $request->validate([
            'photos.*' => 'required|image|mimes:jpeg,jpg,png|max:5120',
        ]);

        Log::info('Adding photos to gallery: '.$gallery->id);

        if ($request->hasFile('photos')) {
            $files = $request->file('photos');
            Log::info('Photos count in request: '.(is_array($files) ? count($files) : '1'));

            foreach ($request->file('photos') as $photo) {
                try {
                    $media = $gallery->addMedia($photo)->toMediaCollection('photos');
                    Log::info('Media added: '.$media->id);

                    // Stocker le chemin relatif (stable, indépendant de APP_URL)
                    $relativePath = $media->id.'/'.$media->file_name;
                    $gallery->photos()->create([
                        'file_path' => $relativePath,
                        'thumbnail_path' => $relativePath,
                        'order_column' => 0,
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to add photo: '.$e->getMessage());
                }
            }
        } else {
            Log::warning('No photos found in request for gallery: '.$gallery->id);
        }

        return response()->json($gallery->load('photos'));
    }

    public function deletePhoto(Request $request, $id, $photoId)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(function ($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->firstOrFail();
        $photo = $gallery->photos()->findOrFail($photoId);

        // Find associated media and delete it
        // We can try to find media by the filename in the file_path
        $filename = basename($photo->file_path);
        $media = $gallery->getMedia('photos')->first(function ($m) use ($filename) {
            return $m->file_name === $filename || basename($m->getUrl()) === $filename;
        });

        if ($media) {
            $media->delete();
        }

        $photo->delete();

        return response()->noContent();
    }
}
