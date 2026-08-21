<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $totalPhotographers = User::where('role', 'user')->count();
        $totalGalleries = Gallery::count();

        $activeSubscriptions = UserSubscription::currentlyActive()->with('plan')->get();
        $totalActiveSubscriptions = $activeSubscriptions->count();
        $monthlyRevenue = $activeSubscriptions->sum(function ($sub) {
            if (! $sub->plan) {
                return 0;
            }

            return $sub->billing_cycle === 'yearly'
                ? ((float) $sub->plan->yearly_price / 12)
                : (float) $sub->plan->price;
        });

        // Mock data for the chart, representing growth over the last 7 days
        $growthData = [
            ['name' => 'Lun', 'photographes' => 12, 'ca' => 120],
            ['name' => 'Mar', 'photographes' => 19, 'ca' => 190],
            ['name' => 'Mer', 'photographes' => 15, 'ca' => 150],
            ['name' => 'Jeu', 'photographes' => 22, 'ca' => 220],
            ['name' => 'Ven', 'photographes' => 30, 'ca' => 300],
            ['name' => 'Sam', 'photographes' => 35, 'ca' => 350],
            ['name' => 'Dim', 'photographes' => 42, 'ca' => 420],
        ];

        return response()->json([
            'metrics' => [
                'total_photographers' => $totalPhotographers,
                'total_galleries' => $totalGalleries,
                'active_subscriptions' => $totalActiveSubscriptions,
                'monthly_revenue' => $monthlyRevenue,
            ],
            'growth_data' => $growthData,
        ]);
    }

    public function transactions(Request $request)
    {
        $limit = $request->query('limit', 10);
        $transactions = UserSubscription::with(['user', 'plan'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($transactions);
    }
}
