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
            'sort_order' => 'integer',
            'is_featured' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Category::create($validated);

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
