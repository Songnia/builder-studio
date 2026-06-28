<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Gallery;
use App\Models\Photo;
use App\Models\Like;

class GalleryController extends Controller
{
    public function show(Request $request, $uuid)
    {
        $gallery = Gallery::where('uuid', $uuid)->with(['photos' => function($query) use ($request) {
            $query->orderBy('order_column')
                  ->withExists(['likes as is_liked' => function($q) use ($request) {
                      $q->where('client_ip', $request->ip());
                  }]);
        }])->firstOrFail();

        // Check for PIN protection logic here or in middleware
        // For now returning public data

        // Get photographer slug
        $photographerSlug = $gallery->user->siteConfigs()->where('is_published', true)->first()?->slug 
            ?? $gallery->user->siteConfigs()->first()?->slug;
        
        $galleryData = $gallery->toArray();
        $galleryData['photographer_slug'] = $photographerSlug;

        return response()->json($galleryData);
    }

    public function toggleLike(Request $request, $uuid)
    {
        $gallery = Gallery::where('uuid', $uuid)->firstOrFail();
        
        $validated = $request->validate([
            'photo_id' => 'required|exists:photos,id',
        ]);

        $photo = Photo::where('gallery_id', $gallery->id)->findOrFail($validated['photo_id']);
        $ip = $request->ip();

        $existingLike = Like::where('photo_id', $photo->id)
                            ->where('client_ip', $ip)
                            ->first();

        if ($existingLike) {
            $existingLike->delete();
            return response()->json(['status' => 'unliked']);
        } else {
            Like::create([
                'photo_id' => $photo->id,
                'gallery_id' => $gallery->id,
                'client_ip' => $ip,
            ]);
            return response()->json(['status' => 'liked']);
        }
    }
}
