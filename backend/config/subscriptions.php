<?php

return [
    /*
    | The public frontend promises a 30-day, card-free Starter trial.
    | No grace period is advertised after a trial or paid period expires.
    */
    'trial_days' => (int) env('SUBSCRIPTION_TRIAL_DAYS', 30),

    /*
    | Public subscription catalogue.
    |
    | These values mirror the offers advertised by PricingPage.tsx. Database
    | rows are created by the catalogue migration and remain the authoritative
    | source for checkout prices and active/inactive status.
    */
    'catalog' => [
        'starter' => [
            'name' => 'STARTER',
            'description' => 'Pour démarrer votre studio en ligne',
            'price' => 5000,
            'yearly_price' => 50000,
            'promo_monthly_price' => 2500,
            'promo_months' => 6,
            'popular' => false,
            'features' => [
                'Site vitrine (builder pas-à-pas)',
                'Sous-domaine Vanda Studio',
                'Portfolio (jusqu\'à 20 photos)',
                'Galeries clients (4 actives/mois)',
                'Livraison de galeries par lien sécurisé',
                'Facturation & devis en FCFA',
                'Support par e-mail',
            ],
            'maketou_product_id' => '0125f2a3-f95b-4298-9d5b-e053c84de9cb',
            'maketou_yearly_product_id' => 'f019d0e4-fb8d-434a-bc3e-758d5db46d90',
        ],
        'pro' => [
            'name' => 'PRO',
            'description' => 'La formule des photographes qui vivent de leur art',
            'price' => 11000,
            'yearly_price' => 100000,
            'promo_monthly_price' => 5000,
            'promo_months' => 6,
            'popular' => true,
            'features' => [
                'Tout le plan Starter',
                'Domaine personnalisé',
                'Sans watermark Vanda Studio',
                'Portfolio jusqu\'à 500 photos',
                '20 galeries clients actives par mois',
                'Paiement en ligne en FCFA (Mobile Money & carte)',
                'Acomptes & soldes sur devis et factures',
                'Support e-mail prioritaire',
            ],
            'maketou_product_id' => 'c84a9886-ec7a-405a-a00e-2efb45035e6f',
            'maketou_yearly_product_id' => 'e1121214-39e8-4188-9b2d-c201b8999d42',
        ],
        'studio' => [
            'name' => 'STUDIO',
            'description' => 'La puissance maximale pour les studios et les agences',
            'price' => 25000,
            'yearly_price' => 250000,
            'promo_monthly_price' => 15000,
            'promo_months' => 6,
            'popular' => false,
            'features' => [
                'Tout le plan Pro',
                'Photos portfolio illimitées',
                'Galeries clients illimitées',
                'API & Webhooks',
                'Statistiques avancées',
                'Support prioritaire 24/7',
                'Accès anticipé aux nouvelles fonctionnalités',
                'Badge « Studio vérifié » sur le profil',
                'Export des données & sauvegardes',
                'Onboarding dédié',
            ],
            'maketou_product_id' => '31d7c6d1-62b2-4cfb-a979-f98e6d0e04de',
            'maketou_yearly_product_id' => 'bf278046-0097-489e-9f7f-395f0ed9bcfa',
        ],
    ],

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
