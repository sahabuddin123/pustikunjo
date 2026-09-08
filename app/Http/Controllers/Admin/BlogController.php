<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $posts = BlogPost::orderByDesc('created_at')->paginate(15);

        return Inertia::render('Admin/Blog/Index', [
            'posts' => $posts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blog/Form', [
            'post' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'summary' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'author_name' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']) ?: 'post-' . time();
        }

        if ($validated['is_published'] ?? true) {
            $validated['published_at'] = now();
        }

        BlogPost::create($validated);

        return redirect()->route('admin.blog.index')->with('success', 'ব্লগ পোস্ট সফলভাবে তৈরি হয়েছে!');
    }

    public function edit(BlogPost $blog)
    {
        return Inertia::render('Admin/Blog/Form', [
            'post' => $blog,
        ]);
    }

    public function update(Request $request, BlogPost $blog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blog_posts,slug,' . $blog->id,
            'summary' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'author_name' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        if (($validated['is_published'] ?? false) && !$blog->published_at) {
            $validated['published_at'] = now();
        }

        $blog->update($validated);

        return redirect()->route('admin.blog.index')->with('success', 'ব্লগ পোস্ট আপডেট করা হয়েছে!');
    }

    public function destroy(BlogPost $blog)
    {
        $blog->delete();

        return redirect()->route('admin.blog.index')->with('success', 'ব্লগ পোস্ট মুছে ফেলা হয়েছে!');
    }
}
