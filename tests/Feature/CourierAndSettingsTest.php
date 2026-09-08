<?php

namespace Tests\Feature;

use App\Models\FraudRecord;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourierAndSettingsTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
        $this->admin = User::firstOrCreate(
            ['email' => 'admin@pustikunjo.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password123'),
                'role' => 'admin',
                'phone' => '01711111111',
            ]
        );
    }

    public function test_settings_index_page_renders_with_all_props()
    {
        $response = $this->actingAs($this->admin)->get('/admin/settings');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Settings/Index')
            ->has('general')
            ->has('appearance')
            ->has('seo')
            ->has('courierSteadfast')
            ->has('fraudSettings')
            ->has('paymentBkash')
            ->has('emailSmtp')
        );
    }

    public function test_settings_update_saves_all_categories()
    {
        $payload = [
            'general' => [
                'site_name' => 'Pusti Kunjo Updated',
                'tagline' => 'Fresh & Pure Food',
                'email' => 'contact@pustikunjo.com.bd',
                'currency' => 'BDT',
                'currency_symbol' => '৳',
            ],
            'appearance' => [
                'primary_color' => '#0d6838',
                'primary_hover' => '#0a522c',
                'accent_color' => '#f59e0b',
                'light_bg' => '#f0fdf4',
            ],
            'courierSteadfast' => [
                'enabled' => true,
                'api_key' => 'test_api_key',
                'secret_key' => 'test_secret_key',
                'base_url' => 'https://portal.steadfast.com.bd/api/v1',
            ],
        ];

        $response = $this->actingAs($this->admin)->post('/admin/settings', $payload);

        $response->assertRedirect();
        $general = SiteSetting::get('general_settings');
        $this->assertEquals('Pusti Kunjo Updated', $general['site_name']);
        $courier = SiteSetting::get('courier_steadfast');
        $this->assertEquals('test_api_key', $courier['api_key']);
    }

    public function test_order_can_be_dispatched_to_steadfast_courier()
    {
        $order = Order::create([
            'order_number' => 'PK-TEST-COURIER-01',
            'customer_name' => 'জামিল আহমেদ',
            'customer_phone' => '01712345678',
            'shipping_address' => 'মিরপুর ১০, ঢাকা',
            'shipping_area' => 'ঢাকা',
            'subtotal' => 1200,
            'shipping_fee' => 60,
            'grand_total' => 1260,
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->post("/admin/orders/{$order->id}/courier", [
            'recipient_name' => 'জামিল আহমেদ',
            'recipient_phone' => '01712345678',
            'recipient_address' => 'মিরপুর ১০, ঢাকা',
            'cod_amount' => 1260,
            'note' => 'টেস্ট ডেলিভারি',
        ]);

        $response->assertRedirect();
        $order->refresh();

        $this->assertEquals('steadfast', $order->courier_name);
        $this->assertNotEmpty($order->courier_tracking_code);
        $this->assertStringStartsWith('SF', $order->courier_tracking_code);
        $this->assertEquals('shipped', $order->status);
    }

    public function test_customer_can_be_blacklisted_and_whitelisted_from_order()
    {
        $order = Order::create([
            'order_number' => 'PK-TEST-FRAUD-01',
            'customer_name' => 'সন্দেহভাজন গ্রাহক',
            'customer_phone' => '01899999999',
            'shipping_address' => 'উত্তরা, ঢাকা',
            'shipping_area' => 'ঢাকা',
            'subtotal' => 500,
            'shipping_fee' => 60,
            'grand_total' => 560,
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'status' => 'pending',
        ]);

        // Blacklist
        $response = $this->actingAs($this->admin)->post("/admin/orders/{$order->id}/blacklist", [
            'action' => 'blacklist',
            'reason' => 'ভুয়া কাস্টমার, ফোন ধরে না',
        ]);
        $response->assertRedirect();

        $this->assertTrue(FraudRecord::isFraud('01899999999'));

        // Whitelist / Pardon
        $response = $this->actingAs($this->admin)->post("/admin/orders/{$order->id}/blacklist", [
            'action' => 'whitelist',
        ]);
        $response->assertRedirect();

        $this->assertFalse(FraudRecord::isFraud('01899999999'));
    }

    public function test_order_status_can_be_updated_directly()
    {
        $order = Order::create([
            'order_number' => 'PK-STATUS-TEST-01',
            'customer_name' => 'করিম সাহেব',
            'customer_phone' => '01755555555',
            'shipping_address' => 'ধানমন্ডি, ঢাকা',
            'shipping_area' => 'ঢাকা',
            'subtotal' => 1000,
            'shipping_fee' => 60,
            'grand_total' => 1060,
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->post("/admin/orders/{$order->id}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertRedirect();
        $order->refresh();
        $this->assertEquals('confirmed', $order->status);
    }
}
