<?php

namespace App\Support;

final class MaketouPulsePayload
{
    public static function cartId(array $payload): ?string
    {
        $candidates = [
            $payload['cart']['id'] ?? null,
            $payload['cartId'] ?? null,
            $payload['meta']['cartId'] ?? null,
            $payload['id'] ?? null,
        ];

        foreach ($candidates as $candidate) {
            if (is_string($candidate) && trim($candidate) !== '') {
                return trim($candidate);
            }
        }

        return null;
    }

    public static function subscriptionCorrelation(array $payload): ?array
    {
        $userId = $payload['meta']['userId'] ?? null;
        $planId = $payload['meta']['planId'] ?? null;

        if (! self::isPositiveInteger($userId) || ! self::isPositiveInteger($planId)) {
            return null;
        }

        return [
            'user_id' => (int) $userId,
            'plan_id' => (int) $planId,
            'billing_cycle' => in_array($payload['meta']['billingCycle'] ?? null, ['monthly', 'yearly'], true)
                ? $payload['meta']['billingCycle']
                : null,
        ];
    }

    public static function isSuccessfulSale(array $payload): bool
    {
        return strtoupper((string) ($payload['eventType'] ?? '')) === 'SUCCESSFUL_SALE';
    }

    public static function isSyntheticTest(array $payload): bool
    {
        return self::isSuccessfulSale($payload)
            && ($payload['sale']['id'] ?? null) === 'sale_123'
            && ($payload['meta']['orderId'] ?? null) === 'ext_order_abc123';
    }

    public static function safeLogContext(array $payload): array
    {
        $productIds = [];

        foreach (($payload['products'] ?? []) as $product) {
            if (is_array($product) && is_string($product['id'] ?? null)) {
                $productIds[] = $product['id'];
            }
        }

        return [
            'event_type' => is_string($payload['eventType'] ?? null) ? $payload['eventType'] : null,
            'sale_id' => is_string($payload['sale']['id'] ?? null) ? $payload['sale']['id'] : null,
            'product_ids' => $productIds,
            'has_cart_id' => self::cartId($payload) !== null,
            'has_subscription_correlation' => self::subscriptionCorrelation($payload) !== null,
        ];
    }

    private static function isPositiveInteger(mixed $value): bool
    {
        return (is_int($value) && $value > 0)
            || (is_string($value) && ctype_digit($value) && (int) $value > 0);
    }
}
