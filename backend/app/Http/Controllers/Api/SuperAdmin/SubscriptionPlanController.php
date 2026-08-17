<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;

class SubscriptionPlanController extends Controller
{
    public function index()
    {
        $plans = SubscriptionPlan::all();
        return response()->json($plans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'maketou_product_id' => 'nullable|string|max:255',
        ]);

        $plan = SubscriptionPlan::create($validated);

        return response()->json($plan, 201);
    }

    public function show($id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        return response()->json($plan);
    }

    public function update(Request $request, $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'maketou_product_id' => 'nullable|string|max:255',
        ]);

        $plan->update($validated);

        return response()->json($plan);
    }

    public function destroy($id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        $plan->delete();

        return response()->json(null, 204);
    }
}
