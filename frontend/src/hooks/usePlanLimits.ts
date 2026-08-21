import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/services/api';

export type PlanType = 'starter' | 'pro' | 'studio';

interface PlanLimits {
    maxPhotos: number;
    maxGalleries: number;
    maxPages: number;
    canCustomDomain: boolean;
    canRemoveBranding: boolean;
    storageGB: number;
}

interface SubscriptionEntitlements {
    portfolio_photos_limit: number | null;
    active_galleries_monthly_limit: number | null;
    custom_domain: boolean;
    remove_branding: boolean;
}

interface SubscriptionPolicyResponse {
    active: boolean;
    source: 'trial' | 'subscription' | 'superadmin' | 'none';
    plan: PlanType | null;
    trial_ends_at: string | null;
    ends_at: string | null;
    entitlements: SubscriptionEntitlements;
    usage: {
        portfolio_photos: number;
        active_galleries_this_month: number;
    };
}

const LOCKED_LIMITS: PlanLimits = {
    maxPhotos: 0,
    maxGalleries: 0,
    maxPages: 0,
    canCustomDomain: false,
    canRemoveBranding: false,
    storageGB: 0,
};

export function usePlanLimits() {
    const [policy, setPolicy] = useState<SubscriptionPolicyResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        api.get<SubscriptionPolicyResponse>('/subscription/entitlements')
            .then((response) => {
                if (!cancelled) setPolicy(response.data);
            })
            .catch(() => {
                // Fail closed in the UI. The API remains the authoritative guard.
                if (!cancelled) setPolicy(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const currentPlan: PlanType = policy?.plan ?? 'starter';

    const limits = useMemo<PlanLimits>(() => {
        if (!policy?.active) return LOCKED_LIMITS;

        return {
            maxPhotos: policy.entitlements.portfolio_photos_limit ?? Infinity,
            maxGalleries: policy.entitlements.active_galleries_monthly_limit ?? Infinity,
            // No page quota is advertised in the public pricing contract.
            maxPages: Infinity,
            canCustomDomain: policy.entitlements.custom_domain,
            canRemoveBranding: policy.entitlements.remove_branding,
            // Storage has no numeric Starter/Pro limit in the pricing contract.
            storageGB: Infinity,
        };
    }, [policy]);

    const checkLimit = useCallback((
        feature: 'photos' | 'galleries' | 'pages',
        currentValue: number
    ): boolean => {
        switch (feature) {
            case 'photos': {
                const usage = Math.max(currentValue, policy?.usage.portfolio_photos ?? 0);
                return usage >= limits.maxPhotos;
            }
            case 'galleries': {
                const usage = Math.max(currentValue, policy?.usage.active_galleries_this_month ?? 0);
                return usage >= limits.maxGalleries;
            }
            case 'pages':
                return currentValue >= limits.maxPages;
            default:
                return false;
        }
    }, [limits, policy]);

    return {
        currentPlan,
        limits,
        checkLimit,
        subscriptionActive: policy?.active ?? false,
        subscriptionSource: policy?.source ?? 'none',
        subscriptionEndsAt: policy?.ends_at ?? null,
        trialEndsAt: policy?.trial_ends_at ?? null,
        loading,
    };
}
