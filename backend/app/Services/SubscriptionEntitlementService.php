<?php

namespace App\Services;

use App\Models\SiteConfig;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Http\JsonResponse;

class SubscriptionEntitlementService
{
    /** @var array<int, array<string, mixed>> */
    private array $resolved = [];

    /** @return array<string, mixed> */
    public function forUser(User $user): array
    {
        if (isset($this->resolved[$user->id])) {
            return $this->resolved[$user->id];
        }

        $trialDays = max(0, (int) config('subscriptions.trial_days', 30));
        $trialEndsAt = $user->created_at?->copy()->addDays($trialDays);

        if (! $user->isActive()) {
            return $this->resolved[$user->id] = $this->inactivePayload($trialDays, $trialEndsAt);
        }

        if ($user->isSuperAdmin()) {
            return $this->resolved[$user->id] = $this->activePayload(
                user: $user,
                plan: 'studio',
                source: 'superadmin',
                trialEndsAt: $trialEndsAt,
            );
        }

        $subscription = $this->currentPaidSubscription($user);
        if ($subscription) {
            $plan = $this->normalizePlanName($subscription->plan?->name);

            if ($plan !== null) {
                return $this->resolved[$user->id] = $this->activePayload(
                    user: $user,
                    plan: $plan,
                    source: 'subscription',
                    subscription: $subscription,
                    trialEndsAt: $trialEndsAt,
                );
            }
        }

        if ($trialEndsAt !== null && now()->lt($trialEndsAt)) {
            return $this->resolved[$user->id] = $this->activePayload(
                user: $user,
                plan: 'starter',
                source: 'trial',
                trialEndsAt: $trialEndsAt,
            );
        }

        return $this->resolved[$user->id] = $this->inactivePayload($trialDays, $trialEndsAt);
    }

    /** @return array<string, mixed> */
    private function inactivePayload(int $trialDays, mixed $trialEndsAt): array
    {
        return [
            'active' => false,
            'source' => 'none',
            'plan' => null,
            'plan_name' => null,
            'subscription_id' => null,
            'starts_at' => null,
            'ends_at' => null,
            'trial_days' => $trialDays,
            'trial_ends_at' => $trialEndsAt?->toIso8601String(),
            'entitlements' => $this->inactiveEntitlements(),
        ];
    }

    public function authorize(User $user, string $capability): ?JsonResponse
    {
        $policy = $this->forUser($user);

        if (! $policy['active']) {
            return response()->json([
                'message' => 'Un abonnement actif ou un essai en cours est requis.',
                'code' => 'subscription_required',
                'capability' => $capability,
                'subscription' => $policy,
            ], 402);
        }

        if (($policy['entitlements'][$capability] ?? false) !== true) {
            return response()->json([
                'message' => 'Cette fonctionnalité n’est pas incluse dans votre forfait.',
                'code' => 'plan_upgrade_required',
                'capability' => $capability,
                'plan' => $policy['plan'],
            ], 403);
        }

        return null;
    }

    public function limit(User $user, string $quota): ?int
    {
        $policy = $this->forUser($user);

        if (! $policy['active']) {
            return 0;
        }

        $value = $policy['entitlements'][$quota] ?? 0;

        return $value === null ? null : (int) $value;
    }

    public function quotaExceeded(string $quota, int $limit, int $usage): JsonResponse
    {
        return response()->json([
            'message' => 'La limite de votre forfait est atteinte.',
            'code' => 'quota_exceeded',
            'quota' => $quota,
            'limit' => $limit,
            'usage' => $usage,
        ], 403);
    }

    public function activeGalleryUsage(User $user): int
    {
        return $user->galleries()
            ->where('status', '!=', 'archived')
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->count();
    }

    public function portfolioPhotoUsage(User $user, ?SiteConfig $excluding = null): int
    {
        return $user->siteConfigs()
            ->when($excluding, fn ($query) => $query->whereKeyNot($excluding->getKey()))
            ->get(['config_data'])
            ->sum(fn (SiteConfig $config) => $this->portfolioPhotoCount($config->config_data));
    }

    /** @param array<string, mixed> $configData */
    public function portfolioPhotoCount(array $configData): int
    {
        return isset($configData['photos']) && is_array($configData['photos'])
            ? count($configData['photos'])
            : 0;
    }

    /** @return array<string, int> */
    public function usage(User $user): array
    {
        return [
            'portfolio_photos' => $this->portfolioPhotoUsage($user),
            'active_galleries_this_month' => $this->activeGalleryUsage($user),
        ];
    }

    private function currentPaidSubscription(User $user): ?UserSubscription
    {
        return $user->subscriptions()
            ->with('plan')
            ->currentlyActive()
            ->orderByDesc('starts_at')
            ->orderByDesc('id')
            ->get()
            ->first(fn (UserSubscription $subscription) => $this->normalizePlanName($subscription->plan?->name) !== null);
    }

    private function normalizePlanName(?string $name): ?string
    {
        if ($name === null) {
            return null;
        }

        $plan = strtolower(trim($name));

        return array_key_exists($plan, config('subscriptions.plans', [])) ? $plan : null;
    }

    /** @return array<string, mixed> */
    private function activePayload(
        User $user,
        string $plan,
        string $source,
        ?UserSubscription $subscription = null,
        mixed $trialEndsAt = null,
    ): array {
        return [
            'active' => true,
            'source' => $source,
            'plan' => $plan,
            'plan_name' => strtoupper($plan),
            'subscription_id' => $subscription?->id,
            'starts_at' => $subscription?->starts_at?->toIso8601String() ?? $user->created_at?->toIso8601String(),
            'ends_at' => $subscription?->ends_at?->toIso8601String() ?? ($source === 'trial' ? $trialEndsAt?->toIso8601String() : null),
            'trial_days' => max(0, (int) config('subscriptions.trial_days', 30)),
            'trial_ends_at' => $trialEndsAt?->toIso8601String(),
            'entitlements' => config("subscriptions.plans.{$plan}"),
        ];
    }

    /** @return array<string, mixed> */
    private function inactiveEntitlements(): array
    {
        $starter = config('subscriptions.plans.starter', []);

        return collect($starter)
            ->map(fn ($value) => is_bool($value) ? false : 0)
            ->all();
    }
}
