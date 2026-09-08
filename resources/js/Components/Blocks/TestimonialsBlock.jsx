import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsBlock({ data }) {
    const heading = data.heading || 'গ্রাহকদের সন্তুষ্টির অভিজ্ঞতা';
    const items = data.items || [];

    if (!items || items.length === 0) return null;

    return (
        <section className="py-12 sm:py-16 bg-[#F8FAF8] border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
                    <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wider block">
                        টেস্টিমোনিয়াল
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        {heading}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-md border border-gray-100 transition-all flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(item.rating || 5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700 italic leading-relaxed">
                                    "{item.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-50">
                                <img
                                    src={item.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                                />
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">
                                        {item.name}
                                    </h4>
                                    <span className="text-xs text-emerald-700 font-medium">
                                        ভেরিফাইড ক্রেতা
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
