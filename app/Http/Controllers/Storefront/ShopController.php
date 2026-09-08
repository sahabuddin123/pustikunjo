<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        // Search
        if ($request->filled('q')) {
            $searchTerm = $request->input('q');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('sku', 'like', "%{$searchTerm}%")
                  ->orWhere('short_description', 'like', "%{$searchTerm}%");
            });
        }

        // Category Filter
        if ($request->filled('category')) {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Price Sorting
        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'popular' => $query->orderBy('is_featured', 'desc')->latest(),
            default => $query->latest(),
        };

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::withCount('products')->where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Storefront/Shop', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'q' => $request->input('q', ''),
                'category' => $request->input('category', ''),
                'sort' => $sort,
            ],
            'meta' => [
                'title' => 'সকল পণ্য — পুষ্টি কুঞ্জ',
                'description' => 'পুষ্টি কুঞ্জের সকল প্রাকৃতিক ও খাঁটি পুষ্টিকর স্বাস্থ্য পণ্য ব্রাউজ করুন।',
            ]
        ]);
    }

    public function category($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        
        $products = Product::with('category')
            ->where('category_id', $category->id)
            ->where('is_active', true)
            ->latest()
            ->paginate(12);

        $categories = Category::withCount('products')->where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Storefront/Shop', [
            'category' => $category,
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $slug,
                'sort' => 'latest',
            ],
            'meta' => [
                'title' => $category->name . ' — পুষ্টি কুঞ্জ',
                'description' => $category->description ?: $category->name . ' ক্যাটাগরির প্রিমিয়াম স্বাস্থ্য পণ্য সমূহ।',
            ]
        ]);
    }
}
