<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class PublicMediaController extends Controller
{
    public function show(string $path)
    {
        $decodedPath = urldecode($path);

        if ($decodedPath === '' || str_contains($decodedPath, '..')) {
            abort(404);
        }

        if (! Storage::disk('public')->exists($decodedPath)) {
            abort(404);
        }

        return Storage::disk('public')->response($decodedPath);
    }
}
