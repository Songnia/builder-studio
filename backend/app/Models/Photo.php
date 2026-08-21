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
        return $this->mediaUrl($this->file_path);
    }

    public function getIsLikedAttribute()
    {
        return (bool) ($this->attributes['is_liked'] ?? false);
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->mediaUrl($this->thumbnail_path);
    }

    private function mediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        $relativePath = PublicMedia::extractRelativePath($path);
        if (! $relativePath && (str_starts_with($path, 'http://') || str_starts_with($path, 'https://'))) {
            return $path;
        }

        $relativePath ??= ltrim($path, '/');
        $gallery = $this->relationLoaded('gallery')
            ? $this->getRelation('gallery')
            : $this->gallery()->first(['id', 'pin_code']);

        return $gallery?->pin_code
            ? PublicMedia::temporaryUrl($relativePath)
            : PublicMedia::url($relativePath);
    }
}
