<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'STARTER',
                'price' => 5000,
                'features' => [
                    'Accès au constructeur de site (builder pas-à-pas)',
                    'Jusqu\'à 20 photos dans le portfolio',
                    '4 galeries clients actives par mois',
                    'Livraison de galeries par lien sécurisé',
                    'Facturation & devis en FCFA',
                    'Sous-domaine Vanda Studio',
                    'Support par email',
                ],
                'is_active' => true,
                'maketou_product_id' => '0125f2a3-f95b-4298-9d5b-e053c84de9cb',
                'maketou_yearly_product_id' => 'f019d0e4-fb8d-434a-bc3e-758d5db46d90',
                'yearly_price' => 50000,
            ],
            [
                'name' => 'PRO',
                'price' => 11000,
                'features' => [
                    'Toutes les fonctionnalités Starter',
                    'Jusqu\'à 500 photos dans le portfolio',
                    '20 galeries clients actives par mois',
                    'Domaine personnalisé inclus',
                    'Sans watermark Vanda Studio',
                    'Paiement en ligne en FCFA (Mobile Money & carte)',
                    'Acomptes & soldes sur devis et factures',
                    'Support e-mail prioritaire',
                ],
                'is_active' => true,
                'maketou_product_id' => 'c84a9886-ec7a-405a-a00e-2efb45035e6f',
                'maketou_yearly_product_id' => 'e1121214-39e8-4188-9b2d-c201b8999d42',
                'yearly_price' => 100000,
            ],
            [
                'name' => 'STUDIO',
                'price' => 25000,
                'features' => [
                    'Toutes les fonctionnalités PRO',
                    'Photos portfolio illimitées',
                    'Galeries clients illimitées',
                    'API et Webhooks',
                    'Statistiques avancées',
                    'Support prioritaire 24/7',
                    'Accès anticipé aux nouvelles fonctionnalités',
                    'Export des données & sauvegardes',
                    'Onboarding dédié',
                ],
                'is_active' => true,
                'maketou_product_id' => '31d7c6d1-62b2-4cfb-a979-f98e6d0e04de',
                'maketou_yearly_product_id' => 'bf278046-0097-489e-9f7f-395f0ed9bcfa',
                'yearly_price' => 250000,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['name' => $plan['name']],
                $plan
            );
        }
    }
}
