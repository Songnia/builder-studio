<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PhotographerController extends Controller
{
    public function index()
    {
        $photographers = User::whereIn('role', ['user', 'admin', 'superadmin'])
            ->with(['subscriptions' => function($query) {
                $query->where('status', 'active')->with('plan');
            }, 'siteConfigs'])
            ->get()
            ->map(function($user) {
                $activeSub = $user->subscriptions->first();
                $firstSite = $user->siteConfigs->first();
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at,
                    'active_plan' => $activeSub ? $activeSub->plan->name : null,
                    'role' => $user->role,
                    'phone' => $user->phone ?? null,
                    'is_published' => $firstSite ? $firstSite->is_published : false,
                    'site_config_id' => $firstSite ? $firstSite->id : null,
                ];
            });

        return response()->json($photographers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,superadmin,user',
            'phone' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
            'is_active' => true,
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|required|string|in:admin,superadmin,user',
            'phone' => 'nullable|string|max:255',
        ]);

        $dataToUpdate = [
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'role' => $validated['role'] ?? $user->role,
            'phone' => array_key_exists('phone', $validated) ? $validated['phone'] : $user->phone,
        ];

        if (!empty($validated['password'])) {
            $dataToUpdate['password'] = bcrypt($validated['password']);
        }

        $user->update($dataToUpdate);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete yourself'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function toggleActive($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'superadmin') {
            return response()->json(['message' => 'Cannot toggle superadmin status'], 403);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'message' => 'User status updated',
            'is_active' => $user->is_active
        ]);
    }

    public function togglePublish($id)
    {
        $user = User::findOrFail($id);
        $site = $user->siteConfigs()->first();

        if (!$site) {
            return response()->json(['message' => 'Cet utilisateur n\'a pas de site configuré'], 404);
        }

        $newValue = $site->is_published ? false : true;
        $site->update(['is_published' => $newValue]);

        return response()->json([
            'message' => 'Site publish status updated',
            'is_published' => $newValue
        ]);
    }
}
