<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use App\Services\Sms\SmsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MramSmsGatewayTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Configure M-RAM credentials
        SiteSetting::set('sms_config', [
            'enabled' => true,
            'provider' => 'mram',
            'mram_active' => true,
            'mram_is_default' => true,
            'mram_api_key' => 'TEST_MRAM_API_KEY_123',
            'mram_sender_id' => '8809601017199',
            'mram_base_url' => 'https://msg.mram.com.bd/smsapi',
        ], 'sms');
    }

    public function test_mram_sms_sends_unicode_message_for_bangla_text(): void
    {
        Http::fake([
            'msg.mram.com.bd/smsapi' => Http::response('SMS SUBMITTED: 12345678', 200),
        ]);

        $smsService = app(SmsService::class);
        $result = $smsService->sendSms('01700000000', 'আপনার পুষ্টি কুঞ্জ অর্ডার কনফার্ম হয়েছে।', 'order_placed');

        $this->assertTrue($result['success']);
        $this->assertEquals('mram', $result['provider']);

        Http::assertSent(function ($request) {
            return $request->url() === 'https://msg.mram.com.bd/smsapi' &&
                   $request['api_key'] === 'TEST_MRAM_API_KEY_123' &&
                   $request['type'] === 'unicode' &&
                   $request['contacts'] === '8801700000000' &&
                   $request['senderid'] === '8809601017199' &&
                   $request['label'] === 'transactional';
        });
    }

    public function test_mram_sms_sends_plain_text_for_english_text(): void
    {
        Http::fake([
            'msg.mram.com.bd/smsapi' => Http::response('SMS SUBMITTED: 87654321', 200),
        ]);

        $smsService = app(SmsService::class);
        $result = $smsService->sendSms('8801812345678', 'Your OTP code is 987654', 'otp');

        $this->assertTrue($result['success']);

        Http::assertSent(function ($request) {
            return $request['type'] === 'text' &&
                   $request['contacts'] === '8801812345678';
        });
    }

    public function test_mram_sms_handles_known_error_codes(): void
    {
        Http::fake([
            'msg.mram.com.bd/smsapi' => Http::response('1007', 200),
        ]);

        $smsService = app(SmsService::class);
        $result = $smsService->sendSms('01700000000', 'Test message', 'test');

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Balance Insufficient', $result['response']);
    }

    public function test_mram_balance_retrieval(): void
    {
        Http::fake([
            'msg.mram.com.bd/miscapi/TEST_MRAM_API_KEY_123/getBalance' => Http::response('550.00', 200),
        ]);

        $smsService = app(SmsService::class);
        $balance = $smsService->getMramBalance();

        $this->assertTrue($balance['success']);
        $this->assertEquals('550.00', $balance['balance']);
    }

    public function test_admin_can_save_mram_config(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.sms.config'), [
            'config' => [
                'enabled' => true,
                'provider' => 'mram',
                'mram_active' => true,
                'mram_is_default' => true,
                'mram_api_key' => 'NEW_KEY_C40002956',
                'mram_sender_id' => '8809601017199',
                'mram_base_url' => 'https://msg.mram.com.bd/smsapi',
            ],
        ]);

        $response->assertRedirect();

        $savedConfig = SiteSetting::get('sms_config', []);
        $this->assertEquals('NEW_KEY_C40002956', $savedConfig['mram_api_key']);
        $this->assertEquals('8809601017199', $savedConfig['mram_sender_id']);
    }
}
