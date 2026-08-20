<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Backfill: activate all existing user accounts.
     *
     * The original `is_active` column defaulted to `false`, so accounts created
     * before that migration were stored as inactive. Once the `active` middleware
     * and login guard enforce the flag, those legitimate accounts would be locked
     * out. This backfill activates them; administrators can still deactivate
     * specific accounts afterwards via the super-admin interface.
     */
    public function up(): void
    {
        DB::table('users')->whereNull('is_active')->update(['is_active' => true]);
        DB::table('users')->where('is_active', false)->update(['is_active' => true]);
    }

    public function down(): void
    {
        // No-op: deactivation is managed by administrators.
    }
};