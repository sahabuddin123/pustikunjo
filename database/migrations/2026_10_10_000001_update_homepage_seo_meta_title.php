<?php

use App\Models\Page;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $homePage = Page::where('slug', 'home')->orWhere('slug', '/')->first();
        if ($homePage) {
            $homePage->update([
                'meta_title' => 'পুষ্টি কুঞ্জ — খাঁটি অর্গানিক ফুড ও প্রাকৃতিক স্বাস্থ্য পণ্য | Pusti Kunjo',
                'meta_description' => 'পুষ্টি কুঞ্জ (Pusti Kunjo) — বাংলাদেশের বিশ্বস্ত অর্গানিক ফুড ব্র্যান্ড। ১০০% খাঁটি রোজেলা চা, বিটরুট পাউডার, মেথি মিক্স ও প্রাকৃতিক স্বাস্থ্য পণ্য। সারা দেশে ক্যাশ অন ডেলিভারি!',
            ]);
        }

        $seoSettings = SiteSetting::get('seo_settings', []);
        $seoSettings['meta_title'] = 'পুষ্টি কুঞ্জ — খাঁটি অর্গানিক ফুড ও প্রাকৃতিক স্বাস্থ্য পণ্য | Pusti Kunjo';
        $seoSettings['meta_description'] = 'পুষ্টি কুঞ্জ (Pusti Kunjo) — বাংলাদেশের বিশ্বস্ত অর্গানিক ফুড ব্র্যান্ড। ১০০% খাঁটি রোজেলা চা, বিটরুট পাউডার, মেথি মিক্স ও প্রাকৃতিক স্বাস্থ্য পণ্য। সারা দেশে ক্যাশ অন ডেলিভারি!';
        $seoSettings['meta_keywords'] = 'পুষ্টি কুঞ্জ, Pusti Kunjo, pustikunjo, pustikunjo.com.bd, অর্গানিক ফুড বাংলাদেশ, খাঁটি ভেষজ পণ্য, রোজেলা চা, rosella tea, বিটরুট পাউডার, beetroot powder, মেথি মিক্স, methi mix, চিয়া সিড, chia seeds, প্রাকৃতিক স্বাস্থ্য পণ্য, সুপারফুড';
        SiteSetting::set('seo_settings', $seoSettings, 'seo');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No action needed
    }
};
