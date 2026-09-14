<?php

namespace App\Services\Image;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class WebpConverterService
{
    /**
     * Check if WebP conversion is supported in current environment.
     */
    public function isSupported(): bool
    {
        return function_exists('imagewebp') 
            || class_exists('\Imagick') 
            || $this->hasCliTool('cwebp') 
            || $this->hasCliTool('convert');
    }

    /**
     * Get active conversion driver name.
     */
    public function getDriver(): string
    {
        if (function_exists('imagewebp')) {
            return 'gd';
        }
        if (class_exists('\Imagick')) {
            return 'imagick';
        }
        if ($this->hasCliTool('cwebp')) {
            return 'cwebp_cli';
        }
        if ($this->hasCliTool('convert')) {
            return 'imagemagick_cli';
        }
        return 'none';
    }

    protected function hasCliTool(string $tool): bool
    {
        if (!function_exists('exec')) {
            return false;
        }
        $output = [];
        $returnVar = 1;
        @exec("which {$tool} 2>&1", $output, $returnVar);
        return $returnVar === 0 && !empty($output[0]);
    }

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
        if (!file_exists($sourcePath)) {
            return null;
        }

        $extension = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));
        if ($extension === 'webp') {
            @chmod($sourcePath, 0666);
            return $sourcePath;
        }

        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'bmp'])) {
            return null;
        }

        $targetPath = preg_replace('/\.(jpg|jpeg|png|bmp)$/i', '.webp', $sourcePath);

        // Driver 1: GD imagewebp
        if (function_exists('imagewebp')) {
            try {
                $rawContent = @file_get_contents($sourcePath);
                if ($rawContent) {
                    $image = @imagecreatefromstring($rawContent);
                    if ($image) {
                        if (!imageistruecolor($image)) {
                            imagepalettetotruecolor($image);
                        }
                        imagealphablending($image, true);
                        imagesavealpha($image, true);

                        $success = @imagewebp($image, $targetPath, $quality);
                        @imagedestroy($image);

                        if ($success && file_exists($targetPath) && filesize($targetPath) > 0) {
                            @chmod($targetPath, 0666);
                            if (!$keepOriginal && $sourcePath !== $targetPath) {
                                @unlink($sourcePath);
                            }
                            return $targetPath;
                        }
                    }
                }
            } catch (\Throwable $e) {
                Log::warning("GD Webp conversion failed for [{$sourcePath}]: " . $e->getMessage());
            }
        }

        // Driver 2: Imagick extension
        if (class_exists('\Imagick')) {
            try {
                $imagick = new \Imagick($sourcePath);
                $imagick->setImageFormat('webp');
                $imagick->setImageCompressionQuality($quality);
                $imagick->writeImage($targetPath);
                $imagick->clear();
                $imagick->destroy();

                if (file_exists($targetPath) && filesize($targetPath) > 0) {
                    @chmod($targetPath, 0666);
                    if (!$keepOriginal && $sourcePath !== $targetPath) {
                        @unlink($sourcePath);
                    }
                    return $targetPath;
                }
            } catch (\Throwable $e) {
                Log::warning("Imagick Webp conversion failed for [{$sourcePath}]: " . $e->getMessage());
            }
        }

        // Driver 3: cwebp CLI binary
        if ($this->hasCliTool('cwebp')) {
            try {
                $cmd = sprintf('cwebp -q %d %s -o %s 2>&1', $quality, escapeshellarg($sourcePath), escapeshellarg($targetPath));
                @exec($cmd);
                if (file_exists($targetPath) && filesize($targetPath) > 0) {
                    @chmod($targetPath, 0666);
                    if (!$keepOriginal && $sourcePath !== $targetPath) {
                        @unlink($sourcePath);
                    }
                    return $targetPath;
                }
            } catch (\Throwable $e) {
                Log::warning("cwebp CLI conversion failed for [{$sourcePath}]: " . $e->getMessage());
            }
        }

        // Driver 4: ImageMagick CLI binary
        if ($this->hasCliTool('convert')) {
            try {
                $cmd = sprintf('convert %s -quality %d %s 2>&1', escapeshellarg($sourcePath), $quality, escapeshellarg($targetPath));
                @exec($cmd);
                if (file_exists($targetPath) && filesize($targetPath) > 0) {
                    @chmod($targetPath, 0666);
                    if (!$keepOriginal && $sourcePath !== $targetPath) {
                        @unlink($sourcePath);
                    }
                    return $targetPath;
                }
            } catch (\Throwable $e) {
                Log::warning("convert CLI conversion failed for [{$sourcePath}]: " . $e->getMessage());
            }
        }

        // If empty file was created on failure, remove it
        if (file_exists($targetPath) && filesize($targetPath) === 0) {
            @unlink($targetPath);
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
