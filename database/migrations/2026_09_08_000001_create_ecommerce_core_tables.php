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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('weight')->nullable(); // e.g. "200g", "500g", "1kg"
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('badge')->nullable(); // "নতুন", "বেস্ট সেলার", "২০% ছাড়"
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->json('images')->nullable(); // Array of image URLs
            $table->json('benefits')->nullable(); // Array of {title, text, icon}
            $table->text('usage_instructions')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image')->nullable();
            $table->timestamps();
        });

        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['fixed', 'percent'])->default('fixed');
            $table->decimal('value', 10, 2);
            $table->decimal('min_order_amount', 10, 2)->default(0);
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_alt_phone')->nullable();
            $table->string('customer_email')->nullable();
            $table->text('shipping_address');
            $table->string('shipping_area')->default('ঢাকার ভিতরে');
            $table->text('order_notes')->nullable();

            $table->enum('payment_method', ['cod', 'bkash_manual', 'bkash_pgw'])->default('cod');
            $table->string('payment_status')->default('pending'); 
            // pending, payment_pending, payment_verified, payment_rejected, paid, failed

            $table->string('status')->default('pending');
            // pending, payment_pending, payment_verified, confirmed, shipped, delivered, cancelled

            // bKash manual send money info
            $table->string('bkash_sender_number')->nullable();
            $table->string('bkash_trx_id')->nullable();
            $table->text('bkash_reject_reason')->nullable();
            $table->string('bkash_payment_id')->nullable();

            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('shipping_fee', 10, 2)->default(60);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('coupon_code')->nullable();
            $table->decimal('grand_total', 10, 2)->default(0);

            $table->text('admin_notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_name');
            $table->string('product_sku')->nullable();
            $table->string('product_image')->nullable();
            $table->decimal('unit_price', 10, 2);
            $table->integer('quantity')->default(1);
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->integer('rating')->default(5);
            $table->text('comment');
            $table->boolean('is_approved')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
