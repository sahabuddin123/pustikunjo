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

        // 3. Reviews for the 3 real products
        $pRosella = Product::where('slug', 'rosella-tea')->first();
        $pBeetroot = Product::where('slug', 'beetroot-powder')->first();
        $pMethi = Product::where('slug', 'methi-mix')->first();

        if ($pRosella) {
            Review::firstOrCreate(
                ['product_id' => $pRosella->id, 'customer_phone' => '01811223344'],
                [
                    'customer_name' => 'ফারহানা ইসলাম',
                    'rating' => 5,
                    'comment' => 'রোজেলা চা অত্যন্ত ফ্রেশ এবং স্বাদও চমৎকার। রক্তচাপ নিয়ন্ত্রণে অনেক উপকার পেয়েছি!',
                    'is_approved' => true,
                ]
            );
        }

        if ($pBeetroot) {
            Review::firstOrCreate(
                ['product_id' => $pBeetroot->id, 'customer_phone' => '01711223344'],
                [
                    'customer_name' => 'তানভীর আহমেদ',
                    'rating' => 5,
                    'comment' => 'বিটরুট পাউডার খুব ভালো এবং খাঁটি। দ্রুত ডেলিভারির জন্য ধন্যবাদ পুষ্টি কুঞ্জকে!',
                    'is_approved' => true,
                ]
            );
        }

        if ($pMethi) {
            Review::firstOrCreate(
                ['product_id' => $pMethi->id, 'customer_phone' => '01911223344'],
                [
                    'customer_name' => 'কামরুল হাসান',
                    'rating' => 5,
                    'comment' => 'মেথি মিক্স খেয়ে হজম ও পেটের সমস্যায় অনেক উপকার পেয়েছি। প্যাকেজিংও দারুণ।',
                    'is_approved' => true,
                ]
            );
        }

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
                            'image' => '/images/banners/rosella-tea-banner.jpg',
                            'url' => '/product/rosella-tea',
                            'alt' => 'পুষ্টি কুঞ্জ রোজেলা চা — ১০০% খাঁটি ও প্রাকৃতিক হারবাল চা',
                        ],
                        [
                            'image' => '/images/banners/beetroot-powder-banner.jpg',
                            'url' => '/product/beetroot-powder',
                            'alt' => 'স্প্রে ড্রাইড বিটরুট পাউডার — ১০০% অর্গানিক সুপারফুড',
                        ],
                        [
                            'image' => '/images/banners/methi-mix-banner.jpg',
                            'url' => '/product/methi-mix',
                            'alt' => 'মেথি মিক্স — প্রাকৃতিক হজম ও সুগার নিয়ন্ত্রণ ভেষজ ফর্মুলা',
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
                            'poster' => '/uploads/1789723597_ChatGPT_Image_Sep_11__2026__08_04_06_PM.webp',
                            'videoUrl' => 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-in-a-park-41315-large.mp4',
                            'promoBanner' => '/uploads/1789579454_ChatGPTImageSep11202608_15_15PM.webp',
                            'thumb' => '/uploads/1789579454_ChatGPTImageSep11202608_15_15PM.webp',
                            'title' => 'Spray Dried Beetroot',
                            'fullTitle' => 'Spray Dried Beetroot Powder',
                            'price' => '৳ ৩৯০.০০',
                            'productUrl' => '/product/beetroot-powder',
                            'alt' => 'Spray Dried Beetroot Powder Video Review & Promo',
                        ],
                        [
                            'id' => 2,
                            'poster' => '/uploads/1789723623_ChatGPT_Image_Sep_11__2026__08_04_13_PM.webp',
                            'videoUrl' => 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-41712-large.mp4',
                            'promoBanner' => '/uploads/1789579439_ChatGPTImageSep11202608_15_50PM.webp',
                            'thumb' => '/uploads/1789579439_ChatGPTImageSep11202608_15_50PM.webp',
                            'title' => 'Pure Herbal Methi Mix',
                            'fullTitle' => 'Pure Herbal Methi Mix',
                            'price' => '৳ ৭৮০.০০',
                            'productUrl' => '/product/methi-mix',
                            'alt' => 'Pure Herbal Methi Mix Video Review & Promo',
                        ],
                        [
                            'id' => 3,
                            'poster' => '/uploads/1789723673_ChatGPT_Image_Sep_11__2026__08_04_20_PM.webp',
                            'videoUrl' => 'https://assets.mixkit.co/videos/preview/mixkit-woman-recording-a-vlog-with-her-phone-41314-large.mp4',
                            'promoBanner' => '/uploads/1789579366_rosella-tea.webp',
                            'thumb' => '/uploads/1789579366_rosella-tea.webp',
                            'title' => 'Organic Rosella Tea',
                            'fullTitle' => 'Organic Rosella Herbal Tea',
                            'price' => '৳ ৮৫০.০০',
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
            'meta_title' => 'পুষ্টি কুঞ্জ — খাঁটি অর্গানিক ফুড ও প্রাকৃতিক স্বাস্থ্য পণ্য | Pusti Kunjo',
            'meta_description' => 'পুষ্টি কুঞ্জ (Pusti Kunjo) — বাংলাদেশের বিশ্বস্ত অর্গানিক ফুড ব্র্যান্ড। ১০০% খাঁটি রোজেলা চা, বিটরুট পাউডার, মেথি মিক্স ও প্রাকৃতিক স্বাস্থ্য পণ্য। সারা দেশে ক্যাশ অন ডেলিভারি!',
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
