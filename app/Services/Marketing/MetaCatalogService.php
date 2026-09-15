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

    /**
     * Generate Meta / Facebook Catalog XML (RSS 2.0) feed content
     */
    public function generateXml(): string
    {
        $products = Product::with('category')->where('is_active', true)->get();
        $brandName = SiteSetting::get('site_name', 'পুষ্টি কুঞ্জ (Pusti Kunjo)');
        $siteUrl = url('/');

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">' . "\n";
        $xml .= '  <channel>' . "\n";
        $xml .= '    <title>' . htmlspecialchars($brandName, ENT_XML1, 'UTF-8') . '</title>' . "\n";
        $xml .= '    <link>' . htmlspecialchars($siteUrl, ENT_XML1, 'UTF-8') . '</link>' . "\n";
        $xml .= '    <description>Facebook / Meta Product Catalog Feed</description>' . "\n";

        foreach ($products as $product) {
            $availability = $product->stock > 0 ? 'in stock' : 'out of stock';
            $priceFormatted = number_format($product->price, 2, '.', '') . ' BDT';
            $salePriceFormatted = ($product->sale_price && $product->sale_price > 0 && $product->sale_price < $product->price)
                ? number_format($product->sale_price, 2, '.', '') . ' BDT'
                : '';
            $productUrl = url('/product/' . $product->slug);
            $rawImg = $product->primary_image;
            $imageUrl = (str_starts_with($rawImg, 'http://') || str_starts_with($rawImg, 'https://'))
                ? $rawImg
                : url($rawImg);
            $description = strip_tags($product->short_description ?: $product->description ?: $product->name);

            $xml .= '    <item>' . "\n";
            $xml .= '      <g:id>' . htmlspecialchars($product->sku ?: ('PK-' . $product->id), ENT_XML1, 'UTF-8') . '</g:id>' . "\n";
            $xml .= '      <g:title>' . htmlspecialchars($product->name, ENT_XML1, 'UTF-8') . '</g:title>' . "\n";
            $xml .= '      <g:description>' . htmlspecialchars($description, ENT_XML1, 'UTF-8') . '</g:description>' . "\n";
            $xml .= '      <g:link>' . htmlspecialchars($productUrl, ENT_XML1, 'UTF-8') . '</g:link>' . "\n";
            $xml .= '      <g:image_link>' . htmlspecialchars($imageUrl, ENT_XML1, 'UTF-8') . '</g:image_link>' . "\n";
            $xml .= '      <g:brand>' . htmlspecialchars($brandName, ENT_XML1, 'UTF-8') . '</g:brand>' . "\n";
            $xml .= '      <g:condition>new</g:condition>' . "\n";
            $xml .= '      <g:availability>' . $availability . '</g:availability>' . "\n";
            $xml .= '      <g:price>' . $priceFormatted . '</g:price>' . "\n";
            if (!empty($salePriceFormatted)) {
                $xml .= '      <g:sale_price>' . $salePriceFormatted . '</g:sale_price>' . "\n";
            }
            if ($product->category) {
                $xml .= '      <g:product_type>' . htmlspecialchars($product->category->name, ENT_XML1, 'UTF-8') . '</g:product_type>' . "\n";
            }
            $xml .= '    </item>' . "\n";
        }

        $xml .= '  </channel>' . "\n";
        $xml .= '</rss>';

        return $xml;
    }
}
