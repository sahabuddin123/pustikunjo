import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';

export default function BlogPostsBlock({ data = {}, latestBlogs = [] }) {
    const heading = data.heading || 'স্বাস্থ্য পরামর্শ ও ব্লগ';
    const subheading = data.subheading || 'প্রাকৃতিক উপায়ে সুস্থ থাকার কার্যকরী টিপস ও তথ্য';
    const limit = Number(data.limit) || 3;
    const columns = Number(data.columns) || 3;

    const posts = latestBlogs && latestBlogs.length > 0 ? latestBlogs.slice(0, limit) : [
        {
            id: 1,
            title: 'বিটরুট পাউডারের আশ্চর্য ১০টি স্বাস্থ্য উপকারিতা',
            slug: 'beetroot-powder-benefits',
            summary: 'রক্তস্বল্পতা দূরীকরণ থেকে শুরু করে ত্বকের উজ্জ্বলতা বৃদ্ধিতে বিটরুট পাউডারের ভূমিকা অপরিসীম।',
            featured_image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
            published_at: '2026-09-01',
        },
        {
            id: 2,
            title: 'চিয়া সিড খাওয়ার সঠিক নিয়ম ও এর পুষ্টিগুণ',
            slug: 'chia-seeds-eating-guide',
            summary: 'ওজন নিয়ন্ত্রণ এবং হার্ট সুস্থ রাখতে প্রতিদিন সঠিক নিয়মে কীভাবে চিয়া সিড খাবেন?',
            featured_image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600&auto=format&fit=crop&q=80',
            published_at: '2026-08-28',
        },
        {
            id: 3,
            title: 'ডায়াবেটিস ও গ্যাস্ট্রিক নিয়ন্ত্রণে মেথিমিক্সের কার্যকারিতা',
            slug: 'methimix-diabetes-control',
            summary: 'খালি পেটে মেথিমিক্স সেবন কীভাবে আপনার হজমশক্তি ও রক্তে গ্লুকোজ লেভেল ঠিক রাখে?',
            featured_image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80',
            published_at: '2026-08-25',
        },
    ];

    const colClass = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
    }[columns] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

    return (
        <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            {heading}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {subheading}
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                        <span>সকল ব্লগ পড়ুন</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className={`grid ${colClass} gap-6`}>
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-gray-100">
                                    <img
                                        src={post.featured_image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                                <div className="p-5 space-y-2.5">
                                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('bn-BD') : 'সম্প্রতি'}</span>
                                    </div>
                                    <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                                        <Link href={`/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                        {post.summary}
                                    </p>
                                </div>
                            </div>
                            <div className="p-5 pt-0">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors"
                                >
                                    <span>সম্পূর্ণ পড়ুন</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
