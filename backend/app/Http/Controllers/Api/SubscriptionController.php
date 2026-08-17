<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Get all active subscription plans for users
     */
    public function getActivePlans()
    {
        $plans = SubscriptionPlan::where('is_active', true)
                                 ->orderBy('price', 'asc')
                                 ->get();
                                 
        return response()->json($plans);
    }
}
