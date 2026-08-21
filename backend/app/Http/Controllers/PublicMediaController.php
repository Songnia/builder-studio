<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PublicMediaController extends Controller
{
    public function show(Request $request, string $path)
    {
        $decodedPath = urldecode($path);

        if ($decodedPath === '' || str_contains($decodedPath, '..')) {
            abort(404);
        }

        if (! Storage::disk('public')->exists($decodedPath)) {
            abort(404);
        }

        $belongsToProtectedGallery = Gallery::query()
            ->whereNotNull('pin_code')
            ->where('pin_code', '!=', '')
            ->where(function ($query) use ($decodedPath) {
                $query->where('zip_path', $decodedPath)
                    ->orWhereHas('photos', function ($photoQuery) use ($decodedPath) {
                        $photoQuery->where('file_path', $decodedPath)
                            ->orWhere('thumbnail_path', $decodedPath);
                    });
            })
            ->exists();

        if ($belongsToProtectedGallery && ! $request->hasValidSignature()) {
            abort(403);
        }

        return Storage::disk('public')->response($decodedPath);
    }
}
