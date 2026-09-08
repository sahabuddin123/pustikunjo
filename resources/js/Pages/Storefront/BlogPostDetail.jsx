import React from 'react';
import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

export default function BlogPostDetail({ post, recentPosts = [], meta = {} }) {
    return (
        <StorefrontLayout meta={meta}>
            <div className="bg-emerald-900 text-white py-10 border-b border-emerald-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> ব্লগে ফিরে যান
                    </Link>
                    <h1 className="text-2xl sm:text-4xl font-black leading-tight text-white">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-emerald-200">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {post.author_name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <article className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-8">
                    {post.featured_image && (
                        <div className="aspect-16/9 rounded-2xl overflow-hidden shadow-md">
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-emerald max-w-none text-gray-800 text-base leading-relaxed whitespace-pre-line">
                        {post.content}
                    </div>
                </article>

                {/* Related Articles */}
                {recentPosts && recentPosts.length > 0 && (
                    <div className="mt-12 space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">অন্যান্য আর্টিকেলসমূহ</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {recentPosts.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/blog/${p.slug}`}
                                    className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex items-center gap-3"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-900 hover:text-emerald-700 line-clamp-2">
                                            {p.title}
                                        </h4>
                                        <span className="text-xs text-gray-400 mt-1 block">
                                            {new Date(p.created_at).toLocaleDateString('bn-BD')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
