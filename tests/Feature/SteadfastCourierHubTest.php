<?php

namespace Tests\Feature;

use App\Models\CourierWebhookLog;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SteadfastCourierHubTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'role' => 'admin',
        ]);
    }

    public function test_courier_dashboard_renders_with_metrics_and_parcels(): void
    {
        // Seed an order with courier tracking
        Order::create([
            'order_number' => 'ORD-1001',
            'customer_name' => 'Md Sahabuddin',
            'customer_phone' => '01711112233',
            'shipping_address' => 'Mirpur-10, Dhaka',
            'shipping_area' => 'inside_dhaka',
            'shipping_fee' => 60,
            'subtotal' => 1200,
            'grand_total' => 1260,
            'payment_method' => 'cod',
            'status' => 'shipped',
            'courier_name' => 'steadfast',
            'courier_consignment_id' => '9876543',
            'courier_tracking_code' => 'SF12345678',
            'courier_status' => 'in_transit',
            'courier_rider_note' => 'ফোন দিয়ে ডেলিভারি করবেন',
            'courier_pickup_note' => 'Fakirapool 1st Lane, Dhaka-1000',
            'order_notes' => 'সাবধানে হ্যান্ডেল করবেন',
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/courier');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Courier/Index')
                ->has('parcels.data', 1)
                ->has('stats')
                ->where('stats.total_booked', 1)
                ->where('stats.in_transit', 1)
        );
    }

    public function test_live_tracking_endpoint_returns_data_with_rider_and_customer_notes(): void
    {
        Order::create([
            'order_number' => 'ORD-1002',
            'customer_name' => 'Karim Mia',
            'customer_phone' => '01822223344',
            'shipping_address' => 'Dhanmondi 27, Dhaka',
            'shipping_area' => 'inside_dhaka',
            'shipping_fee' => 60,
            'subtotal' => 850,
            'grand_total' => 910,
            'payment_method' => 'cod',
            'status' => 'shipped',
            'courier_tracking_code' => 'SF88899911',
            'courier_status' => 'in_transit',
            'courier_rider_note' => '৩য় তলা ফ্ল্যাট ৫বি',
            'order_notes' => 'জরুরি ডেলিভারি লাগবে',
        ]);

        $response = $this->actingAs($this->admin)->postJson('/admin/courier/track', [
            'code' => 'SF88899911',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'tracking_code' => 'SF88899911',
            'order' => [
                'order_number' => 'ORD-1002',
                'customer_name' => 'Karim Mia',
                'rider_note' => '৩য় তলা ফ্ল্যাট ৫বি',
                'customer_note' => 'জরুরি ডেলিভারি লাগবে',
            ]
        ]);
    }

    public function test_instant_fraud_check_endpoint(): void
    {
        // Seed order history for phone
        Order::create([
            'order_number' => 'ORD-1003',
            'customer_name' => 'Test Customer',
            'customer_phone' => '01912345678',
            'shipping_address' => 'Uttara Sector 7',
            'shipping_area' => 'inside_dhaka',
            'subtotal' => 500,
            'grand_total' => 560,
            'payment_method' => 'cod',
            'status' => 'delivered',
        ]);

        $response = $this->actingAs($this->admin)->postJson('/admin/courier/fraud-check', [
            'phone' => '01912345678',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'phone',
            'risk_level',
            'risk_score',
            'risk_reason',
            'metrics' => [
                'total_orders',
                'delivered_orders',
                'cancelled_orders',
                'success_rate',
            ],
            'badge',
        ]);
    }

    public function test_steadfast_webhook_syncs_order_status_and_logs(): void
    {
        SiteSetting::set('courier_steadfast', [
            'webhook_token' => 'my_secret_token_123',
        ], 'courier');

        $order = Order::create([
            'order_number' => 'ORD-2026',
            'customer_name' => 'Salma Begum',
            'customer_phone' => '01511223344',
            'shipping_address' => 'Gulshan 1, Dhaka',
            'shipping_area' => 'inside_dhaka',
            'subtotal' => 1500,
            'grand_total' => 1560,
            'payment_method' => 'cod',
            'status' => 'shipped',
            'courier_tracking_code' => 'SF55566677',
            'courier_status' => 'in_transit',
        ]);

        // Post to public webhook endpoint with bearer token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer my_secret_token_123',
        ])->postJson('/api/v1/courier/webhook/steadfast', [
            'tracking_code' => 'SF55566677',
            'status' => 'delivered',
            'rider_comment' => 'গ্রাহক পণ্য রিসিভ করেছেন এবং টাকা পরিশোধ করেছেন',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 200,
            'order_number' => 'ORD-2026',
            'new_status' => 'delivered',
            'courier_status' => 'delivered',
        ]);

        // Verify order updated in DB
        $order->refresh();
        $this->assertEquals('delivered', $order->status);
        $this->assertEquals('paid', $order->payment_status);
        $this->assertEquals('delivered', $order->courier_status);
        $this->assertEquals('গ্রাহক পণ্য রিসিভ করেছেন এবং টাকা পরিশোধ করেছেন', $order->courier_rider_note);

        // Verify webhook log created
        $this->assertDatabaseHas('courier_webhook_logs', [
            'tracking_code' => 'SF55566677',
            'status' => 'delivered',
        ]);
    }
}
