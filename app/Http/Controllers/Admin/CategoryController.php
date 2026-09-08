<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        if (empty($validated['slug'])) {
            $slug = Str::slug($validated['name']);
            $validated['slug'] = !empty($slug) ? $slug : 'cat-' . time();
        }

        $originalSlug = $validated['slug'];
        $count = 1;
        while (Category::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = "{$originalSlug}-" . $count++;
        }

        $validated['is_active'] = $request->boolean('is_active', true);

        $category = Category::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'ক্যাটাগরি সফলভাবে তৈরি হয়েছে!',
                'category' => $category,
            ]);
        }

        return back()->with('success', 'ক্যাটাগরি তৈরি হয়েছে!');
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug,' . $category->id,
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'sort_order' => 'integer',
            'is_featured' => 'boolean',
        ]);

        $category->update($validated);

        return back()->with('success', 'ক্যাটাগরি আপডেট হয়েছে!');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return back()->with('success', 'ক্যাটাগরি মুছে ফেলা হয়েছে!');
    }
}
