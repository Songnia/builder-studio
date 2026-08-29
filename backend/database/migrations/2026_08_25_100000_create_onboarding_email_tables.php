<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('onboarding_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('event_name', 80);
            $table->nullableMorphs('subject');
            $table->json('properties')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();
            $table->index(['user_id', 'event_name', 'occurred_at']);
            $table->unique(['user_id', 'event_name', 'subject_type', 'subject_id'], 'onboarding_event_subject_unique');
        });

        Schema::create('onboarding_email_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('template_key', 80);
            $table->unsignedSmallInteger('lifecycle_version')->default(1);
            $table->string('subject_key', 120)->default('global');
            $table->enum('status', ['pending', 'sent', 'suppressed', 'failed'])->default('pending');
            $table->timestamp('scheduled_for');
            $table->timestamp('sent_at')->nullable();
            $table->text('failure_reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'template_key', 'lifecycle_version', 'subject_key'], 'onboarding_delivery_unique');
            $table->index(['status', 'scheduled_for']);
        });

        Schema::create('onboarding_email_preferences', function (Blueprint $table) {
            $table->foreignId('user_id')->primary()->constrained()->cascadeOnDelete();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('onboarding_email_preferences');
        Schema::dropIfExists('onboarding_email_deliveries');
        Schema::dropIfExists('onboarding_events');
    }
};
