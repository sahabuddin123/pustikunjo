<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CustomerModuleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }
    public function test_customer_can_register_and_is_authenticated(): void
    {
        $phone = '01711' . rand(100000, 999999);
        $response = $this->post('/register', [
            'name' => 'তানভীর আহমেদ',
            'phone' => $phone,
            'email' => 'tanvir_' . rand(100, 999) . '@test.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'address' => 'মিরপুর ১০, ঢাকা',
        ]);

        $response->assertRedirect(route('customer.account'));
        $this->assertAuthenticated();

        $user = User::where('phone', $phone)->first();
        $this->assertNotNull($user);
        $this->assertEquals('customer', $user->role);
        $this->assertEquals('তানভীর আহমেদ', $user->name);
    }

    public function test_customer_can_login_with_phone_and_password(): void
    {
        $phone = '01811' . rand(100000, 999999);
        $user = User::create([
            'name' => 'রাকিব হাসান',
            'phone' => $phone,
            'email' => 'rakib_' . rand(100, 999) . '@test.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        $response = $this->post('/login', [
            'phone_or_email' => $phone,
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('customer.account'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_customer_dashboard_renders_with_orders_and_stats(): void
    {
        $phone = '01911' . rand(100000, 999999);
        $user = User::create([
            'name' => 'সাদিয়া আফরিন',
            'phone' => $phone,
            'email' => 'sadia_' . rand(100, 999) . '@test.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        // Create an order for this customer
        Order::create([
            'order_number' => 'PK-' . rand(10000, 99999),
            'user_id' => $user->id,
            'customer_name' => $user->name,
            'customer_phone' => $phone,
            'shipping_address' => 'বনানী, ঢাকা',
            'status' => 'pending',
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'subtotal' => 500,
            'shipping_cost' => 60,
            'discount' => 0,
            'total_amount' => 560,
        ]);

        $response = $this->actingAs($user)->get('/my-account');
        $response->assertStatus(200);
    }

    public function test_customer_can_update_profile(): void
    {
        $phone = '01611' . rand(100000, 999999);
        $user = User::create([
            'name' => 'পুরনো নাম',
            'phone' => $phone,
            'email' => 'old_' . rand(100, 999) . '@test.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        $response = $this->actingAs($user)->post('/customer/profile', [
            'name' => 'নতুন নাম',
            'phone' => $phone,
            'email' => $user->email,
            'address' => 'উত্তরা, ঢাকা',
        ]);

        $response->assertSessionHas('success');
        $user->refresh();
        $this->assertEquals('নতুন নাম', $user->name);
        $this->assertEquals('উত্তরা, ঢাকা', $user->address);
    }

    public function test_customer_can_update_password(): void
    {
        $phone = '01511' . rand(100000, 999999);
        $user = User::create([
            'name' => 'টেস্ট ইউজার',
            'phone' => $phone,
            'email' => 'test_' . rand(100, 999) . '@test.com',
            'password' => Hash::make('old_pass_123'),
            'role' => 'customer',
        ]);

        $response = $this->actingAs($user)->post('/customer/password', [
            'current_password' => 'old_pass_123',
            'password' => 'new_pass_456',
            'password_confirmation' => 'new_pass_456',
        ]);

        $response->assertSessionHas('success');
        $user->refresh();
        $this->assertTrue(Hash::check('new_pass_456', $user->password));
    }

    public function test_customer_can_logout(): void
    {
        $user = User::create([
            'name' => 'লগআউট ইউজার',
            'phone' => '01311' . rand(100000, 999999),
            'email' => 'logout_' . rand(100, 999) . '@test.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        $response = $this->actingAs($user)->post('/customer/logout');
        $response->assertRedirect(route('home'));
        $this->assertGuest();
    }

    public function test_forgot_password_sends_otp_and_resets_password(): void
    {
        $phone = '01722' . rand(100000, 999999);
        $user = User::create([
            'name' => 'ফরগট টেস্ট',
            'phone' => $phone,
            'email' => 'forgot_' . rand(100, 999) . '@test.com',
            'password' => Hash::make('old_pass_123'),
            'role' => 'customer',
        ]);

        // Step 1: Request OTP
        $sendResponse = $this->post('/forgot-password/send-otp', [
            'phone_or_email' => $phone,
        ]);
        $sendResponse->assertRedirect(route('customer.forgot-password'));
        $sendResponse->assertSessionHas('pwd_reset_otp');

        $otp = session('pwd_reset_otp');
        $this->assertNotEmpty($otp);

        // Step 2: Verify OTP and reset password
        $resetResponse = $this->post('/forgot-password/reset', [
            'otp' => $otp,
            'password' => 'brand_new_secret',
            'password_confirmation' => 'brand_new_secret',
        ]);

        $resetResponse->assertRedirect(route('customer.account'));
        $this->assertAuthenticatedAs($user);

        $user->refresh();
        $this->assertTrue(Hash::check('brand_new_secret', $user->password));
    }

    public function test_forgot_phone_recovers_account_by_email(): void
    {
        $phone = '01833' . rand(100000, 999999);
        $email = 'recover_' . rand(100, 999) . '@test.com';
        $user = User::create([
            'name' => 'রিকভারি ইউজার',
            'phone' => $phone,
            'email' => $email,
            'password' => Hash::make('secret123'),
            'role' => 'customer',
        ]);

        $response = $this->post('/forgot-phone/search', [
            'search_type' => 'email',
            'email' => $email,
        ]);

        $response->assertSessionHas('recovered_account');
        $recovered = session('recovered_account');
        $this->assertEquals('রিকভারি ইউজার', $recovered['name']);
        $this->assertStringContainsString('***', $recovered['masked_phone']);
    }

    public function test_forgot_phone_recovers_account_by_order_number(): void
    {
        $orderNumber = 'PK-REC-' . rand(1000, 9999);
        $order = Order::create([
            'order_number' => $orderNumber,
            'customer_name' => 'অর্ডার রিকভারি',
            'customer_phone' => '01999123456',
            'shipping_address' => 'ধানমন্ডি, ঢাকা',
            'status' => 'confirmed',
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'subtotal' => 600,
            'shipping_cost' => 60,
            'discount' => 0,
            'total_amount' => 660,
        ]);

        $response = $this->post('/forgot-phone/search', [
            'search_type' => 'order',
            'order_number' => $orderNumber,
        ]);

        $response->assertSessionHas('recovered_account');
        $recovered = session('recovered_account');
        $this->assertEquals('অর্ডার রিকভারি', $recovered['name']);
        $this->assertEquals($orderNumber, $recovered['order_number']);
        $this->assertStringContainsString('***', $recovered['masked_phone']);
    }

    public function test_customer_can_view_consultation_page_and_submit_request(): void
    {
        $viewResponse = $this->get('/consultation');
        $viewResponse->assertStatus(200);

        $submitResponse = $this->post('/consultation/submit', [
            'name' => 'মোজাম্মেল হক',
            'phone' => '01712345678',
            'category' => 'পুরুষদের স্বাস্থ্য ও ভাইটালিটি',
            'age' => 32,
            'gender' => 'male',
            'height' => '5 ft 8 in',
            'weight' => '72 kg',
            'problem_details' => 'বেশ কিছুদিন ধরে দুর্বলতা ও ক্লান্তিভাব অনুভব করছি। সঠিক ডায়েট চাই।',
            'contact_method' => 'whatsapp',
        ]);

        $submitResponse->assertSessionHas('success');
        $this->assertDatabaseHas('consultation_requests', [
            'name' => 'মোজাম্মেল হক',
            'phone' => '01712345678',
            'category' => 'পুরুষদের স্বাস্থ্য ও ভাইটালিটি',
            'status' => 'pending',
        ]);
    }

    public function test_customer_can_view_dietary_guide_page(): void
    {
        $response = $this->get('/nutrition-guide');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Storefront/DietaryGuide'));

        $aliasResponse = $this->get('/dietary-guide');
        $aliasResponse->assertStatus(200);
    }

    public function test_customer_can_view_how_to_order_page(): void
    {
        $response = $this->get('/how-to-order');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Storefront/HowToOrder')
            ->has('contact')
        );

        $aliasResponse = $this->get('/kivabe-order-korben');
        $aliasResponse->assertStatus(200);
    }

    public function test_customer_can_view_terms_page(): void
    {
        $response = $this->get('/terms');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Storefront/Terms')
            ->has('contact')
        );

        $aliasResponse = $this->get('/terms-and-conditions');
        $aliasResponse->assertStatus(200);
    }
}
