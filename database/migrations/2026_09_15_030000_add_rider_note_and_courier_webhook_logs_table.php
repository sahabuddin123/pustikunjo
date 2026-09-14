<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'courier_rider_note')) {
                $table->string('courier_rider_note')->nullable()->after('courier_status');
            }
            if (!Schema::hasColumn('orders', 'courier_pickup_note')) {
                $table->string('courier_pickup_note')->nullable()->after('courier_rider_note');
            }
        });

        if (!Schema::hasTable('courier_webhook_logs')) {
            Schema::create('courier_webhook_logs', function (Blueprint $table) {
                $table->id();
                $table->string('courier_name')->default('steadfast');
                $table->string('tracking_code')->nullable()->index();
                $table->string('consignment_id')->nullable()->index();
                $table->string('status')->nullable();
                $table->json('payload')->nullable();
                $table->string('ip_address')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'courier_rider_note')) {
                $table->dropColumn(['courier_rider_note', 'courier_pickup_note']);
            }
        });

        Schema::dropIfExists('courier_webhook_logs');
    }
};
