<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;
use App\Models\Product;
use App\Models\Page;

class UpdateSeoMetaSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Update Global SEO Settings
        $existingSeo = SiteSetting::get('seo_settings', []);
        $updatedSeo = array_merge($existingSeo, [
            'indexing_directive' => 'index, follow',
            'meta_title' => 'পুষ্টি কুঞ্জ (Pusti Kunjo) — ১০০% খাঁটি অর্গানিক ও ভেষজ পুষ্টি পণ্য',
            'meta_description' => 'পুষ্টি কুঞ্জ (Pusti Kunjo) — ১০০% খাঁটি ও প্রাকৃতিক অর্গানিক ফুড ব্র্যান্ড। প্রিমিয়াম রোজেলা চা, বিটরুট পাউডার, মেথি মিক্স ও চিয়া সিড। সারা দেশে ক্যাশ অন ডেলিভারি!',
            'meta_keywords' => 'পুষ্টি কুঞ্জ, Pusti Kunjo, pustikunjo, অর্গানিক ফুড বাংলাদেশ, খাঁটি ভেষজ পণ্য, রোজেলা চা, rosella tea, বিটরুট পাউডার, beetroot powder bd, মেথি মিক্স, methi mix, চিয়া সিড, chia seeds bd, ভেষজ পুষ্টি পণ্য, সুপারফুড, natural health food bangladesh, অর্গানিক গ্রোসারি, অনলাইন অর্গানিক শপ',
        ]);
        SiteSetting::set('seo_settings', $updatedSeo, 'seo');

        // 2. Update Home Page record
        $homePage = Page::where('slug', 'home')->orWhere('slug', '/')->first();
        if ($homePage) {
            $homePage->update([
                'meta_title' => 'পুষ্টি কুঞ্জ (Pusti Kunjo) — ১০০% খাঁটি অর্গানিক ও ভেষজ পুষ্টি পণ্য',
                'meta_description' => 'পুষ্টি কুঞ্জ (Pusti Kunjo) — ১০০% খাঁটি ও প্রাকৃতিক অর্গানিক ফুড ব্র্যান্ড। প্রিমিয়াম রোজেলা চা, বিটরুট পাউডার, মেথি মিক্স ও চিয়া সিড। সারা দেশে ক্যাশ অন ডেলিভারি!',
            ]);
        }

        // 3. Update Product 10: Rosella Tea
        $p1 = Product::where('slug', 'rosella-tea')->orWhere('id', 10)->first();
        if ($p1) {
            $p1->update([
                'meta_title' => 'রোজেলা চা (Rosella Tea) — ১০০% খাঁটি প্রিমিয়াম হারবাল চা | পুষ্টি কুঞ্জ',
                'meta_description' => 'পুষ্টি কুঞ্জের ১০০% বিশুদ্ধ রোজেলা চা (Rosella Tea)। উচ্চ রক্তচাপ নিয়ন্ত্রণ, রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি, লিভার সুরক্ষা ও ওজন কমাতে অনন্য প্রাকৃতিক হারবাল চা। ক্যাশ অন ডেলিভারি!',
                'meta_keywords' => 'রোজেলা চা, Rosella tea bd, rosella tea price in bangladesh, হারবাল চা, হিবিস্কাস টি, hibiscus tea, রক্তচাপ নিয়ন্ত্রক চা, ভেষজ চা, ওজন কমানোর চা, পুষ্টি কুঞ্জ রোজেলা চা, organic tea bd, ভেষজ পানীয়',
            ]);
        }

        // 4. Update Product 11: Beetroot Powder
        $p2 = Product::where('slug', 'beetroot-powder')->orWhere('id', 11)->first();
        if ($p2) {
            $p2->update([
                'meta_title' => 'স্প্রে ড্রাইড বিটরুট পাউডার (Beetroot Powder) — ১০০% খাঁটি সুপারফুড | পুষ্টি কুঞ্জ',
                'meta_description' => 'তাজা বিটরুট থেকে তৈরি ১০০% খাঁটি স্প্রে ড্রাইড বিটরুট পাউডার। দ্রুত রক্তস্বল্পতা দূরীকরণ, হিমোগ্লোবিন বৃদ্ধি, ত্বকের উজ্জ্বলতা ও এনার্জি বাড়াতে সেরা। ক্যাশ অন ডেলিভারি!',
                'meta_keywords' => 'বিটরুট পাউডার, beetroot powder bd, স্প্রে ড্রাইড বিটরুট পাউডার, beetroot powder price in bd, রক্ত বাড়ানোর খাবার, হিমোগ্লোবিন বৃদ্ধির উপায়, ত্বকের উজ্জ্বলতায় বিটরুট, সুপারফুড বাংলাদেশ, পুষ্টি কুঞ্জ বিটরুট পাউডার, প্রাকৃতিক আয়রন সাপ্লিমেন্ট',
            ]);
        }

        // 5. Update Product 12: Methi Mix
        $p3 = Product::where('slug', 'methi-mix')->orWhere('id', 12)->first();
        if ($p3) {
            $p3->update([
                'meta_title' => 'মেথি মিক্স (Methi Mix) — ডায়াবেটিস ও গ্যাস্ট্রিকের ভেষজ সমাধান | পুষ্টি কুঞ্জ',
                'meta_description' => 'আমলকি, হরিতকী, মেথি ও প্রাকৃতিক ভেষজে তৈরি খাঁটি মেথি মিক্স। পেটের গ্যাস, অ্যাসিডিটি, বদহজম দূরীকরণ এবং রক্তে সুগার নিয়ন্ত্রণে অত্যন্ত কার্যকরী। সারা দেশে ক্যাশ অন ডেলিভারি!',
                'meta_keywords' => 'মেথি মিক্স, methi mix bd, মেথি পাউডার, ডায়াবেটিস নিয়ন্ত্রণ ভেষজ, গ্যাস্ট্রিকের ঘরোয়া সমাধান, বদহজম দূর করার উপায়, মেথির উপকারিতা, ভেষজ পথ্য, মেথি মিক্স এর দাম, পুষ্টি কুঞ্জ মেথি মিক্স, মেথি গুঁড়া',
            ]);
        }
    }
}
