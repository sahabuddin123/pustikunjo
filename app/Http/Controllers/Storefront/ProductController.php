<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use App\Models\SiteSetting;
use App\Services\Payment\BkashService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show($slug)
    {
        $product = Product::with(['category', 'reviews' => function ($q) {
            $q->latest();
        }])->where('slug', $slug)->where('is_active', true)->firstOrFail();

        $relatedProducts = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        $shippingZones = SiteSetting::get('shipping_zones', [
            ['name' => 'ঢাকার ভিতরে', 'fee' => 60],
            ['name' => 'ঢাকার বাইরে', 'fee' => 120],
        ]);

        $bkashSettings = app(BkashService::class)->getSettings();

        // Product Schema.org JSON-LD
        $schemaJsonLd = [
            '@context' => 'https://schema.org/',
            '@type' => 'Product',
            'name' => $product->name,
            'image' => [url($product->primary_image)],
            'description' => strip_tags($product->short_description ?: $product->description ?: $product->name),
            'sku' => $product->sku,
            'brand' => [
                '@type' => 'Brand',
                'name' => 'Pusti Kunjo',
            ],
            'offers' => [
                '@type' => 'Offer',
                'url' => url('/product/' . $product->slug),
                'priceCurrency' => 'BDT',
                'price' => $product->effective_price,
                'availability' => $product->stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            ]
        ];

        return Inertia::render('Storefront/ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'shippingZones' => $shippingZones,
            'bkashSettings' => [
                'manual_enabled' => $bkashSettings['manual_enabled'] ?? true,
                'manual_type' => $bkashSettings['manual_type'] ?? 'merchant',
                'manual_number' => $bkashSettings['manual_number'] ?? '01700000000',
                'manual_instructions' => $bkashSettings['manual_instructions'] ?? 'অর্ডার কনফার্ম করতে {amount} টাকা {number} নম্বরে সেন্ড মানি করুন। সেন্ড মানি করার পর নিচে ট্রানজেকশন আইডি (TrxID) লিখুন।',
                'pgw_enabled' => $bkashSettings['pgw_enabled'] ?? false,
            ],
            'schemaJsonLd' => $schemaJsonLd,
            'meta' => [
                'title' => ($product->meta_title ?: $product->name) . ' — পুষ্টি কুঞ্জ',
                'description' => $product->meta_description ?: strip_tags($product->short_description),
                'ogImage' => $product->og_image ?: url($product->primary_image),
                'sku' => $product->sku,
            ]
        ]);
    }

    public function submitReview(Request $request, $id)
    {
        $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_phone' => 'nullable|string|max:20',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $product = Product::findOrFail($id);

        Review::create([
            'product_id' => $product->id,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => true, // Auto approved for high responsiveness
        ]);

        return back()->with('success', 'আপনার মূল্যবান মতামতের জন্য ধন্যবাদ!');
    }
}
