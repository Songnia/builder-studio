<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    private $defaultSettings = [
        'site_name' => 'Vanda Studio',
        'contact_email' => 'support@vandastudio.com',
        'maintenance_mode' => false,
        'allow_registrations' => true,
        'require_email_verification' => false,
        'notify_admins_on_registration' => true,
        'notify_admins_on_employer_registration' => false,
        'show_empty_offers_countdown' => false,
        'seo_title' => 'Vanda Studio - Plateforme pour Photographes',
        'seo_description' => 'Créez votre site vitrine et livrez vos galeries clients facilement.',
        'logo' => null,
    ];

    public function index()
    {
        $settings = Cache::get('superadmin_settings', $this->defaultSettings);
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $currentSettings = Cache::get('superadmin_settings', $this->defaultSettings);
        
        $newSettings = array_merge($currentSettings, $request->only(array_keys($this->defaultSettings)));

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('public/global');
            $newSettings['logo'] = url(\Storage::url($path));
        }

        Cache::forever('superadmin_settings', $newSettings);

        return response()->json($newSettings);
    }
}
