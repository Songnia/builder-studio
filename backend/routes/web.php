<?php

use App\Http\Controllers\PublicMediaController;
use App\Http\Controllers\GalleryShareController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\Seo\MarketingPageController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes - Dynamic Multi-Domain & Programmatic SEO Infrastructure
|--------------------------------------------------------------------------
*/

// SEO Technical Infrastructure (Sitemaps & Robots.txt)
Route::get('/sitemap.xml', [SeoController::class, 'sitemapIndex']);
Route::get('/sitemap-{group}.xml', [SeoController::class, 'sitemapGroup'])->where('group', '[a-z_]+');
Route::get('/robots.txt', [SeoController::class, 'robots']);

// Programmatic SEO Marketing Routes (SSR Blade views)
Route::get('/pricing', [MarketingPageController::class, 'show']);
Route::get('/for', [MarketingPageController::class, 'show']);
Route::get('/for/{slug}', [MarketingPageController::class, 'show']);
Route::get('/tools/{slug}', [MarketingPageController::class, 'show']);
Route::get('/features/{slug}', [MarketingPageController::class, 'show']);
Route::get('/solutions/{slug}', [MarketingPageController::class, 'show']);
Route::get('/templates/{slug}', [MarketingPageController::class, 'show']);
Route::get('/guides/{slug}', [MarketingPageController::class, 'show']);
Route::get('/alternatives', [MarketingPageController::class, 'show']);
Route::get('/alternatives/{slug}', [MarketingPageController::class, 'show']);

// 1. Media Route (accessible globally for local dev & production)
Route::get('/media/{path}', [PublicMediaController::class, 'show'])
    ->where('path', '.*')
    ->name('media.show');

// Shared galleries: Laravel injects Open Graph metadata before React boots.
Route::get('/g/{uuid}', [GalleryShareController::class, 'page'])
    ->whereUuid('uuid')
    ->name('gallery.share.page');
Route::get('/gallery-share/{uuid}/cover', [GalleryShareController::class, 'cover'])
    ->whereUuid('uuid')
    ->name('gallery.share.cover');

Route::get('/email/onboarding/unsubscribe/{user}', function (int $user) {
    DB::table('onboarding_email_preferences')->updateOrInsert(
        ['user_id' => $user],
        ['unsubscribed_at' => now(), 'created_at' => now(), 'updated_at' => now()]
    );

    return response('Vous ne recevrez plus les conseils d’onboarding VANDA STUDIO.', 200)
        ->header('Content-Type', 'text/plain; charset=UTF-8');
})->middleware('signed')->name('onboarding.unsubscribe');

// 2. API Domain Fallback
Route::domain('api.vanda-studio.org')->group(function () {
    Route::any('{any?}', function() {
        return response()->json(['message' => 'Vanda API is running'], 200);
    })->where('any', '.*');
});

// 2. Fallback
Route::fallback(function () {
    $isAdminRoute = request()->is(
        'admin',
        'admin/*',
        'superadmin',
        'superadmin/*',
        'auth/*',
        'login',
        'signup',
        'profile',
        'builder',
        'resources'
    );

    if ($isAdminRoute && file_exists(public_path('app/index.html'))) {
        return response()->file(public_path('app/index.html'));
    }

    if (file_exists(public_path('landing/index.html'))) {
        return response()->file(public_path('landing/index.html'));
    }

    return response()->json(['error' => 'Route not found'], 404);
});
