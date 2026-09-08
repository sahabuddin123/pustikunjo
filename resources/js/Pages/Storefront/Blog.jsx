import React from 'react';
import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

export default function Blog({ posts, meta = {} }) {
    const postList = posts?.data || posts || [];

    return (
        <StorefrontLayout meta={meta}>
            <div className="bg-emerald-900 text-white py-12 border-b border-emerald-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        পুষ্টি কুঞ্জ স্বাস্থ্য পরামর্শ ও ব্লগ
                    </h1>
                    <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl mx-auto">
                        প্রাকৃতিক খাদ্যাভ্যাস, ভেষজ উপাদানের গুণাগুণ ও সুস্থ থাকার কার্যকরী টিপস।
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                {postList.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto space-y-3">
                        <BookOpen className="w-12 h-12 text-emerald-600 mx-auto" />
                        <h3 className="text-lg font-bold text-gray-900">শীঘ্রই নতুন ব্লগ প্রকাশিত হবে</h3>
                        <p className="text-sm text-gray-500">আমাদের সাথে যুক্ত থাকুন নিয়মিত স্বাস্থ্য বিষয়ক আর্টিকেলের জন্য।</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {postList.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="aspect-16/10 overflow-hidden bg-emerald-50">
                                        <img
                                            src={post.featured_image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'}
                                            alt={post.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                                {new Date(post.created_at).toLocaleDateString('bn-BD')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5 text-emerald-600" />
                                                {post.author_name}
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 hover:text-emerald-700 transition-colors line-clamp-2">
                                            <Link href={`/blog/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h2>
                                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                            {post.summary || post.content}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors group"
                                    >
                                        <span>সম্পূর্ণ পড়ুন</span>
                                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
