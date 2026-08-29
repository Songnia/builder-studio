<?php

namespace Tests\Feature;

use App\Models\Gallery;
use App\Models\Invoice;
use App\Models\Photo;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class CriticalRemediationTest extends TestCase
{
    public function test_active_backfill_does_not_reactivate_disabled_accounts(): void
    {
        $user = User::factory()->create(['is_active' => false]);
        $migration = require database_path('migrations/2026_08_20_000000_backfill_users_is_active.php');

        $migration->up();

        $this->assertFalse($user->fresh()->is_active);
    }

    public function test_gallery_owner_can_update_gallery_metadata(): void
    {
        $owner = User::factory()->create();
        $gallery = Gallery::factory()->create([
            'user_id' => $owner->id,
            'title' => 'Ancien titre',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($owner)->patchJson("/api/admin/galleries/{$gallery->uuid}", [
            'title' => 'Nouveau titre',
            'description' => 'Livraison finale',
            'client_phone' => '+237600000000',
            'pin_code' => '4321',
            'status' => 'published',
        ]);

        $response->assertOk()
            ->assertJsonPath('title', 'Nouveau titre')
            ->assertJsonPath('status', 'published');

        $this->assertDatabaseHas('galleries', [
            'id' => $gallery->id,
            'user_id' => $owner->id,
            'title' => 'Nouveau titre',
            'status' => 'published',
        ]);
    }

    public function test_user_cannot_update_another_users_gallery(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $gallery = Gallery::factory()->create([
            'user_id' => $owner->id,
            'title' => 'Titre protégé',
        ]);

        $this->actingAs($attacker)
            ->patchJson("/api/admin/galleries/{$gallery->uuid}", ['title' => 'Titre détourné'])
            ->assertNotFound();

        $this->assertDatabaseHas('galleries', [
            'id' => $gallery->id,
            'title' => 'Titre protégé',
        ]);
    }

    public function test_user_cannot_verify_another_users_payment_cart(): void
    {
        Http::preventStrayRequests();

        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $plan = SubscriptionPlan::create([
            'name' => 'Plan de test',
            'price' => 5000,
            'is_active' => true,
        ]);

        UserSubscription::create([
            'user_id' => $owner->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'canceled',
            'payment_status' => 'waiting_payment',
            'maketou_cart_id' => 'cart-owner-only',
            'starts_at' => now(),
        ]);

        $this->actingAs($attacker)
            ->postJson('/api/payment/verify', ['cart_id' => 'cart-owner-only'])
            ->assertNotFound();

        Http::assertNothingSent();
    }

    public function test_user_can_verify_own_payment_cart(): void
    {
        Http::fake([
            '*' => Http::response([
                'id' => 'cart-current-user',
                'status' => 'completed',
            ]),
        ]);

        $user = User::factory()->create();
        $plan = SubscriptionPlan::create([
            'name' => 'Plan actif',
            'price' => 10000,
            'is_active' => true,
        ]);
        $subscription = UserSubscription::create([
            'user_id' => $user->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'canceled',
            'payment_status' => 'waiting_payment',
            'maketou_cart_id' => 'cart-current-user',
            'starts_at' => now(),
        ]);

        $this->actingAs($user)
            ->postJson('/api/payment/verify', ['cart_id' => 'cart-current-user'])
            ->assertOk()
            ->assertJsonPath('payment_status', 'completed')
            ->assertJsonPath('subscription_status', 'active');

        $this->assertSame('active', $subscription->fresh()->status);
    }

    public function test_logout_revokes_the_current_access_token(): void
    {
        $user = User::factory()->create();
        $plainTextToken = $user->createToken('logout-regression')->plainTextToken;

        $this->withToken($plainTextToken)
            ->postJson('/api/logout')
            ->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        $this->withToken($plainTextToken)
            ->getJson('/api/user')
            ->assertUnauthorized();
    }

    public function test_login_is_rate_limited_after_repeated_failures(): void
    {
        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->postJson('/api/login', [
                'email' => 'rate-limit@vanda.test',
                'password' => 'invalid-password',
            ])->assertUnauthorized();
        }

        $this->postJson('/api/login', [
            'email' => 'rate-limit@vanda.test',
            'password' => 'invalid-password',
        ])->assertTooManyRequests();
    }

    public function test_invoice_creation_rejects_an_initial_overpayment(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/admin/invoices', [
            'invoice_number' => 'INV-OVERPAY-001',
            'issue_date' => '2026-08-20',
            'due_date' => '2026-09-20',
            'client_name' => 'Client Test',
            'client_email' => 'client@example.test',
            'tax_rate' => 0,
            'include_tax' => false,
            'total_amount' => 100,
            'amount_paid' => 101,
            'items' => [[
                'description' => 'Prestation',
                'quantity' => 1,
                'unit_price' => 100,
                'total' => 100,
            ]],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['amount_paid']);
    }

    public function test_record_payment_rejects_an_amount_above_the_remaining_balance(): void
    {
        $user = User::factory()->create();
        $invoice = Invoice::create([
            'user_id' => $user->id,
            'invoice_number' => 'INV-OVERPAY-002',
            'issue_date' => '2026-08-20',
            'due_date' => '2026-09-20',
            'client_name' => 'Client Test',
            'client_email' => 'client@example.test',
            'tax_rate' => 0,
            'include_tax' => false,
            'total_amount' => 100,
            'amount_paid' => 50,
            'status' => 'partially_paid',
            'currency' => 'FCFA',
        ]);

        $this->actingAs($user)
            ->postJson("/api/admin/invoices/{$invoice->id}/payment", ['amount' => 51])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['amount']);

        $this->assertEquals(50, $invoice->fresh()->amount_paid);
    }

    public function test_pin_protected_gallery_media_requires_a_valid_signature(): void
    {
        Storage::fake('public');
        $owner = User::factory()->create();
        $gallery = Gallery::factory()->create([
            'user_id' => $owner->id,
            'pin_code' => '9876',
        ]);
        Photo::create([
            'gallery_id' => $gallery->id,
            'file_path' => 'protected/photo.jpg',
            'thumbnail_path' => 'protected/photo.jpg',
            'order_column' => 0,
        ]);
        Storage::disk('public')->put('protected/photo.jpg', 'protected-image');

        $this->withServerVariables(['HTTP_HOST' => 'api.vanda-studio.org'])
            ->get('/media/protected/photo.jpg')
            ->assertForbidden();

        $signedUrl = URL::temporarySignedRoute(
            'media.show',
            now()->addMinutes(5),
            ['path' => 'protected/photo.jpg']
        );

        $this->get($signedUrl)
            ->assertOk()
            ->assertStreamedContent('protected-image');
    }

    public function test_public_builder_media_remains_accessible_without_a_signature(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('builder-media/1/hero/public.jpg', 'public-image');

        $this->withServerVariables(['HTTP_HOST' => 'api.vanda-studio.org'])
            ->get('/media/builder-media/1/hero/public.jpg')
            ->assertOk()
            ->assertStreamedContent('public-image');
    }

    public function test_liking_a_pin_protected_gallery_requires_the_pin(): void
    {
        $owner = User::factory()->create();
        $gallery = Gallery::factory()->create([
            'user_id' => $owner->id,
            'pin_code' => '2468',
        ]);
        $photo = Photo::create([
            'gallery_id' => $gallery->id,
            'file_path' => 'protected/like.jpg',
            'thumbnail_path' => 'protected/like.jpg',
            'order_column' => 0,
        ]);

        $this->postJson("/api/client/gallery/{$gallery->uuid}/like", [
            'photo_id' => $photo->id,
        ])->assertForbidden();

        $this->withHeader('X-Gallery-PIN', '2468')
            ->postJson("/api/client/gallery/{$gallery->uuid}/like", [
                'photo_id' => $photo->id,
            ])->assertOk()
            ->assertJson(['status' => 'liked']);
    }
}
