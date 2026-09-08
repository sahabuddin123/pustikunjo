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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('type')->default('builder'); // builder, builder+logic, dynamic, logic, blog, etc.
            $table->longText('content')->nullable();
            $table->json('blocks')->nullable(); // WPBakery-style block list JSON
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->string('author_name')->default('পুষ্টি কুঞ্জ টিম');
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable(); // Stores string or JSON values
            $table->string('group')->default('general'); // general, contact, appearance, payment, sms, marketing, shipping
            $table->timestamps();
        });

        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_phone');
            $table->text('message');
            $table->string('event_name')->nullable(); // order_placed, payment_verified, payment_rejected, etc.
            $table->string('provider')->nullable(); // ssl_wireless, bulksmsbd, mdl, custom_http
            $table->string('status')->default('sent'); // sent, failed, queued
            $table->text('response_raw')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_logs');
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('pages');
    }
};
