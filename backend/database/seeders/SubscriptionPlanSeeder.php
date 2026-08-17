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
                    'Accès au constructeur de site',
                    'Jusqu\'à 20 photos',
                    '4 galeries par mois',
                    'Sous-domaine Vanda Studio',
                    'Support par email'
                ],
                'is_active' => true,
                'maketou_product_id' => 'vanda-starter',
            ],
            [
                'name' => 'PRO',
                'price' => 15000,
                'features' => [
                    'Toutes les fonctionnalités Starter',
                    'Jusqu\'à 500 photos',
                    '20 galeries par mois',
                    'Domaine personnalisé inclus',
                    'Sans watermark Vanda Studio'
                ],
                'is_active' => true,
                'maketou_product_id' => 'vanda-pro',
            ],
            [
                'name' => 'STUDIO',
                'price' => 45000,
                'features' => [
                    'Toutes les fonctionnalités PRO',
                    'Photos illimitées',
                    'Galeries illimitées',
                    'API et Webhooks',
                    'Support prioritaire 24/7',
                    'Statistiques avancées'
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
