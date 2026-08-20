<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

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
                    'Support par email'
                ],
                'is_active' => true,
                'maketou_product_id' => 'vanda-starter',
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
                    'Support e-mail prioritaire'
                ],
                'is_active' => true,
                'maketou_product_id' => 'vanda-pro',
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
                    'Onboarding dédié'
                ],
                'is_active' => true,
                'maketou_product_id' => 'vanda-studio',
            ]
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['name' => $plan['name']],
                $plan
            );
        }
    }
}
