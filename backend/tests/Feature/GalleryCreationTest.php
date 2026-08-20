<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class GalleryCreationTest extends TestCase
{
    // The base TestCase uses RefreshDatabase, so the test schema is rebuilt
    // in a dedicated test database (sqlite :memory: in CI) and never touches
    // the local development database.

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
