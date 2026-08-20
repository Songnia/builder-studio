<?php

namespace Database\Seeders;

use App\Models\Gallery;
use App\Models\Photo;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
        Gallery::factory()
            ->count(10)
            ->for($user)
            ->has(Photo::factory()->count(15), 'photos')
            ->create();
    }
}
