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
        $plans = config('subscriptions.catalog', []);

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['name' => $plan['name']],
                [
                    'price' => $plan['price'],
                    'yearly_price' => $plan['yearly_price'],
                    'features' => $plan['features'],
                    'is_active' => true,
                    'maketou_product_id' => $plan['maketou_product_id'],
                    'maketou_yearly_product_id' => $plan['maketou_yearly_product_id'],
                ]
            );
        }
    }
}
