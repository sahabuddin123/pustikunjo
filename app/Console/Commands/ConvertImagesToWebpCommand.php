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

        $this->line("Target directories: " . implode(', ', array_map('basename', $directories)));

        $stats = $converter->convertDirectories($directories, $quality);

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
