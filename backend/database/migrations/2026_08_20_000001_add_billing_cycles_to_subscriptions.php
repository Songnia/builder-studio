<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->decimal('yearly_price', 10, 2)->nullable()->after('price');
            $table->string('maketou_yearly_product_id')->nullable()->after('maketou_product_id');
        });

        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->string('billing_cycle', 16)->default('monthly')->after('subscription_plan_id');
        });

        $offers = [
            'STARTER' => [
                'monthly_id' => '0125f2a3-f95b-4298-9d5b-e053c84de9cb',
                'yearly_id' => 'f019d0e4-fb8d-434a-bc3e-758d5db46d90',
                'yearly_price' => 50000,
            ],
            'PRO' => [
                'monthly_id' => 'c84a9886-ec7a-405a-a00e-2efb45035e6f',
                'yearly_id' => 'e1121214-39e8-4188-9b2d-c201b8999d42',
                'yearly_price' => 100000,
            ],
            'STUDIO' => [
                'monthly_id' => '31d7c6d1-62b2-4cfb-a979-f98e6d0e04de',
                'yearly_id' => 'bf278046-0097-489e-9f7f-395f0ed9bcfa',
                'yearly_price' => 250000,
            ],
        ];

        foreach ($offers as $name => $offer) {
            DB::table('subscription_plans')
                ->whereRaw('UPPER(name) = ?', [$name])
                ->update([
                    'maketou_product_id' => $offer['monthly_id'],
                    'maketou_yearly_product_id' => $offer['yearly_id'],
                    'yearly_price' => $offer['yearly_price'],
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->dropColumn('billing_cycle');
        });

        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn(['yearly_price', 'maketou_yearly_product_id']);
        });
    }
};
