<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Like;
use App\Models\Photo;
use App\Services\SubscriptionEntitlementService;
use App\Services\OnboardingLifecycleService;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function show(Request $request, $uuid, SubscriptionEntitlementService $subscriptions, OnboardingLifecycleService $onboarding)
    {
        $gallery = Gallery::where('uuid', $uuid)->with(['photos' => function ($query) use ($request) {
            $query->orderBy('order_column')
                ->withExists(['likes as is_liked' => function ($q) use ($request) {
                    $q->where('client_ip', $request->ip());
                }]);
        }])->firstOrFail();

        if (! $subscriptions->forUser($gallery->user)['active']) {
            return response()->json(['message' => 'Galerie indisponible'], 404);
        }

        // Check for PIN protection logic
        if (! empty($gallery->pin_code)) {
            $providedPin = $request->header('X-Gallery-PIN')
                ?? $request->input('pin')
                ?? $request->header('X-PIN');

            if (! $providedPin || (string) $providedPin !== (string) $gallery->pin_code) {
                return response()->json([
                    'requires_pin' => true,
                    'message' => 'Invalid or missing gallery PIN code',
                    'title' => $gallery->title,
                    'uuid' => $gallery->uuid,
                ], 403);
            }
        }

        // Get photographer slug
        $photographerSlug = $gallery->user->siteConfigs()->where('is_published', true)->first()?->slug
            ?? $gallery->user->siteConfigs()->first()?->slug;

        $galleryData = $gallery->toArray();
        $galleryData['photographer_slug'] = $photographerSlug;

        $onboarding->recordOnce($gallery->user, 'gallery_first_client_opened', $gallery, [
            'gallery_uuid' => $gallery->uuid,
        ]);

        return response()->json($galleryData);
    }

    public function toggleLike(Request $request, $uuid, SubscriptionEntitlementService $subscriptions)
    {
        $gallery = Gallery::where('uuid', $uuid)->firstOrFail();

        if (! $subscriptions->forUser($gallery->user)['active']) {
            return response()->json(['message' => 'Galerie indisponible'], 404);
        }

        if (! empty($gallery->pin_code)) {
            $providedPin = $request->header('X-Gallery-PIN')
                ?? $request->input('pin')
                ?? $request->header('X-PIN');

            if (! $providedPin || (string) $providedPin !== (string) $gallery->pin_code) {
                return response()->json([
                    'requires_pin' => true,
                    'message' => 'Invalid or missing gallery PIN code',
                ], 403);
            }
        }

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
