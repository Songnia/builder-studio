<?php

namespace App\Jobs;

use App\Mail\OnboardingMail;
use App\Models\OnboardingEmailDelivery;
use App\Services\OnboardingLifecycleService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendOnboardingEmail implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public readonly int $deliveryId) {}

    public function handle(OnboardingLifecycleService $lifecycle): void
    {
        $delivery = OnboardingEmailDelivery::with('user')->find($this->deliveryId);

        if (! $delivery || $delivery->status !== 'pending') {
            return;
        }

        if (! $lifecycle->isEligible($delivery)) {
            $delivery->update(['status' => 'suppressed']);
            return;
        }

        Mail::to($delivery->user->email)->send(new OnboardingMail($lifecycle->messageFor($delivery)));
        $delivery->update(['status' => 'sent', 'sent_at' => now(), 'failure_reason' => null]);
        $lifecycle->record($delivery->user, 'onboarding_email_sent', $delivery, ['template_key' => $delivery->template_key]);
    }

    public function failed(Throwable $exception): void
    {
        OnboardingEmailDelivery::whereKey($this->deliveryId)->where('status', 'pending')->update([
            'status' => 'failed',
            'failure_reason' => mb_substr($exception->getMessage(), 0, 2000),
        ]);
    }
}
