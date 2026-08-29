<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuperAdminAuditLog extends Model
{
    protected $table = "superadmin_audit_logs";
    public $timestamps = false;

    protected $fillable = [
        "actor_id", "action", "target_type", "target_id", "before_data",
        "after_data", "reason", "ip_address", "user_agent", "created_at",
    ];

    protected $casts = [
        "before_data" => "array",
        "after_data" => "array",
        "created_at" => "datetime",
    ];

    public function actor()
    {
        return $this->belongsTo(User::class, "actor_id");
    }
}
