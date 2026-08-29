<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Services\OnboardingLifecycleService;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if (isset($user->is_active) && !$user->is_active) {
                Auth::logout();
                return response()->json(['message' => 'Votre compte est désactivé. Veuillez contacter le support.'], 403);
            }
            $token = $user->createToken('admin-token')->plainTextToken;
            
            // Check if user has at least one site config
            $hasSite = $user->siteConfigs()->exists();
            
            return response()->json([
                'token' => $token, 
                'user' => $user,
                'has_site' => $hasSite
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function register(Request $request, OnboardingLifecycleService $onboarding)
    {
        if (! SystemSetting::valueFor('allow_registrations', true)) {
            return response()->json(['message' => 'Les inscriptions sont temporairement fermées.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;
        $onboarding->recordAndTrigger($user, 'account_created');

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function logout(Request $request)
    {
        $currentToken = $request->user()->currentAccessToken();

        if ($currentToken && method_exists($currentToken, 'delete')) {
            $currentToken->delete();
        } else {
            Auth::guard('web')->logout();
            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
        }

        Auth::guard('sanctum')->forgetUser();

        return response()->noContent();
    }
}
