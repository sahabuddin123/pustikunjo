<?php

namespace App\Console\Commands;

use App\Services\Image\WebpConverterService;
use Illuminate\Console\Command;

class ConvertImagesToWebpCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:convert-webp 
                            {--dir=* : Specific directory to convert} 
                            {--quality=82 : WebP quality (1-100)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically convert all PNG and JPG images to optimized WebP format';

    /**
     * Execute the console command.
     */
    public function handle(WebpConverterService $converter): int
    {
        $this->info('Starting automatic WebP image conversion...');

        $customDirs = $this->option('dir');
        $quality = (int) $this->option('quality');

        $directories = !empty($customDirs) ? $customDirs : [
            public_path('images/banners'),
            public_path('images/products'),
            public_path('uploads'),
            storage_path('app/public'),
        ];

        $driver = $converter->getDriver();
        $this->line("Active WebP driver: <info>{$driver}</info>");

        if ($driver === 'none') {
            $this->newLine();
            $this->error("❌ WebP কনভার্ট করার কোনো ড্রাইভার (GD বা Imagick) এই PHP CLI তে পাওয়া যায়নি!");
            $this->warn("বর্তমান CLI PHP (" . PHP_BINARY . ") তে GD বা Imagick এক্সটেনশন লোড হয়নি।");
            $this->newLine();
            $this->line("<comment>💡 aaPanel সার্ভারে ওয়েবসাইটের পিএইচপি দিয়ে কমান্ডটি রান করুন:</comment>");
            $this->line("   <info>/www/server/php/82/bin/php artisan images:convert-webp</info>");
            $this->line("   অথবা");
            $this->line("   <info>/www/server/php/83/bin/php artisan images:convert-webp</info>");
            $this->newLine();
            return self::FAILURE;
        }

        $this->line("Target directories: " . implode(', ', array_map('basename', $directories)));

        $stats = $converter->convertDirectories($directories, $quality);

        // Ensure permissions across all target directories so Nginx/webserver can read files
        foreach ($directories as $dir) {
            if (is_dir($dir)) {
                @chmod($dir, 0777);
                try {
                    $files = \Illuminate\Support\Facades\File::allFiles($dir);
                    foreach ($files as $file) {
                        @chmod($file->getRealPath(), 0666);
                    }
                } catch (\Throwable $e) {}
            }
        }

        $this->newLine();
        $this->info("✓ Conversion complete!");
        $this->table(
            ['Metric', 'Count / Value'],
            [
                ['Total Images Scanned', $stats['scanned']],
                ['Successfully Converted to WebP', $stats['converted']],
                ['Failed Conversions', $stats['failed']],
                ['Total Bandwidth / Storage Saved', round($stats['bytes_saved'] / 1024, 2) . ' KB'],
            ]
        );

        return self::SUCCESS;
    }
}
