<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubscriptionPlanController extends Controller
{
    public function index()
    {
        $plans = SubscriptionPlan::all();

        return response()->json($plans);
    }

    public function store(Request $request)
    {
        if ($request->filled('name')) {
            $request->merge(['name' => strtoupper(trim($request->string('name')->toString()))]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', Rule::in(['STARTER', 'PRO', 'STUDIO']), 'unique:subscription_plans,name'],
            'price' => 'required|numeric|min:0',
            'yearly_price' => 'required|numeric|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'maketou_product_id' => 'nullable|string|max:255',
            'maketou_yearly_product_id' => 'nullable|string|max:255',
        ]);
        $validated['name'] = strtoupper($validated['name']);

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

        if ($request->filled('name')) {
            $request->merge(['name' => strtoupper(trim($request->string('name')->toString()))]);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', Rule::in(['STARTER', 'PRO', 'STUDIO']), Rule::unique('subscription_plans', 'name')->ignore($plan->id)],
            'price' => 'sometimes|numeric|min:0',
            'yearly_price' => 'sometimes|numeric|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'maketou_product_id' => 'nullable|string|max:255',
            'maketou_yearly_product_id' => 'nullable|string|max:255',
        ]);

        if (isset($validated['name'])) {
            $validated['name'] = strtoupper($validated['name']);
        }

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
