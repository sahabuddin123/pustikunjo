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
        Schema::create('consultation_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('category')->default('সাধারণ স্বাস্থ্য ও পুষ্টি পরামর্শ');
            $table->integer('age')->nullable();
            $table->string('gender')->nullable();
            $table->string('height')->nullable();
            $table->string('weight')->nullable();
            $table->text('problem_details');
            $table->string('contact_method')->default('whatsapp'); // whatsapp, phone_call
            $table->string('status')->default('pending'); // pending, contacted, completed, cancelled
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation_requests');
    }
};
