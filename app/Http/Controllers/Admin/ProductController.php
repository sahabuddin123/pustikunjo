<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->filled('q')) {
            $term = $request->input('q');
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('sku', 'like', "%{$term}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        $products = $query->latest()->paginate(15)->withQueryString();
        $categories = Category::all();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'q' => $request->input('q', ''),
                'category' => $request->input('category', ''),
            ]
        ]);
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->get();
        return Inertia::render('Admin/Products/Form', [
            'categories' => $categories,
            'product' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'weight' => 'nullable|string|max:50',
            'variants' => 'nullable|array',
            'category_id' => 'nullable|exists:categories,id',
            'badge' => 'nullable|string|max:50',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'benefits' => 'nullable|array',
            'usage_instructions' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::lower(Str::random(4));
        }

        Product::create($validated);

        return redirect()->route('admin.products.index')->with('success', 'পণ্য সফলভাবে যুক্ত হয়েছে!');
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Admin/Products/Form', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug,' . $product->id,
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'weight' => 'nullable|string|max:50',
            'variants' => 'nullable|array',
            'category_id' => 'nullable|exists:categories,id',
            'badge' => 'nullable|string|max:50',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'benefits' => 'nullable|array',
            'usage_instructions' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')->with('success', 'পণ্য সফলভাবে আপডেট করা হয়েছে!');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'পণ্য সফলভাবে মুছে ফেলা হয়েছে!');
    }
}
