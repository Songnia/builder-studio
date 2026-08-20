<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class AuthActiveTest extends TestCase
{

    public function test_active_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'active@vanda.test',
            'password' => bcrypt('password123'),
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'active@vanda.test',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token', 'user']);
    }

    public function test_deactivated_user_cannot_login()
    {
        $user = User::factory()->create([
            'email' => 'inactive@vanda.test',
            'password' => bcrypt('password123'),
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'inactive@vanda.test',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
                 ->assertJson(['message' => 'Votre compte est désactivé. Veuillez contacter le support.']);
    }

    public function test_deactivated_user_token_is_blocked_by_middleware()
    {
        $user = User::factory()->create([
            'email' => 'user@vanda.test',
            'password' => bcrypt('password123'),
            'is_active' => true,
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        // Verify active token works
        $this->withHeader('Authorization', 'Bearer ' . $token)
             ->getJson('/api/user')
             ->assertStatus(200);

        // Deactivate user
        $user->update(['is_active' => false]);

        // Verify token is now blocked with 403
        $this->withHeader('Authorization', 'Bearer ' . $token)
             ->getJson('/api/user')
             ->assertStatus(403)
             ->assertJson(['message' => 'Votre compte est désactivé. Veuillez contacter le support.']);
    }
}
