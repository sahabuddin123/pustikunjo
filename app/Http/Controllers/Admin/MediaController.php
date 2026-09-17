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
            File::makeDirectory($uploadPath, 0777, true);
        } else {
            @chmod($uploadPath, 0777);
        }

        $files = File::files($uploadPath);
        $mediaList = [];

        foreach ($files as $file) {
            $filename = $file->getFilename();
            $ext = strtolower($file->getExtension());
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'])) {
                @chmod($file->getRealPath(), 0666);
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
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $ext = strtolower($file->getClientOriginalExtension());
        $filename = time() . '_' . $safeName . '.' . $ext;
        
        $uploadPath = public_path('uploads');
        if (!File::exists($uploadPath)) {
            File::makeDirectory($uploadPath, 0777, true);
        }

        $file->move($uploadPath, $filename);
        $fullPath = $uploadPath . '/' . $filename;

        // Automatically convert to WebP and DELETE original file if JPG/PNG
        $webpPath = app(\App\Services\Image\WebpConverterService::class)->convert($fullPath, 82, false);
        $finalPath = ($webpPath && file_exists($webpPath)) ? $webpPath : $fullPath;
        $finalFilename = basename($finalPath);

        $mediaItem = [
            'filename' => $finalFilename,
            'url' => asset('uploads/' . $finalFilename),
            'size' => round(filesize($finalPath) / 1024, 2) . ' KB',
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        // If Inertia visit, return back() with flash message
        if ($request->header('X-Inertia')) {
            return back()->with('success', 'ছবি সফলভাবে আপলোড ও WebP ফরম্যাটে সংরক্ষিত হয়েছে!');
        }

        if ($request->expectsJson() || $request->query('format') === 'json') {
            return response()->json([
                'success' => true,
                'message' => 'ছবি সফলভাবে আপলোড ও WebP ফরম্যাটে সংরক্ষিত হয়েছে!',
                'media' => $mediaItem,
            ]);
        }

        return back()->with('success', 'ছবি সফলভাবে আপলোড ও WebP ফরম্যাটে সংরক্ষিত হয়েছে!');
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
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $ext = strtolower($file->getClientOriginalExtension());
        $filename = time() . '_' . $safeName . '.' . $ext;
        
        $uploadPath = public_path('uploads');
        if (!File::exists($uploadPath)) {
            File::makeDirectory($uploadPath, 0777, true);
        }

        $file->move($uploadPath, $filename);
        $fullPath = $uploadPath . '/' . $filename;

        // Automatically convert to WebP and DELETE original file if JPG/PNG
        $webpPath = app(\App\Services\Image\WebpConverterService::class)->convert($fullPath, 82, false);
        $finalPath = ($webpPath && file_exists($webpPath)) ? $webpPath : $fullPath;
        $finalFilename = basename($finalPath);

        return response()->json([
            'success' => true,
            'message' => 'ছবি সফলভাবে আপলোড ও WebP ফরম্যাটে সংরক্ষিত হয়েছে!',
            'media' => [
                'filename' => $finalFilename,
                'url' => asset('uploads/' . $finalFilename),
                'size' => round(filesize($finalPath) / 1024, 2) . ' KB',
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
     * Batch convert all images across site to WebP and clean old JPG/PNG
     */
    public function convertAllWebp(\App\Services\Image\WebpConverterService $converter)
    {
        $directories = [
            public_path('uploads'),
            public_path('images/products'),
            public_path('images/banners'),
            storage_path('app/public'),
        ];

        // Convert with keepOriginal = false so all JPG/PNG are converted and deleted!
        $stats = $converter->convertDirectories($directories, 82, false);

        // Update database references in products table
        try {
            $products = \App\Models\Product::all();
            foreach ($products as $p) {
                $changed = false;
                if (is_array($p->images)) {
                    $newImages = array_map(function ($img) {
                        return is_string($img) ? preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $img) : $img;
                    }, $p->images);
                    if ($newImages !== $p->images) {
                        $p->images = $newImages;
                        $changed = true;
                    }
                }
                if ($p->og_image && preg_match('/\.(jpg|jpeg|png)$/i', $p->og_image)) {
                    $p->og_image = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $p->og_image);
                    $changed = true;
                }
                if ($changed) {
                    $p->save();
                }
            }

            // Update database references in site_settings table
            $settings = \Illuminate\Support\Facades\DB::table('site_settings')->get();
            foreach ($settings as $s) {
                if (is_string($s->value) && preg_match('/\.(jpg|jpeg|png)/i', $s->value)) {
                    $newVal = preg_replace('/\.(jpg|jpeg|png)/i', '.webp', $s->value);
                    \Illuminate\Support\Facades\DB::table('site_settings')->where('id', $s->id)->update(['value' => $newVal]);
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('DB update during WebP batch convert failed: ' . $e->getMessage());
        }

        $msg = "স্বয়ংক্রিয়ভাবে {$stats['converted']} টি ছবি WebP ফরম্যাটে রূপান্তর ও অপ্রয়োজনীয় ফাইল ডিলিট করা হয়েছে! (" . round($stats['bytes_saved'] / 1024, 2) . " KB সাইজ সেভ হয়েছে)";

        if (request()->expectsJson() || (request()->header('X-Inertia') === null && request()->ajax())) {
            return response()->json([
                'success' => true,
                'message' => $msg,
                'stats' => $stats,
            ]);
        }

        return back()->with('success', $msg);
    }
}
