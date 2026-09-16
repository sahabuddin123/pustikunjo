<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Product;
use App\Models\Page;

return new class extends Migration
{
    /**
     * Run the migrations to fix broken product images and homepage blocks.
     */
    public function up(): void
    {
        // 1. Fix Product Images
        $productUpdates = [
            'beetroot-powder' => [
                'name' => 'বিটরুট পাউডার (Beetroot Powder)',
                'images' => [
                    '/images/products/beetroot-powder.webp',
                    '/images/products/beetroot-powder.jpg',
                    '/images/products/beetroot-powder-label.webp',
                ],
            ],
            'methi-mix' => [
                'name' => 'মেথি মিক্স (Methi Mix)',
                'images' => [
                    '/images/products/methi-mix.webp',
                    '/images/products/methi-mix.jpg',
                    '/images/products/methi-mix-label.webp',
                ],
            ],
            'rosella-tea' => [
                'name' => 'রোজেলা চা (Rosella Tea)',
                'images' => [
                    '/images/products/rosella-tea.webp',
                    '/images/products/rosella-tea.jpg',
                    '/images/products/rosella-tea-label.webp',
                ],
            ],
            'chia-seeds' => [
                'images' => [
                    '/images/products/chia-seeds.webp',
                    '/images/products/chia-seeds.jpg',
                ],
            ],
            'moringa-powder' => [
                'images' => [
                    '/images/products/moringa-powder.webp',
                    '/images/products/moringa-powder.jpg',
                ],
            ],
        ];

        foreach ($productUpdates as $slug => $data) {
            $product = Product::where('slug', $slug)->first();
            if ($product) {
                $needsUpdate = false;
                $currentImages = is_array($product->images) ? $product->images : [];
                
                // Check if current images contain broken upload strings or is empty
                $hasBrokenImage = empty($currentImages);
                foreach ($currentImages as $img) {
                    if (str_contains($img, 'ChatGPTImage') || str_contains($img, 'WhatsAppImage') || !str_starts_with($img, '/images/')) {
                        $hasBrokenImage = true;
                        break;
                    }
                }

                if ($hasBrokenImage || isset($data['name'])) {
                    $product->images = $data['images'];
                    if (isset($data['name']) && empty($product->name)) {
                        $product->name = $data['name'];
                    }
                    $product->save();
                }
            }
        }

        // 2. Fix Homepage CMS Blocks (Product Videos & Certifications)
        $homePages = Page::whereIn('slug', ['home', '/'])->get();
        foreach ($homePages as $page) {
            $blocks = $page->blocks ?: [];
            $modified = false;

            foreach ($blocks as &$block) {
                // Fix Product Videos block
                if (($block['type'] ?? '') === 'product_videos') {
                    $block['data']['heading'] = $block['data']['heading'] ?? 'Product Videos';
                    $block['data']['items'] = [
                        [
                            'id' => 1,
                            'poster' => '/images/product_videos/video_poster_1.jpg',
                            'videoUrl' => $block['data']['items'][0]['videoUrl'] ?? 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-in-a-park-41315-large.mp4',
                            'promoBanner' => '/images/product_videos/promo_banner_1.jpg',
                            'thumb' => '/images/product_videos/thumb_1.png',
                            'title' => 'Spray Dried Beetr...',
                            'fullTitle' => 'Spray Dried Beetroot Powder',
                            'price' => 'Tk 1,150.00',
                            'productUrl' => '/product/beetroot-powder',
                            'alt' => 'Spray Dried Beetroot Powder Video Review & Promo',
                        ],
                        [
                            'id' => 2,
                            'poster' => '/images/product_videos/video_poster_2.jpg',
                            'videoUrl' => $block['data']['items'][1]['videoUrl'] ?? 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-41712-large.mp4',
                            'promoBanner' => '/images/product_videos/promo_banner_2.jpg',
                            'thumb' => '/images/product_videos/thumb_2.png',
                            'title' => 'Pure Herbal Methi Mix',
                            'fullTitle' => 'Pure Herbal Methi Mix',
                            'price' => 'Tk 880.00',
                            'productUrl' => '/product/methi-mix',
                            'alt' => 'Pure Herbal Methi Mix Video Review & Promo',
                        ],
                        [
                            'id' => 3,
                            'poster' => '/images/product_videos/video_poster_3.jpg',
                            'videoUrl' => $block['data']['items'][2]['videoUrl'] ?? 'https://assets.mixkit.co/videos/preview/mixkit-woman-recording-a-vlog-with-her-phone-41314-large.mp4',
                            'promoBanner' => '/images/product_videos/promo_banner_3.jpg',
                            'thumb' => '/images/product_videos/thumb_3.png',
                            'title' => 'Rosella Tea...',
                            'fullTitle' => 'Organic Rosella Herbal Tea',
                            'price' => 'Tk 950.00',
                            'productUrl' => '/product/rosella-tea',
                            'alt' => 'Organic Rosella Tea Video Review & Promo',
                        ],
                    ];
                    $modified = true;
                }

                // Fix Certifications block
                if (($block['type'] ?? '') === 'certifications' || ($block['type'] ?? '') === 'award_certifications') {
                    $block['data']['heading'] = 'Award-winning & Certified';
                    $block['data']['subheading'] = 'ISO/IEC 17025:2017 আন্তর্জাতিক মান অনুযায়ী এক্রেডিটেড ওয়াফেন রিসার্চ ল্যাব রিপোর্ট';
                    $block['data']['items'] = [
                        [
                            'image' => '/images/certificates/rosella-tea-report.png',
                            'title' => 'রোজেলা চা ল্যাব টেস্ট রিপোর্ট',
                            'subtitle' => 'Waffen Research Lab (ISO/IEC 17025:2017)',
                            'alt' => 'Rosella Tea Lab Test Report',
                        ],
                        [
                            'image' => '/images/certificates/beetroot-powder-report.png',
                            'title' => 'বিটরুট পাউডার ল্যাব টেস্ট রিপোর্ট',
                            'subtitle' => 'Waffen Research Lab (ISO/IEC 17025:2017)',
                            'alt' => 'Beetroot Powder Lab Test Report',
                        ],
                        [
                            'image' => '/images/certificates/methi-mix-report.png',
                            'title' => 'মেথি মিক্স ল্যাব টেস্ট রিপোর্ট',
                            'subtitle' => 'Waffen Research Lab (ISO/IEC 17025:2017)',
                            'alt' => 'Methi Mix Powder Lab Test Report',
                        ],
                    ];
                    $modified = true;
                }
            }

            if ($modified) {
                $page->blocks = $blocks;
                $page->save();
            }
        }

        // 3. Fix Site Settings Brand Logo & Favicon
        $generalSettingsRow = \Illuminate\Support\Facades\DB::table('site_settings')->where('key', 'general_settings')->first();
        if ($generalSettingsRow) {
            $genData = json_decode($generalSettingsRow->value, true) ?: [];
            $genData['logo'] = '/images/logo-white.png';
            $genData['favicon'] = '/favicon.ico';
            \Illuminate\Support\Facades\DB::table('site_settings')->where('key', 'general_settings')->update([
                'value' => json_encode($genData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'updated_at' => now(),
            ]);
        }

        // Also ensure public/uploads/1789327595_pusti-kunjo-logo.png exists as a physical fallback
        $targetUploadLogo = public_path('uploads/1789327595_pusti-kunjo-logo.png');
        $sourceLogo = public_path('images/logo-white.png');
        if (file_exists($sourceLogo) && !file_exists($targetUploadLogo)) {
            @copy($sourceLogo, $targetUploadLogo);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Safe no-op on rollback
    }
};
