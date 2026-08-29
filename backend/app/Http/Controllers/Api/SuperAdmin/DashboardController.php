<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\SystemSetting;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use App\Services\SuperAdminAuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class DashboardController extends Controller
{
    public function __construct(private readonly SuperAdminAuditService $audit)
    {
    }

    public function stats(Request $request)
    {
        $totalPhotographers = User::where('role', 'user')->count();
        $totalGalleries = Gallery::count();
        $activeSubscriptions = UserSubscription::currentlyActive()->with('plan')->get();
        $totalActiveSubscriptions = $activeSubscriptions->count();
        $monthlyRevenue = $activeSubscriptions->sum(fn ($subscription) => $this->monthlyValue($subscription));

        $periodStart = Carbon::now()->subDays(30);
        $subscriptionsAtStart = UserSubscription::query()->with('plan')->where('starts_at', '<=', $periodStart)
            ->where(fn ($query) => $query->whereNull('ends_at')->orWhere('ends_at', '>', $periodStart))
            ->get();
        $canceledLast30 = UserSubscription::query()->with('plan')->where('status', 'canceled')
            ->whereBetween('updated_at', [$periodStart, Carbon::now()])->get();
        $activeCustomersAtStart = $subscriptionsAtStart->unique('user_id')->count();
        $canceledCustomers = $canceledLast30->unique('user_id')->count();
        $customerChurn = $activeCustomersAtStart > 0 ? round($canceledCustomers / $activeCustomersAtStart, 4) : null;
        $mrr = round($monthlyRevenue, 2);
        $arpu = $totalActiveSubscriptions > 0 ? round($mrr / $totalActiveSubscriptions, 2) : null;
        $ltv = ($arpu !== null && $customerChurn !== null && $customerChurn > 0) ? round($arpu / $customerChurn, 2) : null;
        $mrrAtStart = $subscriptionsAtStart->sum(fn ($subscription) => $this->monthlyValue($subscription));
        $lostMrr = $canceledLast30->sum(fn ($subscription) => $this->monthlyValue($subscription));
        $revenueChurn = $mrrAtStart > 0 ? round($lostMrr / $mrrAtStart, 4) : null;
        $newPayingCustomers = UserSubscription::query()->where('payment_status', 'completed')
            ->whereBetween('created_at', [$periodStart, Carbon::now()])->distinct('user_id')->count('user_id');
        $marketingSpend = (float) SystemSetting::valueFor('monthly_marketing_spend', 0);
        $cac = ($marketingSpend > 0 && $newPayingCustomers > 0) ? round($marketingSpend / $newPayingCustomers, 2) : null;
        $ltvCacRatio = ($ltv !== null && $cac !== null && $cac > 0) ? round($ltv / $cac, 2) : null;
        $metricsStatus = $ltvCacRatio === null ? 'insufficient_data' : ($ltvCacRatio > 3 ? 'healthy' : ($ltvCacRatio >= 2.5 ? 'watch' : 'critical'));

        $growthData = collect(range(6, 0))->map(function ($daysAgo) {
            $day = Carbon::now()->subDays($daysAgo);
            $dailySubscriptions = UserSubscription::query()->with('plan')->whereDate('created_at', $day)->get();
            return [
                'name' => $day->format('d/m'),
                'photographes' => User::where('role', 'user')->whereDate('created_at', $day)->count(),
                'ca' => round($dailySubscriptions->sum(fn ($subscription) => $this->monthlyValue($subscription)), 2),
            ];
        })->values()->all();

        return response()->json([
            'metrics' => [
                'total_photographers' => $totalPhotographers,
                'total_galleries' => $totalGalleries,
                'active_subscriptions' => $totalActiveSubscriptions,
                'monthly_revenue' => $monthlyRevenue,
                'mrr' => $mrr,
                'customer_churn' => $customerChurn,
                'revenue_churn' => $revenueChurn,
                'arpu' => $arpu,
                'cac' => $cac,
                'ltv' => $ltv,
                'ltv_cac_ratio' => $ltvCacRatio,
                'marketing_spend' => $marketingSpend,
                'new_paying_customers' => $newPayingCustomers,
                'golden_rule_target' => 3,
                'metrics_status' => $metricsStatus,
            ],
            'growth_data' => $growthData,
        ]);
    }

    public function transactions(Request $request)
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', Rule::in(['all', 'active', 'canceled', 'past_due'])],
            'payment_status' => ['nullable', 'string', 'max:50'],
            'plan_id' => ['nullable', 'integer', 'exists:subscription_plans,id'],
            'billing_cycle' => ['nullable', Rule::in(['all', 'monthly', 'yearly'])],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:100'],
            'export' => ['nullable', Rule::in(['csv'])],
        ]);

        $query = UserSubscription::query()->with(['user:id,name,email', 'plan:id,name,price,yearly_price']);
        if (! empty($validated['q'])) {
            $search = trim($validated['q']);
            $query->where(function ($query) use ($search) {
                $query->where('maketou_cart_id', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($user) => $user->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
            });
        }
        if (($validated['status'] ?? 'all') !== 'all') {
            $query->where('status', $validated['status']);
        }
        if (! empty($validated['payment_status'])) {
            $query->where('payment_status', $validated['payment_status']);
        }
        if (! empty($validated['plan_id'])) {
            $query->where('subscription_plan_id', $validated['plan_id']);
        }
        if (($validated['billing_cycle'] ?? 'all') !== 'all') {
            $query->where('billing_cycle', $validated['billing_cycle']);
        }
        if (! empty($validated['from'])) {
            $query->whereDate('created_at', '>=', $validated['from']);
        }
        if (! empty($validated['to'])) {
            $query->whereDate('created_at', '<=', $validated['to']);
        }

        if (($validated['export'] ?? null) === 'csv') {
            $this->audit->record($request, 'transactions.exported', null, null, ['filters' => collect($validated)->except(['export'])->all()]);
            $exportQuery = clone $query;
            return response()->streamDownload(function () use ($exportQuery) {
                $output = fopen('php://output', 'w');
                fputcsv($output, ['ID', 'Date', 'Client', 'Email', 'Forfait', 'Cycle', 'Valeur mensuelle', 'Paiement', 'Abonnement', 'Référence']);
                $exportQuery->orderBy('id')->chunkById(500, function ($subscriptions) use ($output) {
                    foreach ($subscriptions as $subscription) {
                        fputcsv($output, [$subscription->id, $subscription->created_at, $subscription->user?->name, $subscription->user?->email, $subscription->plan?->name, $subscription->billing_cycle, $this->monthlyValue($subscription), $subscription->payment_status, $subscription->status, $subscription->maketou_cart_id]);
                    }
                });
                fclose($output);
            }, 'transactions-vanda-'.now()->format('Y-m-d-His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
        }

        $summaryRows = (clone $query)->get();
        $summary = [
            'total' => $summaryRows->count(),
            'active' => $summaryRows->where('status', 'active')->count(),
            'completed' => $summaryRows->where('payment_status', 'completed')->count(),
            'failed' => $summaryRows->whereIn('payment_status', ['payment_failed', 'abandoned'])->count(),
            'mrr' => round($summaryRows->where('status', 'active')->sum(fn ($subscription) => $this->monthlyValue($subscription)), 2),
        ];
        $paginator = $query->latest('created_at')->paginate($validated['per_page'] ?? 30)->withQueryString();
        $paginator->setCollection($paginator->getCollection()->map(fn ($subscription) => [
            'id' => $subscription->id,
            'user_id' => $subscription->user_id,
            'user' => $subscription->user,
            'plan' => $subscription->plan,
            'billing_cycle' => $subscription->billing_cycle,
            'monthly_value' => $this->monthlyValue($subscription),
            'status' => $subscription->status,
            'payment_status' => $subscription->payment_status,
            'maketou_cart_id' => $subscription->maketou_cart_id,
            'starts_at' => $subscription->starts_at,
            'ends_at' => $subscription->ends_at,
            'created_at' => $subscription->created_at,
        ]));

        return response()->json([
            'data' => $paginator->items(),
            'meta' => ['current_page' => $paginator->currentPage(), 'last_page' => $paginator->lastPage(), 'total' => $paginator->total(), 'from' => $paginator->firstItem(), 'to' => $paginator->lastItem()],
            'summary' => $summary,
            'plans' => SubscriptionPlan::query()->orderBy('price')->get(['id', 'name']),
            'payment_statuses' => UserSubscription::query()->whereNotNull('payment_status')->distinct()->orderBy('payment_status')->pluck('payment_status'),
        ]);
    }

    private function monthlyValue(UserSubscription $subscription): float
    {
        if (! $subscription->plan) {
            return 0;
        }
        return $subscription->billing_cycle === 'yearly'
            ? round(((float) ($subscription->plan->yearly_price ?? 0)) / 12, 2)
            : (float) $subscription->plan->price;
    }
}
