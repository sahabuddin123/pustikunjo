<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Services\Marketing\MetaCatalogService;
use Illuminate\Http\Response;

class FeedController extends Controller
{
    protected MetaCatalogService $catalogService;

    public function __construct(MetaCatalogService $catalogService)
    {
        $this->catalogService = $catalogService;
    }

    /**
     * Generate Meta / Facebook Catalog CSV
     */
    public function facebookCatalog()
    {
        $csvContent = $this->catalogService->generateCsv();

        return response($csvContent, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'inline; filename="facebook_catalog.csv"',
            'Cache-Control' => 'max-age=3600, public',
        ]);
    }

    /**
     * Generate dynamic sitemap.xml
     */
    public function sitemap()
    {
        $baseUrl = url('/');
        $products = Product::where('is_active', true)->get();
        $categories = Category::where('is_active', true)->get();
        $pages = Page::where('is_published', true)->get();
        $blogs = BlogPost::where('is_published', true)->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Static routes
        $xml .= "<url><loc>{$baseUrl}</loc><priority>1.0</priority><changefreq>daily</changefreq></url>";
        $xml .= "<url><loc>{$baseUrl}/shop</loc><priority>0.9</priority><changefreq>daily</changefreq></url>";
        $xml .= "<url><loc>{$baseUrl}/blog</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>";
        $xml .= "<url><loc>{$baseUrl}/track-order</loc><priority>0.5</priority></url>";

        // Products
        foreach ($products as $p) {
            $url = url('/product/' . $p->slug);
            $lastmod = $p->updated_at->toAtomString();
            $xml .= "<url><loc>{$url}</loc><lastmod>{$lastmod}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq></url>";
        }

        // Categories
        foreach ($categories as $c) {
            $url = url('/category/' . $c->slug);
            $xml .= "<url><loc>{$url}</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>";
        }

        // Custom Pages
        foreach ($pages as $pg) {
            $url = url('/' . ltrim($pg->slug, '/'));
            $xml .= "<url><loc>{$url}</loc><priority>0.6</priority></url>";
        }

        // Blog posts
        foreach ($blogs as $b) {
            $url = url('/blog/' . $b->slug);
            $xml .= "<url><loc>{$url}</loc><priority>0.6</priority></url>";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }

    /**
     * Generate dynamic robots.txt
     */
    public function robots()
    {
        $customRobots = SiteSetting::get('robots_txt', null);
        if ($customRobots) {
            return response($customRobots, 200, ['Content-Type' => 'text/plain']);
        }

        $sitemapUrl = url('/sitemap.xml');
        $content = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /checkout\nDisallow: /order-success\n\nSitemap: {$sitemapUrl}\n";

        return response($content, 200, ['Content-Type' => 'text/plain']);
    }
}
