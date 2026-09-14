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
            // Read source file content into memory for bulletproof decoding
            $rawContent = @file_get_contents($sourcePath);
            if (!$rawContent) {
                return null;
            }

            $image = @imagecreatefromstring($rawContent);
            if (!$image) {
                return null;
            }

            // Ensure truecolor and transparency support
            if (!imageistruecolor($image)) {
                imagepalettetotruecolor($image);
            }
            imagealphablending($image, true);
            imagesavealpha($image, true);

            // Save as WebP
            $success = @imagewebp($image, $targetPath, $quality);
            @imagedestroy($image);

            if ($success && file_exists($targetPath) && filesize($targetPath) > 0) {
                // Ensure readable permissions on Linux/aaPanel for Nginx (www user)
                @chmod($targetPath, 0666);

                if (!$keepOriginal && $sourcePath !== $targetPath) {
                    @unlink($sourcePath);
                }
                return $targetPath;
            }

            // If empty file was created on failure, remove it
            if (file_exists($targetPath) && filesize($targetPath) === 0) {
                @unlink($targetPath);
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

            // Ensure directory has proper permissions
            @chmod($fullDir, 0777);

            $files = File::allFiles($fullDir);
            foreach ($files as $file) {
                $ext = strtolower($file->getExtension());
                if (!in_array($ext, ['jpg', 'jpeg', 'png', 'bmp'])) {
                    if ($ext === 'webp') {
                        @chmod($file->getRealPath(), 0666);
                    }
                    continue;
                }

                $stats['scanned']++;
                $sourcePath = $file->getRealPath();
                $webpPath = preg_replace('/\.(jpg|jpeg|png|bmp)$/i', '.webp', $sourcePath);

                $originalSize = $file->getSize();

                // Convert
                $result = $this->convert($sourcePath, $quality, true);
                if ($result && file_exists($webpPath) && filesize($webpPath) > 0) {
                    $stats['converted']++;
                    $newSize = filesize($webpPath);
                    if ($originalSize > $newSize) {
                        $stats['bytes_saved'] += ($originalSize - $newSize);
                    }
                    @chmod($webpPath, 0666);
                } else {
                    $stats['failed']++;
                }
            }
        }

        return $stats;
    }
}
