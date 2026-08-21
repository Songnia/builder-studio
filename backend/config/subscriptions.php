<?php

return [
    /*
    | The public frontend promises a 30-day, card-free Starter trial.
    | No grace period is advertised after a trial or paid period expires.
    */
    'trial_days' => (int) env('SUBSCRIPTION_TRIAL_DAYS', 30),

    /*
    | Machine-readable counterpart of frontend/src/pages/PricingPage.tsx.
    | A null quota means unlimited. Plan names are matched case-insensitively.
    */
    'plans' => [
        'starter' => [
            'builder' => true,
            'publish_site' => true,
            'vanda_subdomain' => true,
            'portfolio_photos_limit' => 20,
            'active_galleries_monthly_limit' => 4,
            'secure_gallery_delivery' => true,
            'invoicing' => true,
            'online_payments' => false,
            'deposits_and_balances' => false,
            'custom_domain' => false,
            'remove_branding' => false,
            'api_webhooks' => false,
            'advanced_analytics' => false,
            'data_export' => false,
            'verified_badge' => false,
            'early_access' => false,
        ],
        'pro' => [
            'builder' => true,
            'publish_site' => true,
            'vanda_subdomain' => true,
            'portfolio_photos_limit' => 500,
            'active_galleries_monthly_limit' => 20,
            'secure_gallery_delivery' => true,
            'invoicing' => true,
            'online_payments' => true,
            'deposits_and_balances' => true,
            'custom_domain' => true,
            'remove_branding' => true,
            'api_webhooks' => false,
            'advanced_analytics' => false,
            'data_export' => false,
            'verified_badge' => false,
            'early_access' => false,
        ],
        'studio' => [
            'builder' => true,
            'publish_site' => true,
            'vanda_subdomain' => true,
            'portfolio_photos_limit' => null,
            'active_galleries_monthly_limit' => null,
            'secure_gallery_delivery' => true,
            'invoicing' => true,
            'online_payments' => true,
            'deposits_and_balances' => true,
            'custom_domain' => true,
            'remove_branding' => true,
            'api_webhooks' => true,
            'advanced_analytics' => true,
            'data_export' => true,
            'verified_badge' => true,
            'early_access' => true,
        ],
    ],
];
