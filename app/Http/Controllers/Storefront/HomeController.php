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

        return Inertia::render('Storefront/Home', [
            'page' => $homePage,
            'products' => $allProducts,
            'featuredProducts' => $featuredProducts,
            'latestProducts' => $latestProducts,
            'categories' => $categories,
            'latestBlogs' => $latestBlogs,
            'meta' => [
                'title' => $homePage?->meta_title ?: 'খাঁটি ও প্রাকৃতিক স্বাস্থ্য পণ্য',
                'description' => $homePage?->meta_description ?: 'পুষ্টি কুঞ্জ - আপনার সুস্বাস্থ্যের বিশ্বস্ত ঠিকানা। ১০০% প্রাকৃতিক ও নির্ভেজাল উপাদান।',
                'ogImage' => $homePage?->og_image ?: '/images/og-default.jpg',
            ]
        ]);
    }
}
