<?php

namespace Database\Seeders;

use App\Models\Gallery;
use App\Models\Photo;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        Gallery::factory()
            ->count(10)
            ->has(Photo::factory()->count(15), 'photos')
            ->create();
    }
}
