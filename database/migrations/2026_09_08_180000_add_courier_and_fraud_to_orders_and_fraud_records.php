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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('courier_name')->nullable()->after('admin_notes');
            $table->string('courier_consignment_id')->nullable()->after('courier_name');
            $table->string('courier_tracking_code')->nullable()->after('courier_consignment_id');
            $table->string('courier_status')->nullable()->after('courier_tracking_code');
            $table->timestamp('courier_sent_at')->nullable()->after('courier_status');
            $table->json('courier_response')->nullable()->after('courier_sent_at');
            $table->integer('fraud_score')->default(0)->after('courier_response');
            $table->string('fraud_status')->default('safe')->after('fraud_score'); // safe, suspicious, high_risk
        });

        Schema::create('fraud_records', function (Blueprint $table) {
            $table->id();
            $table->string('phone')->unique();
            $table->string('risk_level')->default('fraud'); // safe, suspicious, fraud
            $table->text('reason')->nullable();
            $table->integer('total_orders')->default(0);
            $table->integer('cancelled_orders')->default(0);
            $table->foreignId('reported_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fraud_records');

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'courier_name',
                'courier_consignment_id',
                'courier_tracking_code',
                'courier_status',
                'courier_sent_at',
                'courier_response',
                'fraud_score',
                'fraud_status',
            ]);
        });
    }
};
