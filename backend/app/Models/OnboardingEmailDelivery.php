<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OnboardingEmailDelivery extends Model
{
    protected $fillable = [
        'user_id', 'template_key', 'lifecycle_version', 'subject_key', 'status',
        'scheduled_for', 'sent_at', 'failure_reason', 'metadata',
    ];

    protected $casts = ['scheduled_for' => 'datetime', 'sent_at' => 'datetime', 'metadata' => 'array'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
