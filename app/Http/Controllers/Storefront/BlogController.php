<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $posts = BlogPost::where('is_published', true)
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('Storefront/Blog', [
            'posts' => $posts,
            'meta' => [
                'title' => 'ব্লগ ও স্বাস্থ্য পরামর্শ — পুষ্টি কুঞ্জ',
                'description' => 'প্রাকৃতিক খাদ্যাভ্যাস, ভেষজ উপাদান ও সুস্থ জীবনযাপন সম্পর্কিত তথ্যবহুল ব্লগ।',
            ]
        ]);
    }

    public function show($slug)
    {
        $post = BlogPost::where('slug', $slug)->where('is_published', true)->firstOrFail();
        
        $recentPosts = BlogPost::where('id', '!=', $post->id)
            ->where('is_published', true)
            ->latest('published_at')
            ->take(4)
            ->get();

        return Inertia::render('Storefront/BlogPostDetail', [
            'post' => $post,
            'recentPosts' => $recentPosts,
            'meta' => [
                'title' => $post->title . ' — পুষ্টি কুঞ্জ ব্লগ',
                'description' => $post->summary ?: strip_tags(substr($post->content, 0, 150)),
                'ogImage' => $post->featured_image ? url($post->featured_image) : '/images/og-default.jpg',
            ]
        ]);
    }
}
