<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DynamicPagesAndCkeditorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_view_pages_index()
    {
        $admin = User::where('email', 'admin@pustikunjo.com.bd')->first();

        $response = $this->actingAs($admin)->get('/admin/pages');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Pages/Index'));
    }

    public function test_admin_can_update_page_with_rich_html_content()
    {
        $admin = User::where('email', 'admin@pustikunjo.com.bd')->first();
        $page = Page::where('slug', 'how-to-order')->first();

        $customHtml = '<h2>অর্ডার করার আধুনিক নিয়মাবলী</h2><p>১. পণ্য বাছাই ২. ঠিকানা প্রদান ৩. ক্যাশ অন ডেলিভারি</p>';

        $response = $this->actingAs($admin)->put("/admin/pages/{$page->id}", [
            'title' => 'কীভাবে অর্ডার করবেন (হালনাগাদ)',
            'slug' => 'how-to-order',
            'type' => 'builder',
            'content' => $customHtml,
            'blocks' => [],
            'meta_title' => 'নতুন অর্ডার নিয়ম | পুষ্টি কুঞ্জ',
            'meta_description' => 'সহজ পদ্ধতিতে অর্ডার করুন',
            'is_published' => true,
        ]);

        $response->assertSessionHas('success');

        $page->refresh();
        $this->assertEquals('কীভাবে অর্ডার করবেন (হালনাগাদ)', $page->title);
        $this->assertEquals($customHtml, $page->content);

        // Verify storefront renders the updated dynamic page
        $storefront = $this->get('/how-to-order');
        $storefront->assertStatus(200);
        $storefront->assertInertia(fn ($p) => $p
            ->component('Storefront/HowToOrder')
            ->where('page.title', 'কীভাবে অর্ডার করবেন (হালনাগাদ)')
            ->where('page.content', $customHtml)
        );
    }

    public function test_admin_can_update_terms_page_content()
    {
        $admin = User::where('email', 'admin@pustikunjo.com.bd')->first();
        $page = Page::where('slug', 'terms')->first();

        $termsHtml = '<h2>সংশোধিত শর্তাবলী</h2><p>১০০% খাঁটি পণ্যের নিশ্চয়তা ও রিফান্ড নীতি।</p>';

        $response = $this->actingAs($admin)->put("/admin/pages/{$page->id}", [
            'title' => 'শর্তাবলী ও পলিসিসমূহ (নতুন)',
            'slug' => 'terms',
            'type' => 'builder',
            'content' => $termsHtml,
            'blocks' => [],
            'meta_title' => 'শর্তাবলী | পুষ্টি কুঞ্জ',
            'is_published' => true,
        ]);

        $response->assertSessionHas('success');

        $page->refresh();
        $this->assertEquals($termsHtml, $page->content);

        $storefront = $this->get('/terms');
        $storefront->assertStatus(200);
        $storefront->assertInertia(fn ($p) => $p
            ->component('Storefront/Terms')
            ->where('page.title', 'শর্তাবলী ও পলিসিসমূহ (নতুন)')
            ->where('page.content', $termsHtml)
        );
    }

    public function test_custom_page_renders_with_rich_html_content()
    {
        $admin = User::where('email', 'admin@pustikunjo.com.bd')->first();

        $richHtml = '<h2>আমাদের কৃষক পরিবার</h2><p>আমরা প্রত্যন্ত অঞ্চল থেকে সরাসরি কৃষকের কাছ থেকে পণ্য সংগ্রহ করি।</p>';

        // Create new dynamic page
        $response = $this->actingAs($admin)->post('/admin/pages', [
            'title' => 'কৃষক পরিবার',
            'slug' => 'our-farmers',
            'type' => 'builder',
            'content' => $richHtml,
            'blocks' => [],
            'meta_title' => 'কৃষক পরিবার | পুষ্টি কুঞ্জ',
            'meta_description' => 'আমাদের সংগৃহীত পণ্যের উৎস',
            'is_published' => true,
        ]);

        $createdPage = Page::where('slug', 'our-farmers')->first();
        $this->assertNotNull($createdPage);
        $this->assertEquals($richHtml, $createdPage->content);
        $response->assertRedirect(route('admin.pages.edit', $createdPage->id));

        // Storefront loads custom page with BuilderPage component
        $storefront = $this->get('/our-farmers');
        $storefront->assertStatus(200);
        $storefront->assertInertia(fn ($p) => $p
            ->component('Storefront/BuilderPage')
            ->where('page.title', 'কৃষক পরিবার')
            ->where('page.content', $richHtml)
        );
    }
}
