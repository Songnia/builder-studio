<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Install the three offers advertised by the public pricing interface.
     * Production deployments run migrations, but intentionally do not run
     * seeders, so these reference rows must be installed here once.
     */
    public function up(): void
    {
        $plans = [
            [
                'name' => 'STARTER',
                'price' => 5000,
                'yearly_price' => 50000,
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
            [
                'name' => 'PRO',
                'price' => 11000,
                'yearly_price' => 100000,
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
            [
                'name' => 'STUDIO',
                'price' => 25000,
                'yearly_price' => 250000,
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
        ];

        foreach ($plans as $plan) {
            $now = now();

            DB::table('subscription_plans')->updateOrInsert(
                ['name' => $plan['name']],
                [
                    'price' => $plan['price'],
                    'yearly_price' => $plan['yearly_price'],
                    'features' => json_encode($plan['features'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    'is_active' => true,
                    'maketou_product_id' => $plan['maketou_product_id'],
                    'maketou_yearly_product_id' => $plan['maketou_yearly_product_id'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }

    public function down(): void
    {
        // Reference plans may already be attached to subscriptions. A rollback
        // must not delete them (and cascade-delete customer subscription data).
    }
};
