<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use App\Models\SuperAdminAuditLog;
use App\Services\SuperAdminAuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserControlController extends Controller
{
    public function __construct(private readonly SuperAdminAuditService $audit)
    {
    }
    /**
     * Return the complete operational snapshot of one managed account.
     */
    public function show($id)
    {
        $user = User::query()
            ->with([
                'siteConfigs:id,user_id,site_name,slug,is_published,created_at,updated_at',
                'galleries:id,user_id,uuid,title,status,created_at,updated_at',
                'subscriptions' => fn ($query) => $query->with('plan')->latest('starts_at')->latest('id'),
                'invoices:id,user_id,invoice_number,issue_date,due_date,client_name,total_amount,amount_paid,status,currency,created_at',
            ])
            ->withCount(['galleries', 'siteConfigs', 'subscriptions', 'invoices', 'tokens'])
            ->findOrFail($id);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_active' => (bool) $user->is_active,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'stats' => [
                'galleries' => $user->galleries_count,
                'sites' => $user->site_configs_count,
                'subscriptions' => $user->subscriptions_count,
                'invoices' => $user->invoices_count,
                'sessions' => $user->tokens_count,
            ],
            'sites' => $user->siteConfigs,
            'galleries' => $user->galleries,
            'subscriptions' => $user->subscriptions->map(fn (UserSubscription $subscription) => [
                'id' => $subscription->id,
                'plan' => $subscription->plan ? [
                    'id' => $subscription->plan->id,
                    'name' => $subscription->plan->name,
                ] : null,
                'billing_cycle' => $subscription->billing_cycle,
                'status' => $subscription->status,
                'payment_status' => $subscription->payment_status,
                'starts_at' => $subscription->starts_at,
                'ends_at' => $subscription->ends_at,
                'created_at' => $subscription->created_at,
            ]),
            'invoices' => $user->invoices,
            'audit_logs' => SuperAdminAuditLog::query()->with('actor:id,name,email')->where('target_type', 'user')->where('target_id', $user->id)->latest('created_at')->limit(25)->get(),
        ]);
    }

    /**
     * Assign a plan manually from the control plane.
     *
     * Existing active subscriptions are closed first so entitlement resolution
     * remains deterministic and historical records are retained.
     */
    public function storeSubscription(Request $request, $id)
    {
        $validated = $request->validate([
            'subscription_plan_id' => ['required', 'integer', 'exists:subscription_plans,id'],
            'billing_cycle' => ['required', Rule::in(['monthly', 'yearly'])],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at', 'after:now'],
            'reason' => ['required', 'string', 'min:5', 'max:500'],
        ], [
            'subscription_plan_id.required' => 'Sélectionnez un forfait.',
            'billing_cycle.required' => 'Sélectionnez un cycle de facturation.',
            'ends_at.after' => 'La date de fin doit être postérieure à la date de début et à aujourd’hui.',
            'reason.required' => 'Le motif est obligatoire.',
            'reason.min' => 'Le motif doit contenir au moins :min caractères.',
        ]);

        $subscription = DB::transaction(function () use ($validated, $id) {
            $user = User::query()->lockForUpdate()->findOrFail($id);
            $plan = SubscriptionPlan::query()->findOrFail($validated['subscription_plan_id']);

            UserSubscription::query()
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->lockForUpdate()
                ->update([
                    'status' => 'canceled',
                    'ends_at' => now(),
                ]);

            return UserSubscription::create([
                'user_id' => $user->id,
                'subscription_plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'status' => 'active',
                'payment_status' => 'manual',
                'starts_at' => $validated['starts_at'] ?? now(),
                'ends_at' => $validated['ends_at'] ?? null,
            ]);
        });
        $target = User::findOrFail($id);
        $this->audit->record($request, 'subscription.assigned', $target, null, $subscription->only(['id', 'subscription_plan_id', 'billing_cycle', 'status', 'starts_at', 'ends_at']), $validated['reason']);

        return response()->json([
            'message' => 'Abonnement attribué depuis le panneau Super Admin.',
            'subscription' => $subscription->load('plan'),
        ], 201);
    }

    /**
     * Replace an active subscription with another plan while preserving history.
     */
    public function changePlan(Request $request, $id, $subscriptionId)
    {
        $validated = $request->validate([
            'subscription_plan_id' => [
                'required',
                'integer',
                Rule::exists('subscription_plans', 'id')->where(fn ($query) => $query->where('is_active', true)),
            ],
            'billing_cycle' => ['required', Rule::in(['monthly', 'yearly'])],
            'ends_at' => ['nullable', 'date', 'after:now'],
            'reason' => ['required', 'string', 'min:5', 'max:500'],
        ], [
            'subscription_plan_id.required' => 'Sélectionnez un forfait.',
            'billing_cycle.required' => 'Sélectionnez un cycle de facturation.',
            'ends_at.after' => 'La date de fin doit être postérieure à la date de début et à aujourd’hui.',
            'reason.required' => 'Le motif est obligatoire.',
            'reason.min' => 'Le motif doit contenir au moins :min caractères.',
        ]);

        [$before, $replacement] = DB::transaction(function () use ($validated, $id, $subscriptionId) {
            $user = User::query()->lockForUpdate()->findOrFail($id);
            $current = UserSubscription::query()
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->findOrFail($subscriptionId);

            if ($current->status !== 'active'
                || ($current->starts_at && $current->starts_at->isFuture())
                || ($current->ends_at && $current->ends_at->isPast())) {
                throw ValidationException::withMessages([
                    'subscription' => 'Seul l’abonnement actuellement actif peut changer de forfait.',
                ]);
            }

            if ((int) $current->subscription_plan_id === (int) $validated['subscription_plan_id']) {
                throw ValidationException::withMessages([
                    'subscription_plan_id' => 'Sélectionnez un forfait différent du forfait actuel.',
                ]);
            }

            $before = $current->only(['id', 'subscription_plan_id', 'billing_cycle', 'status', 'payment_status', 'starts_at', 'ends_at']);
            $effectiveAt = now();
            $replacementEnd = array_key_exists('ends_at', $validated)
                ? $validated['ends_at']
                : ($current->ends_at?->isFuture() ? $current->ends_at : null);

            UserSubscription::query()
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->update(['status' => 'canceled', 'ends_at' => $effectiveAt]);

            $replacement = UserSubscription::create([
                'user_id' => $user->id,
                'subscription_plan_id' => $validated['subscription_plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'status' => 'active',
                'payment_status' => 'manual',
                'starts_at' => $effectiveAt,
                'ends_at' => $replacementEnd,
            ]);

            return [$before, $replacement];
        });

        $after = $replacement->only(['id', 'subscription_plan_id', 'billing_cycle', 'status', 'payment_status', 'starts_at', 'ends_at']);
        $after['replaced_subscription_id'] = $before['id'];
        $target = User::findOrFail($id);
        $this->audit->record($request, 'subscription.plan_changed', $target, $before, $after, $validated['reason']);

        return response()->json([
            'message' => 'Le forfait de l’utilisateur a été modifié et l’historique conservé.',
            'subscription' => $replacement->load('plan'),
        ]);
    }

    /**
     * Update lifecycle status or validity of one subscription owned by a user.
     */
    public function updateSubscription(Request $request, $id, $subscriptionId)
    {
        $validated = $request->validate([
            'status' => ['sometimes', Rule::in(['active', 'past_due', 'canceled'])],
            'billing_cycle' => ['sometimes', Rule::in(['monthly', 'yearly'])],
            'starts_at' => ['sometimes', 'nullable', 'date'],
            'ends_at' => ['sometimes', 'nullable', 'date'],
            'reason' => ['required', 'string', 'min:5', 'max:500'],
        ], [
            'reason.required' => 'Le motif est obligatoire.',
            'reason.min' => 'Le motif doit contenir au moins :min caractères.',
        ]);
        $before = UserSubscription::query()->where('user_id', $id)->findOrFail($subscriptionId)->only(['id', 'subscription_plan_id', 'billing_cycle', 'status', 'starts_at', 'ends_at']);

        $subscription = DB::transaction(function () use ($validated, $id, $subscriptionId) {
            $subscription = UserSubscription::query()
                ->where('user_id', $id)
                ->lockForUpdate()
                ->findOrFail($subscriptionId);

            if (($validated['status'] ?? $subscription->status) === 'active') {
                UserSubscription::query()
                    ->where('user_id', $id)
                    ->where('status', 'active')
                    ->whereKeyNot($subscription->id)
                    ->lockForUpdate()
                    ->update([
                        'status' => 'canceled',
                        'ends_at' => now(),
                    ]);
            }

            $subscription->update(array_filter([
                'status' => $validated['status'] ?? null,
                'billing_cycle' => $validated['billing_cycle'] ?? null,
                'starts_at' => array_key_exists('starts_at', $validated) ? $validated['starts_at'] : null,
                'ends_at' => array_key_exists('ends_at', $validated)
                    ? $validated['ends_at']
                    : (($validated['status'] ?? null) === 'canceled' ? now() : null),
            ], fn ($value) => $value !== null));

            return $subscription->fresh('plan');
        });

        $this->audit->record($request, 'subscription.updated', User::findOrFail($id), $before, $subscription->only(['id', 'subscription_plan_id', 'billing_cycle', 'status', 'starts_at', 'ends_at']), $validated['reason']);
        return response()->json([
            'message' => 'Abonnement mis à jour.',
            'subscription' => $subscription,
        ]);
    }
}
