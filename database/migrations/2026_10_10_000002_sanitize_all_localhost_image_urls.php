<?php

use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $cleanString = function (?string $str): ?string {
            if ($str === null || $str === '') {
                return $str;
            }
            // Standard URLs
            $str = preg_replace('#https?://(?:127\.0\.0\.1|localhost)(?::\d+)?/#i', '/', $str);
            // JSON escaped slash URLs
            $str = preg_replace('#https?:\\\\/\\\\/(?:127\.0\.0\.1|localhost)(?::\d+)?\\\\/#i', '\/', $str);
            return $str;
        };

        // 1. Sanitize Pages (blocks and content)
        $pages = Page::all();
        foreach ($pages as $page) {
            $updates = [];
            if (!empty($page->blocks)) {
                $json = json_encode($page->blocks, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $cleaned = $cleanString($json);
                $updates['blocks'] = json_decode($cleaned, true);
            }
            if (!empty($page->content) && is_string($page->content)) {
                $updates['content'] = $cleanString($page->content);
            }
            if (!empty($updates)) {
                $page->update($updates);
            }
        }

        // 2. Sanitize SiteSettings
        $settings = SiteSetting::all();
        foreach ($settings as $setting) {
            $rawVal = $setting->getRawOriginal('value') ?? $setting->value;
            if (is_string($rawVal)) {
                $decoded = json_decode($rawVal, true);
                if (json_last_error() === JSON_ERROR_NONE && (is_array($decoded) || is_object($decoded))) {
                    $json = json_encode($decoded, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    $cleaned = $cleanString($json);
                    $setting->update(['value' => $cleaned]);
                } else {
                    $cleaned = $cleanString($rawVal);
                    $setting->update(['value' => $cleaned]);
                }
            } elseif (is_array($rawVal)) {
                $json = json_encode($rawVal, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $cleaned = $cleanString($json);
                $setting->update(['value' => json_decode($cleaned, true)]);
            }

            try {
                Cache::forget("site_setting_{$setting->key}");
            } catch (\Throwable $e) {
                // Ignore cache error
            }
        }

        // 3. Sanitize Products
        $products = Product::all();
        foreach ($products as $prod) {
            $prodUpdates = [];
            if (!empty($prod->primary_image)) {
                $prodUpdates['primary_image'] = $cleanString($prod->primary_image);
            }
            if (!empty($prod->images) && is_array($prod->images)) {
                $json = json_encode($prod->images, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $cleaned = $cleanString($json);
                $prodUpdates['images'] = json_decode($cleaned, true);
            }
            if (!empty($prodUpdates)) {
                $prod->update($prodUpdates);
            }
        }

        // 4. Sanitize Categories
        $categories = Category::all();
        foreach ($categories as $cat) {
            if (!empty($cat->image)) {
                $cat->update([
                    'image' => $cleanString($cat->image),
                ]);
            }
        }

        // 5. Clear application caches
        try {
            Cache::flush();
        } catch (\Throwable $e) {
            // Ignore cache flush failures
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Irreversible sanitize migration
    }
};
