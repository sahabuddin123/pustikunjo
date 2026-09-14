<?php

namespace App\Services\Image;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class WebpConverterService
{
    /**
     * Convert an image file (PNG, JPG, JPEG) to WebP format.
     *
     * @param string $sourcePath Absolute path to the source image
     * @param int $quality Compression quality (1-100, default 82)
     * @param bool $keepOriginal Whether to keep original file
     * @return string|null Path to the converted webp file, or null on failure
     */
    public function convert(string $sourcePath, int $quality = 82, bool $keepOriginal = true): ?string
    {
        if (!file_exists($sourcePath) || !function_exists('imagewebp')) {
            return null;
        }

        $extension = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));
        if ($extension === 'webp') {
            return $sourcePath;
        }

        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'bmp'])) {
            return null;
        }

        $targetPath = preg_replace('/\.(jpg|jpeg|png|bmp)$/i', '.webp', $sourcePath);

        try {
            $imageInfo = @getimagesize($sourcePath);
            if (!$imageInfo) {
                return null;
            }

            $mime = $imageInfo['mime'];
            $image = null;

            if ($mime === 'image/jpeg') {
                $image = @imagecreatefromjpeg($sourcePath);
            } elseif ($mime === 'image/png') {
                $image = @imagecreatefrompng($sourcePath);
                if ($image) {
                    imagepalettetotruecolor($image);
                    imagealphablending($image, true);
                    imagesavealpha($image, true);
                }
            } elseif ($mime === 'image/bmp') {
                if (function_exists('imagecreatefrombmp')) {
                    $image = @imagecreatefrombmp($sourcePath);
                }
            }

            if (!$image) {
                return null;
            }

            // Save as WebP
            $success = @imagewebp($image, $targetPath, $quality);
            @imagedestroy($image);

            if ($success && file_exists($targetPath)) {
                if (!$keepOriginal && $sourcePath !== $targetPath) {
                    @unlink($sourcePath);
                }
                return $targetPath;
            }
        } catch (\Throwable $e) {
            Log::warning("Webp conversion failed for [{$sourcePath}]: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Batch convert all images in specified directories.
     *
     * @param array $directories List of directory paths (relative or absolute)
     * @param int $quality
     * @return array Summary of conversion results
     */
    public function convertDirectories(array $directories, int $quality = 82): array
    {
        $stats = [
            'scanned' => 0,
            'converted' => 0,
            'skipped' => 0,
            'failed' => 0,
            'bytes_saved' => 0,
        ];

        foreach ($directories as $dir) {
            $fullDir = str_starts_with($dir, '/') || preg_match('/^[a-zA-Z]:\\\\/', $dir)
                ? $dir
                : base_path($dir);

            if (!is_dir($fullDir)) {
                continue;
            }

            $files = File::allFiles($fullDir);
            foreach ($files as $file) {
                $ext = strtolower($file->getExtension());
                if (!in_array($ext, ['jpg', 'jpeg', 'png'])) {
                    continue;
                }

                $stats['scanned']++;
                $sourcePath = $file->getRealPath();
                $webpPath = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $sourcePath);

                $originalSize = $file->getSize();

                // Convert
                $result = $this->convert($sourcePath, $quality, true);
                if ($result && file_exists($webpPath)) {
                    $stats['converted']++;
                    $newSize = filesize($webpPath);
                    if ($originalSize > $newSize) {
                        $stats['bytes_saved'] += ($originalSize - $newSize);
                    }
                } else {
                    $stats['failed']++;
                }
            }
        }

        return $stats;
    }
}
