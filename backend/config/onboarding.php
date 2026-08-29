<?php

return [
    'emails_enabled' => (bool) env('ONBOARDING_EMAILS_ENABLED', false),
    'lifecycle_version' => 1,
    'rollout_percentage' => min(100, max(0, (int) env('ONBOARDING_EMAILS_ROLLOUT_PERCENTAGE', 100))),
    'frontend_url' => rtrim((string) env('FRONTEND_URL', 'http://localhost:5173'), '/'),
    'frequency_cap_hours' => 24,
];
