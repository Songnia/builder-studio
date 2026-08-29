<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn("users", "phone")) {
            Schema::table("users", function (Blueprint $table) {
                $table->string("phone", 40)->nullable()->after("email");
            });
        }

        if (! Schema::hasTable("superadmin_audit_logs")) {
            Schema::create("superadmin_audit_logs", function (Blueprint $table) {
                $table->id();
                $table->foreignId("actor_id")->nullable()->constrained("users")->nullOnDelete();
                $table->string("action", 100)->index();
                $table->string("target_type", 80)->nullable();
                $table->unsignedBigInteger("target_id")->nullable();
                $table->json("before_data")->nullable();
                $table->json("after_data")->nullable();
                $table->string("reason", 500)->nullable();
                $table->string("ip_address", 45)->nullable();
                $table->text("user_agent")->nullable();
                $table->timestamp("created_at")->useCurrent();
                $table->index(["target_type", "target_id"]);
                $table->index(["actor_id", "created_at"]);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists("superadmin_audit_logs");
        if (Schema::hasColumn("users", "phone")) {
            Schema::table("users", fn (Blueprint $table) => $table->dropColumn("phone"));
        }
    }
};
