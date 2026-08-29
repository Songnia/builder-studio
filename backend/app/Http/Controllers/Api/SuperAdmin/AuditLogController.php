<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SuperAdminAuditLog;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            "q" => ["nullable", "string", "max:120"],
            "action" => ["nullable", "string", "max:100"],
            "actor_id" => ["nullable", "integer", "exists:users,id"],
            "from" => ["nullable", "date"],
            "to" => ["nullable", "date", "after_or_equal:from"],
            "per_page" => ["nullable", "integer", "min:10", "max:100"],
        ]);
        $query = SuperAdminAuditLog::query()->with("actor:id,name,email");
        if (! empty($validated["q"])) {
            $search = trim($validated["q"]);
            $query->where(function ($q) use ($search) {
                $q->where("action", "like", "%{$search}%")
                    ->orWhere("reason", "like", "%{$search}%")
                    ->orWhereHas("actor", fn ($actor) => $actor->where("name", "like", "%{$search}%")->orWhere("email", "like", "%{$search}%"));
            });
        }
        if (! empty($validated["action"])) {
            $query->where("action", $validated["action"]);
        }
        if (! empty($validated["actor_id"])) {
            $query->where("actor_id", $validated["actor_id"]);
        }
        if (! empty($validated["from"])) {
            $query->whereDate("created_at", ">=", $validated["from"]);
        }
        if (! empty($validated["to"])) {
            $query->whereDate("created_at", "<=", $validated["to"]);
        }
        $paginator = $query->latest("created_at")->paginate($validated["per_page"] ?? 30)->withQueryString();

        return response()->json([
            "data" => $paginator->items(),
            "meta" => ["current_page" => $paginator->currentPage(), "last_page" => $paginator->lastPage(), "total" => $paginator->total(), "from" => $paginator->firstItem(), "to" => $paginator->lastItem()],
            "actions" => SuperAdminAuditLog::query()->distinct()->orderBy("action")->pluck("action"),
            "summary" => [
                "today" => SuperAdminAuditLog::query()->whereDate("created_at", today())->count(),
                "last_7_days" => SuperAdminAuditLog::query()->where("created_at", ">=", now()->subDays(7))->count(),
                "sensitive" => SuperAdminAuditLog::query()->whereIn("action", ["user.deleted", "user.sessions_revoked", "user.updated", "subscription.updated"])->where("created_at", ">=", now()->subDays(30))->count(),
            ],
        ]);
    }
}
