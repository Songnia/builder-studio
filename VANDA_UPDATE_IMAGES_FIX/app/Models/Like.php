<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    protected $fillable = ['photo_id', 'gallery_id', 'client_ip', 'session_id'];

    public function photo()
    {
        return $this->belongsTo(Photo::class);
    }

    public function gallery()
    {
        return $this->belongsTo(Gallery::class);
    }
}
