<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('client_phone')->nullable()->after('client_email');
            $table->boolean('include_tax')->default(false)->after('tax_rate');
            $table->json('studio_info')->nullable()->after('total_amount');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['client_phone', 'include_tax', 'studio_info']);
        });
    }
};
