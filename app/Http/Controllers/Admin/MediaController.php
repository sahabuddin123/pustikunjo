<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class MediaController extends Controller
{
    /**
     * Get list of uploaded media files sorted by newest first
     */
    protected function getMediaList(): array
    {
        $uploadPath = public_path('uploads');
        if (!File::exists($uploadPath)) {
            File::makeDirectory($uploadPath, 0755, true);
        }

        $files = File::files($uploadPath);
        $mediaList = [];

        foreach ($files as $file) {
            $filename = $file->getFilename();
            $ext = strtolower($file->getExtension());
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'])) {
                $mediaList[] = [
                    'filename' => $filename,
                    'url' => asset('uploads/' . $filename),
                    'size' => round($file->getSize() / 1024, 2) . ' KB',
                    'updated_at' => date('Y-m-d H:i:s', $file->getMTime()),
                ];
            }
        }

        usort($mediaList, function ($a, $b) {
            return strcmp($b['updated_at'], $a['updated_at']);
        });

        return $mediaList;
    }

    /**
     * Inertia page index or raw JSON if explicitly requested via non-Inertia JSON
     */
    public function index(Request $request)
    {
        $mediaList = $this->getMediaList();

        // If it is an Inertia navigation request, ALWAYS return an Inertia view!
        if ($request->header('X-Inertia')) {
            return Inertia::render('Admin/Media/Index', [
                'media' => $mediaList,
            ]);
        }

        // Only return JSON if not an Inertia request and JSON is expected or requested
        if ($request->query('format') === 'json' || $request->expectsJson()) {
            return response()->json([
                'media' => $mediaList,
            ]);
        }

        return Inertia::render('Admin/Media/Index', [
            'media' => $mediaList,
        ]);
    }

    /**
     * Dedicated JSON endpoint for MediaPickerModal
     */
    public function apiList()
    {
        return response()->json([
            'media' => $this->getMediaList(),
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,svg,gif|max:10240',
        ]);

        $file = $request->file('image');
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
        
        $uploadPath = public_path('uploads');
        if (!File::exists($uploadPath)) {
            File::makeDirectory($uploadPath, 0755, true);
        }

        $file->move($uploadPath, $filename);
        $fullPath = $uploadPath . '/' . $filename;

        // Automatically convert to WebP if PNG/JPG
        $webpPath = app(\App\Services\Image\WebpConverterService::class)->convert($fullPath);

        $mediaItem = [
            'filename' => $filename,
            'url' => asset('uploads/' . $filename),
            'webp_url' => ($webpPath && file_exists($webpPath)) ? asset('uploads/' . basename($webpPath)) : null,
            'size' => round(filesize($fullPath) / 1024, 2) . ' KB',
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        // If Inertia visit, return back() with flash message
        if ($request->header('X-Inertia')) {
            return back()->with('success', 'ছবি সফলভাবে আপলোড ও WebP তে অপ্টিমাইজ হয়েছে!');
        }

        if ($request->expectsJson() || $request->query('format') === 'json') {
            return response()->json([
                'success' => true,
                'message' => 'ছবি সফলভাবে আপলোড ও WebP তে অপ্টিমাইজ হয়েছে!',
                'media' => $mediaItem,
            ]);
        }

        return back()->with('success', 'ছবি সফলভাবে আপলোড ও WebP তে অপ্টিমাইজ হয়েছে!');
    }

    /**
     * Dedicated JSON upload endpoint for MediaPickerModal
     */
    public function apiUpload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,svg,gif|max:10240',
        ]);

        $file = $request->file('image');
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
        
        $uploadPath = public_path('uploads');
        if (!File::exists($uploadPath)) {
            File::makeDirectory($uploadPath, 0755, true);
        }

        $file->move($uploadPath, $filename);
        $fullPath = $uploadPath . '/' . $filename;

        // Automatically convert to WebP if PNG/JPG
        $webpPath = app(\App\Services\Image\WebpConverterService::class)->convert($fullPath);

        return response()->json([
            'success' => true,
            'message' => 'ছবি সফলভাবে আপলোড ও WebP তে অপ্টিমাইজ হয়েছে!',
            'media' => [
                'filename' => $filename,
                'url' => asset('uploads/' . $filename),
                'webp_url' => ($webpPath && file_exists($webpPath)) ? asset('uploads/' . basename($webpPath)) : null,
                'size' => round(filesize($fullPath) / 1024, 2) . ' KB',
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ]);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
        ]);

        $filePath = public_path('uploads/' . basename($request->filename));
        $webpPath = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $filePath);

        $deleted = false;
        if (File::exists($filePath)) {
            File::delete($filePath);
            $deleted = true;
        }
        if (File::exists($webpPath) && $webpPath !== $filePath) {
            File::delete($webpPath);
            $deleted = true;
        }

        if ($deleted) {
            if ($request->header('X-Inertia')) {
                return back()->with('success', 'ফাইল মুছে ফেলা হয়েছে!');
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'ফাইল মুছে ফেলা হয়েছে!'
                ]);
            }
            return back()->with('success', 'ফাইল মুছে ফেলা হয়েছে!');
        }

        if ($request->header('X-Inertia')) {
            return back()->with('error', 'ফাইল খুঁজে পাওয়া যায়নি!');
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'ফাইল খুঁজে পাওয়া যায়নি!'
            ], 404);
        }

        return back()->with('error', 'ফাইল খুঁজে পাওয়া যায়নি!');
    }

    /**
     * Batch convert all images across site to WebP
     */
    public function convertAllWebp(\App\Services\Image\WebpConverterService $converter)
    {
        $directories = [
            public_path('images/banners'),
            public_path('images/products'),
            public_path('uploads'),
            storage_path('app/public'),
        ];

        $stats = $converter->convertDirectories($directories);

        return back()->with('success', "স্বয়ংক্রিয়ভাবে {$stats['converted']} টি ছবি WebP ফরম্যাটে অপ্টিমাইজ করা হয়েছে! (" . round($stats['bytes_saved'] / 1024, 2) . " KB সাইজ কমেছে)");
    }
}
