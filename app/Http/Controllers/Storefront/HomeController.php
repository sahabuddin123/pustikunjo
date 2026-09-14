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
        
        $allProducts = Product::with('category')
            ->where('is_active', true)
            ->get();

        $featuredProducts = $allProducts->where('is_featured', true)->take(8)->values();
        $latestProducts = $allProducts->sortByDesc('created_at')->take(8)->values();

        $categories = Category::withCount(['products' => function ($q) {
            $q->where('is_active', true);
        }])
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->get();

        $latestBlogs = BlogPost::where('is_published', true)
            ->latest()
            ->take(3)
            ->get();

        $seoSettings = SiteSetting::get('seo_settings', []);

        return Inertia::render('Storefront/Home', [
            'page' => $homePage,
            'products' => $allProducts,
            'featuredProducts' => $featuredProducts,
            'latestProducts' => $latestProducts,
            'categories' => $categories,
            'latestBlogs' => $latestBlogs,
            'meta' => [
                'title' => $homePage?->meta_title ?: ($seoSettings['meta_title'] ?? 'পুষ্টি কুঞ্জ (Pusti Kunjo) | ১০০% খাঁটি অর্গানিক ও ভেষজ পুষ্টি পণ্য'),
                'description' => $homePage?->meta_description ?: ($seoSettings['meta_description'] ?? 'পুষ্টি কুঞ্জ (Pusti Kunjo) — বাংলাদেশের বিশ্বস্ত অর্গানিক ফুড ব্র্যান্ড। ১০০% খাঁটি রোজেলা চা, বিটরুট পাউডার, মেথি মিক্স ও প্রিমিয়াম চিয়া সিড। ক্যাশ অন ডেলিভারি!'),
                'keywords' => $seoSettings['meta_keywords'] ?? 'পুষ্টি কুঞ্জ, Pusti Kunjo, pustikunjo, অর্গানিক ফুড বাংলাদেশ, রোজেলা চা, বিটরুট পাউডার, মেথি মিক্স, চিয়া সিড, ভেষজ পুষ্টি পণ্য, সুপারফুড',
                'ogImage' => $homePage?->og_image ?: ($seoSettings['og_image'] ?? '/images/og-default.jpg'),
            ]
        ]);
    }
}
