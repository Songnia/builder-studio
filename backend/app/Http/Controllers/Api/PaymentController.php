<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Services\MaketouService;
use App\Support\MaketouPulsePayload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected MaketouService $maketouService;

    public function __construct(MaketouService $maketouService)
    {
        $this->maketouService = $maketouService;
    }

    /**
     * Initiate a checkout session
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'redirect_url' => 'required|url',
            'billing_cycle' => 'sometimes|in:monthly,yearly',
        ]);

        $user = $request->user();
        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        $planKey = strtolower(trim($plan->name));
        $billingCycle = $request->input('billing_cycle', 'monthly');
        $productId = $billingCycle === 'yearly'
            ? $plan->maketou_yearly_product_id
            : $plan->maketou_product_id;

        if (! $plan->is_active || ! $productId || ! config("subscriptions.plans.{$planKey}")) {
            return response()->json([
                'message' => 'Ce plan n\'est pas disponible pour le moment.',
            ], 400);
        }

        // Split name into first and last name for Maketou
        $nameParts = explode(' ', $user->name, 2);
        $firstName = $nameParts[0];
        $lastName = $nameParts[1] ?? '';

        try {
            // Fix localhost URL validation issue with Maketou API
            $redirectUrl = $request->redirect_url;
            if (str_contains($redirectUrl, 'localhost')) {
                $redirectUrl = str_replace('localhost', '127.0.0.1', $redirectUrl);
            }

            $payload = [
                'productDocumentId' => $productId,
                'email' => $user->email,
                'firstName' => $firstName,
                'lastName' => $lastName,
                'redirectURL' => $redirectUrl,
                'meta' => [
                    'userId' => (string) $user->id,
                    'planId' => (string) $plan->id,
                    'billingCycle' => $billingCycle,
                ],
            ];

            // Only add phone if we have one, to avoid validation errors
            if (! empty($user->phone)) {
                $payload['phone'] = $user->phone;
            }

            $response = $this->maketouService->createCart($payload);

            if (isset($response['cart']['id']) && isset($response['redirectUrl'])) {

                // Create a pending subscription record
                $subscription = UserSubscription::create([
                    'user_id' => $user->id,
                    'subscription_plan_id' => $plan->id,
                    'billing_cycle' => $billingCycle,
                    'status' => 'canceled', // Will be active upon payment success
                    'payment_status' => 'waiting_payment',
                    'maketou_cart_id' => $response['cart']['id'],
                    'starts_at' => now(),
                    // ends_at will be calculated based on plan duration when active
                ]);

                return response()->json([
                    'message' => 'Session de paiement créée',
                    'redirectUrl' => $response['redirectUrl'],
                    'cartId' => $response['cart']['id'],
                ], 201);
            }

            return response()->json(['message' => 'Réponse invalide de Maketou'], 500);

        } catch (\Exception $e) {
            Log::error('Maketou Checkout Error: '.$e->getMessage());

            return response()->json(['message' => 'Erreur lors de l\'initialisation du paiement', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Webhook to receive events from Maketou (Pulse)
     */
    public function webhook(Request $request)
    {
        $payload = $request->all();
        Log::info('Maketou webhook received', MaketouPulsePayload::safeLogContext($payload));

        $cartId = MaketouPulsePayload::cartId($payload);
        $subscription = null;

        if (! $cartId && MaketouPulsePayload::isSyntheticTest($payload)) {
            return response()->json([
                'message' => 'Maketou Pulse test payload accepted',
            ], 202);
        }

        if (! $cartId && MaketouPulsePayload::isSuccessfulSale($payload)) {
            $correlation = MaketouPulsePayload::subscriptionCorrelation($payload);

            if ($correlation) {
                $subscription = UserSubscription::where('user_id', $correlation['user_id'])
                    ->where('subscription_plan_id', $correlation['plan_id'])
                    ->where('payment_status', 'waiting_payment')
                    ->whereNotNull('maketou_cart_id')
                    ->when($correlation['billing_cycle'], fn ($query, $cycle) => $query->where('billing_cycle', $cycle))
                    ->latest()
                    ->first();

                $cartId = $subscription?->maketou_cart_id;
            }
        }

        if (! $cartId) {
            Log::warning('Maketou webhook could not be correlated to a cart', MaketouPulsePayload::safeLogContext($payload));

            return response()->json(['message' => 'Cart reference missing in payload'], 422);
        }

        try {
            // Always verify the cart status with Maketou to prevent spoofing
            $maketouCart = $this->maketouService->getCart($cartId);

            if (! isset($maketouCart['id'])) {
                return response()->json(['message' => 'Cart not found on Maketou'], 404);
            }

            if (! hash_equals((string) $cartId, (string) $maketouCart['id'])) {
                return response()->json(['message' => 'Cart verification mismatch'], 409);
            }

            $this->processCartStatus($maketouCart, $subscription);

            return response()->json(['message' => 'Webhook processed successfully']);

        } catch (\Exception $e) {
            Log::error('Maketou Webhook Error: '.$e->getMessage());

            return response()->json(['message' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Verify payment manually (can be called by frontend callback page)
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|string',
        ]);

        $subscription = UserSubscription::where('user_id', $request->user()->id)
            ->where('maketou_cart_id', $request->cart_id)
            ->firstOrFail();

        try {
            $maketouCart = $this->maketouService->getCart($request->cart_id);

            if (! isset($maketouCart['id'])) {
                return response()->json(['message' => 'Cart not found'], 404);
            }

            if (! hash_equals((string) $subscription->maketou_cart_id, (string) $maketouCart['id'])) {
                return response()->json(['message' => 'Cart verification mismatch'], 409);
            }

            $subscription = $this->processCartStatus($maketouCart, $subscription);

            return response()->json([
                'message' => 'Status vérifié',
                'payment_status' => $maketouCart['status'] ?? 'unknown',
                'subscription_status' => $subscription ? $subscription->status : null,
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur de vérification', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Internal method to process cart status and update database
     */
    private function processCartStatus(array $maketouCart, ?UserSubscription $subscription = null)
    {
        $cartId = $maketouCart['id'];
        $status = $maketouCart['status']; // e.g. 'completed', 'waiting_payment', 'payment_failed'

        $subscription ??= UserSubscription::where('maketou_cart_id', $cartId)->first();

        // Fallback: If subscription is not found by cart_id, try using meta if present
        if (! $subscription && isset($maketouCart['meta']['userId']) && isset($maketouCart['meta']['planId'])) {
            // Find latest pending subscription for this user and plan
            $subscription = UserSubscription::where('user_id', $maketouCart['meta']['userId'])
                ->where('subscription_plan_id', $maketouCart['meta']['planId'])
                ->where('payment_status', 'waiting_payment')
                ->latest()
                ->first();

            if ($subscription) {
                $subscription->maketou_cart_id = $cartId;
            }
        }

        if ($subscription) {
            $subscription->payment_status = $status;

            if ($status === 'completed') {
                $subscription->status = 'active';
                // Calculate ends_at based on plan logic, assuming 1 month for now
                if (! $subscription->ends_at) {
                    $subscription->ends_at = $subscription->billing_cycle === 'yearly'
                        ? now()->addYear()
                        : now()->addMonth();
                }

                // AHA MOMENT: Automatically publish the user's site upon payment success
                $siteConfig = SiteConfig::where('user_id', $subscription->user_id)->first();
                if ($siteConfig) {
                    $siteConfig->is_published = true;
                    $siteConfig->save();
                }
            } elseif (in_array($status, ['payment_failed', 'abandoned'])) {
                $subscription->status = 'canceled';
            }

            $subscription->save();
        }

        return $subscription;
    }
}
