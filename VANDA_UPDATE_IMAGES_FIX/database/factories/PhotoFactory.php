<?php

namespace Database\Factories;

use App\Models\Photo;
use App\Models\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;

class PhotoFactory extends Factory
{
    protected $model = Photo::class;

    public function definition(): array
    {
        return [
            'gallery_id' => Gallery::factory(),
            'file_path' => $this->faker->imageUrl(1200, 800, 'photography'),
            'thumbnail_path' => $this->faker->imageUrl(300, 300, 'photography'),
            'order_column' => 0,
        ];
    }
}
