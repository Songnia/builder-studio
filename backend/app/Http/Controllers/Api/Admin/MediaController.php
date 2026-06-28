<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Support\PublicMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Upload a single media file (image) for the builder.
     * Returns a permanent public URL to be stored in site config.
     *
     * POST /api/admin/media/upload
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file'    => 'required|file|image|mimes:jpeg,jpg,png,webp,gif|max:10240', // 10 Mo max
            'context' => 'nullable|string|in:hero,logo,portfolio,services,promoter,banner',
        ]);

        $file    = $request->file('file');
        $context = $request->input('context', 'builder');
        $user    = $request->user();

        // Chemin : builder-media/{user_id}/{context}/{uuid}.{ext}
        $extension = $file->getClientOriginalExtension() ?: 'jpg';
        $filename  = Str::uuid() . '.' . $extension;
        $path      = "builder-media/{$user->id}/{$context}/{$filename}";

        Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

        $url = PublicMedia::url($path);

        return response()->json([
            'url'  => $url,
            'path' => $path,
        ], 201);
    }

    /**
     * Delete a previously uploaded media file.
     *
     * DELETE /api/admin/media
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $path = $request->input('path');

        // Sécurité : on ne supprime que dans le dossier builder-media
        if (!str_starts_with($path, 'builder-media/')) {
            return response()->json(['error' => 'Unauthorized path'], 403);
        }

        Storage::disk('public')->delete($path);

        return response()->json(['message' => 'Media deleted'], 200);
    }
}
