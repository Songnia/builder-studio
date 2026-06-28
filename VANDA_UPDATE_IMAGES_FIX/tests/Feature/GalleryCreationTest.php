<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GalleryCreationTest extends TestCase
{
    // Use RefreshDatabase to reset db state, but be careful if user has persistent data they want to keep.
    // Given the context of "debugging", I probably shouldn't wipe their DB via RefreshDatabase unless I'm sure it's a test environment.
    // I will NOT use RefreshDatabase trait to avoid wiping the user's dev database, 
    // instead I'll create a user and clean up, or just rely on manual cleanup if needed.
    // Check .env first? No, I'll just rely on creating a unique user.

    public function test_gallery_creation()
    {
        // 1. Create a User
        $user = User::factory()->create();

        // 2. Act as the user
        $response = $this->actingAs($user)
                         ->postJson('/api/admin/galleries', [
                             'title' => 'Test Gallery ' . uniqid(),
                             'description' => 'A test description',
                             'pin_code' => '1234',
                         ]);

        // 3. Assertions
        $response->assertStatus(201);
        $this->assertDatabaseHas('galleries', [
            'user_id' => $user->id,
            'title' => $response->json('title'),
        ]);
        
        // Clean up (optional, but polite)
        // User::destroy($user->id); // Cascades?
    }
}
