<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Services\SuperAdminAuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PhotographerController extends Controller
{
    public function __construct(private readonly SuperAdminAuditService $audit)
    {
    }

    public function index(Request $request)
    {
        $validated = $request->validate([
            "q" => ["nullable", "string", "max:120"],
            "role" => ["nullable", Rule::in(["all", "user", "admin", "superadmin", "staff"])],
            "status" => ["nullable", Rule::in(["all", "active", "inactive"])],
            "plan_id" => ["nullable", "integer", "exists:subscription_plans,id"],
            "subscription" => ["nullable", Rule::in(["all", "active", "none"])],
            "published" => ["nullable", Rule::in(["all", "published", "unpublished", "none"])],
            "sort" => ["nullable", Rule::in(["created_at", "name", "email"])],
            "direction" => ["nullable", Rule::in(["asc", "desc"])],
            "per_page" => ["nullable", "integer", "min:10", "max:100"],
        ]);

        $query = User::query()->whereIn("role", ["user", "admin", "superadmin"]);
        $search = trim((string) ($validated["q"] ?? ""));
        if ($search !== "") {
            $query->where(function ($query) use ($search) {
                $query->where("name", "like", "%{$search}%")
                    ->orWhere("email", "like", "%{$search}%")
                    ->orWhere("phone", "like", "%{$search}%");
            });
        }
        if (($validated["role"] ?? "all") === "staff") {
            $query->whereIn("role", ["admin", "superadmin"]);
        } elseif (($validated["role"] ?? "all") !== "all") {
            $query->where("role", $validated["role"]);
        }
        if (($validated["status"] ?? "all") !== "all") {
            $query->where("is_active", $validated["status"] === "active");
        }
        if (! empty($validated["plan_id"])) {
            $query->whereHas("subscriptions", fn ($q) => $q->currentlyActive()->where("subscription_plan_id", $validated["plan_id"]));
        }
        if (($validated["subscription"] ?? "all") === "active") {
            $query->whereHas("subscriptions", fn ($q) => $q->currentlyActive());
        } elseif (($validated["subscription"] ?? "all") === "none") {
            $query->whereDoesntHave("subscriptions", fn ($q) => $q->currentlyActive());
        }
        $published = $validated["published"] ?? "all";
        if ($published === "published") {
            $query->whereHas("siteConfigs", fn ($q) => $q->where("is_published", true));
        } elseif ($published === "unpublished") {
            $query->whereHas("siteConfigs", fn ($q) => $q->where("is_published", false));
        } elseif ($published === "none") {
            $query->whereDoesntHave("siteConfigs");
        }

        $summaryBase = User::query()->whereIn("role", ["user", "admin", "superadmin"]);
        $summary = [
            "total" => (clone $summaryBase)->count(),
            "active" => (clone $summaryBase)->where("is_active", true)->count(),
            "inactive" => (clone $summaryBase)->where("is_active", false)->count(),
            "subscribed" => (clone $summaryBase)->whereHas("subscriptions", fn ($q) => $q->currentlyActive())->count(),
            "published" => (clone $summaryBase)->whereHas("siteConfigs", fn ($q) => $q->where("is_published", true))->count(),
        ];

        $paginator = $query
            ->with([
                "subscriptions" => fn ($q) => $q->currentlyActive()->with("plan"),
                "siteConfigs:id,user_id,site_name,slug,is_published",
            ])
            ->withCount(["galleries", "invoices"])
            ->orderBy($validated["sort"] ?? "created_at", $validated["direction"] ?? "desc")
            ->paginate($validated["per_page"] ?? 25)
            ->withQueryString();

        $paginator->setCollection($paginator->getCollection()->map(function (User $user) {
            $activeSubscription = $user->subscriptions->first();
            $site = $user->siteConfigs->first();

            return [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "phone" => $user->phone,
                "role" => $user->role,
                "is_active" => (bool) $user->is_active,
                "email_verified_at" => $user->email_verified_at,
                "created_at" => $user->created_at,
                "active_plan" => $activeSubscription?->plan?->name,
                "active_plan_id" => $activeSubscription?->subscription_plan_id,
                "subscription_status" => $activeSubscription?->status,
                "is_published" => (bool) ($site?->is_published ?? false),
                "site_config_id" => $site?->id,
                "site_name" => $site?->site_name,
                "site_slug" => $site?->slug,
                "galleries_count" => $user->galleries_count,
                "invoices_count" => $user->invoices_count,
            ];
        }));

        return response()->json([
            "data" => $paginator->items(),
            "meta" => [
                "current_page" => $paginator->currentPage(),
                "last_page" => $paginator->lastPage(),
                "per_page" => $paginator->perPage(),
                "total" => $paginator->total(),
                "from" => $paginator->firstItem(),
                "to" => $paginator->lastItem(),
            ],
            "summary" => $summary,
            "plans" => SubscriptionPlan::query()->orderBy("price")->get(["id", "name", "is_active"]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", "max:255", "unique:users,email"],
            "password" => ["required", "string", "min:8"],
            "role" => ["required", Rule::in(["admin", "superadmin", "user"])],
            "phone" => ["nullable", "string", "max:40"],
            "reason" => ["nullable", "string", "max:500"],
        ]);

        $user = User::create([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "password" => $validated["password"],
            "role" => $validated["role"],
            "phone" => $validated["phone"] ?? null,
            "is_active" => true,
        ]);
        $this->audit->record($request, "user.created", $user, null, $user->only(["name", "email", "phone", "role", "is_active"]), $validated["reason"] ?? null);

        return response()->json(["message" => "Utilisateur créé.", "user" => $user], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            "name" => ["sometimes", "required", "string", "max:255"],
            "email" => ["sometimes", "required", "email", "max:255", Rule::unique("users", "email")->ignore($user->id)],
            "password" => ["nullable", "string", "min:8"],
            "role" => ["sometimes", "required", Rule::in(["admin", "superadmin", "user"])],
            "phone" => ["nullable", "string", "max:40"],
            "reason" => ["nullable", "string", "max:500"],
        ]);
        $before = $user->only(["name", "email", "phone", "role", "is_active"]);

        $result = DB::transaction(function () use ($validated, $id, $request, $user) {
            $activeSuperAdminIds = User::query()->where("role", "superadmin")->where("is_active", true)->lockForUpdate()->pluck("id");
            $lockedUser = User::query()->lockForUpdate()->findOrFail($id);
            $requestedRole = $validated["role"] ?? $lockedUser->role;
            if ($lockedUser->role === "superadmin" && $requestedRole !== "superadmin") {
                if ($lockedUser->is($request->user())) {
                    return response()->json(["message" => "Vous ne pouvez pas retirer votre propre rôle Super Admin."], 409);
                }
                if ($lockedUser->is_active && $activeSuperAdminIds->count() <= 1) {
                    return response()->json(["message" => "Au moins un Super Admin actif doit être conservé."], 409);
                }
            }
            $data = collect($validated)->only(["name", "email", "phone", "role", "password"])->filter(fn ($value) => $value !== null)->all();
            $lockedUser->update($data);
            return $lockedUser->fresh();
        });

        if ($result instanceof \Illuminate\Http\JsonResponse) {
            return $result;
        }
        $this->audit->record($request, "user.updated", $result, $before, $result->only(["name", "email", "phone", "role", "is_active"]), $validated["reason"] ?? null);

        return response()->json(["message" => "Utilisateur mis à jour.", "user" => $result]);
    }

    public function deletionImpact($id)
    {
        $user = User::query()->withCount(["galleries", "siteConfigs", "subscriptions", "invoices", "tokens"])->findOrFail($id);
        $impact = [
            "galleries" => $user->galleries_count,
            "sites" => $user->site_configs_count,
            "subscriptions" => $user->subscriptions_count,
            "invoices" => $user->invoices_count,
            "sessions" => $user->tokens_count,
        ];

        return response()->json([
            "user" => $user->only(["id", "name", "email", "role", "is_active"]),
            "impact" => $impact,
            "can_delete" => array_sum($impact) === 0,
            "recommended_action" => array_sum($impact) === 0 ? "delete" : "deactivate",
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::query()->withCount(["galleries", "siteConfigs", "subscriptions", "invoices", "tokens"])->findOrFail($id);
        $validated = $request->validate([
            "confirmation" => ["required", "string", Rule::in([$user->email])],
            "reason" => ["required", "string", "min:5", "max:500"],
        ]);
        if ($user->is($request->user())) {
            return response()->json(["message" => "Vous ne pouvez pas supprimer votre propre compte."], 403);
        }
        $impact = ["galleries" => $user->galleries_count, "sites" => $user->site_configs_count, "subscriptions" => $user->subscriptions_count, "invoices" => $user->invoices_count, "sessions" => $user->tokens_count];
        if (array_sum($impact) > 0) {
            return response()->json(["message" => "Suppression bloquée : ce compte possède des données. Désactivez-le ou traitez ses ressources avant suppression.", "impact" => $impact], 409);
        }
        $before = $user->only(["id", "name", "email", "role", "is_active"]);
        $this->audit->record($request, "user.deleted", $user, $before, null, $validated["reason"]);
        $user->delete();

        return response()->noContent();
    }

    public function toggleActive(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if ($user->role === "superadmin") {
            return response()->json(["message" => "Le statut d’un Super Admin ne peut pas être basculé depuis cette action."], 403);
        }
        $before = ["is_active" => (bool) $user->is_active];
        $user->update(["is_active" => ! $user->is_active]);
        $this->audit->record($request, $user->is_active ? "user.activated" : "user.deactivated", $user, $before, ["is_active" => (bool) $user->is_active], $request->input("reason"));

        return response()->json(["message" => "Statut mis à jour.", "is_active" => (bool) $user->is_active]);
    }

    public function togglePublish(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $site = $user->siteConfigs()->first();
        if (! $site) {
            return response()->json(["message" => "Cet utilisateur n’a pas de site configuré."], 404);
        }
        $before = ["site_id" => $site->id, "is_published" => (bool) $site->is_published];
        $site->update(["is_published" => ! $site->is_published]);
        $this->audit->record($request, $site->is_published ? "site.published" : "site.unpublished", $user, $before, ["site_id" => $site->id, "is_published" => (bool) $site->is_published], $request->input("reason"));

        return response()->json(["message" => "Publication du site mise à jour.", "is_published" => (bool) $site->is_published]);
    }

    public function revokeTokens(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate(["reason" => ["required", "string", "min:5", "max:500"]]);
        if ($user->is($request->user())) {
            return response()->json(["message" => "Utilisez la déconnexion pour révoquer votre session courante."], 409);
        }
        $count = $user->tokens()->count();
        $user->tokens()->delete();
        $this->audit->record($request, "user.sessions_revoked", $user, ["sessions" => $count], ["sessions" => 0], $validated["reason"]);

        return response()->json(["message" => "Toutes les sessions ont été révoquées.", "revoked" => $count]);
    }

    public function setEmailVerification(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            "verified" => ["required", "boolean"],
            "reason" => ["required", "string", "min:5", "max:500"],
        ]);
        $before = ["email_verified_at" => $user->email_verified_at];
        $user->forceFill(["email_verified_at" => $validated["verified"] ? now() : null])->save();
        $this->audit->record($request, $validated["verified"] ? "user.email_verified" : "user.email_unverified", $user, $before, ["email_verified_at" => $user->email_verified_at], $validated["reason"]);

        return response()->json(["message" => "Vérification email mise à jour.", "email_verified_at" => $user->email_verified_at]);
    }
}
