<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomePageRedesignTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }
    public function test_homepage_serves_status_200_with_exact_blocks()
    {
        $response = $this->get('/');
        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Storefront/Home')
            ->has('products', 3)
            ->has('categories', 2)
            ->where('products.0.slug', 'beetroot-powder')
            ->where('products.1.slug', 'methimix')
            ->where('products.2.slug', 'chia-seeds')
            ->has('page.blocks', 7)
            ->where('page.blocks.0.type', 'hero')
            ->where('page.blocks.1.type', 'product_grid')
            ->where('page.blocks.2.type', 'product_videos')
            ->where('page.blocks.3.type', 'product_grid')
            ->where('page.blocks.4.type', 'certifications')
            ->where('page.blocks.5.type', 'why_pustikunjo')
            ->where('page.blocks.6.type', 'consultation_cta')
        );
    }

    public function test_only_three_products_exist_in_database()
    {
        $products = Product::where('is_active', true)->get();
        $this->assertCount(3, $products);

        $expectedSkus = ['PK-BT-001', 'PK-MM-002', 'PK-CS-003'];
        $actualSkus = $products->pluck('sku')->toArray();
        sort($expectedSkus);
        sort($actualSkus);
        $this->assertEquals($expectedSkus, $actualSkus);
    }

    public function test_payment_methods_restricted_to_cod_and_bkash()
    {
        $response = $this->get('/');
        $response->assertInertia(fn ($page) => $page
            ->where('footer.payment_icons', ['bkash', 'cod'])
        );
    }
}
