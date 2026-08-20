<?php

use App\Http\Controllers\PublicMediaController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\Seo\MarketingPageController;
use Illuminate\Support\Facades\Route;

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

// 1. API Domain
Route::domain('api.vanda-studio.org')->group(function () {
    Route::get('/media/{path}', [PublicMediaController::class, 'show'])
        ->where('path', '.*');

    Route::any('{any?}', function() {
        return response()->json(['message' => 'Vanda API is running'], 200);
    })->where('any', '.*');
});

// 2. Fallback
Route::fallback(function () {
    if (file_exists(public_path('landing/index.html'))) {
        return response()->file(public_path('landing/index.html'));
    }
    return response()->json(['error' => 'Route not found'], 404);
});
