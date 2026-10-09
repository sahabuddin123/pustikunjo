<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use App\Models\BlogPost;
use App\Models\SiteSetting;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $homePage = Page::where('slug', 'home')->orWhere('slug', '/')->first();
        
        $allProducts = Product::storefront()
            ->with('category')
            ->get();

        $featuredProducts = $allProducts->where('is_featured', true)->take(8)->values();
        $latestProducts = $allProducts->sortByDesc('created_at')->take(8)->values();

        $categories = Category::withCount(['products' => function ($q) {
            $q->where('is_active', true)->where('is_visible_on_storefront', true);
        }])
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->get();

        $latestBlogs = BlogPost::where('is_published', true)
            ->latest()
            ->take(3)
            ->get();

        $seoSettings = SiteSetting::get('seo_settings', []);

        $pageMetaTitle = $homePage?->meta_title;
        if (empty($pageMetaTitle) || str_contains($pageMetaTitle, 'Purity Begins here')) {
            $resolvedTitle = (!empty($seoSettings['meta_title']) && !str_contains($seoSettings['meta_title'], 'Purity Begins here'))
                ? $seoSettings['meta_title']
                : 'পুষ্টি কুঞ্জ — খাঁটি অর্গানিক ফুড ও প্রাকৃতিক স্বাস্থ্য পণ্য | Pusti Kunjo';
        } else {
            $resolvedTitle = $pageMetaTitle;
        }

        $resolvedDescription = (!empty($homePage?->meta_description) && !str_contains($homePage->meta_description, 'Purity Begins here'))
            ? $homePage->meta_description
            : ($seoSettings['meta_description'] ?? 'পুষ্টি কুঞ্জ (Pusti Kunjo) — বাংলাদেশের বিশ্বস্ত অর্গানিক ফুড ব্র্যান্ড। ১০০% খাঁটি রোজেলা চা, বিটরুট পাউডার, মেথি মিক্স ও প্রাকৃতিক স্বাস্থ্য পণ্য। সারা দেশে ক্যাশ অন ডেলিভারি!');

        $resolvedKeywords = $seoSettings['meta_keywords'] ?? 'পুষ্টি কুঞ্জ, Pusti Kunjo, pustikunjo, pustikunjo.com.bd, অর্গানিক ফুড বাংলাদেশ, খাঁটি ভেষজ পণ্য, রোজেলা চা, rosella tea, বিটরুট পাউডার, beetroot powder, মেথি মিক্স, methi mix, চিয়া সিড, chia seeds, প্রাকৃতিক স্বাস্থ্য পণ্য, সুপারফুড, natural health food bangladesh';

        return Inertia::render('Storefront/Home', [
            'page' => $homePage,
            'products' => $allProducts,
            'featuredProducts' => $featuredProducts,
            'latestProducts' => $latestProducts,
            'categories' => $categories,
            'latestBlogs' => $latestBlogs,
            'meta' => [
                'title' => $resolvedTitle,
                'description' => $resolvedDescription,
                'keywords' => $resolvedKeywords,
                'ogImage' => $homePage?->og_image ?: ($seoSettings['og_image'] ?? '/images/og-default.jpg'),
            ]
        ]);
    }
}
