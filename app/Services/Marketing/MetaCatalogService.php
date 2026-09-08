<?php

namespace App\Services\Marketing;

use App\Models\Product;
use App\Models\SiteSetting;

class MetaCatalogService
{
    /**
     * Generate Meta / Facebook Catalog CSV feed content
     */
    public function generateCsv(): string
    {
        $products = Product::with('category')->where('is_active', true)->get();
        $brandName = SiteSetting::get('site_name', 'Pusti Kunjo');
        $siteUrl = config('app.url', 'https://pustikunjo.com.bd');

        $headers = [
            'id',
            'title',
            'description',
            'availability',
            'condition',
            'price',
            'sale_price',
            'link',
            'image_link',
            'brand',
            'product_type',
            'inventory'
        ];

        $output = fopen('php://temp', 'r+');
        fputcsv($output, $headers);

        foreach ($products as $product) {
            $availability = $product->stock > 0 ? 'in stock' : 'out of stock';
            $priceFormatted = number_format($product->price, 2, '.', '') . ' BDT';
            $salePriceFormatted = $product->sale_price ? number_format($product->sale_price, 2, '.', '') . ' BDT' : '';
            $productUrl = url('/product/' . $product->slug);
            $imageUrl = url($product->primary_image);

            fputcsv($output, [
                $product->sku, // Matches Pixel content_ids
                $product->name,
                strip_tags($product->short_description ?: $product->description ?: $product->name),
                $availability,
                'new',
                $priceFormatted,
                $salePriceFormatted,
                $productUrl,
                $imageUrl,
                $brandName,
                $product->category ? $product->category->name : 'স্বাস্থ্য পণ্য',
                $product->stock
            ]);
        }

        rewind($output);
        $csvContent = stream_get_contents($output);
        fclose($output);

        return $csvContent;
    }
}
