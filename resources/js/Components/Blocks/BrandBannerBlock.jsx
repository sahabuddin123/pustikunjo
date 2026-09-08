import React from 'react';
import { Link } from '@inertiajs/react';
import { Leaf, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function BrandBannerBlock({ data }) {
    const title = data.title || 'সুস্থ জীবনের প্রত্যয়ে খাঁটি পুষ্টির সমাহার';
    const subtitle = data.subtitle || 'প্রকৃতির বিশুদ্ধ দান ও আধুনিক স্বাস্থ্য সচেতনতার অনন্য মিলন ঘটাতে কাজ করছে পুষ্টি কুঞ্জ।';
    const ctaLabel = data.cta_label || 'আমাদের গল্প জানুন';
    const ctaUrl = data.cta_url || '/about-us';
    const backgroundImage = data.background_image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80';

    return (
        <section className="py-8 sm:py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[340px] sm:min-h-[400px] flex items-center">
                    {/* Background Image */}
                    <img
                        src={backgroundImage}
                        alt="Pusti Kunjo Natural Lifestyle"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />

                    {/* Dark Green Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#072F1C]/95 via-[#0B3E25]/85 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 max-w-xl p-8 sm:p-12 lg:p-16 text-white space-y-4 sm:space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                            <Leaf className="w-3.5 h-3.5 fill-current" />
                            <span>প্রকৃতির বিশুদ্ধতা</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                            {title}
                        </h2>

                        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
                            {subtitle}
                        </p>

                        <div className="pt-2">
                            <Link
                                href={ctaUrl}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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
