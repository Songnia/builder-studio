<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\SuperAdminAuditService;
use App\Support\PublicMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SettingController extends Controller
{
    private array $defaults = [
        'site_name' => 'Vanda Studio', 'contact_email' => 'support@vandastudio.com',
        'maintenance_mode' => false, 'allow_registrations' => true,
        'monthly_marketing_spend' => 0,
        'require_email_verification' => false, 'notify_admins_on_registration' => true,
        'notify_admins_on_employer_registration' => false, 'show_empty_offers_countdown' => false,
        'seo_title' => 'Vanda Studio - Plateforme pour Photographes',
        'seo_description' => 'Créez votre site vitrine et livrez vos galeries clients facilement.', 'logo' => null,
    ];

    public function __construct(private readonly SuperAdminAuditService $audit) {}

    public function index() { return response()->json($this->settings()); }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'contact_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'maintenance_mode' => ['sometimes', 'boolean'], 'allow_registrations' => ['sometimes', 'boolean'],
            'monthly_marketing_spend' => ['sometimes', 'numeric', 'min:0', 'max:999999999999'],
            'require_email_verification' => ['sometimes', 'boolean'], 'notify_admins_on_registration' => ['sometimes', 'boolean'],
            'notify_admins_on_employer_registration' => ['sometimes', 'boolean'], 'show_empty_offers_countdown' => ['sometimes', 'boolean'],
            'seo_title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'seo_description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'logo' => ['sometimes', 'nullable', 'image', 'mimes:png,jpg,jpeg,webp,svg', 'max:2048'],
            'remove_logo' => ['sometimes', 'boolean'],
            'reason' => ['required', 'string', 'min:5', 'max:500'],
        ]);
        $reason = $validated['reason']; unset($validated['reason']);
        $before = $this->settings();
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = Str::uuid().'.'.strtolower($file->getClientOriginalExtension() ?: 'png');
            $file->storeAs('global', $filename, 'public');
            $validated['logo'] = PublicMedia::url('global/'.$filename);
        } elseif ($validated['remove_logo'] ?? false) {
            $relativePath = PublicMedia::extractRelativePath($before['logo'] ?? null);
            if ($relativePath && str_starts_with($relativePath, 'global/')) {
                Storage::disk('public')->delete($relativePath);
            }
            $validated['logo'] = null;
        } else {
            unset($validated['logo']);
        }
        unset($validated['remove_logo']);

        DB::transaction(function () use ($validated, $request) {
            foreach ($validated as $key => $value) {
                if (! array_key_exists($key, $this->defaults)) continue;
                SystemSetting::updateOrCreate(['key' => $key], ['value' => $value, 'updated_by' => $request->user()->id]);
            }
        });
        Cache::forget('superadmin_settings');
        $after = $this->settings();
        $this->audit->record($request, 'settings.updated', null, $before, $after, $reason);

        return response()->json($after);
    }

    private function settings(): array
    {
        return Cache::remember('superadmin_settings', now()->addMinutes(30), fn () => array_merge($this->defaults, SystemSetting::query()->pluck('value', 'key')->all()));
    }
}
