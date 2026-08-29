<?php

namespace Tests\Feature;

use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use Database\Seeders\SubscriptionPlanSeeder;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MaketouOfferMappingTest extends TestCase
{
    public function test_seeder_configures_all_monthly_and_yearly_product_ids(): void
    {
        $this->seed(SubscriptionPlanSeeder::class);

        $expected = [
            'STARTER' => [
                'monthly' => '0125f2a3-f95b-4298-9d5b-e053c84de9cb',
                'yearly' => 'f019d0e4-fb8d-434a-bc3e-758d5db46d90',
            ],
            'PRO' => [
                'monthly' => 'c84a9886-ec7a-405a-a00e-2efb45035e6f',
                'yearly' => 'e1121214-39e8-4188-9b2d-c201b8999d42',
            ],
            'STUDIO' => [
                'monthly' => '31d7c6d1-62b2-4cfb-a979-f98e6d0e04de',
                'yearly' => 'bf278046-0097-489e-9f7f-395f0ed9bcfa',
            ],
        ];

        foreach ($expected as $name => $ids) {
            $plan = SubscriptionPlan::where('name', $name)->firstOrFail();

            $this->assertSame($ids['monthly'], $plan->maketou_product_id);
            $this->assertSame($ids['yearly'], $plan->maketou_yearly_product_id);
        }
    }

    public function test_seeded_catalog_matches_the_three_public_offers(): void
    {
        $this->seed(SubscriptionPlanSeeder::class);

        $expectedPrices = [
            'STARTER' => [5000, 50000],
            'PRO' => [11000, 100000],
            'STUDIO' => [25000, 250000],
        ];

        $this->assertDatabaseCount('subscription_plans', 3);

        foreach ($expectedPrices as $name => [$monthly, $yearly]) {
            $plan = SubscriptionPlan::where('name', $name)->firstOrFail();

            $this->assertSame($monthly, (int) $plan->price);
            $this->assertSame($yearly, (int) $plan->yearly_price);
            $this->assertTrue($plan->is_active);
            $this->assertNotEmpty($plan->features);
        }
    }

    public function test_admin_subscription_endpoint_exposes_public_catalog_metadata(): void
    {
        $this->seed(SubscriptionPlanSeeder::class);
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/plans')
            ->assertOk()
            ->assertJsonCount(3)
            ->assertJsonPath('0.policy_key', 'starter')
            ->assertJsonPath('0.description', 'Pour démarrer votre studio en ligne')
            ->assertJsonPath('0.promo_monthly_price', 2500)
            ->assertJsonPath('0.promo_months', 6)
            ->assertJsonPath('0.popular', false)
            ->assertJsonPath('1.policy_key', 'pro')
            ->assertJsonPath('1.promo_monthly_price', 5000)
            ->assertJsonPath('1.popular', true)
            ->assertJsonPath('2.policy_key', 'studio')
            ->assertJsonPath('2.promo_monthly_price', 15000)
            ->assertJsonPath('2.popular', false);
    }

    public function test_checkout_reports_an_invalid_maketou_api_key(): void
    {
        config(['services.maketou.api_key' => 'invalid-test-key']);
        Http::fake([
            '*' => Http::response([
                'code' => 'INVALID_API_KEY',
                'message' => 'Invalid API key',
            ], 401),
        ]);

        $this->seed(SubscriptionPlanSeeder::class);
        $user = User::factory()->create();
        $plan = SubscriptionPlan::where('name', 'STARTER')->firstOrFail();

        $this->actingAs($user)
            ->postJson('/api/payment/checkout', [
                'plan_id' => $plan->id,
                'billing_cycle' => 'monthly',
                'redirect_url' => 'https://app.vanda-studio.org/admin/dashboard',
            ])
            ->assertStatus(503)
            ->assertJson([
                'code' => 'payment_configuration_error',
                'message' => 'Le service de paiement est temporairement mal configuré. Contactez l’administrateur.',
            ]);

        $this->assertDatabaseCount('user_subscriptions', 0);
    }

    public function test_checkout_reports_an_invalid_product_id(): void
    {
        config(['services.maketou.api_key' => 'valid-test-key']);
        Http::fake([
            '*' => Http::response([
                'code' => 'INVALID_PRODUCT',
                'message' => 'Invalid product',
            ], 400),
        ]);

        $this->seed(SubscriptionPlanSeeder::class);
        $user = User::factory()->create();
        $plan = SubscriptionPlan::where('name', 'PRO')->firstOrFail();

        $this->actingAs($user)
            ->postJson('/api/payment/checkout', [
                'plan_id' => $plan->id,
                'billing_cycle' => 'yearly',
                'redirect_url' => 'https://app.vanda-studio.org/admin/dashboard',
            ])
            ->assertStatus(400)
            ->assertJson([
                'code' => 'plan_payment_unavailable',
                'message' => 'Ce forfait n’est pas disponible au paiement. Contactez l’administrateur.',
            ]);

        $this->assertDatabaseCount('user_subscriptions', 0);
    }

    public function test_yearly_checkout_uses_yearly_product_and_persists_cycle(): void
    {
        Http::fake([
            '*' => Http::response([
                'cart' => ['id' => 'cart-yearly-pro'],
                'redirectUrl' => 'https://checkout.maketou.test/cart-yearly-pro',
            ], 201),
        ]);

        $this->seed(SubscriptionPlanSeeder::class);
        $user = User::factory()->create();
        $plan = SubscriptionPlan::where('name', 'PRO')->firstOrFail();

        $this->actingAs($user)
            ->postJson('/api/payment/checkout', [
                'plan_id' => $plan->id,
                'billing_cycle' => 'yearly',
                'redirect_url' => 'https://app.vanda-studio.org/admin/dashboard',
            ])
            ->assertCreated()
            ->assertJsonPath('cartId', 'cart-yearly-pro');

        Http::assertSent(fn (Request $request) => $request['productDocumentId'] === 'e1121214-39e8-4188-9b2d-c201b8999d42'
            && $request['meta']['billingCycle'] === 'yearly'
        );

        $subscription = UserSubscription::where('maketou_cart_id', 'cart-yearly-pro')->firstOrFail();
        $this->assertSame('yearly', $subscription->billing_cycle);
    }
}
