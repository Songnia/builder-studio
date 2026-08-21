<?php

namespace Tests\Unit;

use App\Support\MaketouPulsePayload;
use PHPUnit\Framework\TestCase;

class MaketouPulsePayloadTest extends TestCase
{
    public function test_it_recognizes_the_confirmed_synthetic_pulse_payload(): void
    {
        $payload = $this->syntheticPayload();

        $this->assertTrue(MaketouPulsePayload::isSuccessfulSale($payload));
        $this->assertTrue(MaketouPulsePayload::isSyntheticTest($payload));
        $this->assertNull(MaketouPulsePayload::cartId($payload));
    }

    public function test_it_extracts_cart_and_subscription_correlation_fields(): void
    {
        $payload = [
            'eventType' => 'SUCCESSFUL_SALE',
            'cart' => ['id' => 'cart-confirmed-123'],
            'meta' => ['userId' => '42', 'planId' => '7', 'billingCycle' => 'yearly'],
        ];

        $this->assertSame('cart-confirmed-123', MaketouPulsePayload::cartId($payload));
        $this->assertSame(
            ['user_id' => 42, 'plan_id' => 7, 'billing_cycle' => 'yearly'],
            MaketouPulsePayload::subscriptionCorrelation($payload)
        );
    }

    public function test_safe_log_context_excludes_customer_personal_data(): void
    {
        $context = MaketouPulsePayload::safeLogContext($this->syntheticPayload());

        $this->assertSame('SUCCESSFUL_SALE', $context['event_type']);
        $this->assertSame('sale_123', $context['sale_id']);
        $this->assertSame(['prod_123'], $context['product_ids']);
        $this->assertArrayNotHasKey('customer', $context);
        $this->assertStringNotContainsString('client@example.test', json_encode($context));
    }

    private function syntheticPayload(): array
    {
        return [
            'customer' => [
                'email' => 'client@example.test',
                'name' => 'Client Test',
                'phone' => '+237600000000',
            ],
            'sale' => [
                'id' => 'sale_123',
                'amount' => 25000,
                'currency' => 'XAF',
            ],
            'products' => [[
                'id' => 'prod_123',
                'name' => 'VANDA PRO',
            ]],
            'store' => ['id' => 'store_123'],
            'eventType' => 'SUCCESSFUL_SALE',
            'meta' => [
                'orderId' => 'ext_order_abc123',
                'source' => 'test',
            ],
        ];
    }
}
