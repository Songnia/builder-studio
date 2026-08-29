<?php

namespace App\Services;

use App\Models\SuperAdminAuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class SuperAdminAuditService
{
    public function record(Request $request, string $action, ?Model $target = null, ?array $before = null, ?array $after = null, ?string $reason = null): void
    {
        SuperAdminAuditLog::create([
            "actor_id" => $request->user()?->id,
            "action" => $action,
            "target_type" => $target ? ($target instanceof User ? "user" : Str::snake(class_basename($target))) : null,
            "target_id" => $target?->id,
            "before_data" => $before,
            "after_data" => $after,
            "reason" => $reason,
            "ip_address" => $request->ip(),
            "user_agent" => mb_substr((string) $request->userAgent(), 0, 1000),
            "created_at" => now(),
        ]);
    }
}
