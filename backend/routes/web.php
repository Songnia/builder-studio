<?php

use App\Http\Controllers\PublicMediaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Dynamic Multi-Domain
|--------------------------------------------------------------------------
*/

// 1. API Domain
Route::domain('api.vanda-studio.org')->group(function () {
    Route::get('/media/{path}', [PublicMediaController::class, 'show'])
        ->where('path', '.*');

    Route::any('{any?}', function() {
        return response()->json(['message' => 'Vanda API is running'], 200);
    })->where('any', '.*');
});

// 2. Fallback pour tout le reste (géré par le .htaccess vers landing ou app)
// Si une requête arrive ici, c'est qu'Apache n'a pas pu servir le fichier index.html
Route::fallback(function () {
    // Si on est sur un sous-domaine de photographe, on devrait idéalement 
    // laisser le .htaccess servir le index.html du dossier landing
    // Mais au cas où, on peut renvoyer une erreur 404 propre ou rediriger.
    return response()->json(['error' => 'Route not found or Domain not configured'], 404);
});
