<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Page;
use Illuminate\Support\Facades\DB;

class UpdateThreeProductsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Process Banner images to create square 1:1 product images using GD
        $this->createSquareProductThumbnails();

        // 2. Ensure Categories exist
        $category = Category::firstOrCreate(
            ['slug' => 'organic-powders'],
            [
                'name' => 'ভেষজ ও পুষ্টিকর খাদ্য',
                'description' => '১০০% খাঁটি ও অর্গানিক পুষ্টি খাদ্য ও পাউডার',
                'is_active' => true,
            ]
        );

        // 3. Clear existing products
        Product::query()->delete();

        // 4. Insert the 3 Products from packaging labels
        $products = [
            [
                'name' => 'রোজেলা চা (Rosella Tea)',
                'slug' => 'rosella-tea',
                'sku' => 'PK-RT-100',
                'price' => 950.00,
                'sale_price' => 850.00,
                'stock' => 150,
                'weight' => '100 g',
                'category_id' => $category->id,
                'badge' => 'হারবাল টি',
                'short_description' => 'রোজেলা চা লাল রঙের টক-মিষ্টি স্বাদের শতভাগ স্বাস্থ্যকর ভেষজ ও হারবাল পানীয়।',
                'description' => '১০০% বিশুদ্ধ হিবিস্কাস সাবডারিফা (রোজেলা) ফুলের বৃতি দিয়ে তৈরি পুষ্টিকুঞ্জ রোজেলা চা। এতে অতিরিক্ত কোনো ক্ষতিকর উপাদান বা প্রিজারভেটিভ নেই। এটি প্রাকৃতিকভাবে ক্যাফেইন-মুক্ত এবং অত্যন্ত স্বাস্থ্যকর ও সতেজকারক।',
                'benefits' => [
                    'উচ্চ রক্তচাপ ও হৃদরোগের ঝুঁকি কমায়',
                    'এতে থাকা অ্যান্টিঅক্সিডেন্ট ও ভিটামিন সি কোষের ক্ষতি রোধ করে ও রোগ প্রতিরোধ ক্ষমতা বাড়ায়',
                    'শরীরের চর্বি কমায় ও ওজন নিয়ন্ত্রণে সহায়ক',
                    'হজমশক্তি বৃদ্ধি করে ও পেটের অস্বস্তি কমায়',
                    'সর্দি-কাশি, গলার এলার্জি ও ফুসফুসের সুস্থতায় কার্যকরী',
                ],
                'usage_instructions' => "৪-৫ টি শুকনো রোজেলা ফুল ১ কাপ গরম পানিতে দিয়ে ৫-৭ মিনিট ভিজিয়ে রাখুন। এরপর ছেঁকে নিন। স্বাদ বাড়াতে সামান্য মধু মেশানো যায়।",
                'images' => [
                    '/images/products/rosella-tea.jpg',
                    '/images/products/rosella-tea-label.jpg',
                ],
                'is_featured' => true,
                'is_active' => true,
                'meta_title' => 'রোজেলা চা (Rosella Tea) — ১০০% খাঁটি হারবাল চা | পুষ্টি কুঞ্জ',
                'meta_description' => 'পুষ্টিকুঞ্জ ১০০% বিশুদ্ধ রোজেলা চা। উচ্চ রক্তচাপ নিয়ন্ত্রণ, রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি ও ওজন কমাতে অনন্য প্রাকৃতিক হারবাল চা।',
            ],
            [
                'name' => 'স্প্রে ড্রাইড বিটরুট পাউডার (Beetroot Powder)',
                'slug' => 'beetroot-powder',
                'sku' => 'PK-BRP-200',
                'price' => 1050.00,
                'sale_price' => 950.00,
                'stock' => 150,
                'weight' => '200 g',
                'category_id' => $category->id,
                'badge' => 'সুপারফুড',
                'short_description' => '১০০% প্রাকৃতিক তাজা বিটরুট থেকে তৈরি প্রিমিয়াম স্প্রে ড্রাইড পাউডার।',
                'description' => 'বিটরুট বা বিট (Beta vulgaris) একটি পুষ্টিকর ও গাঢ় লালচে-বেগুনী রঙের মূলজাতীয় সবজি। এটি একটি উৎকৃষ্ট "সুপারফুড"। স্প্রে ড্রাইড বিটরুট পানিতে দেওয়ার সাথে সাথে ধীরে ধীরে মিশে যেতে শুরু করে। এতে কোনো কৃত্রিম রং, প্রিজারভেটিভ ও ফ্লেভার নেই।',
                'benefits' => [
                    'লিভারে চর্বি জমতে বাধা দেয় এবং শরীর বিষমুক্ত করে',
                    'হৃদপিণ্ড ভালো রাখে',
                    'রক্তচাপ নিয়ন্ত্রণ করে ও রক্ত চলাচল সহজ করে',
                    'কোষ্ঠকাঠিন্য দূর করে এবং হজমশক্তি উন্নত করে',
                    'কাজের শক্তি ও স্ট্যামিনা বাড়ায়',
                    'ত্বককে ভেতর থেকে উজ্জ্বল এবং সতেজ করে',
                ],
                'usage_instructions' => "এক গ্লাস কুসুম গরম পানি বা হালকা গরম দুধে এক চা চামচ বিটরুট পাউডার ভালোভাবে মিশিয়ে পান করুন। স্বাদ বাড়াতে মধু বা লেবুর রস মেশান।\nসকালের ফল বা সবজির স্মুদিতে কিংবা জুসের সাথে ১ চা চামচ মিশিয়ে নিতে পারেন।\nস্যুপ, সস বা পরোটা ও রুটির আটার সাথে মিশিয়েও এটি খাওয়া যায়।",
                'images' => [
                    '/images/products/beetroot-powder.jpg',
                    '/images/products/beetroot-powder-label.jpg',
                ],
                'is_featured' => true,
                'is_active' => true,
                'meta_title' => 'স্প্রে ড্রাইড বিটরুট পাউডার (Beetroot Powder) — প্রিমিয়াম সুপারফুড | পুষ্টি কুঞ্জ',
                'meta_description' => 'তাজা বিটরুট থেকে প্রস্তুতকৃত ১০০% স্প্রে ড্রাইড বিটরুট পাউডার। লিভার ডিটক্স, হৃদপিণ্ডের সুরক্ষা ও ত্বকের লাবণ্যে অনন্য।',
            ],
            [
                'name' => 'মেথি মিক্স (Methi Mix)',
                'slug' => 'methi-mix',
                'sku' => 'PK-MM-200',
                'price' => 880.00,
                'sale_price' => 780.00,
                'stock' => 150,
                'weight' => '200 g',
                'category_id' => $category->id,
                'badge' => 'ভেষজ ফর্মুলা',
                'short_description' => 'শতভাগ খাঁটি ও প্রাকৃতিক ভেষজের এক অনন্য স্বাস্থ্যকর মিশ্রণ।',
                'description' => 'বাছাইকৃত উৎকৃষ্টমানের আমলকি, হরিতকী, বহেড়া, বেল শুঁট, আদা শুঁট, মেথি, পিংক সল্ট, জোয়ান, পুদিনা, থানকুনি পাতা, লবঙ্গ, কাবাব চিনি, পিপল মরিচ, কালোজিরা, সোনা পাতা ইত্যাদি সহ বিভিন্ন স্বাস্থ্যকর ভেষজ উপাদানে তৈরি। কোনো কৃত্রিম রং, রাসায়নিক বা প্রিজারভেটিভ নেই।',
                'benefits' => [
                    'পেটের গ্যাস, বদহজম ও বুকজ্বালা কমায়',
                    'কোষ্ঠকাঠিন্য দূর করে পেট পরিষ্কার রাখে',
                    'পরিপাকতন্ত্রের কার্যক্ষমতা বাড়ায়',
                    'রক্তে শর্করা বা সুগার লেভেল নিয়ন্ত্রণ করে',
                    'ইনসুলিনের কার্যকারিতা বাড়ায়',
                    'অতিরিক্ত মেদ ও ওজন কমাতে সহায়ক',
                ],
                'usage_instructions' => "প্রতিদিন অল্প পরিমাপ (প্রায় ১ চা চামচ) মেথি মিক্স পাউডার এক গ্লাস হালকা কুসুম গরম পানিতে ভালোভাবে মিশিয়ে শারীরিক প্রয়োজন অনুযায়ী দিনে ১-২ বার খাওয়া যেতে পারে।\nপ্রয়োজনে পাতলা কাপড় দিয়ে ছেঁকে নিতে পারেন।",
                'images' => [
                    '/images/products/methi-mix.jpg',
                    '/images/products/methi-mix-label.jpg',
                ],
                'is_featured' => true,
                'is_active' => true,
                'meta_title' => 'মেথি মিক্স (Methi Mix) — প্রাকৃতিক হজম ও সুগার নিয়ন্ত্রণ | পুষ্টি কুঞ্জ',
                'meta_description' => 'আমলকি, হরিতকী ও মেথির সমন্বয়ে তৈরি খাঁটি ভেষজ মেথি মিক্স। পেটের গ্যাস, বদহজম দূরীকরণ ও সুগার নিয়ন্ত্রণে অত্যন্ত কার্যকরী।',
            ],
        ];

        foreach ($products as $pData) {
            Product::create($pData);
        }

        // 5. Update Homepage Builder Blocks (Hero Slider Banners)
        $homePage = Page::where('slug', 'home')->first();
        if ($homePage) {
            $blocks = $homePage->blocks ?: [];

            foreach ($blocks as &$block) {
                if (($block['type'] ?? '') === 'hero') {
                    $block['data']['slides'] = [
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
                    ];
                }
            }

            $homePage->blocks = $blocks;
            $homePage->save();
        }

        $this->command->info('3 Products added and 3 Banners updated successfully!');
    }

    private function createSquareProductThumbnails(): void
    {
        $pairs = [
            [
                'banner' => public_path('images/banners/rosella-tea-banner.jpg'),
                'product' => public_path('images/products/rosella-tea.jpg'),
            ],
            [
                'banner' => public_path('images/banners/beetroot-powder-banner.jpg'),
                'product' => public_path('images/products/beetroot-powder.jpg'),
            ],
            [
                'banner' => public_path('images/banners/methi-mix-banner.jpg'),
                'product' => public_path('images/products/methi-mix.jpg'),
            ],
        ];

        foreach ($pairs as $item) {
            if (!file_exists($item['banner'])) continue;

            $src = @imagecreatefromjpeg($item['banner']);
            if (!$src) continue;

            $srcW = imagesx($src);
            $srcH = imagesy($src);

            // Banners have product display on the right half.
            // Crop a square region focusing on the right/center product platter
            $cropSize = $srcH; // height is the square dimension
            $cropX = max(0, (int)($srcW - $cropSize)); // right aligned
            $cropY = 0;

            $dest = imagecreatetruecolor(800, 800);
            imagecopyresampled($dest, $src, 0, 0, $cropX, $cropY, 800, 800, $cropSize, $cropSize);

            imagejpeg($dest, $item['product'], 92);

            imagedestroy($src);
            imagedestroy($dest);
        }
    }
}
