import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ImageWithTextBlock({ data }) {
    const heading = data.heading || 'কেন পুষ্টি কুঞ্জ আপনার প্রথম পছন্দ?';
    const text = data.text || 'আমরা বিশ্বাস করি সুস্থ শরীরের মূল চাবিকাঠি হলো খাঁটি খাদ্য। তাই প্রতিটি পণ্য নিজস্ব তত্ত্বাবধানে পরীক্ষিত উপাদান থেকে স্বাস্থ্যসম্মত পরিবেশে প্রস্তুত ও প্যাকেটজাত করা হয়।';
    const image = data.image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80';
    const imageSide = data.image_side || 'left';
    const ctaLabel = data.cta_label || 'আমাদের সম্পর্কে বিস্তারিত';
    const ctaUrl = data.cta_url || '/about-us';

    return (
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex flex-col ${imageSide === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-14`}>
                    {/* Image Column */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-4/3 sm:aspect-16/10">
                            <img
                                src={image}
                                alt={heading}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-xs text-gray-900 shadow-md">
                                <p className="text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>শতভাগ প্রাকৃতিক উপাদানে প্রস্তুত ও পরীক্ষিত</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full lg:w-1/2 space-y-5">
                        <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wider block">
                            আমাদের প্রতিশ্রুতি
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                            {heading}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                            {text}
                        </p>
                        <div className="pt-2">
                            <Link
                                href={ctaUrl}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all"
                            >
                                <span>{ctaLabel}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
