<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Gallery;
use App\Models\SiteConfig;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Admin\GalleryController;
use App\Http\Controllers\Api\SiteConfigController;

echo "--- DÉBUT DES TESTS DE SÉCURITÉ ---\n\n";

// 1. Setup Users
$userA = User::find(5);
$userB = User::find(6);

if (!$userA || !$userB) {
    die("Erreur: Les utilisateurs de test (ID 5 et 6) n'existent pas.\n");
}

echo "Utilisateurs de test: \n";
echo "- User A (ID {$userA->id}): {$userA->name}\n";
echo "- User B (ID {$userB->id}): {$userB->name}\n\n";

// 2. Setup Data
// Clean up previous test data if any
Gallery::where('title', 'LIKE', 'TEST SECU%')->delete();
SiteConfig::where('site_name', 'LIKE', 'TEST SECU%')->delete();

echo "Création des données de test...\n";

auth()->login($userA);
$galleryA = Gallery::create([
    'uuid' => Str::uuid(),
    'user_id' => $userA->id,
    'title' => 'TEST SECU Gallery A',
    'status' => 'draft'
]);
$siteConfigA = SiteConfig::create([
    'user_id' => $userA->id,
    'site_name' => 'TEST SECU Site A',
    'slug' => 'test-secu-site-a',
    'config_data' => [],
    'is_published' => true
]);

auth()->login($userB);
$galleryB = Gallery::create([
    'uuid' => Str::uuid(),
    'user_id' => $userB->id,
    'title' => 'TEST SECU Gallery B',
    'status' => 'draft'
]);
$siteConfigB = SiteConfig::create([
    'user_id' => $userB->id,
    'site_name' => 'TEST SECU Site B',
    'slug' => 'test-secu-site-b',
    'config_data' => [],
    'is_published' => true
]);

echo "Données créées:\n";
echo "- Gallery A ({$galleryA->uuid}) owned by User A\n";
echo "- Gallery B ({$galleryB->uuid}) owned by User B\n";
echo "- Site A owned by User A\n";
echo "- Site B owned by User B\n\n";

// 3. Run Tests
$failures = 0;
$successes = 0;

function runTest($name, $callback) {
    global $failures, $successes;
    echo "TEST: $name ... ";
    try {
        $callback();
        echo "✅ PASSÉ\n";
        $successes++;
    } catch (\Exception $e) {
        if ($e->getMessage() === 'PASSED_EXPECTED_EXCEPTION') {
             echo "✅ PASSÉ (Access Refused as expected)\n";
             $successes++;
        } else {
            echo "❌ ÉCHOUÉ - " . $e->getMessage() . "\n";
            $failures++;
        }
    }
}

// --- TEST GALLERY CONTROLLER ---

echo "--- Test Isolation Galeries ---\n";

runTest("User A peut voir sa propre galerie (Gallery A)", function() use ($userA, $galleryA) {
    auth()->login($userA);
    $controller = new GalleryController();
    $request = Request::create('/api/admin/galleries/' . $galleryA->uuid, 'GET');
    $request->setUserResolver(function () use ($userA) { return $userA; });
    
    $response = $controller->show($request, $galleryA->uuid);
    if ((string)$response->uuid !== (string)$galleryA->uuid) {
        $actual = (string)$response->uuid;
        $expected = (string)$galleryA->uuid;
        throw new Exception("Mauvaise galerie retournée. Attendu: $expected, Reçu: $actual");
    }
});

runTest("User A NE PEUT PAS voir la galerie de User B (Gallery B)", function() use ($userA, $galleryB) {
    auth()->login($userA);
    $controller = new GalleryController();
    $request = Request::create('/api/admin/galleries/' . $galleryB->uuid, 'GET');
    $request->setUserResolver(function () use ($userA) { return $userA; });
    
    try {
        $controller->show($request, $galleryB->uuid);
        throw new Exception("FAIL: Accès autorisé à la galerie d'autrui !");
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        throw new Exception("PASSED_EXPECTED_EXCEPTION"); // C'est ce qu'on veut
    }
});

runTest("User A NE PEUT PAS supprimer la galerie de User B", function() use ($userA, $galleryB) {
    auth()->login($userA);
    $controller = new GalleryController();
    $request = Request::create('/api/admin/galleries/' . $galleryB->uuid, 'DELETE');
    $request->setUserResolver(function () use ($userA) { return $userA; });
    
    try {
        $controller->destroy($request, $galleryB->uuid);
        throw new Exception("FAIL: Suppression autorisée sur la galerie d'autrui !");
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        throw new Exception("PASSED_EXPECTED_EXCEPTION");
    }
});

// --- TEST SITECONFIG CONTROLLER ---

echo "\n--- Test Isolation SiteConfigs ---\n";

runTest("User A peut voir sa config", function() use ($userA, $siteConfigA) {
    auth()->login($userA);
    $controller = new SiteConfigController();
    $request = Request::create('/api/admin/site-configs/' . $siteConfigA->id, 'GET');
    $request->setUserResolver(function () use ($userA) { return $userA; });
    
    $response = $controller->show($request, $siteConfigA->id);
    if ($response->getData()->id !== $siteConfigA->id) throw new Exception("Mauvaise config retournée");
});

runTest("User A NE PEUT PAS voir la config de User B", function() use ($userA, $siteConfigB) {
    auth()->login($userA);
    $controller = new SiteConfigController();
    $request = Request::create('/api/admin/site-configs/' . $siteConfigB->id, 'GET');
    $request->setUserResolver(function () use ($userA) { return $userA; });
    
    try {
        $controller->show($request, $siteConfigB->id);
        throw new Exception("FAIL: Accès autorisé à la config d'autrui !");
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        throw new Exception("PASSED_EXPECTED_EXCEPTION");
    }
});

runTest("User A NE PEUT PAS modifier la config de User B", function() use ($userA, $siteConfigB) {
    auth()->login($userA);
    $controller = new SiteConfigController();
    $request = Request::create('/api/admin/site-configs/' . $siteConfigB->id, 'PUT', ['site_name' => 'HACKED']);
    $request->setUserResolver(function () use ($userA) { return $userA; });
    
    try {
        $controller->update($request, $siteConfigB->id);
        throw new Exception("FAIL: Modification autorisée sur la config d'autrui !");
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        throw new Exception("PASSED_EXPECTED_EXCEPTION");
    }
});


echo "\n--- RÉSULTATS FINAUX ---\n";
echo "Total Tests: " . ($failures + $successes) . "\n";
echo "Succès: $successes\n";
echo "Échecs: $failures\n";

if ($failures === 0) {
    echo "\n🏆 TOUS LES TESTS DE SÉCURITÉ SONT PASSÉS ! LE SYSTÈME EST SÉCURISÉ.\n";
} else {
    echo "\n🚨 IL Y A DES FAILLES DE SÉCURITÉ NON CORRIGÉES !\n";
}

// Cleanup
$galleryA->delete();
$galleryB->delete();
$siteConfigA->delete();
$siteConfigB->delete();
