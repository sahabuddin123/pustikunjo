<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PageBuilderController extends Controller
{
    public function index()
    {
        $pages = Page::latest()->get();
        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Pages/Builder', [
            'page' => null,
            'products' => Product::where('is_active', true)->select('id', 'name', 'price', 'sku')->get(),
            'categories' => Category::where('is_active', true)->select('id', 'name', 'slug')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:pages,slug',
            'type' => 'required|string',
            'blocks' => 'nullable|array',
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page = Page::create($validated);

        return redirect()->route('admin.pages.edit', $page->id)->with('success', 'পেজ সফলভাবে তৈরি হয়েছে!');
    }

    public function edit($id)
    {
        $page = Page::findOrFail($id);
        $products = Product::where('is_active', true)->select('id', 'name', 'price', 'sku')->get();
        $categories = Category::where('is_active', true)->select('id', 'name', 'slug')->get();

        return Inertia::render('Admin/Pages/Builder', [
            'page' => $page,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:pages,slug,' . $page->id,
            'type' => 'required|string',
            'blocks' => 'nullable|array',
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $page->update($validated);

        return back()->with('success', 'পেজ এবং ব্লকসমূহ সফলভাবে সংরক্ষিত হয়েছে!');
    }

    public function destroy($id)
    {
        $page = Page::findOrFail($id);
        if ($page->slug === 'home' || $page->slug === '/') {
            return back()->with('error', 'হোমপেজ মুছে ফেলা যাবে না।');
        }
        $page->delete();

        return redirect()->route('admin.pages.index')->with('success', 'পেজ মুছে ফেলা হয়েছে!');
    }
}
