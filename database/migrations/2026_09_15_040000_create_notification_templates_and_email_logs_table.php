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
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('channel'); // 'sms' or 'email'
            $table->string('event_key'); // 'order_placed', 'order_confirmed', 'order_shipped', etc.
            $table->string('name'); // Display Name
            $table->string('subject')->nullable(); // For email
            $table->text('body'); // Content with {{placeholders}}
            $table->boolean('is_active')->default(true);
            $table->boolean('send_to_admin')->default(false);
            $table->string('admin_recipient')->nullable();
            $table->json('available_tags')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['channel', 'event_key']);
        });

        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_email');
            $table->string('subject');
            $table->longText('body')->nullable();
            $table->string('event_name')->nullable();
            $table->string('status')->default('sent'); // 'sent' or 'failed'
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_logs');
        Schema::dropIfExists('notification_templates');
    }
};
