<?php

namespace Tests\Feature;

use App\Models\SubscriptionPlan;
use App\Models\Gallery;
use App\Models\Invoice;
use App\Models\SiteConfig;
use App\Models\SystemSetting;
use App\Models\SuperAdminAuditLog;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Tests\TestCase;

class SuperAdminRemediationTest extends TestCase
{
    #[DataProvider('superAdminEndpoints')]
    public function test_anonymous_users_cannot_access_superadmin_endpoints(string $method, string $uri): void
    {
        $this->json($method, $uri)->assertUnauthorized();
    }

    #[DataProvider('superAdminEndpoints')]
    public function test_non_superadmins_cannot_access_superadmin_endpoints(string $method, string $uri): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->json($method, $uri)
            ->assertForbidden();
    }

    public function test_inactive_superadmin_is_blocked_before_privileged_actions(): void
    {
        $superadmin = User::factory()->create([
            'role' => 'superadmin',
            'is_active' => false,
        ]);

        $this->actingAs($superadmin)
            ->getJson('/api/superadmin/dashboard/stats')
            ->assertForbidden();
    }

    public function test_referenced_plan_cannot_be_deleted_and_subscription_history_is_preserved(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $subscriber = User::factory()->create();
        [$plan, $subscription] = $this->createReferencedPlan($subscriber);

        $this->actingAs($superadmin)
            ->deleteJson("/api/superadmin/plans/{$plan->id}")
            ->assertStatus(409)
            ->assertJsonPath('message', 'Ce forfait est associé à des abonnements et ne peut pas être supprimé. Désactivez-le à la place.');

        $this->assertDatabaseHas('subscription_plans', ['id' => $plan->id]);
        $this->assertDatabaseHas('user_subscriptions', ['id' => $subscription->id]);
    }

    public function test_database_restricts_direct_deletion_of_a_referenced_plan(): void
    {
        $subscriber = User::factory()->create();
        [$plan, $subscription] = $this->createReferencedPlan($subscriber);

        try {
            DB::table('subscription_plans')->where('id', $plan->id)->delete();
            $this->fail('The database accepted deletion of a referenced subscription plan.');
        } catch (QueryException) {
            // The foreign key is the final safeguard if application checks are bypassed.
        }

        $this->assertDatabaseHas('subscription_plans', ['id' => $plan->id]);
        $this->assertDatabaseHas('user_subscriptions', ['id' => $subscription->id]);
    }

    public function test_unreferenced_plan_can_still_be_deleted(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $plan = SubscriptionPlan::create([
            'name' => 'LEGACY-UNUSED',
            'price' => 0,
            'yearly_price' => 0,
            'features' => [],
            'is_active' => false,
        ]);

        $this->actingAs($superadmin)
            ->deleteJson("/api/superadmin/plans/{$plan->id}", ['reason' => 'Suppression du forfait inutilisé'])
            ->assertNoContent();

        $this->assertDatabaseMissing('subscription_plans', ['id' => $plan->id]);
    }

    public function test_superadmin_cannot_demote_their_own_account(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);

        $this->actingAs($superadmin)
            ->patchJson("/api/superadmin/users/{$superadmin->id}", ['role' => 'admin'])
            ->assertStatus(409)
            ->assertJsonPath('message', 'Vous ne pouvez pas retirer votre propre rôle Super Admin.');

        $this->assertDatabaseHas('users', [
            'id' => $superadmin->id,
            'role' => 'superadmin',
            'is_active' => true,
        ]);
    }

    public function test_superadmin_can_demote_another_superadmin_without_removing_the_last_active_one(): void
    {
        $actor = User::factory()->create(['role' => 'superadmin']);
        $target = User::factory()->create(['role' => 'superadmin']);

        $this->actingAs($actor)
            ->patchJson("/api/superadmin/users/{$target->id}", ['role' => 'admin'])
            ->assertOk();

        $this->assertDatabaseHas('users', ['id' => $actor->id, 'role' => 'superadmin', 'is_active' => true]);
        $this->assertDatabaseHas('users', ['id' => $target->id, 'role' => 'admin']);
    }

    public static function superAdminEndpoints(): array
    {
        return [
            'dashboard stats' => ['GET', '/api/superadmin/dashboard/stats'],
            'dashboard transactions' => ['GET', '/api/superadmin/dashboard/transactions'],
            'audit logs' => ['GET', '/api/superadmin/audit-logs'],
            'resources index' => ['GET', '/api/superadmin/resources?type=sites'],
            'resources site update' => ['PATCH', '/api/superadmin/resources/sites/999999'],
            'resources gallery update' => ['PATCH', '/api/superadmin/resources/galleries/999999'],
            'users index' => ['GET', '/api/superadmin/users'],
            'users store' => ['POST', '/api/superadmin/users'],
            'users update' => ['PATCH', '/api/superadmin/users/999999'],
            'users delete' => ['DELETE', '/api/superadmin/users/999999'],
            'users active toggle' => ['PATCH', '/api/superadmin/users/999999/toggle-active'],
            'users publish toggle' => ['PATCH', '/api/superadmin/users/999999/toggle-publish'],
            'users deletion impact' => ['GET', '/api/superadmin/users/999999/deletion-impact'],
            'users revoke tokens' => ['POST', '/api/superadmin/users/999999/revoke-tokens'],
            'users email verification' => ['PATCH', '/api/superadmin/users/999999/email-verification'],
            'users overview' => ['GET', '/api/superadmin/users/999999/overview'],
            'users subscription store' => ['POST', '/api/superadmin/users/999999/subscriptions'],
            'users subscription plan change' => ['POST', '/api/superadmin/users/999999/subscriptions/999999/change-plan'],
            'users subscription update' => ['PATCH', '/api/superadmin/users/999999/subscriptions/999999'],
            'plans index' => ['GET', '/api/superadmin/plans'],
            'plans store' => ['POST', '/api/superadmin/plans'],
            'plans show' => ['GET', '/api/superadmin/plans/999999'],
            'plans update' => ['PATCH', '/api/superadmin/plans/999999'],
            'plans delete' => ['DELETE', '/api/superadmin/plans/999999'],
            'settings index' => ['GET', '/api/superadmin/settings'],
            'settings update' => ['POST', '/api/superadmin/settings'],
        ];
    }

    /** @return array{SubscriptionPlan, UserSubscription} */
    private function createReferencedPlan(User $subscriber): array
    {
        $plan = SubscriptionPlan::create([
            'name' => 'LEGACY-REFERENCED',
            'price' => 1000,
            'yearly_price' => 10000,
            'features' => [],
            'is_active' => true,
        ]);

        $subscription = UserSubscription::create([
            'user_id' => $subscriber->id,
            'subscription_plan_id' => $plan->id,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'payment_status' => 'completed',
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addMonth(),
        ]);

        return [$plan, $subscription];
    }
    public function test_dashboard_exposes_real_saas_metrics_without_fake_cac(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $response = $this->actingAs($superadmin)->getJson('/api/superadmin/dashboard/stats')->assertOk();
        $response->assertJsonStructure(['metrics' => ['mrr', 'customer_churn', 'revenue_churn', 'cac', 'ltv', 'ltv_cac_ratio', 'metrics_status']]);
        $this->assertSame('insufficient_data', $response->json('metrics.metrics_status'));
        $this->assertNull($response->json('metrics.cac'));
    }
    public function test_user_registry_supports_server_side_search_filters_and_pagination(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        User::factory()->create(['name' => 'Client Chirurgical', 'role' => 'user', 'is_active' => false]);
        User::factory()->create(['name' => 'Autre Client', 'role' => 'user', 'is_active' => true]);

        $this->actingAs($superadmin)->getJson('/api/superadmin/users?q=Chirurgical&role=user&status=inactive&per_page=10')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Client Chirurgical')
            ->assertJsonPath('meta.total', 1)->assertJsonStructure(['summary' => ['total', 'active', 'inactive', 'subscribed', 'published']]);
    }

    public function test_deletion_impact_blocks_cascade_deletion_of_managed_data(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $target = User::factory()->create(['role' => 'user']);
        Gallery::factory()->create(['user_id' => $target->id]);

        $this->actingAs($superadmin)->getJson("/api/superadmin/users/{$target->id}/deletion-impact")
            ->assertOk()->assertJsonPath('impact.galleries', 1)->assertJsonPath('can_delete', false);
        $this->actingAs($superadmin)->deleteJson("/api/superadmin/users/{$target->id}", ['confirmation' => $target->email, 'reason' => 'Demande de nettoyage contrôlé'])->assertStatus(409);
        $this->assertDatabaseHas('users', ['id' => $target->id]);
    }

    public function test_superadmin_can_revoke_sessions_and_action_is_audited(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $target = User::factory()->create(['role' => 'user']);
        $target->createToken('mobile'); $target->createToken('desktop');

        $this->actingAs($superadmin)->postJson("/api/superadmin/users/{$target->id}/revoke-tokens", ['reason' => 'Suspicion de compromission'])
            ->assertOk()->assertJsonPath('revoked', 2);
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->assertDatabaseHas('superadmin_audit_logs', ['actor_id' => $superadmin->id, 'target_id' => $target->id, 'action' => 'user.sessions_revoked', 'reason' => 'Suspicion de compromission']);
    }

    public function test_profile_changes_persist_phone_and_are_audited(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $target = User::factory()->create(['role' => 'user']);
        $this->actingAs($superadmin)->patchJson("/api/superadmin/users/{$target->id}", ['phone' => '+237690000000', 'reason' => 'Correction demandée par le client'])->assertOk();
        $this->assertDatabaseHas('users', ['id' => $target->id, 'phone' => '+237690000000']);
        $this->assertDatabaseHas('superadmin_audit_logs', ['action' => 'user.updated', 'target_id' => $target->id]);
    }
    public function test_financial_registry_filters_paginates_and_exports_csv(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $customer = User::factory()->create(['role' => 'user', 'email' => 'finance@example.com']);
        $plan = SubscriptionPlan::query()->where('name', 'PRO')->firstOrFail();
        UserSubscription::create(['user_id' => $customer->id, 'subscription_plan_id' => $plan->id, 'billing_cycle' => 'monthly', 'status' => 'active', 'payment_status' => 'completed', 'starts_at' => now(), 'ends_at' => now()->addMonth()]);
        $this->actingAs($superadmin)->getJson("/api/superadmin/dashboard/transactions?q=finance@example.com&status=active&plan_id={$plan->id}")
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('meta.total', 1)->assertJsonPath('summary.completed', 1);
        $this->actingAs($superadmin)->get("/api/superadmin/dashboard/transactions?export=csv&plan_id={$plan->id}")
            ->assertOk()->assertHeader('content-type', 'text/csv; charset=UTF-8');
        $this->assertDatabaseHas('superadmin_audit_logs', ['action' => 'transactions.exported', 'actor_id' => $superadmin->id]);
    }

    public function test_settings_are_persisted_and_audited(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $this->actingAs($superadmin)->postJson('/api/superadmin/settings', ['site_name' => 'Vanda Control', 'allow_registrations' => false, 'reason' => 'Mise à jour de la politique plateforme'])
            ->assertOk()->assertJsonPath('site_name', 'Vanda Control')->assertJsonPath('allow_registrations', false);
        $this->assertDatabaseHas('system_settings', ['key' => 'site_name', 'updated_by' => $superadmin->id]);
        $this->assertDatabaseHas('superadmin_audit_logs', ['action' => 'settings.updated', 'actor_id' => $superadmin->id]);
    }

    public function test_plan_changes_require_a_reason_and_are_audited(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $plan = SubscriptionPlan::query()->where('name', 'PRO')->firstOrFail();
        $this->actingAs($superadmin)->patchJson("/api/superadmin/plans/{$plan->id}", ['price' => 12500, 'reason' => 'Ajustement tarifaire validé'])->assertOk()->assertJsonPath('price', '12500.00');
        $this->assertDatabaseHas('superadmin_audit_logs', ['action' => 'plan.updated', 'target_type' => 'subscription_plan', 'target_id' => $plan->id]);
    }

    public function test_resource_registry_searches_owners_and_exposes_financial_summary(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $owner = User::factory()->create(['role' => 'user', 'name' => 'Studio Décision', 'email' => 'decision@example.com']);
        $site = SiteConfig::create(['user_id' => $owner->id, 'site_name' => 'Portfolio Décision', 'config_data' => [], 'is_published' => true]);
        $gallery = Gallery::factory()->create(['user_id' => $owner->id, 'title' => 'Mariage Direction', 'status' => 'published']);
        $invoice = Invoice::create([
            'user_id' => $owner->id,
            'invoice_number' => 'INV-CONTROL-001',
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(15)->toDateString(),
            'client_name' => 'Client Pilotage',
            'client_email' => 'client.pilotage@example.com',
            'total_amount' => 150000,
            'amount_paid' => 50000,
            'status' => 'pending',
            'currency' => 'FCFA',
        ]);

        $this->actingAs($superadmin)->getJson('/api/superadmin/resources?type=sites&q=decision@example.com&status=published')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $site->id)->assertJsonPath('summary.published', 1);
        $this->actingAs($superadmin)->getJson('/api/superadmin/resources?type=galleries&q=Mariage%20Direction&status=published')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $gallery->id);
        $this->actingAs($superadmin)->getJson('/api/superadmin/resources?type=invoices&q=INV-CONTROL-001')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $invoice->id)
            ->assertJsonPath('summary.billed', 150000)->assertJsonPath('summary.paid', 50000)->assertJsonPath('summary.outstanding', 100000);
    }

    public function test_resource_status_changes_require_reason_and_are_audited(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $owner = User::factory()->create(['role' => 'user']);
        $site = SiteConfig::create(['user_id' => $owner->id, 'site_name' => 'Site à contrôler', 'config_data' => [], 'is_published' => false]);
        $gallery = Gallery::factory()->create(['user_id' => $owner->id, 'status' => 'draft']);

        $this->actingAs($superadmin)->patchJson("/api/superadmin/resources/sites/{$site->id}", ['is_published' => true])->assertUnprocessable();
        $this->actingAs($superadmin)->patchJson("/api/superadmin/resources/sites/{$site->id}", ['is_published' => true, 'reason' => 'Validation éditoriale terminée'])->assertOk();
        $this->actingAs($superadmin)->patchJson("/api/superadmin/resources/galleries/{$gallery->id}", ['status' => 'archived', 'reason' => 'Cycle client définitivement terminé'])->assertOk();

        $this->assertDatabaseHas('site_configs', ['id' => $site->id, 'is_published' => true]);
        $this->assertDatabaseHas('galleries', ['id' => $gallery->id, 'status' => 'archived']);
        $this->assertDatabaseHas('superadmin_audit_logs', ['actor_id' => $superadmin->id, 'action' => 'site.published', 'target_type' => 'site_config', 'target_id' => $site->id]);
        $this->assertDatabaseHas('superadmin_audit_logs', ['actor_id' => $superadmin->id, 'action' => 'gallery.status_updated', 'target_type' => 'gallery', 'target_id' => $gallery->id]);
    }

    public function test_registration_setting_closes_public_account_creation(): void
    {
        SystemSetting::create(['key' => 'allow_registrations', 'value' => false]);

        $this->postJson('/api/register', [
            'name' => 'Compte bloqué',
            'email' => 'blocked-registration@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ])->assertForbidden()->assertJsonPath('message', 'Les inscriptions sont temporairement fermées.');

        $this->assertDatabaseMissing('users', ['email' => 'blocked-registration@example.com']);
    }

    public function test_saas_metrics_calculate_mrr_churn_cac_ltv_and_golden_rule(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $plan = SubscriptionPlan::create(['name' => 'METRICS-CONTROL', 'price' => 10000, 'yearly_price' => 120000, 'features' => [], 'is_active' => true]);
        $oldActiveUser = User::factory()->create();
        $canceledUser = User::factory()->create();
        $newPayingUser = User::factory()->create();

        $oldActive = UserSubscription::create(['user_id' => $oldActiveUser->id, 'subscription_plan_id' => $plan->id, 'billing_cycle' => 'monthly', 'status' => 'active', 'payment_status' => 'completed', 'starts_at' => now()->subDays(60), 'ends_at' => now()->addMonth()]);
        $canceled = UserSubscription::create(['user_id' => $canceledUser->id, 'subscription_plan_id' => $plan->id, 'billing_cycle' => 'monthly', 'status' => 'canceled', 'payment_status' => 'completed', 'starts_at' => now()->subDays(60), 'ends_at' => now()->subDay()]);
        UserSubscription::create(['user_id' => $newPayingUser->id, 'subscription_plan_id' => $plan->id, 'billing_cycle' => 'monthly', 'status' => 'active', 'payment_status' => 'completed', 'starts_at' => now(), 'ends_at' => now()->addMonth()]);
        DB::table('user_subscriptions')->whereIn('id', [$oldActive->id, $canceled->id])->update(['created_at' => now()->subDays(60)]);
        SystemSetting::create(['key' => 'monthly_marketing_spend', 'value' => 3000]);

        $this->actingAs($superadmin)->getJson('/api/superadmin/dashboard/stats')->assertOk()
            ->assertJsonPath('metrics.mrr', 20000)
            ->assertJsonPath('metrics.customer_churn', 0.5)
            ->assertJsonPath('metrics.revenue_churn', 0.5)
            ->assertJsonPath('metrics.cac', 3000)
            ->assertJsonPath('metrics.ltv', 20000)
            ->assertJsonPath('metrics.ltv_cac_ratio', 6.67)
            ->assertJsonPath('metrics.metrics_status', 'healthy');
    }

    public function test_global_logo_removal_deletes_only_the_managed_asset_and_is_audited(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('global/old-logo.png', 'logo');
        SystemSetting::create(['key' => 'logo', 'value' => '/media/global/old-logo.png']);
        Cache::forget('superadmin_settings');
        $superadmin = User::factory()->create(['role' => 'superadmin']);

        $this->actingAs($superadmin)->postJson('/api/superadmin/settings', [
            'remove_logo' => true,
            'reason' => 'Remplacement complet de l’identité visuelle',
        ])->assertOk()->assertJsonPath('logo', null);

        Storage::disk('public')->assertMissing('global/old-logo.png');
        $this->assertDatabaseHas('system_settings', ['key' => 'logo', 'value' => null]);
        $this->assertDatabaseHas('superadmin_audit_logs', ['actor_id' => $superadmin->id, 'action' => 'settings.updated']);
    }

    #[DataProvider('adminSpaDeepLinks')]
    public function test_admin_spa_deep_links_serve_the_admin_entrypoint(string $uri): void
    {
        $response = $this->get($uri)->assertOk();

        $this->assertInstanceOf(BinaryFileResponse::class, $response->baseResponse);
        $this->assertSame(
            realpath(public_path('app/index.html')),
            realpath($response->baseResponse->getFile()->getPathname())
        );
    }

    public static function adminSpaDeepLinks(): array
    {
        return [
            'audit log' => ['/superadmin/audit-log'],
            'resources canonical' => ['/superadmin/resources'],
            'resources compatibility alias' => ['/resources'],
            'user 360 view' => ['/superadmin/users/41'],
        ];
    }

    public function test_manual_subscription_validation_returns_actionable_french_messages(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $customer = User::factory()->create(['role' => 'user']);
        $plan = SubscriptionPlan::create(['name' => 'VALIDATION-PLAN', 'price' => 5000, 'yearly_price' => 50000, 'features' => [], 'is_active' => true]);
        $today = now()->toDateString();

        $this->actingAs($superadmin)->postJson("/api/superadmin/users/{$customer->id}/subscriptions", [
            'subscription_plan_id' => $plan->id,
            'billing_cycle' => 'monthly',
            'starts_at' => $today,
            'ends_at' => $today,
            'reason' => 'test',
        ])->assertUnprocessable()
            ->assertJsonPath('errors.reason.0', 'Le motif doit contenir au moins 5 caractères.')
            ->assertJsonPath('errors.ends_at.0', 'La date de fin doit être postérieure à la date de début et à aujourd’hui.');

        $this->assertDatabaseCount('user_subscriptions', 0);
        $this->actingAs($superadmin)->postJson("/api/superadmin/users/{$customer->id}/subscriptions", [
            'subscription_plan_id' => $plan->id,
            'billing_cycle' => 'monthly',
            'starts_at' => $today,
            'ends_at' => now()->addDay()->toDateString(),
            'reason' => 'test1',
        ])->assertCreated()->assertJsonPath('subscription.status', 'active');
        $this->assertDatabaseHas('user_subscriptions', [
            'user_id' => $customer->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'active',
        ]);
    }

    public function test_superadmin_can_change_a_users_plan_while_preserving_history(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $customer = User::factory()->create(['role' => 'user']);
        $oldPlan = SubscriptionPlan::create(['name' => 'MANUAL-OLD', 'price' => 5000, 'yearly_price' => 50000, 'features' => [], 'is_active' => true]);
        $newPlan = SubscriptionPlan::create(['name' => 'MANUAL-NEW', 'price' => 12000, 'yearly_price' => 120000, 'features' => [], 'is_active' => true]);
        $originalEnd = now()->addMonth()->startOfSecond();
        $current = UserSubscription::create([
            'user_id' => $customer->id,
            'subscription_plan_id' => $oldPlan->id,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'payment_status' => 'completed',
            'starts_at' => now()->subMonth(),
            'ends_at' => $originalEnd,
        ]);

        $response = $this->actingAs($superadmin)->postJson("/api/superadmin/users/{$customer->id}/subscriptions/{$current->id}/change-plan", [
            'subscription_plan_id' => $newPlan->id,
            'billing_cycle' => 'yearly',
            'reason' => 'Migration commerciale validée avec le client',
        ])->assertOk()->assertJsonPath('subscription.subscription_plan_id', $newPlan->id)
            ->assertJsonPath('subscription.billing_cycle', 'yearly');

        $replacementId = $response->json('subscription.id');
        $this->assertDatabaseHas('user_subscriptions', ['id' => $current->id, 'status' => 'canceled']);
        $this->assertDatabaseHas('user_subscriptions', ['id' => $replacementId, 'user_id' => $customer->id, 'subscription_plan_id' => $newPlan->id, 'status' => 'active', 'payment_status' => 'manual']);
        $this->assertDatabaseCount('user_subscriptions', 2);
        $this->assertSame($originalEnd->toDateTimeString(), UserSubscription::findOrFail($replacementId)->ends_at->toDateTimeString());

        $log = SuperAdminAuditLog::query()->where('action', 'subscription.plan_changed')->where('target_id', $customer->id)->firstOrFail();
        $this->assertSame($oldPlan->id, $log->before_data['subscription_plan_id']);
        $this->assertSame($newPlan->id, $log->after_data['subscription_plan_id']);

        $this->actingAs($superadmin)->postJson("/api/superadmin/users/{$customer->id}/subscriptions/{$replacementId}/change-plan", [
            'subscription_plan_id' => $newPlan->id,
            'billing_cycle' => 'monthly',
            'reason' => 'Tentative vers le même forfait',
        ])->assertUnprocessable();
        $this->assertDatabaseCount('user_subscriptions', 2);
    }
}
