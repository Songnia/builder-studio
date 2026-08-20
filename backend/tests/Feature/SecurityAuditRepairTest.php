<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Gallery;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SecurityAuditRepairTest extends TestCase
{

    public function test_media_deletion_prevents_cross_tenant_access()
    {
        Storage::fake('public');
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // User 2 file
        $user2File = "builder-media/{$user2->id}/avatar.jpg";
        Storage::disk('public')->put($user2File, 'dummy content');

        // User 1 tries to delete User 2's file
        $response = $this->actingAs($user1)
            ->deleteJson('/api/admin/media', [
                'path' => $user2File,
            ]);

        $response->assertStatus(403);
        Storage::disk('public')->assertExists($user2File);
    }

    public function test_zip_upload_rejects_non_zip_files()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $gallery = Gallery::factory()->create(['user_id' => $user->id]);

        $fakePhpScript = UploadedFile::fake()->create('malicious.php', 10, 'application/x-php');

        $response = $this->actingAs($user)
            ->postJson("/api/admin/galleries/{$gallery->uuid}/zip", [
                'zip_file' => $fakePhpScript,
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['zip_file']);
    }

    public function test_client_gallery_requires_pin_when_set()
    {
        $user = User::factory()->create();
        $gallery = Gallery::factory()->create([
            'user_id' => $user->id,
            'pin_code' => '9876',
        ]);

        // Request without PIN
        $response = $this->getJson("/api/client/gallery/{$gallery->uuid}");
        $response->assertStatus(403);
        $response->assertJson(['requires_pin' => true]);

        // Request with correct PIN
        $responseWithPin = $this->getJson("/api/client/gallery/{$gallery->uuid}", [
            'X-Gallery-PIN' => '9876',
        ]);
        $responseWithPin->assertStatus(200);
        $responseWithPin->assertJson(['uuid' => $gallery->uuid]);
    }

    public function test_superadmin_logo_upload_validates_image_mime_type()
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'superadmin']);

        $maliciousFile = UploadedFile::fake()->create('shell.php', 10, 'text/x-php');

        $response = $this->actingAs($admin)
            ->postJson('/api/superadmin/settings', [
                'logo' => $maliciousFile,
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['logo']);
    }
}
