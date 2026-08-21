<?php

namespace Tests\Feature;

use App\Models\Gallery;
use App\Models\SiteConfig;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class SubscriptionEntitlementTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow('2026-08-20 12:00:00');
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_new_account_receives_the_frontend_starter_policy_during_its_30_day_trial(): void
    {
        $user = User::factory()->create([
            'created_at' => now()->subDays(10),
        ]);

        $this->actingAs($user)
            ->getJson('/api/subscription/entitlements')
            ->assertOk()
            ->assertJsonPath('active', true)
            ->assertJsonPath('source', 'trial')
            ->assertJsonPath('plan', 'starter')
            ->assertJsonPath('trial_days', 30)
            ->assertJsonPath('entitlements.portfolio_photos_limit', 20)
            ->assertJsonPath('entitlements.active_galleries_monthly_limit', 4)
            ->assertJsonPath('entitlements.custom_domain', false)
            ->assertJsonPath('entitlements.remove_branding', false)
            ->assertJsonPath('entitlements.online_payments', false)
            ->assertJsonPath('entitlements.invoicing', true)
            ->assertJsonPath('entitlements.publish_site', true);
    }

    public function test_expired_trial_without_subscription_cannot_create_a_gallery(): void
    {
        $user = User::factory()->create([
            'created_at' => now()->subDays(31),
        ]);

        $this->actingAs($user)
            ->postJson('/api/admin/galleries', ['title' => 'Hors abonnement'])
            ->assertStatus(402)
            ->assertJsonPath('code', 'subscription_required');

        $this->assertDatabaseCount('galleries', 0);
    }

    public function test_starter_cannot_create_a_fifth_active_gallery_in_the_same_month(): void
    {
        $user = $this->createPaidUser('STARTER');

        Gallery::factory()->count(4)->create([
            'user_id' => $user->id,
            'status' => 'published',
            'created_at' => now()->startOfMonth()->addDay(),
        ]);

        $this->actingAs($user)
            ->postJson('/api/admin/galleries', ['title' => 'Cinquième galerie'])
            ->assertStatus(403)
            ->assertJsonPath('code', 'quota_exceeded')
            ->assertJsonPath('limit', 4)
            ->assertJsonPath('usage', 4);
    }

    public function test_archived_and_previous_month_galleries_do_not_consume_the_current_month_quota(): void
    {
        $user = $this->createPaidUser('STARTER');

        Gallery::factory()->count(3)->create([
            'user_id' => $user->id,
            'status' => 'published',
            'created_at' => now()->startOfMonth()->addDay(),
        ]);
        Gallery::factory()->create([
            'user_id' => $user->id,
            'status' => 'archived',
            'created_at' => now()->startOfMonth()->addDays(2),
        ]);
        Gallery::factory()->create([
            'user_id' => $user->id,
            'status' => 'published',
            'created_at' => now()->subMonth()->startOfMonth()->addDay(),
        ]);

        $this->actingAs($user)
            ->postJson('/api/admin/galleries', ['title' => 'Quatrième galerie active'])
            ->assertCreated();
    }

    public function test_site_cannot_be_published_after_entitlement_expiration(): void
    {
        $user = User::factory()->create([
            'created_at' => now()->subDays(31),
        ]);
        $site = SiteConfig::create([
            'user_id' => $user->id,
            'site_name' => 'Studio expiré',
            'slug' => 'studio-expire',
            'config_data' => ['photos' => []],
            'is_published' => false,
        ]);

        $this->actingAs($user)
            ->postJson("/api/site-configs/{$site->id}/publish", ['is_published' => true])
            ->assertStatus(402)
            ->assertJsonPath('code', 'subscription_required');

        $this->assertFalse($site->fresh()->is_published);
    }

    public function test_starter_cannot_save_more_than_20_portfolio_photos(): void
    {
        $user = User::factory()->create();
        $photos = collect(range(1, 21))
            ->map(fn (int $id) => [
                'id' => (string) $id,
                'url' => "https://example.test/{$id}.jpg",
                'category' => 'Portfolio',
            ])
            ->all();

        $this->actingAs($user)
            ->postJson('/api/site-configs', [
                'site_name' => 'Portfolio trop grand',
                'slug' => 'portfolio-trop-grand',
                'config_data' => ['photos' => $photos],
                'is_published' => false,
            ])
            ->assertStatus(403)
            ->assertJsonPath('code', 'quota_exceeded')
            ->assertJsonPath('limit', 20)
            ->assertJsonPath('usage', 21);

        $this->assertDatabaseCount('site_configs', 0);
    }

    public function test_active_studio_subscription_has_unlimited_frontend_quotas(): void
    {
        $user = $this->createPaidUser('STUDIO');

        $this->actingAs($user)
            ->getJson('/api/subscription/entitlements')
            ->assertOk()
            ->assertJsonPath('source', 'subscription')
            ->assertJsonPath('plan', 'studio')
            ->assertJsonPath('entitlements.portfolio_photos_limit', null)
            ->assertJsonPath('entitlements.active_galleries_monthly_limit', null)
            ->assertJsonPath('entitlements.api_webhooks', true)
            ->assertJsonPath('entitlements.advanced_analytics', true);
    }

    private function createPaidUser(string $planName): User
    {
        $user = User::factory()->create([
            'created_at' => now()->subDays(60),
        ]);
        $plan = SubscriptionPlan::create([
            'name' => $planName,
            'price' => 5000,
            'features' => [],
            'is_active' => true,
            'maketou_product_id' => 'test-'.strtolower($planName),
        ]);

        UserSubscription::create([
            'user_id' => $user->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'active',
            'payment_status' => 'completed',
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addMonth(),
        ]);

        return $user;
    }
}
