<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('user_id')->constrained()->onDelete('cascade');
            $blueprint->string('invoice_number')->unique();
            $blueprint->date('issue_date');
            $blueprint->date('due_date');
            $blueprint->string('client_name');
            $blueprint->string('client_email');
            $blueprint->text('client_address')->nullable();
            $blueprint->decimal('tax_rate', 5, 2)->default(0);
            $blueprint->decimal('total_amount', 15, 2);
            $blueprint->string('status')->default('pending'); // pending, paid, cancelled
            $blueprint->string('currency')->default('FCFA');
            $blueprint->timestamps();
        });

        Schema::create('invoice_items', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('invoice_id')->constrained()->onDelete('cascade');
            $blueprint->string('description');
            $blueprint->integer('quantity');
            $blueprint->decimal('unit_price', 15, 2);
            $blueprint->decimal('total', 15, 2);
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
    }
};
