<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Photo;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class FixPhotoUrls extends Command
{
    protected $signature = 'photos:fix-urls';
    protected $description = 'Migrate absolute photo URLs in DB to relative paths (one-time fix)';

    public function handle()
    {
        $photos = Photo::all();
        $fixed = 0;
        $skipped = 0;

        foreach ($photos as $photo) {
            $path = $photo->getRawOriginal('file_path');

            // Si c'est déjà un chemin relatif (pas http), on saute
            if (!str_starts_with($path, 'http://') && !str_starts_with($path, 'https://')) {
                $skipped++;
                continue;
            }

            // Extraire le nom de fichier depuis l'URL absolue
            // Ex: http://localhost:8000/storage/1/photo.jpeg → chercher media avec file_name = "photo.jpeg"
            $filename = basename(parse_url($path, PHP_URL_PATH));

            // Chercher le media Spatie correspondant
            $media = Media::where('file_name', $filename)
                          ->where('model_type', 'App\\Models\\Gallery')
                          ->first();

            if ($media) {
                $relativePath = $media->id . '/' . $media->file_name;
                $photo->update([
                    'file_path' => $relativePath,
                    'thumbnail_path' => $relativePath,
                ]);
                $this->info("Fixed photo #{$photo->id}: {$filename} → {$relativePath}");
                $fixed++;
            } else {
                // Fallback : extraire depuis l'URL le segment numérique/nom
                // Ex: /storage/6/_-(1).jpeg → "6/_-(1).jpeg"
                preg_match('/\/storage\/(.+)$/', $path, $matches);
                if (!empty($matches[1])) {
                    $relativePath = $matches[1];
                    $photo->update([
                        'file_path' => $relativePath,
                        'thumbnail_path' => $relativePath,
                    ]);
                    $this->warn("Fixed (fallback) photo #{$photo->id}: → {$relativePath}");
                    $fixed++;
                } else {
                    $this->error("Could not fix photo #{$photo->id}: {$path}");
                    $skipped++;
                }
            }
        }

        $this->info("Done. Fixed: {$fixed}, Skipped: {$skipped}");
        return 0;
    }
}
