<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Gallery extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = ['user_id', 'uuid', 'title', 'description', 'client_phone', 'pin_code', 'zip_path', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function photos()
    {
        return $this->hasMany(Photo::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    /**
     * Scope to filter galleries by the currently authenticated user
     */
    public function scopeOwnedByCurrentUser($query)
    {
        return $query->where('user_id', auth()->id());
    }

    protected $appends = ['zip_url', 'photographer_slug'];

    public function getPhotographerSlugAttribute()
    {
        // Get the slug from the user's first site config
        return $this->user->siteConfigs->first()?->slug;
    }

    public function getZipUrlAttribute()
    {
        return $this->zip_path ? asset('storage/' . $this->zip_path) : null;
    }

    public function registerMediaConversions(?\Spatie\MediaLibrary\MediaCollections\Models\Media $media = null): void
    {
        $this->addMediaConversion('thumb')
              ->width(300)
              ->height(300)
              ->sharpen(10);

        $this->addMediaConversion('web')
              ->width(1200)
              ->height(1200)
              ->sharpen(10);
    }
}
