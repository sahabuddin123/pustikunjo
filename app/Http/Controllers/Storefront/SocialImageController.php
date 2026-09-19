<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;

class SocialImageController extends Controller
{
    /**
     * Generate or serve a guaranteed JPEG social preview image for WhatsApp / Facebook
     */
    public function productImage(string $slug)
    {
        $cacheDir = public_path('images/social');
        if (!File::exists($cacheDir)) {
            File::makeDirectory($cacheDir, 0777, true);
        }

        $cleanSlug = preg_replace('/[^a-zA-Z0-9_-]/', '', $slug);
        $cachedPath = $cacheDir . '/product_' . $cleanSlug . '.jpg';

        // Serve cached file if fresh (less than 7 days old)
        if (File::exists($cachedPath) && (time() - File::lastModified($cachedPath) < 604800) && filesize($cachedPath) > 0) {
            return response(file_get_contents($cachedPath), 200, [
                'Content-Type' => 'image/jpeg',
                'Cache-Control' => 'public, max-age=604800',
                'Content-Length' => filesize($cachedPath),
            ]);
        }

        // Find product
        $product = Product::where('slug', $slug)->first();
        $sourcePath = null;

        if ($product) {
            $imgCandidate = $product->og_image ?: $product->primary_image;
            if ($imgCandidate) {
                // Remove query strings
                $imgPath = parse_url($imgCandidate, PHP_URL_PATH);
                $fullPath = public_path(ltrim($imgPath, '/'));
                if (File::exists($fullPath)) {
                    $sourcePath = $fullPath;
                }
            }
        }

        // Fallbacks if not found
        if (!$sourcePath || !File::exists($sourcePath)) {
            $fallbacks = [
                public_path('images/placeholder-product.jpg'),
                public_path('images/placeholder-product.png'),
            ];
            foreach ($fallbacks as $fb) {
                if (File::exists($fb)) {
                    $sourcePath = $fb;
                    break;
                }
            }
        }

        if (!$sourcePath || !File::exists($sourcePath)) {
            return $this->generateDummySocialImage($cachedPath, $product ? $product->name : 'Pusti Kunjo');
        }

        // Convert source image (WebP, PNG, JPG) to a high-quality JPEG under 300KB
        $jpegData = $this->convertToSocialJpeg($sourcePath, $cachedPath);
        if ($jpegData) {
            return response($jpegData, 200, [
                'Content-Type' => 'image/jpeg',
                'Cache-Control' => 'public, max-age=604800',
                'Content-Length' => strlen($jpegData),
            ]);
        }

        return response(file_get_contents($sourcePath), 200, [
            'Content-Type' => 'image/jpeg',
        ]);
    }

    /**
     * Site-wide social preview (for homepage & general links)
     */
    public function siteImage()
    {
        $cacheDir = public_path('images/social');
        if (!File::exists($cacheDir)) {
            File::makeDirectory($cacheDir, 0777, true);
        }

        $cachedPath = $cacheDir . '/site_social.jpg';
        if (File::exists($cachedPath) && (time() - File::lastModified($cachedPath) < 604800) && filesize($cachedPath) > 0) {
            return response(file_get_contents($cachedPath), 200, [
                'Content-Type' => 'image/jpeg',
                'Cache-Control' => 'public, max-age=604800',
            ]);
        }

        $seo = SiteSetting::get('seo_settings', []);
        $general = SiteSetting::get('general_settings', []);
        $candidate = $seo['og_image'] ?? ($general['logo'] ?? null);

        $sourcePath = null;
        if ($candidate) {
            $cleanPath = parse_url($candidate, PHP_URL_PATH);
            $full = public_path(ltrim($cleanPath, '/'));
            if (File::exists($full)) {
                $sourcePath = $full;
            }
        }

        if (!$sourcePath) {
            // Pick first available banner or product
            $firstBanner = File::glob(public_path('images/banners/*.*'));
            if (!empty($firstBanner)) {
                $sourcePath = $firstBanner[0];
            }
        }

        if ($sourcePath && File::exists($sourcePath)) {
            $jpegData = $this->convertToSocialJpeg($sourcePath, $cachedPath);
            if ($jpegData) {
                return response($jpegData, 200, [
                    'Content-Type' => 'image/jpeg',
                    'Cache-Control' => 'public, max-age=604800',
                ]);
            }
        }

        return $this->generateDummySocialImage($cachedPath, 'Pusti Kunjo');
    }

    /**
     * Convert any image into a standard 600x600 or proportional JPEG optimized for WhatsApp (< 300KB)
     */
    protected function convertToSocialJpeg(string $sourcePath, string $targetPath): ?string
    {
        try {
            $ext = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));
            $srcImg = null;

            if ($ext === 'webp' && function_exists('imagecreatefromwebp')) {
                $srcImg = @imagecreatefromwebp($sourcePath);
            } elseif ($ext === 'png' && function_exists('imagecreatefrompng')) {
                $srcImg = @imagecreatefrompng($sourcePath);
            } elseif (in_array($ext, ['jpg', 'jpeg']) && function_exists('imagecreatefromjpeg')) {
                $srcImg = @imagecreatefromjpeg($sourcePath);
            }

            if (!$srcImg) {
                $raw = @file_get_contents($sourcePath);
                if ($raw) {
                    $srcImg = @imagecreatefromstring($raw);
                }
            }

            if (!$srcImg) {
                return null;
            }

            $origW = imagesx($srcImg);
            $origH = imagesy($srcImg);

            // Target max 800x800 for social thumbnail
            $maxDim = 800;
            if ($origW > $maxDim || $origH > $maxDim) {
                $ratio = min($maxDim / $origW, $maxDim / $origH);
                $newW = (int) round($origW * $ratio);
                $newH = (int) round($origH * $ratio);
            } else {
                $newW = $origW;
                $newH = $origH;
            }

            // Create canvas with white background so transparent PNGs render cleanly
            $canvas = imagecreatetruecolor($newW, $newH);
            $white = imagecolorallocate($canvas, 255, 255, 255);
            imagefill($canvas, 0, 0, $white);

            imagecopyresampled($canvas, $srcImg, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
            imagedestroy($srcImg);

            // Save as JPEG with quality 85
            imagejpeg($canvas, $targetPath, 85);
            imagedestroy($canvas);

            if (File::exists($targetPath) && filesize($targetPath) > 0) {
                @chmod($targetPath, 0666);
                return file_get_contents($targetPath);
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Social JPEG conversion failed: ' . $e->getMessage());
        }

        return null;
    }

    protected function generateDummySocialImage(string $targetPath, string $text): Response
    {
        $canvas = imagecreatetruecolor(600, 600);
        $green = imagecolorallocate($canvas, 13, 104, 56);
        imagefill($canvas, 0, 0, $green);

        $white = imagecolorallocate($canvas, 255, 255, 255);
        imagestring($canvas, 5, 240, 290, 'Pusti Kunjo', $white);

        imagejpeg($canvas, $targetPath, 85);
        imagedestroy($canvas);

        return response(file_get_contents($targetPath), 200, [
            'Content-Type' => 'image/jpeg',
            'Cache-Control' => 'public, max-age=604800',
        ]);
    }
}
