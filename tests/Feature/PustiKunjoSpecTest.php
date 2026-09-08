<?php

namespace Tests\Feature;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class PustiKunjoSpecTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_storefront_homepage_and_shop_render_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);

        $shop = $this->get('/shop');
        $shop->assertStatus(200);
    }

    public function test_product_detail_page_loads_with_seeded_product(): void
    {
        $response = $this->get('/product/beetroot-powder');
        $response->assertStatus(200);
    }

    public function test_facebook_catalog_feed_generates_valid_csv(): void
    {
        $response = $this->get('/feeds/facebook.csv');
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        
        $content = $response->getContent();
        $this->assertStringContainsString('id,title,description,availability,condition,price,sale_price,link,image_link,brand,product_type,inventory', $content);
        $this->assertStringContainsString('PK-BT-001', $content);
        $this->assertStringContainsString('BDT', $content);
    }

    public function test_sitemap_and_robots_return_valid_responses(): void
    {
        $sitemap = $this->get('/sitemap.xml');
        $sitemap->assertStatus(200);
        $this->assertStringContainsString('urlset', $sitemap->getContent());

        $robots = $this->get('/robots.txt');
        $robots->assertStatus(200);
        $this->assertStringContainsString('User-agent:', $robots->getContent());
        $this->assertStringContainsString('Sitemap:', $robots->getContent());
    }

    public function test_coupon_validation_api(): void
    {
        $response = $this->postJson('/api/validate-coupon', [
            'code' => 'PUSTI50',
            'amount' => 600,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'valid' => true,
            'code' => 'PUSTI50',
            'discount' => 50,
        ]);
    }

    public function test_checkout_process_with_cod(): void
    {
        $product = Product::first();

        $response = $this->post('/checkout/process', [
            'customer_name' => 'তানভীর রহমান',
            'customer_phone' => '01711223344',
            'shipping_address' => 'বাড়ি #১০, রোড #০২, ধানমন্ডি, ঢাকা',
            'shipping_area' => 'ঢাকার ভিতরে',
            'payment_method' => 'cod',
            'items' => [
                ['id' => $product->id, 'quantity' => 1]
            ]
        ]);

        $response->assertRedirectContains('/order-success');
        $this->assertDatabaseHas('orders', [
            'customer_phone' => '01711223344',
            'payment_method' => 'cod',
            'status' => 'pending',
        ]);
    }

    public function test_checkout_process_with_bkash_manual_validation(): void
    {
        $product = Product::first();

        // Invalid TrxID test (less than 8 chars)
        $invalidResponse = $this->post('/checkout/process', [
            'customer_name' => 'হাসান মাহমুদ',
            'customer_phone' => '01811223344',
            'shipping_address' => 'মিরপুর ১০, ঢাকা',
            'shipping_area' => 'ঢাকার ভিতরে',
            'payment_method' => 'bkash_manual',
            'bkash_sender_number' => '01811223344',
            'bkash_trx_id' => '123', // Invalid
            'items' => [
                ['id' => $product->id, 'quantity' => 1]
            ]
        ]);

        $invalidResponse->assertSessionHasErrors('bkash_trx_id');

        // Valid TrxID test
        $validResponse = $this->post('/checkout/process', [
            'customer_name' => 'হাসান মাহমুদ',
            'customer_phone' => '01811223344',
            'shipping_address' => 'মিরপুর ১০, ঢাকা',
            'shipping_area' => 'ঢাকার ভিতরে',
            'payment_method' => 'bkash_manual',
            'bkash_sender_number' => '01811223344',
            'bkash_trx_id' => 'BK98765432', // Valid 10 chars
            'items' => [
                ['id' => $product->id, 'quantity' => 1]
            ]
        ]);

        $validResponse->assertRedirectContains('/order-success');
        $this->assertDatabaseHas('orders', [
            'customer_phone' => '01811223344',
            'payment_method' => 'bkash_manual',
            'bkash_trx_id' => 'BK98765432',
            'payment_status' => 'payment_pending',
        ]);
    }

    public function test_admin_dashboard_and_orders_management(): void
    {
        $admin = User::first();

        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200);

        $orders = $this->actingAs($admin)->get('/admin/orders');
        $orders->assertStatus(200);

        $products = $this->actingAs($admin)->get('/admin/products');
        $products->assertStatus(200);

        $pages = $this->actingAs($admin)->get('/admin/pages');
        $pages->assertStatus(200);

        $builder = $this->actingAs($admin)->get('/admin/pages/1/edit');
        $builder->assertStatus(200);
    }

    public function test_admin_media_library_json_and_upload(): void
    {
        $admin = User::first();

        // 1. Inertia navigation to media library must render Inertia component
        $inertiaResponse = $this->actingAs($admin)->get('/admin/media');
        $inertiaResponse->assertStatus(200);
        $inertiaResponse->assertInertia(fn ($page) => $page->component('Admin/Media/Index')->has('media'));

        // 2. Fetch media as raw JSON
        $jsonResponse = $this->actingAs($admin)->getJson('/admin/media');
        $jsonResponse->assertStatus(200);
        $jsonResponse->assertJsonStructure(['media']);

        // 2. Upload file via JSON request
        $file = UploadedFile::fake()->image('test_banner.jpg', 800, 600);
        $uploadResponse = $this->actingAs($admin)->postJson('/admin/media/upload', [
            'image' => $file,
        ]);

        $uploadResponse->assertStatus(200);
        $uploadResponse->assertJson(['success' => true]);
        $uploadResponse->assertJsonStructure(['media' => ['filename', 'url', 'size']]);

        // Clean up uploaded file if created
        $uploadedFilename = $uploadResponse->json('media.filename');
        if ($uploadedFilename && file_exists(public_path('uploads/' . $uploadedFilename))) {
            @unlink(public_path('uploads/' . $uploadedFilename));
        }
    }

    public function test_product_has_dynamic_variants_and_checkout_calculates_variant_price(): void
    {
        $product = Product::where('slug', 'beetroot-powder')->firstOrFail();
        $this->assertNotEmpty($product->variants);
        $this->assertCount(2, $product->variants);

        // Variant 2: ৫০০ গ্রাম (sale_price 850)
        $variant = $product->variants[1];
        $this->assertEquals('৫০০ গ্রাম', $variant['name']);
        $this->assertEquals(850, $variant['sale_price']);

        $response = $this->post('/checkout/process', [
            'customer_name' => 'সাকিব আল হাসান',
            'customer_phone' => '01799887766',
            'shipping_address' => 'গুলশান ২, ঢাকা',
            'shipping_area' => 'ঢাকার ভিতরে',
            'payment_method' => 'cod',
            'items' => [
                [
                    'id' => $product->id,
                    'quantity' => 2,
                    'variant_name' => '৫০০ গ্রাম',
                ]
            ]
        ]);

        $response->assertRedirectContains('/order-success');

        // Subtotal should be 850 * 2 = 1700, shipping fee = 60, grand_total = 1760
        $this->assertDatabaseHas('orders', [
            'customer_phone' => '01799887766',
            'subtotal' => 1700,
            'shipping_fee' => 60,
            'grand_total' => 1760,
        ]);

        $this->assertDatabaseHas('order_items', [
            'variant_name' => '৫০০ গ্রাম',
            'unit_price' => 850,
            'quantity' => 2,
            'subtotal' => 1700,
        ]);
    }
}
