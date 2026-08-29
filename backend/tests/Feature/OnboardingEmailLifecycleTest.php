<?php

namespace Tests\Feature;

use App\Jobs\SendOnboardingEmail;
use App\Mail\OnboardingMail;
use App\Models\Gallery;
use App\Models\OnboardingEmailDelivery;
use App\Models\User;
use App\Services\OnboardingLifecycleService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class OnboardingEmailLifecycleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config()->set('onboarding.emails_enabled', true);
        config()->set('onboarding.rollout_percentage', 100);
        config()->set('onboarding.frontend_url', 'https://app.vanda-studio.org');
    }

    public function test_schedule_is_idempotent(): void
    {
        Queue::fake();
        $user = User::factory()->create(['is_active' => true, 'role' => 'admin']);
        $service = app(OnboardingLifecycleService::class);

        $this->assertTrue($service->schedule($user, 'welcome-first-value'));
        $this->assertFalse($service->schedule($user, 'welcome-first-value'));

        $this->assertDatabaseCount('onboarding_email_deliveries', 1);
        Queue::assertPushed(SendOnboardingEmail::class, 1);
    }

    public function test_gallery_rescue_is_suppressed_after_gallery_creation(): void
    {
        $user = User::factory()->create(['is_active' => true, 'role' => 'admin']);
        $delivery = OnboardingEmailDelivery::create([
            'user_id' => $user->id,
            'template_key' => 'gallery-rescue',
            'lifecycle_version' => 1,
            'subject_key' => 'global',
            'status' => 'pending',
            'scheduled_for' => now(),
        ]);
        Gallery::create([
            'user_id' => $user->id,
            'uuid' => fake()->uuid(),
            'title' => 'Galerie test',
            'status' => 'draft',
        ]);

        $this->assertFalse(app(OnboardingLifecycleService::class)->isEligible($delivery->load('user')));
    }

    public function test_job_sends_an_eligible_email_once(): void
    {
        Mail::fake();
        $user = User::factory()->create(['is_active' => true, 'role' => 'admin']);
        $delivery = OnboardingEmailDelivery::create([
            'user_id' => $user->id,
            'template_key' => 'welcome-first-value',
            'lifecycle_version' => 1,
            'subject_key' => 'global',
            'status' => 'pending',
            'scheduled_for' => now(),
        ]);

        $job = new SendOnboardingEmail($delivery->id);
        $job->handle(app(OnboardingLifecycleService::class));
        $job->handle(app(OnboardingLifecycleService::class));

        Mail::assertSent(OnboardingMail::class, 1);
        $this->assertSame('sent', $delivery->fresh()->status);
    }

    public function test_inactive_user_is_suppressed(): void
    {
        $user = User::factory()->create(['is_active' => false, 'role' => 'admin']);
        $delivery = OnboardingEmailDelivery::create([
            'user_id' => $user->id,
            'template_key' => 'welcome-first-value',
            'lifecycle_version' => 1,
            'subject_key' => 'global',
            'status' => 'pending',
            'scheduled_for' => now(),
        ]);

        $this->assertFalse(app(OnboardingLifecycleService::class)->isEligible($delivery->load('user')));
    }
}
