<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->string('maketou_product_id')->nullable()->after('features');
        });

        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->string('maketou_cart_id')->nullable()->after('status');
            $table->string('payment_status')->default('pending')->after('maketou_cart_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn('maketou_product_id');
        });

        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->dropColumn(['maketou_cart_id', 'payment_status']);
        });
    }
};
