<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SiteConfigController;
use App\Http\Controllers\Api\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Api\Admin\InvoiceController as AdminInvoiceController;
use App\Http\Controllers\Api\Client\GalleryController as ClientGalleryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::prefix('admin')->group(function () {
        Route::apiResource('galleries', AdminGalleryController::class);
        Route::apiResource('invoices', AdminInvoiceController::class);
        Route::post('galleries/{id}/photos', [AdminGalleryController::class, 'addPhotos']);
        Route::delete('galleries/{id}/photos/{photoId}', [AdminGalleryController::class, 'deletePhoto']);
        Route::post('galleries/{id}/zip', [AdminGalleryController::class, 'uploadZip']);
    });

    // Site Configuration Routes (Protected)
    Route::apiResource('site-configs', SiteConfigController::class);
    Route::post('site-configs/{id}/publish', [SiteConfigController::class, 'publish']);
});



Route::prefix('client')->group(function () {
    Route::get('/gallery/{uuid}', [ClientGalleryController::class, 'show']);
    Route::post('/gallery/{uuid}/like', [ClientGalleryController::class, 'toggleLike']);
});




// Public Site Configuration Route
Route::get('/sites/{slug}/config', [SiteConfigController::class, 'getPublicConfig']);
