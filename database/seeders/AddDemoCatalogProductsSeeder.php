<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class AddDemoCatalogProductsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Chia Seeds (Demo - Catalog only)
        Product::updateOrCreate(
            ['slug' => 'chia-seeds'],
            [
                'name' => 'অর্গানিক চিয়া সিড (Organic Chia Seeds)',
                'sku' => 'PK-CS-400',
                'price' => 650.00,
                'sale_price' => 550.00,
                'stock' => 50,
                'weight' => '250g',
                'category_id' => 2,
                'badge' => 'Catalog',
                'short_description' => '১০০% প্রিমিয়াম অর্গানিক ব্ল্যাক চিয়া সিড। ওমেগা-৩ ফ্যাটি এসিড, ফাইবার ও প্রোটিন সমৃদ্ধ সুপারফুড।',
                'description' => 'পুষ্টি কুঞ্জের প্রিমিয়াম অর্গানিক চিয়া সিড শরীরের অতিরিক্ত মেদ নিয়ন্ত্রণ, হৃদযন্ত্র সুস্থ রাখতে এবং প্রতিদিনের শক্তির ঘাটতি পূরণে অনন্য।',
                'images' => [
                    '/images/products/chia-seeds.jpg',
                ],
                'benefits' => [
                    'ওজন নিয়ন্ত্রণ ও দীর্ঘক্ষণ পেট ভরা রাখতে সাহায্য করে',
                    'প্রচুর ওমেগা-৩ যা হার্ট ও মস্তিষ্কের জন্য উপকারী',
                    'হজম প্রক্রিয়া উন্নত করে ও কোষ্ঠকাঠিন্য দূর করে',
                ],
                'usage_instructions' => '১ গ্লাস পানিতে ১-২ চা চামচ চিয়া সিড ২০-৩০ মিনিট ভিজিয়ে রেখে সরাসরি বা লেবুর শরবতের সাথে পান করুন।',
                'is_featured' => false,
                'is_active' => true,
                'is_visible_on_storefront' => false, // Hidden from storefront
                'meta_title' => 'অর্গানিক চিয়া সিড (Organic Chia Seeds) — ১০০% খাঁটি সুপারফুড | পুষ্টি কুঞ্জ',
                'meta_description' => 'পুষ্টি কুঞ্জের প্রিমিয়াম অর্গানিক ব্ল্যাক চিয়া সিড। ১০০% খাঁটি ও স্বাস্থ্যসম্মত সুপারফুড।',
                'meta_keywords' => 'চিয়া সিড, chia seeds bd, organic chia seeds, পুষ্টি কুঞ্জ',
            ]
        );

        // 2. Moringa Powder (Demo - Catalog only)
        Product::updateOrCreate(
            ['slug' => 'moringa-powder'],
            [
                'name' => 'অর্গানিক মোরিঙ্গা পাউডার (Organic Moringa Leaf Powder)',
                'sku' => 'PK-MOP-500',
                'price' => 750.00,
                'sale_price' => 650.00,
                'stock' => 45,
                'weight' => '200g',
                'category_id' => 1,
                'badge' => 'Catalog',
                'short_description' => '১০০% খাঁটি সজনে পাতা গুঁড়া (Moringa Leaf Powder)। প্রাকৃতিক মাল্টিভিটামিন ও খনিজ উপাদানের ভাণ্ডার।',
                'description' => 'পুষ্টি কুঞ্জের অর্গানিক মোরিঙ্গা পাউডার শরীরের রোগ প্রতিরোধ ক্ষমতা বাড়ায়, দুর্বলতা ও রক্তশূন্যতা দূর করতে অসাধারণ ভেষজ পথ্য।',
                'images' => [
                    '/images/products/moringa-powder.jpg',
                ],
                'benefits' => [
                    'প্রাকৃতিক মাল্টিভিটামিন যা শরীরের ক্লান্তি ও দুর্বলতা দূর করে',
                    'রোগ প্রতিরোধ ক্ষমতা বহুগুণ বৃদ্ধি করে',
                    'হিমোগ্লোবিন বাড়াতে এবং রক্তস্বল্পতা রোধে অত্যন্ত কার্যকর',
                ],
                'usage_instructions' => 'প্রতিদিন সকালে বা রাতে কুসুম গরম পানিতে ১ চা চামচ মোরিঙ্গা পাউডার গুলিয়ে পান করুন। মধু মিশিয়ে খাওয়া যায়।',
                'is_featured' => false,
                'is_active' => true,
                'is_visible_on_storefront' => false, // Hidden from storefront
                'meta_title' => 'অর্গানিক মোরিঙ্গা পাউডার (Organic Moringa Leaf Powder) | পুষ্টি কুঞ্জ',
                'meta_description' => '১০০% খাঁটি সজনে পাতা গুঁড়া বা মোরিঙ্গা পাউডার। প্রাকৃতিক সুপারফুড।',
                'meta_keywords' => 'মোরিঙ্গা পাউডার, সজনে পাতা গুঁড়া, moringa powder bd, পুষ্টি কুঞ্জ',
            ]
        );
    }
}
