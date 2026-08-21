<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class SubscriptionPolicyConfigTest extends TestCase
{
    public function test_policy_matches_the_public_frontend_plan_matrix(): void
    {
        $policy = require dirname(__DIR__, 2).'/config/subscriptions.php';

        $this->assertSame(30, $policy['trial_days']);

        $this->assertSame(20, $policy['plans']['starter']['portfolio_photos_limit']);
        $this->assertSame(4, $policy['plans']['starter']['active_galleries_monthly_limit']);
        $this->assertFalse($policy['plans']['starter']['custom_domain']);
        $this->assertFalse($policy['plans']['starter']['online_payments']);

        $this->assertSame(500, $policy['plans']['pro']['portfolio_photos_limit']);
        $this->assertSame(20, $policy['plans']['pro']['active_galleries_monthly_limit']);
        $this->assertTrue($policy['plans']['pro']['custom_domain']);
        $this->assertTrue($policy['plans']['pro']['online_payments']);
        $this->assertFalse($policy['plans']['pro']['api_webhooks']);

        $this->assertNull($policy['plans']['studio']['portfolio_photos_limit']);
        $this->assertNull($policy['plans']['studio']['active_galleries_monthly_limit']);
        $this->assertTrue($policy['plans']['studio']['api_webhooks']);
        $this->assertTrue($policy['plans']['studio']['advanced_analytics']);
    }
}
