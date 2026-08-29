<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OnboardingEvent extends Model
{
    protected $fillable = ['user_id', 'event_name', 'subject_type', 'subject_id', 'properties', 'occurred_at'];

    protected $casts = ['properties' => 'array', 'occurred_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
