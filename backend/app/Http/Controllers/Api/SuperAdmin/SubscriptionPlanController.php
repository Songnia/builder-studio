<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Services\SuperAdminAuditService;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubscriptionPlanController extends Controller
{
    public function __construct(private readonly SuperAdminAuditService $audit)
    {
    }

    public function index()
    {
        return response()->json(SubscriptionPlan::query()
            ->withCount(['userSubscriptions', 'userSubscriptions as active_subscriptions_count' => fn ($query) => $query->currentlyActive()])
            ->orderBy('price')->get());
    }

    public function store(Request $request)
    {
        $this->normalizeName($request);
        $validated = $this->validatePlan($request, null, true);
        $reason = $validated['reason']; unset($validated['reason']);
        $plan = SubscriptionPlan::create($validated);
        $this->audit->record($request, 'plan.created', $plan, null, $plan->toArray(), $reason);

        return response()->json($plan, 201);
    }

    public function show($id)
    {
        return response()->json(SubscriptionPlan::query()->withCount(['userSubscriptions', 'userSubscriptions as active_subscriptions_count' => fn ($query) => $query->currentlyActive()])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        $this->normalizeName($request);
        $validated = $this->validatePlan($request, $plan, false);
        $reason = $validated['reason']; unset($validated['reason']);
        $before = $plan->toArray();
        $plan->update($validated);
        $this->audit->record($request, 'plan.updated', $plan, $before, $plan->fresh()->toArray(), $reason);

        return response()->json($plan->fresh());
    }

    public function destroy(Request $request, $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        if ($plan->userSubscriptions()->exists()) {
            return $this->referencedPlanResponse();
        }
        $validated = $request->validate(['reason' => ['required', 'string', 'min:5', 'max:500']]);
        $before = $plan->toArray();
        try {
            $this->audit->record($request, 'plan.deleted', $plan, $before, null, $validated['reason']);
            $plan->delete();
        } catch (QueryException $exception) {
            if ($plan->userSubscriptions()->exists()) {
                return $this->referencedPlanResponse();
            }
            throw $exception;
        }

        return response()->noContent();
    }

    private function validatePlan(Request $request, ?SubscriptionPlan $plan, bool $creating): array
    {
        $required = $creating ? 'required' : 'sometimes';
        return $request->validate([
            'name' => [$required, 'string', Rule::in(['STARTER', 'PRO', 'STUDIO']), Rule::unique('subscription_plans', 'name')->ignore($plan?->id)],
            'price' => [$required, 'numeric', 'min:0'],
            'yearly_price' => [$required, 'numeric', 'min:0'],
            'features' => ['nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
            'maketou_product_id' => ['nullable', 'string', 'max:255'],
            'maketou_yearly_product_id' => ['nullable', 'string', 'max:255'],
            'reason' => ['required', 'string', 'min:5', 'max:500'],
        ]);
    }

    private function normalizeName(Request $request): void
    {
        if ($request->filled('name')) {
            $request->merge(['name' => strtoupper(trim($request->string('name')->toString()))]);
        }
    }

    private function referencedPlanResponse()
    {
        return response()->json(['message' => 'Ce forfait est associé à des abonnements et ne peut pas être supprimé. Désactivez-le à la place.'], 409);
    }
}
