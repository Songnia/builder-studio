<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Services\SubscriptionEntitlementService;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Get all active subscription plans for users
     */
    public function getActivePlans()
    {
        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('price', 'asc')
            ->get()
            ->filter(fn (SubscriptionPlan $plan) => config('subscriptions.plans.'.strtolower(trim($plan->name))) !== null)
            ->map(function (SubscriptionPlan $plan) {
                $key = strtolower(trim($plan->name));
                $catalog = config("subscriptions.catalog.{$key}", []);
                $payload = $plan->toArray();
                $payload['policy_key'] = $key;
                $payload['description'] = $catalog['description'] ?? '';
                $payload['promo_monthly_price'] = $catalog['promo_monthly_price'] ?? null;
                $payload['promo_months'] = $catalog['promo_months'] ?? null;
                $payload['popular'] = $catalog['popular'] ?? false;
                $payload['entitlements'] = config("subscriptions.plans.{$key}");

                return $payload;
            })
            ->values();

        return response()->json($plans);
    }

    /**
     * Return the authoritative policy and current usage for the signed-in user.
     */
    public function current(Request $request, SubscriptionEntitlementService $subscriptions)
    {
        return response()->json([
            ...$subscriptions->forUser($request->user()),
            'usage' => $subscriptions->usage($request->user()),
        ]);
    }
}
