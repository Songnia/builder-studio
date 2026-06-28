<?php

namespace App\Models;

use App\Support\PublicMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    use HasFactory;

    protected $fillable = ['gallery_id', 'file_path', 'thumbnail_path', 'order_column'];

    public function gallery()
    {
        return $this->belongsTo(Gallery::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    protected $appends = ['url', 'thumbnail_url', 'is_liked'];

    protected $casts = [
        'is_liked' => 'boolean',
    ];

    public function getUrlAttribute()
    {
        $path = $this->file_path;

        // Si c'est déjà une URL absolue (http/https), la retourner directement
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return PublicMedia::normalizeUrlIfPublicMedia($path) ?? $path;
        }

        return PublicMedia::url($path);
    }

    public function getIsLikedAttribute()
    {
        return (bool) ($this->attributes['is_liked'] ?? false);
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail_path;
    }
}
