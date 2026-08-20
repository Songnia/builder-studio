<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SiteConfigController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Api\Admin\InvoiceController as AdminInvoiceController;
use App\Http\Controllers\Api\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Api\Client\GalleryController as ClientGalleryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::patch('/user/profile', [ProfileController::class, 'update']);

    // Payment & Subscription endpoints
    Route::get('/plans', [SubscriptionController::class, 'getActivePlans']);
    Route::post('/payment/checkout', [PaymentController::class, 'checkout']);
    Route::post('/payment/verify', [PaymentController::class, 'verifyPayment']);

    Route::prefix('admin')->group(function () {
        Route::apiResource('galleries', AdminGalleryController::class);
        Route::apiResource('invoices', AdminInvoiceController::class);
        Route::post('invoices/{id}/payment', [AdminInvoiceController::class, 'recordPayment']);
        Route::post('galleries/{id}/photos', [AdminGalleryController::class, 'addPhotos']);
        Route::delete('galleries/{id}/photos/{photoId}', [AdminGalleryController::class, 'deletePhoto']);
        Route::post('galleries/{id}/zip', [AdminGalleryController::class, 'uploadZip']);

        // Media uploads for the builder (hero, logo, portfolio, services, etc.)
        Route::post('media/upload', [AdminMediaController::class, 'upload']);
        Route::delete('media', [AdminMediaController::class, 'destroy']);
    });

    // Site Configuration Routes (Protected)
    Route::apiResource('site-configs', SiteConfigController::class);
    Route::post('site-configs/{id}/publish', [SiteConfigController::class, 'publish']);

    // Super Admin Routes
    Route::middleware('superadmin')->prefix('superadmin')->group(function () {
        Route::get('/dashboard/stats', [\App\Http\Controllers\Api\SuperAdmin\DashboardController::class, 'stats']);
        Route::get('/dashboard/transactions', [\App\Http\Controllers\Api\SuperAdmin\DashboardController::class, 'transactions']);
        
        Route::get('/users', [\App\Http\Controllers\Api\SuperAdmin\PhotographerController::class, 'index']);
        Route::post('/users', [\App\Http\Controllers\Api\SuperAdmin\PhotographerController::class, 'store']);
        Route::patch('/users/{id}', [\App\Http\Controllers\Api\SuperAdmin\PhotographerController::class, 'update']);
        Route::delete('/users/{id}', [\App\Http\Controllers\Api\SuperAdmin\PhotographerController::class, 'destroy']);
        Route::patch('/users/{id}/toggle-active', [\App\Http\Controllers\Api\SuperAdmin\PhotographerController::class, 'toggleActive']);
        Route::patch('/users/{id}/toggle-publish', [\App\Http\Controllers\Api\SuperAdmin\PhotographerController::class, 'togglePublish']);
        
        Route::apiResource('plans', \App\Http\Controllers\Api\SuperAdmin\SubscriptionPlanController::class);
        
        Route::get('/settings', [\App\Http\Controllers\Api\SuperAdmin\SettingController::class, 'index']);
        Route::post('/settings', [\App\Http\Controllers\Api\SuperAdmin\SettingController::class, 'update']);
    });
});



Route::prefix('client')->group(function () {
    Route::get('/gallery/{uuid}', [ClientGalleryController::class, 'show']);
    Route::post('/gallery/{uuid}/like', [ClientGalleryController::class, 'toggleLike']);
});




// Public Site Configuration Route
Route::get('/sites/{slug}/config', [SiteConfigController::class, 'getPublicConfig']);

// Maketou Webhook Route
Route::post('/payment/maketou/webhook', [PaymentController::class, 'webhook']);
