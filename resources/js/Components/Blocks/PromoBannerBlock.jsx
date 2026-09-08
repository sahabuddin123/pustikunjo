import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Gift } from 'lucide-react';

export default function PromoBannerBlock({ data }) {
    const heading = data.heading || 'সুস্থ থাকতে প্রতিদিন খান অর্গানিক সুপারফুড';
    const text = data.text || 'বিটরুট পাউডার, মেথিমিক্স ও চিয়া সিডের বিশেষ কম্বো প্যাক অর্ডারে উপভোগ করুন ফ্রি ডেলিভারি!';
    const ctaLabel = data.cta_label || 'অফারটি দেখুন';
    const ctaUrl = data.cta_url || '/shop';
    const image = data.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=80';

    return (
        <section className="py-8 sm:py-12 bg-[#F8FAF8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 to-emerald-800 text-white shadow-xl">
                    {/* Background Image Layer */}
                    <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-30 lg:opacity-60 overflow-hidden mix-blend-overlay">
                        <img
                            src={image}
                            alt="Promo Banner"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
                            <Gift className="w-3.5 h-3.5" /> স্পেশাল অফার
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
                            {heading}
                        </h2>

                        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                            {text}
                        </p>

                        <div className="pt-2">
                            <Link
                                href={ctaUrl}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
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
