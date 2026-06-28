<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SiteConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'site_name',
        'config_data',
        'is_published',
        'slug'
    ];

    protected $casts = [
        'config_data' => 'array',
        'is_published' => 'boolean'
    ];

    /**
     * Relationship: A site config belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter site configs by the currently authenticated user
     */
    public function scopeOwnedByCurrentUser($query)
    {
        return $query->where('user_id', auth()->id());
    }

    /**
     * Generate a unique slug from site name
     */
    public static function generateUniqueSlug(string $siteName, ?int $excludeId = null): string
    {
        $slug = Str::slug($siteName);
        $originalSlug = $slug;
        $counter = 1;

        $query = static::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
            $query = static::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($siteConfig) {
            if (empty($siteConfig->slug)) {
                $siteConfig->slug = static::generateUniqueSlug($siteConfig->site_name);
            }
        });

        static::updating(function ($siteConfig) {
            if ($siteConfig->isDirty('site_name') && !$siteConfig->isDirty('slug')) {
                $siteConfig->slug = static::generateUniqueSlug($siteConfig->site_name, $siteConfig->id);
            }
        });
    }
}
