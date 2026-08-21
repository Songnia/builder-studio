<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Backfill only legacy rows where the activation state is unknown.
     *
     * Explicitly disabled accounts must remain disabled. Updating every false
     * value here would silently undo an administrator's security decision.
     */
    public function up(): void
    {
        DB::table('users')->whereNull('is_active')->update(['is_active' => true]);
    }

    public function down(): void
    {
        // No-op: deactivation is managed by administrators.
    }
};
