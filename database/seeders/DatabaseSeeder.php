<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Page;
use App\Models\Product;
use App\Models\Review;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        User::firstOrCreate(
            ['email' => 'admin@pustikunjo.com.bd'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Call the dedicated 3 Products & Banners Seeder
        $this->call(UpdateThreeProductsSeeder::class);

        // 2. Categories (ONLY the genuine categories for Pusti Kunjo's 3 products)
        $catPowders = Category::updateOrCreate(['slug' => 'organic-powders'], [
            'name' => 'ভেষজ ও পুষ্টিকর পাউডার',
            'image' => 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
            'description' => '১০০% প্রাকৃতিক ও নির্ভেজাল পুষ্টিকর ভেষজ পাউডার সমূহ।',
            'is_featured' => true,
            'sort_order' => 1,
        ]);

        $catSuperfood = Category::updateOrCreate(['slug' => 'super-food'], [
            'name' => 'সুপার ফুড ও বীজ',
            'image' => 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=500&auto=format&fit=crop&q=80',
            'description' => 'উচ্চ পুষ্টিগুণসম্পন্ন প্রিমিয়াম অর্গানিক চিয়া সিড ও স্বাস্থ্যকর সুপারফুড।',
            'is_featured' => true,
            'sort_order' => 2,
        ]);

        // Clean up any extra categories if present
        Category::whereNotIn('slug', ['organic-powders', 'super-food'])->delete();

        // 3. Products (Strictly the 3 real products)
        $seedProduct = function (array $data): Product {
            return Product::updateOrCreate(['slug' => $data['slug']], $data);
        };

        // Product 1: Beetroot Powder (PK-BT-001)
        $p1 = $seedProduct([
            'name' => 'বিটরুট পাউডার (Beetroot Powder)',
            'slug' => 'beetroot-powder',
            'sku' => 'PK-BT-001',
            'price' => 450.00,
            'sale_price' => 390.00,
            'stock' => 85,
            'weight' => '২০০ গ্রাম',
            'variants' => [
                ['name' => '২০০ গ্রাম', 'price' => 450.00, 'sale_price' => 390.00, 'stock' => 50],
                ['name' => '৫০০ গ্রাম', 'price' => 950.00, 'sale_price' => 850.00, 'stock' => 35],
            ],
            'category_id' => $catPowders->id,
            'badge' => 'বেস্ট সেলার',
            'short_description' => '১০০% খাঁটি ও তাজা বিটরুট থেকে প্রস্তুতকৃত প্রিমিয়াম পাউডার। রক্তস্বল্পতা দূর করতে ও প্রাকৃতিক উজ্জ্বলতার জন্য অতুলনীয়।',
            'description' => 'পুষ্টি কুঞ্জের বিটরুট পাউডার উচ্চমানের তাজা বিটরুট ধুয়ে, শুকিয়ে এবং হাইজিনিক উপায়ে গুঁড়ো করে তৈরি করা হয়। এতে কোনো কৃত্রিম রং বা প্রিজারভেটিভ নেই। এটি আয়রন, নাইট্রেট এবং ভিটামিন সি এর সমৃদ্ধ উৎস যা রক্ত সঞ্চালন বাড়ায়, ত্বকে লাবণ্য আনে এবং শরীরের ক্লান্তি দূর করে।',
            'images' => [
                'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=900&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=900&auto=format&fit=crop&q=85'
            ],
            'benefits' => [
                ['title' => 'রক্তস্বল্পতা দূর করে', 'text' => 'উচ্চমাত্রার আয়রন ও ফোলেট রক্তের হিমোগ্লোবিন দ্রুত বৃদ্ধিতে সাহায্য করে।', 'icon' => 'HeartPulse'],
                ['title' => 'ত্বকের প্রাকৃতিক উজ্জ্বলতা', 'text' => 'প্রাকৃতিক অ্যান্টিঅক্সিডেন্ট ত্বককে ভেতর থেকে প্রাণবন্ত ও উজ্জ্বল করে।', 'icon' => 'Sparkles'],
                ['title' => 'স্ট্যামিনা ও রক্তচাপ নিয়ন্ত্রণ', 'text' => 'নাইট্রেট উপাদান রক্তনালী প্রসারিত করে রক্তচাপ স্বাভাবিক রাখতে সহায়তা করে।', 'icon' => 'Activity'],
            ],
            'usage_instructions' => "১. প্রতিদিন সকালে বা সন্ধ্যায় ১ চা চামচ (৫ গ্রাম) বিটরুট পাউডার নিন।\n২. এক গ্লাস কুসুম গরম পানি, দুধ, জুস বা স্মুদির সাথে ভালো করে মিশিয়ে নিন।\n৩. নিয়মিত সেবনে সর্বোচ্চ ফলাফল পাওয়া যায়।",
            'is_featured' => true,
            'is_active' => true,
            'meta_title' => 'খাঁটি বিটরুট পাউডার — পুষ্টি কুঞ্জ',
            'meta_description' => '১০০% প্রাকৃতিক ও নির্ভেজাল বিটরুট পাউডার। ঘরে বসেই ক্যাশ অন ডেলিভারিতে অর্ডার করুন।',
        ]);

        // Product 2: Methimix (PK-MM-002)
        $p2 = $seedProduct([
            'name' => 'মেথিমিক্স (Methimix)',
            'slug' => 'methimix',
            'sku' => 'PK-MM-002',
            'price' => 380.00,
            'sale_price' => 330.00,
            'stock' => 60,
            'weight' => '২৫০ গ্রাম',
            'variants' => [
                ['name' => '২৫০ গ্রাম', 'price' => 380.00, 'sale_price' => 330.00, 'stock' => 40],
                ['name' => '৫০০ গ্রাম', 'price' => 720.00, 'sale_price' => 620.00, 'stock' => 20],
            ],
            'category_id' => $catPowders->id,
            'badge' => 'জনপ্রিয়',
            'short_description' => 'মেথি, মৌরি ও প্রাকৃতিক ভেষজের সুষম মিশ্রণ। ডায়াবেটিস নিয়ন্ত্রণ ও গ্যাস্ট্রিকের সমস্যায় জাদুকরী সমাধান।',
            'description' => 'পুষ্টি কুঞ্জ মেথিমিক্স হলো বাছাইকৃত মেথি দানা ও বিশেষ ভেষজের প্রাকৃতিক ফর্মুলা। এটি হজম প্রক্রিয়াকে ত্বরান্বিত করে, রক্তে চিনির মাত্রা নিয়ন্ত্রণ করতে সাহায্য করে এবং শরীরের বিষাক্ত টক্সিন দূর করে।',
            'images' => [
                'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=900&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=900&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=900&auto=format&fit=crop&q=85'
            ],
            'benefits' => [
                ['title' => 'ডায়াবেটিস নিয়ন্ত্রণ', 'text' => 'রক্তের গ্লুকোজ লেভেল নিয়ন্ত্রণে রাখতে অত্যন্ত সহায়ক ভূমিকা পালন করে।', 'icon' => 'ShieldCheck'],
                ['title' => 'হজমশক্তি বৃদ্ধি ও গ্যাস্ট্রিক মুক্তি', 'text' => 'পেটের ফোলাভাব ও অ্যাসিডিটি দূর করে হজম ক্ষমতা বাড়ায়।', 'icon' => 'CheckCircle2'],
                ['title' => 'ওজন ও অতিরিক্ত চর্বি হ্রাস', 'text' => 'প্রচুর ফাইবার থাকায় ক্ষুধা নিয়ন্ত্রণ করে মেদ কমাতে সাহায্য করে।', 'icon' => 'Scale'],
            ],
            'usage_instructions' => "১. রাতে ১ চামচ মেথিমিক্স এক গ্লাস পানিতে ভিজিয়ে রাখুন।\n২. সকালে খালি পেটে পানিটুকু ছেঁকে বা মিশ্রণসহ পান করুন।",
            'is_featured' => true,
            'is_active' => true,
            'meta_title' => 'খাঁটি মেথিমিক্স — ডায়াবেটিস ও গ্যাস্ট্রিক নিয়ন্ত্রণে পুষ্টি কুঞ্জ',
            'meta_description' => 'ডায়াবেটিস ও হজমের সমস্যার প্রাকৃতিক সমাধান পুষ্টি কুঞ্জ মেথিমিক্স।',
        ]);

        // Product 3: Organic Chia Seeds (PK-CS-003)
        $p3 = $seedProduct([
            'name' => 'প্রিমিয়াম চিয়া সিড (Organic Chia Seeds)',
            'slug' => 'chia-seeds',
            'sku' => 'PK-CS-003',
            'price' => 550.00,
            'sale_price' => 490.00,
            'stock' => 120,
            'weight' => '২৫০ গ্রাম',
            'variants' => [
                ['name' => '২৫০ গ্রাম', 'price' => 550.00, 'sale_price' => 490.00, 'stock' => 80],
                ['name' => '৫০০ গ্রাম', 'price' => 1050.00, 'sale_price' => 920.00, 'stock' => 40],
            ],
            'category_id' => $catSuperfood->id,
            'badge' => 'নতুন স্টক',
            'short_description' => 'আমদানি করা শতভাগ খাঁটি ও পরিষ্কার অর্গানিক চিয়া সিড। ওমেগা-৩ ফ্যাটি এসিড এবং প্রোটিনে ভরপুর।',
            'description' => 'চিয়া সিড একটি প্রাকৃতিক সুপারফুড। এতে রয়েছে প্রচুর পরিমাণ ওমেগা-৩, ক্যালসিয়াম, প্রোটিন, ম্যাগনেসিয়াম ও ফাইবার। যারা ওজন নিয়ন্ত্রণ করতে চান এবং হার্ট সুস্থ রাখতে চান তাদের জন্য এটি অত্যন্ত উপকারী।',
            'images' => [
                'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=900&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=900&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=900&auto=format&fit=crop&q=85'
            ],
            'benefits' => [
                ['title' => 'ওমেগা-৩ ফ্যাটি এসিড', 'text' => 'হার্ট ভালো রাখে এবং রক্তে খারাপ কোলেস্টেরল কমায়।', 'icon' => 'Heart'],
                ['title' => 'ওজন নিয়ন্ত্রণে কার্যকর', 'text' => 'প্রচুর ডায়েটারি ফাইবার দীর্ঘক্ষণ পেট ভরা রেখে ক্ষুধা কমায়।', 'icon' => 'Smile'],
                ['title' => 'হাড় ও পেশীর শক্তি', 'text' => 'ক্যালসিয়াম ও ম্যাগনেসিয়াম হাড় মজবুত ও শক্তিশালী করে।', 'icon' => 'Zap'],
            ],
            'usage_instructions' => "১. ১ চামচ চিয়া সিড ১৫-২০ মিনিট পানিতে ভিজিয়ে রাখুন।\n২. এরপর লেবুর পানি, ডাবের পানি, জুস বা টক দইয়ের সাথে মিশিয়ে খেয়ে নিন।",
            'is_featured' => true,
            'is_active' => true,
            'meta_title' => 'প্রিমিয়াম অর্গানিক চিয়া সিড — পুষ্টি কুঞ্জ',
            'meta_description' => 'খাঁটি ও ফ্রেশ সুপারফুড চিয়া সিড কিনুন পুষ্টি কুঞ্জ থেকে।',
        ]);

        // Clean up any extra products if present
        Product::whereNotIn('slug', ['beetroot-powder', 'methimix', 'chia-seeds'])->delete();

        // Reviews for real products
        Review::firstOrCreate(
            ['product_id' => $p1->id, 'customer_phone' => '01811223344'],
            [
                'customer_name' => 'ফারহানা ইসলাম',
                'rating' => 5,
                'comment' => 'বিটরুট পাউডার খুব ভালো এবং খাঁটি। দ্রুত ডেলিভারির জন্য ধন্যবাদ পুষ্টি কুঞ্জকে!',
                'is_approved' => true,
            ]
        );

        Review::firstOrCreate(
            ['product_id' => $p2->id, 'customer_phone' => '01711223344'],
            [
                'customer_name' => 'তানভীর আহমেদ',
                'rating' => 5,
                'comment' => 'মেথিমিক্স খেয়ে হজম ও পেটের সমস্যায় অনেক উপকার পেয়েছি। প্যাকেজিংও দারুণ।',
                'is_approved' => true,
            ]
        );

        Review::firstOrCreate(
            ['product_id' => $p3->id, 'customer_phone' => '01911223344'],
            [
                'customer_name' => 'কামরুল হাসান',
                'rating' => 5,
                'comment' => 'চিয়া সিডগুলো অত্যন্ত ফ্রেশ ও পরিষ্কার। ক্যাশ অন ডেলিভারিতে হাতে পেয়ে যাচাই করে নিয়েছি।',
                'is_approved' => true,
            ]
        );

        // 4. Coupons
        Coupon::firstOrCreate(
            ['code' => 'PUSTI50'],
            [
                'type' => 'fixed',
                'value' => 50.00,
                'min_order_amount' => 500.00,
                'usage_limit' => 500,
                'is_active' => true,
            ]
        );

        Coupon::firstOrCreate(
            ['code' => 'HEALTH10'],
            [
                'type' => 'percent',
                'value' => 10.00,
                'min_order_amount' => 800.00,
                'usage_limit' => 1000,
                'is_active' => true,
            ]
        );

        // 5. Default Home Page with exact visual sequence from home_dektop.jpg
        $homeBlocks = [
            // 2. Large Hero / Banner Carousel
            [
                'id' => 'b_hero_1',
                'type' => 'hero',
                'is_hidden' => false,
                'data' => [
                    'slides' => [
                        [
                            'image' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&auto=format&fit=crop&q=85',
                            'url' => '/shop',
                            'alt' => 'পুষ্টি কুঞ্জ — ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য',
                        ],
                        [
                            'image' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&auto=format&fit=crop&q=85',
                            'url' => '/product/chia-seeds',
                            'alt' => 'প্রিমিয়াম অর্গানিক চিয়া সিড',
                        ],
                        [
                            'image' => 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1920&auto=format&fit=crop&q=85',
                            'url' => '/product/beetroot-powder',
                            'alt' => 'খাঁটি বিটরুট পাউডার',
                        ],
                    ]
                ]
            ],
            // 3. Best Seller Section
            [
                'id' => 'b_best_sellers_2',
                'type' => 'product_grid',
                'is_hidden' => false,
                'data' => [
                    'heading' => 'BEST SELLER',
                    'limit' => 3,
                    'columns' => 3,
                    'view_all_url' => '/shop',
                    'show_bottom_button' => false,
                ]
            ],
            // 4. Product Videos & Promo Cards
            [
                'id' => 'b_product_videos_3',
                'type' => 'product_videos',
                'is_hidden' => false,
                'data' => [
                    'heading' => 'Product Videos',
                    'items' => [
                        [
                            'id' => 1,
                            'poster' => '/images/product_videos/video_poster_1.jpg',
                            'videoUrl' => 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-in-a-park-41315-large.mp4',
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
                            'videoUrl' => 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-41712-large.mp4',
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
                            'videoUrl' => 'https://assets.mixkit.co/videos/preview/mixkit-woman-recording-a-vlog-with-her-phone-41314-large.mp4',
                            'promoBanner' => '/images/product_videos/promo_banner_3.jpg',
                            'thumb' => '/images/product_videos/thumb_3.png',
                            'title' => 'Rosella Tea...',
                            'fullTitle' => 'Organic Rosella Herbal Tea',
                            'price' => 'Tk 950.00',
                            'productUrl' => '/product/rosella-tea',
                            'alt' => 'Organic Rosella Tea Video Review & Promo',
                        ],
                    ],
                ]
            ],
            // 5. All Products Section
            [
                'id' => 'b_all_products_4',
                'type' => 'product_grid',
                'is_hidden' => false,
                'data' => [
                    'heading' => 'ALL PRODUCTS',
                    'limit' => 3,
                    'columns' => 3,
                    'view_all_url' => '/shop',
                    'show_bottom_button' => true,
                ]
            ],
            // 6. Award / Certification Section (hidden if no real assets)
            [
                'id' => 'b_certifications_5',
                'type' => 'certifications',
                'is_hidden' => false,
                'data' => [
                    'heading' => 'Award-winning & Certified',
                    'items' => [],
                ]
            ],
            // 7. Why Pusti Kunjo
            [
                'id' => 'b_why_pustikunjo_6',
                'type' => 'why_pustikunjo',
                'is_hidden' => false,
                'data' => [
                    'heading' => 'Why PUSTI KUNJO',
                    'subheading' => 'খাঁটি ও প্রাকৃতিক সুস্থতার বিশ্বস্ত অঙ্গীকার',
                    'steps' => [
                        [
                            'number' => '01',
                            'title' => 'শতভাগ খাঁটি ও প্রাকৃতিক',
                            'text' => 'কোনো কৃত্রিম রং, রাসায়নিক বা ক্ষতিকর প্রিজারভেটিভ ছাড়া নিজস্ব স্বাস্থ্যকর পরিবেশে প্রস্তুত।'
                        ],
                        [
                            'number' => '02',
                            'title' => 'উন্নত কাঁচামাল সংগ্রহ',
                            'text' => 'স্থানীয় বিশ্বস্ত কৃষক ও প্রাকৃতিক বনজ উৎস থেকে সরাসরি সর্বোচ্চ মানের নির্ভেজাল কাঁচামাল বাছাই।'
                        ],
                        [
                            'number' => '03',
                            'title' => 'গ্রাহকের সম্পূর্ণ আস্থা',
                            'text' => 'সারা দেশে ঘরে বসে পণ্য হাতে পেয়ে দেখে ও গুণমান যাচাই করে মূল্য পরিশোধের নিশ্চয়তা।'
                        ]
                    ]
                ]
            ],
            // 8. Hakim / Consultation CTA
            [
                'id' => 'b_consultation_7',
                'type' => 'consultation_cta',
                'is_hidden' => false,
                'data' => [
                    'enabled' => true,
                    'label' => 'Hakim Consultation',
                    'heading' => 'আপনার প্রয়োজন অনুযায়ী বিশেষজ্ঞ পরামর্শ নিন',
                    'description' => 'সঠিক খাদ্যাভ্যাস ও ভেষজ উপাদান সম্পর্কিত যে কোনো জিজ্ঞাসায় আমাদের পরামর্শ সেবা গ্রহণ করুন।',
                    'cta_label' => 'পরামর্শ নিন',
                    'cta_url' => '/contact',
                ]
            ],
        ];

        Page::updateOrCreate(['slug' => 'home'], [
            'title' => 'হোম (Home)',
            'type' => 'builder',
            'blocks' => $homeBlocks,
            'meta_title' => 'পুষ্টি কুঞ্জ — Purity Begins here | খাঁটি ও প্রাকৃতিক স্বাস্থ্য পণ্য',
            'meta_description' => 'পুষ্টি কুঞ্জ বাংলাদেশের শীর্ষস্থানীয় অর্গানিক ও ভেষজ খাদ্য ব্র্যান্ড। বিটরুট পাউডার, মেথিমিক্স, চিয়া সিড ও খাঁটি পণ্য সরাসরি হোম ডেলিভারি।',
            'is_published' => true,
        ]);

        // Standard Storefront Pages with Rich HTML for CKEditor
        Page::updateOrCreate(['slug' => 'about-us'], [
            'title' => 'আমাদের সম্পর্কে (About Us)',
            'type' => 'builder',
            'content' => '<h2>পুষ্টি কুঞ্জ — ১০০% খাঁটি ও নির্ভেজাল পুষ্টির অঙ্গীকার</h2><p>পুষ্টি কুঞ্জ বাংলাদেশের প্রতিটি সচেতন পরিবারের কাছে শতভাগ খাঁটি, রাসায়নিকমুক্ত ও পুষ্টিকর খাদ্যপণ্য পৌঁছে দেওয়ার অঙ্গীকার নিয়ে প্রতিষ্ঠিত। আমাদের প্রতিটি পণ্য সরাসরি প্রকৃতি ও বিশ্বস্ত কৃষকের কাছ থেকে সংগৃহীত।</p><h3>আমাদের মূল লক্ষ্য ও বৈশিষ্ট্য:</h3><ul><li><strong>শতভাগ প্রাকৃতিক:</strong> কোনো কৃত্রিম রঙ, সুগন্ধি বা ক্ষতিকর রাসায়নিক উপাদান নেই।</li><li><strong>ল্যাব টেস্টেড কোয়ালিটি:</strong> BSTI এবং BCSIR পরীক্ষিত বিশুদ্ধতার নিশ্চয়তা।</li><li><strong>স্বাস্থ্যসম্মত প্রসেসিং:</strong> সর্বোচ্চ হাইজিন ও আধুনিক প্রযুক্তি ব্যবহার করে তৈরি।</li><li><strong>সরাসরি ডেলিভারি:</strong> দেশের যেকোনো প্রান্তে দ্রুত হোম ডেলিভারি সুবিধা।</li></ul>',
            'meta_title' => 'আমাদের সম্পর্কে | পুষ্টি কুঞ্জ',
            'meta_description' => 'পুষ্টি কুঞ্জ বাংলাদেশের শীর্ষস্থানীয় অর্গানিক ও ভেষজ খাদ্য ব্র্যান্ড।',
            'is_published' => true,
        ]);

        Page::updateOrCreate(['slug' => 'how-to-order'], [
            'title' => 'কীভাবে অর্ডার করবেন (How to Order)',
            'type' => 'builder',
            'content' => '<h2>সহজ ৪টি ধাপে পুষ্টি কুঞ্জ থেকে অর্ডার করার নিয়ম</h2><p>পুষ্টি কুঞ্জ থেকে পণ্য অর্ডার করা অত্যন্ত সহজ এবং নিরাপদ। নিচে নিয়মাবলী তুলে ধরা হলো:</p><ol><li><strong>পণ্য নির্বাচন করুন:</strong> আমাদের শপ পেজ থেকে আপনার প্রয়োজনীয় পণ্য কার্টে যোগ করুন বা সরাসরি "অর্ডার করুন" বাটনে ক্লিক করুন।</li><li><strong>ঠিকানা ও ফোন নম্বর দিন:</strong> চেকআউট ফর্মে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।</li><li><strong>পেমেন্ট মেথড বাছাই করুন:</strong> ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ) অথবা বিকাশ সেন্ড মানি সিলেক্ট করুন।</li><li><strong>অর্ডার নিশ্চিত করুন:</strong> "অর্ডার কনফার্ম করুন" বাটনে ক্লিক করলেই আপনার অর্ডার সম্পন্ন হয়ে যাবে এবং আপনি একটি নিশ্চিতকরণ এসএমএস পাবেন।</li></ol><p>যেকোনো সহায়তায় সরাসরি কল করুন আমাদের হটলাইনে: <strong>09678812525</strong></p>',
            'meta_title' => 'কীভাবে অর্ডার করবেন | পুষ্টি কুঞ্জ',
            'meta_description' => 'সহজ ৪টি ধাপে পুষ্টি কুঞ্জ থেকে অর্ডার করার নিয়ম ও নির্দেশিকা।',
            'is_published' => true,
        ]);

        Page::updateOrCreate(['slug' => 'contact'], [
            'title' => 'যোগাযোগ (Contact)',
            'type' => 'builder+form',
            'content' => '<p>যেকোনো জিজ্ঞাসা, পরামর্শ বা সহায়তার জন্য আমাদের হটলাইন বা ইমেইলে যোগাযোগ করুন। আমাদের সাপোর্ট টিম আপনাকে আন্তরিক সহায়তা প্রদানে প্রস্তুত।</p>',
            'meta_title' => 'যোগাযোগ করুন | পুষ্টি কুঞ্জ',
            'meta_description' => 'পুষ্টি কুঞ্জের সাথে যোগাযোগ, ঠিকানা, মোবাইল নম্বর ও পরামর্শ ফর্ম।',
            'is_published' => true,
        ]);

        Page::updateOrCreate(['slug' => 'refund-policy'], [
            'title' => 'রিফান্ড ও রিটার্ন পলিসি (Refund Policy)',
            'type' => 'builder',
            'content' => '<h2>রিটার্ন ও রিফান্ড পলিসি (Return & Refund Policy)</h2><p>পুষ্টি কুঞ্জ গ্রাহকদের শতভাগ সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।</p><h3>রিটার্ন পলিসি:</h3><ul><li>পণ্য হাতে পেয়ে কোনো অসঙ্গতি বা ত্রুটি দেখলে সাথে সাথে ডেলিভারিম্যানের সামনেই আমাদের হটলাইনে জানান।</li><li>সিলখোলা বা আংশিক ব্যবহৃত পণ্য খাদ্য সুরক্ষার স্বার্থে ফেরতযোগ্য নয়।</li></ul><h3>রিফান্ড পলিসি:</h3><ul><li>বিকাশ সেন্ড মানিতে পরিশোধিত অর্ডারের ক্ষেত্রে পণ্য ফেরত ও যাচাই সাপেক্ষে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে আপনার বিকাশ নম্বরে রিফান্ড প্রদান করা হবে।</li><li>ক্যাশ অন ডেলিভারি অর্ডারের ক্ষেত্রে পণ্য চেক করে গ্রহণ ও মূল্য পরিশোধের সুযোগ রয়েছে।</li></ul>',
            'meta_title' => 'রিটার্ন ও রিফান্ড পলিসি | পুষ্টি কুঞ্জ',
            'meta_description' => 'পুষ্টি কুঞ্জের পণ্য ফেরত ও মূল্য ফেরত সংক্রান্ত নীতিমালা।',
            'is_published' => true,
        ]);

        Page::updateOrCreate(['slug' => 'faq'], [
            'title' => 'সাধারণ জিজ্ঞাসা (FAQ)',
            'type' => 'builder',
            'content' => '<h2>সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)</h2><p>পুষ্টি কুঞ্জের পণ্য, ডেলিভারি ও পেমেন্ট সম্পর্কিত সাধারণ প্রশ্নোত্তরসমূহ নিচে বিস্তারিত দেওয়া হলো। যেকোনো অতিরিক্ত তথ্যের জন্য আমাদের হেল্পলাইনে যোগাযোগ করুন।</p>',
            'blocks' => [
                [
                    'id' => 'b_faq_page_1',
                    'type' => 'faq',
                    'is_hidden' => false,
                    'data' => [
                        'heading' => 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)',
                        'items' => [
                            ['question' => 'কীভাবে পুষ্টি কুঞ্জ থেকে অর্ডার করব?', 'answer' => 'পছন্দের পণ্যটি নির্বাচন করে কার্টে যোগ করুন এবং চেকআউট পেজে নাম, ফোন নম্বর ও ঠিকানা দিয়ে অর্ডার কনফার্ম করুন।'],
                            ['question' => 'ডেলিভারি চার্জ কত এবং কতদিনে পাব?', 'answer' => 'ঢাকার ভিতরে ডেলিভারি চার্জ ৬০ টাকা এবং ২৪ থেকে ৪৮ ঘণ্টার মধ্যে পৌঁছে দেওয়া হয়। ঢাকার বাইরে ১২০ টাকা এবং ২ থেকে ৩ দিনের মধ্যে ডেলিভারি সম্পন্ন হয়।'],
                            ['question' => 'বিকাশ সেন্ড মানি কীভাবে করব?', 'answer' => 'চেকআউট পেজে উল্লেখিত বিকাশ মার্চেন্ট/ব্যক্তিগত নম্বরে মোট টাকা সেন্ড মানি করে প্রাপ্ত TrxID টি প্রদান করে অর্ডার সাবমিট করুন।'],
                            ['question' => 'পণ্য খাঁটি হওয়ার নিশ্চয়তা কী?', 'answer' => 'আমরা কোনো কৃত্রিম কেমিক্যাল বা প্রিজারভেটিভ ব্যবহার করি না। শতভাগ প্রাকৃতিক উপাদান স্বাস্থ্যসম্মত পরিবেশে প্রসেস করে প্যাকেটজাত করা হয়।'],
                        ]
                    ]
                ]
            ],
            'meta_title' => 'সাধারণ জিজ্ঞাসা (FAQ) | পুষ্টি কুঞ্জ',
            'meta_description' => 'সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর - পুষ্টি কুঞ্জ।',
            'is_published' => true,
        ]);

        Page::updateOrCreate(['slug' => 'privacy-policy'], [
            'title' => 'প্রাইভেসি পলিসি (Privacy Policy)',
            'type' => 'builder',
            'content' => '<h2>প্রাইভেসি পলিসি (Privacy Policy)</h2><p>পুষ্টি কুঞ্জে আপনার তথ্যের গোপনীয়তা রক্ষা করা আমাদের পবিত্র দায়িত্ব।</p><ul><li><strong>তথ্য সংগ্রহ:</strong> আপনার নাম, ফোন নম্বর এবং ঠিকানা শুধুমাত্র পণ্য ডেলিভারি এবং অর্ডার ট্র্যাকিংয়ের উদ্দেশ্যে ব্যবহৃত হয়।</li><li><strong>তৃতীয় পক্ষ:</strong> কোনো অবস্থাতেই আপনার ব্যক্তিগত তথ্য কোনো বাণিজ্যিক প্রতিষ্ঠান বা তৃতীয় পক্ষের কাছে বিক্রয় বা হস্তান্তর করা হয় না।</li><li><strong>সুরক্ষিত প্ল্যাটফর্ম:</strong> আমাদের ওয়েবসাইটে ব্যবহৃত পেমেন্ট এবং এসএমএস গেটওয়ে সম্পূর্ণ এনক্রিপ্টেড ও সুরক্ষিত।</li></ul>',
            'meta_title' => 'প্রাইভেসি পলিসি | পুষ্টি কুঞ্জ',
            'meta_description' => 'পুষ্টি কুঞ্জে আপনার ব্যক্তিগত তথ্যের নিরাপত্তা ও গোপনীয়তা নির্দেশিকা।',
            'is_published' => true,
        ]);

        Page::updateOrCreate(['slug' => 'terms'], [
            'title' => 'শর্তাবলী ও নিয়মাবলী (Terms & Conditions)',
            'type' => 'builder',
            'content' => '<h2>পুষ্টি কুঞ্জ ব্যবহারের সাধারণ শর্তাবলী</h2><p>পুষ্টি কুঞ্জ ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি নিম্নের শর্তাবলীর সাথে সম্মতি জ্ঞাপন করছেন:</p><ol><li><strong>অর্ডার নিশ্চিতকরণ:</strong> অর্ডার করার পর আমাদের কাস্টমার সাপোর্ট টিম থেকে ফোন বা এসএমএস এর মাধ্যমে অর্ডার কনফার্ম করা হতে পারে।</li><li><strong>মূল্য ও প্রাপ্যতা:</strong> যেকোনো পণ্যের মূল্য বা অফার কর্তৃপক্ষ যেকোনো সময় পরিবর্তনের অধিকার সংরক্ষণ করে।</li><li><strong>ডেলিভারি সময়সীমা:</strong> প্রাকৃতিক দুর্যোগ বা কুরিয়ার সংক্রান্ত অনাকাঙ্ক্ষিত দেরির ক্ষেত্রে কাস্টমারকে যথাসময়ে অবহিত করা হবে।</li><li><strong>স্বাস্থ্য পরামর্শ:</strong> আমাদের পুষ্টি পরামর্শ সাধারণ সচেতনতামূলক, এটি কোনো প্রত্যক্ষ প্রেসক্রিপশন নয়।</li></ol>',
            'meta_title' => 'শর্তাবলী ও নিয়মাবলী | পুষ্টি কুঞ্জ',
            'meta_description' => 'পুষ্টি কুঞ্জ ওয়েবসাইট ব্যবহারের সাধারণ শর্তাবলী ও নীতিমালা।',
            'is_published' => true,
        ]);

        // Default Site Settings
        SiteSetting::set('site_name', 'Pusti Kunjo');
        SiteSetting::set('site_tagline', 'Purity Begins here');
        SiteSetting::set('contact_phone', '01700-000000');
        SiteSetting::set('contact_whatsapp', '01700000000');
        SiteSetting::set('contact_email', 'info@pustikunjo.com.bd');
        SiteSetting::set('contact_address', 'বাড়ি #১২, রোড #০৪, ধানমন্ডি, ঢাকা');

        SiteSetting::set('shipping_zones', [
            ['name' => 'ঢাকার ভিতরে', 'fee' => 60],
            ['name' => 'ঢাকার বাইরে', 'fee' => 120],
        ], 'shipping');

        SiteSetting::set('payment_bkash', [
            'cod_enabled' => true,
            'manual_enabled' => true,
            'manual_type' => 'merchant',
            'manual_number' => '01700000000',
            'manual_instructions' => 'অর্ডার কনফার্ম করতে {amount} টাকা {number} নম্বরে সেন্ড মানি করুন। সেন্ড মানি করার পর নিচে ট্রানজেকশন আইডি (TrxID) লিখুন।',
            'pgw_enabled' => false,
            'pgw_mode' => 'sandbox',
            'pgw_app_key' => '',
            'pgw_app_secret' => '',
            'pgw_username' => '',
            'pgw_password' => '',
        ], 'payment');

        SiteSetting::set('theme_customizer', [
            'primary_color' => '#0d6838',
            'secondary_color' => '#f59e0b',
            'accent_color' => '#e11d48',
            'font' => 'Hind Siliguri',
            'button_radius' => '0.5rem',
            'container_width' => '1280px',
            'logo_url' => '',
            'favicon_url' => '',
            'custom_css' => '',
        ], 'appearance');

        SiteSetting::set('header_config', [
            'announcement_bar' => [
                'enabled' => true,
                'text' => '🌿 ১০০% প্রাকৃতিক ও স্বাস্থ্যসম্মত খাঁটি পণ্য — সারা দেশে ক্যাশ অন ডেলিভারি!',
                'bg_color' => '#07381e',
                'text_color' => '#ffffff',
            ],
            'sticky_header' => true,
            'hotline_phone' => '01700-000000',
            'menu_items' => [
                ['label' => 'হোম', 'url' => '/'],
                ['label' => 'শপ', 'url' => '/shop'],
                ['label' => 'আমাদের সম্পর্কে', 'url' => '/about-us'],
                ['label' => 'ব্লগ', 'url' => '/blog'],
                ['label' => 'অর্ডার ট্র্যাক', 'url' => '/track-order'],
                ['label' => 'যোগাযোগ', 'url' => '/contact'],
            ],
        ], 'appearance');

        SiteSetting::set('footer_config', [
            'about_text' => 'পুষ্টি কুঞ্জ একটি নির্ভরযোগ্য স্বাস্থ্য ও অর্গানিক ফুড ব্র্যান্ড। আমাদের লক্ষ্য প্রতিটি পরিবারে খাঁটি পুষ্টি ও স্বাস্থ্যকর খাদ্য পৌঁছে দেওয়া।',
            'copyright_text' => '© ২০২৬ পুষ্টি কুঞ্জ। সর্বস্বত্ব সংরক্ষিত।',
            'social_links' => [
                'facebook' => 'https://facebook.com',
                'youtube' => 'https://youtube.com',
                'instagram' => 'https://instagram.com',
                'whatsapp' => 'https://wa.me/8801700000000',
            ],
            'payment_icons' => ['bkash', 'cod'],
        ], 'appearance');
    }
}
