<?php

namespace Tests\Feature;

use App\Models\Complaint;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComplaintModuleTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
        $this->admin = User::firstOrCreate(
            ['email' => 'admin_complaint_test@pustikunjo.com'],
            ['name' => 'Super Admin', 'password' => bcrypt('secret123'), 'role' => 'admin']
        );
    }

    public function test_complaint_page_loads_successfully()
    {
        $response = $this->get('/complaint');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Storefront/Complaint')
            ->has('initialPhone')
            ->has('initialName')
        );
    }

    public function test_complaint_submission_validation()
    {
        $response = $this->post('/complaint', []);
        $response->assertSessionHasErrors(['phone', 'issue_details']);
    }

    public function test_customer_can_submit_complaint()
    {
        $response = $this->post('/complaint', [
            'phone' => '01711223344',
            'name' => 'Md. Rahman',
            'order_number' => 'PK-260908-9999',
            'issue_details' => 'পণ্যটি ভাঙা অবস্থায় পেয়েছি, অনুগ্রহ করে পরিবর্তন করে দিন।',
            'photos' => ['https://pustikunjo.com/demo.jpg'],
        ]);

        $complaint = Complaint::where('phone', '01711223344')->first();
        $this->assertNotNull($complaint);
        $this->assertStringStartsWith('PK-CMP-', $complaint->ticket_number);
        $this->assertEquals('pending', $complaint->status);
        $this->assertEquals('PK-260908-9999', $complaint->order_number);
        $this->assertContains('https://pustikunjo.com/demo.jpg', $complaint->photos);

        $response->assertRedirect('/complaint?ticket=' . $complaint->ticket_number);
        $response->assertSessionHas('success');
    }

    public function test_complaint_tracking_by_ticket()
    {
        $complaint = Complaint::create([
            'phone' => '01899887766',
            'name' => 'Fatima Begum',
            'issue_details' => 'ডেলিভারিতে বিলম্ব হচ্ছে, আপডেট দরকার।',
            'status' => 'pending',
        ]);

        $response = $this->get('/complaint?ticket=' . $complaint->ticket_number);
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Storefront/Complaint')
            ->where('trackedComplaint.ticket_number', $complaint->ticket_number)
            ->where('trackedComplaint.phone', '01899887766')
        );
    }

    public function test_admin_can_view_and_update_complaint()
    {
        $complaint = Complaint::create([
            'phone' => '01912345678',
            'name' => 'Kabir Hossain',
            'issue_details' => 'প্যাকেজিং ছেঁড়া ছিল।',
            'status' => 'pending',
        ]);

        // Admin complaints index
        $response = $this->actingAs($this->admin)->get('/admin/complaints');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Complaints/Index')
            ->has('complaints')
            ->has('stats')
        );

        // Update status to resolved
        $updateResponse = $this->actingAs($this->admin)->post("/admin/complaints/{$complaint->id}/status", [
            'status' => 'resolved',
            'admin_notes' => 'গ্রাহকের সাথে কথা বলে নতুন পণ্য পাঠানো হয়েছে।',
            'notify_customer' => false,
        ]);

        $updateResponse->assertSessionHas('success');
        $complaint->refresh();
        $this->assertEquals('resolved', $complaint->status);
        $this->assertNotNull($complaint->resolved_at);
        $this->assertEquals('গ্রাহকের সাথে কথা বলে নতুন পণ্য পাঠানো হয়েছে।', $complaint->admin_notes);
    }
}
