import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function CategoryGridBlock({ data, categories = [] }) {
    const heading = data.heading || 'জনপ্রিয় ক্যাটাগরি সমূহ';
    const cols = data.columns || (categories.length <= 2 ? 2 : 4);

    if (!categories || categories.length === 0) return null;

    const isCompact = categories.length <= 2;

    return (
        <section className="py-8 sm:py-12 bg-[#F8FAF8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-6 bg-emerald-700 rounded-full inline-block" />
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                            {heading}
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
                    >
                        <span>সকল পণ্য দেখুন</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className={`${isCompact ? 'max-w-xl mx-auto' : ''} grid grid-cols-2 ${categories.length > 2 ? 'sm:grid-cols-2 lg:grid-cols-4' : ''} gap-4 sm:gap-6`}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-gray-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col p-4 sm:p-6 items-center text-center"
                        >
                            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-emerald-50 mb-3 sm:mb-4 border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                <img
                                    src={cat.image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80'}
                                    alt={cat.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-800 text-sm sm:text-base transition-colors line-clamp-1">
                                {cat.name}
                            </h3>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2">
                                {cat.products_count !== undefined ? `${cat.products_count} টি পণ্য` : 'পণ্য দেখুন'}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
