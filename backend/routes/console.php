<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('onboarding:evaluate', function (\App\Services\OnboardingLifecycleService $lifecycle) {
    $this->info($lifecycle->evaluateDueUsers().' e-mail(s) d’onboarding planifié(s).');
})->purpose('Evaluate behavior-driven onboarding email eligibility');

Schedule::command('onboarding:evaluate')->hourly()->withoutOverlapping();
