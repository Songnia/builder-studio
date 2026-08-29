<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Services\SubscriptionEntitlementService;
use App\Support\PublicMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryShareController extends Controller
{
    public function page(Request $request, string $uuid, SubscriptionEntitlementService $subscriptions)
    {
        $indexPath = public_path('landing/index.html');

        abort_unless(is_file($indexPath), 404);

        $gallery = Gallery::query()
            ->where('uuid', $uuid)
            ->with(['user', 'photos' => fn ($query) => $query->orderBy('order_column')->orderBy('id')])
            ->first();

        $html = file_get_contents($indexPath);

        if (! $gallery || ! $subscriptions->forUser($gallery->user)['active']) {
            return response($html)->header('Content-Type', 'text/html; charset=UTF-8');
        }

        $title = $gallery->title.' — Galerie privée';
        $description = $gallery->description ?: 'Découvrez cette galerie photo privée sur VANDA STUDIO.';
        $canonicalUrl = $request->fullUrl();
        $coverUrl = $gallery->photos->isNotEmpty()
            ? route('gallery.share.cover', ['uuid' => $gallery->uuid])
            : url('/landing/pwa-512x512.png');

        $escape = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $meta = implode("\n", [
            '<meta property="og:type" content="website">',
            '<meta property="og:title" content="'.$escape($title).'">',
            '<meta property="og:description" content="'.$escape($description).'">',
            '<meta property="og:url" content="'.$escape($canonicalUrl).'">',
            '<meta property="og:image" content="'.$escape($coverUrl).'">',
            '<meta property="og:image:alt" content="Couverture de '.$escape($gallery->title).'">',
            '<meta name="twitter:card" content="summary_large_image">',
            '<meta name="twitter:title" content="'.$escape($title).'">',
            '<meta name="twitter:description" content="'.$escape($description).'">',
            '<meta name="twitter:image" content="'.$escape($coverUrl).'">',
            '<link rel="canonical" href="'.$escape($canonicalUrl).'">',
        ]);

        $html = str_replace('</head>', $meta."\n</head>", $html);

        return response($html)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    /**
     * The owner explicitly selected the first gallery photo as the public
     * social-sharing cover. No other protected gallery photo is exposed here.
     */
    public function cover(string $uuid, SubscriptionEntitlementService $subscriptions)
    {
        $gallery = Gallery::query()->where('uuid', $uuid)->with('user')->firstOrFail();

        abort_unless($subscriptions->forUser($gallery->user)['active'], 404);

        $photo = $gallery->photos()->orderBy('order_column')->orderBy('id')->firstOrFail();
        $path = ltrim(PublicMedia::extractRelativePath($photo->file_path) ?? $photo->file_path, '/');

        abort_if($path === '' || str_contains($path, '..') || ! Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->response($path, null, [
            'Cache-Control' => 'public, max-age=86400',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
