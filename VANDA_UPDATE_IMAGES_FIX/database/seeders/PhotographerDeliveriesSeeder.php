<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Gallery;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class PhotographerDeliveriesSeeder extends Seeder
{
    public function run(): void
    {
        $photographers = [
            'photographer-a@test.com' => [
                'title' => 'Mariage Sophie & Marc',
                'description' => 'Photos du mariage champétre de Sophie et Marc - 15 juin 2026',
                'pin' => '1234'
            ],
            'photographer-b@test.com' => [
                'title' => 'Séance Studio Portrait',
                'description' => 'Portrait professionnel entreprise - Collection Hiver 2026',
                'pin' => '5678'
            ]
        ];

        // Ensure we have a temp directory for fake images
        $tempDir = storage_path('app/temp_seeds');
        if (!File::exists($tempDir)) {
            File::makeDirectory($tempDir, 0755, true);
        }

        // Create a dummy image
        $dummyImagePath = $tempDir . '/dummy.jpg';
        $image = imagecreatetruecolor(800, 600);
        $bg = imagecolorallocate($image, 200, 200, 200);
        $text_color = imagecolorallocate($image, 50, 50, 50);
        imagefilledrectangle($image, 0, 0, 800, 600, $bg);
        imagestring($image, 5, 300, 280, 'Test Image', $text_color);
        imagestring($image, 3, 300, 310, date('Y-m-d H:i:s'), $text_color);
        imagejpeg($image, $dummyImagePath);
        imagedestroy($image);

        foreach ($photographers as $email => $data) {
            $user = User::where('email', $email)->first();

            if ($user) {
                $this->command->info("Creating delivery for {$user->name}...");

                // Create Gallery
                $gallery = Gallery::create([
                    'uuid' => Str::uuid(),
                    'user_id' => $user->id,
                    'title' => $data['title'],
                    'description' => $data['description'],
                    'pin_code' => $data['pin'],
                    'status' => 'published',
                ]);

                // Add 5 photos
                for ($i = 1; $i <= 5; $i++) {
                   $filename = "photo_{$user->id}_{$i}.jpg";
                   $tempPath = $tempDir . '/' . $filename;
                   File::copy($dummyImagePath, $tempPath);

                   try {
                       $media = $gallery->addMedia($tempPath)
                            ->preservingOriginal()
                            ->toMediaCollection('photos');
    
                       $gallery->photos()->create([
                            'file_path' => $media->getUrl(),
                            'thumbnail_path' => $media->getUrl('thumb'),
                            'order_column' => $i,
                       ]);
                   } catch (\Exception $e) {
                       $this->command->error("Failed to add media: " . $e->getMessage());
                   }
                }
                $this->command->info("  -> Gallery created with {$gallery->photos()->count()} photos.");
            } else {
                $this->command->warn("User {$email} not found. Skipping.");
            }
        }
        
        // Clean up temp dir
         File::deleteDirectory($tempDir);
    }
}
