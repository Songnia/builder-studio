<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Gallery;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        return Gallery::ownedByCurrentUser()
            ->with([
                'user.siteConfigs',
                'photos' => function($query) {
                    $query->withCount('likes as is_liked');
                }
            ])
            ->latest()
            ->paginate(20);
    }

    public function store(Request $request)
    {
        // Custom debug logging
        $logFile = storage_path('logs/custom_debug.log');
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($logFile, "[$timestamp] Request hit store\n", FILE_APPEND);
        file_put_contents($logFile, "[$timestamp] Input: " . json_encode($request->all()) . "\n", FILE_APPEND);
        file_put_contents($logFile, "[$timestamp] Files: " . json_encode($_FILES) . "\n", FILE_APPEND);

        try {
            // Validation should not be in try-catch to allow 422 response
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'client_phone' => 'nullable|string|max:20',
                'pin_code' => 'nullable|string|max:4',
                'zip_file' => 'sometimes|file', 
                'photos' => 'sometimes|array',
                'photos.*' => 'file|image|mimes:jpeg,jpg,png|max:5120',
            ]);
            file_put_contents($logFile, "[$timestamp] Validation passed\n", FILE_APPEND);

        } catch (\Illuminate\Validation\ValidationException $e) {
             file_put_contents($logFile, "[$timestamp] Validation FAILED: " . json_encode($e->errors()) . "\n", FILE_APPEND);
             throw $e;
        }

        try {
            $gallery = Gallery::create([
                'uuid' => Str::uuid(),
                'user_id' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'client_phone' => $validated['client_phone'] ?? null,
                'pin_code' => $validated['pin_code'] ?? null,
                'status' => 'draft',
            ]);
            \Illuminate\Support\Facades\Log::info('Gallery created: ' . $gallery->id);

            if ($request->hasFile('zip_file')) {
                \Illuminate\Support\Facades\Log::info('Processing zip file');
                $file = $request->file('zip_file');
                \Illuminate\Support\Facades\Log::info('Zip file details: ' . json_encode([
                    'originalName' => $file->getClientOriginalName(),
                    'mimeType' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->getPathname(),
                    'error' => $file->getError()
                ]));
                
                $path = $file->store('zips', 'public');
                $gallery->update(['zip_path' => $path]);
            }

            if ($request->hasFile('photos')) {
                \Illuminate\Support\Facades\Log::info('Processing photos count: ' . count($request->file('photos')));
                foreach ($request->file('photos') as $photo) {
                    $media = $gallery->addMedia($photo)->toMediaCollection('photos');
                    
                    // Stocker le chemin relatif (stable, indépendant de APP_URL)
                    $relativePath = $media->id . '/' . $media->file_name;
                    $gallery->photos()->create([
                        'file_path' => $relativePath,
                        'thumbnail_path' => $relativePath, // Sera généré via Spatie conversions
                        'order_column' => 0,
                    ]);
                }
            }

            return response()->json($gallery->load('photos'), 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error creating gallery: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        return Gallery::ownedByCurrentUser()
            ->where(function($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->with([
                'user.siteConfigs',
                'photos' => function($query) {
                    $query->withCount('likes as is_liked');
                }
            ])
            ->firstOrFail();
    }

    public function destroy(Request $request, $id)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(function($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->firstOrFail();
        
        $gallery->delete(); // Cascades photos and likes
        return response()->noContent();
    }

    public function uploadZip(Request $request, $id)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(function($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->firstOrFail();

        $validated = $request->validate([
            'zip_file' => 'required|file',
        ]);

        $file = $request->file('zip_file');
        $path = $file->store('zips', 'public');
        $gallery->update(['zip_path' => $path]);

        return response()->json(['message' => 'ZIP uploaded successfully', 'zip_path' => $path]);
    }

    public function addPhotos(Request $request, $id)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(function($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->firstOrFail();
        
        $validated = $request->validate([
            'photos.*' => 'required|image|mimes:jpeg,jpg,png|max:5120',
        ]);

        \Illuminate\Support\Facades\Log::info('Adding photos to gallery: ' . $gallery->id);
        
        if ($request->hasFile('photos')) {
            $files = $request->file('photos');
            \Illuminate\Support\Facades\Log::info('Photos count in request: ' . (is_array($files) ? count($files) : '1'));
            
            foreach ($request->file('photos') as $photo) {
                try {
                    $media = $gallery->addMedia($photo)->toMediaCollection('photos');
                    \Illuminate\Support\Facades\Log::info('Media added: ' . $media->id);
                    
                    // Stocker le chemin relatif (stable, indépendant de APP_URL)
                    $relativePath = $media->id . '/' . $media->file_name;
                    $gallery->photos()->create([
                        'file_path' => $relativePath,
                        'thumbnail_path' => $relativePath,
                        'order_column' => 0,
                    ]);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Failed to add photo: ' . $e->getMessage());
                }
            }
        } else {
            \Illuminate\Support\Facades\Log::warning('No photos found in request for gallery: ' . $gallery->id);
        }

        return response()->json($gallery->load('photos'));
    }

    public function deletePhoto(Request $request, $id, $photoId)
    {
        $gallery = Gallery::ownedByCurrentUser()
            ->where(function($query) use ($id) {
                $query->where('uuid', $id)->orWhere('id', $id);
            })
            ->firstOrFail();
        $photo = $gallery->photos()->findOrFail($photoId);
        
        // Find associated media and delete it
        // We can try to find media by the filename in the file_path
        $filename = basename($photo->file_path);
        $media = $gallery->getMedia('photos')->first(function($m) use ($filename) {
            return $m->file_name === $filename || basename($m->getUrl()) === $filename;
        });

        if ($media) {
            $media->delete();
        }
        
        $photo->delete();
        
        return response()->noContent();
    }
}
