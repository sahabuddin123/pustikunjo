<?php

namespace Tests\Feature;

use App\Models\NotificationTemplate;
use App\Models\Order;
use App\Models\User;
use App\Services\Notification\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class DynamicNotificationTemplateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        NotificationTemplate::seedDefaults();
    }

    public function test_admin_can_view_templates_hub(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get(route('admin.templates.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Templates/Index')
            ->has('smsTemplates')
            ->has('emailTemplates')
            ->has('sampleData')
            ->has('defaultTags')
        );
    }

    public function test_admin_can_update_template(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $template = NotificationTemplate::where('channel', 'sms')->where('event_key', 'order_placed')->firstOrFail();

        $response = $this->actingAs($admin)->put(route('admin.templates.update', $template->id), [
            'body' => 'ধন্যবাদ {{customer_name}}, আপনার অর্ডার {{order_number}} পাওয়া গেছে। মোট: {{grand_total}}।',
            'is_active' => true,
            'send_to_admin' => true,
            'admin_recipient' => '01711223344',
        ]);

        $response->assertRedirect();

        $template->refresh();
        $this->assertEquals('ধন্যবাদ {{customer_name}}, আপনার অর্ডার {{order_number}} পাওয়া গেছে। মোট: {{grand_total}}।', $template->body);
        $this->assertTrue($template->send_to_admin);
        $this->assertEquals('01711223344', $template->admin_recipient);
    }

    public function test_admin_can_reset_template_to_default(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $template = NotificationTemplate::where('channel', 'sms')->where('event_key', 'order_placed')->firstOrFail();

        // Modify template
        $template->update(['body' => 'Modified custom text']);

        // Reset
        $response = $this->actingAs($admin)->post(route('admin.templates.reset', $template->id));
        $response->assertRedirect();

        $template->refresh();
        $this->assertStringContainsString('পুষ্টি কুঞ্জে আপনার অর্ডার', $template->body);
    }

    public function test_notification_service_replaces_tags_and_triggers_notifications(): void
    {
        Http::fake([
            'msg.mram.com.bd/*' => Http::response('SMS SUBMITTED: 99887766', 200),
        ]);
        Mail::fake();

        $order = Order::create([
            'order_number' => 'PK-99001',
            'customer_name' => 'মাহিদুল ইসলাম',
            'customer_phone' => '01712345678',
            'customer_email' => 'mahidul@example.com',
            'shipping_address' => 'মিরপুর, ঢাকা',
            'subtotal' => 1200,
            'shipping_cost' => 60,
            'grand_total' => 1260,
            'payment_method' => 'cod',
            'status' => 'pending',
        ]);

        $service = app(NotificationService::class);
        $results = $service->triggerOrderEvent('order_placed', $order);

        $this->assertNotNull($results['sms']);
        $this->assertNotNull($results['email']);
        $this->assertTrue($results['sms']['success']);
        $this->assertTrue($results['email']['success']);

        // Assert SMS HTTP sent with replaced values
        Http::assertSent(function ($request) {
            return str_contains($request['msg'], 'মাহিদুল ইসলাম') &&
                   str_contains($request['msg'], 'PK-99001') &&
                   str_contains($request['msg'], '1,260');
        });
    }

    public function test_admin_can_send_test_notification(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        Http::fake([
            'msg.mram.com.bd/*' => Http::response('TEST_OK', 200),
        ]);

        $response = $this->actingAs($admin)->post(route('admin.templates.test-send'), [
            'channel' => 'sms',
            'event_key' => 'order_placed',
            'recipient' => '01899887766',
            'body' => 'হ্যালো {{customer_name}}, এটি একটি টেস্ট মেসেজ।',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
}
