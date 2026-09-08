import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, PhoneCall, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export default function CtaBlock({ data }) {
    const { siteConfig, header } = usePage().props;
    const hotline = header?.hotline_phone || siteConfig?.phone || '01700-000000';

    const heading = data.heading || 'আপনার প্রয়োজনীয় পণ্যটি আজই অর্ডার করুন';
    const subheading = data.subheading || '১০০% প্রাকৃতিক ও নির্ভেজাল পুষ্টি পণ্য সরাসরি আপনার ঠিকানায়। নিশ্চিন্তে ঘরে বসে ক্যাশ অন ডেলিভারিতে অর্ডার করুন।';
    const primaryLabel = data.primary_label || 'শপ করুন';
    const primaryUrl = data.primary_url || '/shop';
    const secondaryLabel = data.secondary_label || 'যোগাযোগ করুন';
    const secondaryUrl = data.secondary_url || '/contact';

    return (
        <section className="py-12 sm:py-16 bg-[#0B3E25] text-white relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>পুষ্টি কুঞ্জ পরিবারে স্বাগতম</span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    {heading}
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 font-medium max-w-2xl mx-auto leading-relaxed">
                    {subheading}
                </p>

                {/* CTAs */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href={primaryUrl}
                        className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-lg hover:shadow-amber-400/30 transition-all transform hover:-translate-y-0.5"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{primaryLabel}</span>
                    </Link>

                    <Link
                        href={secondaryUrl}
                        className="px-7 py-3.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 border border-emerald-600/80 text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all hover:border-emerald-400"
                    >
                        <PhoneCall className="w-4 h-4 text-emerald-300" />
                        <span>{secondaryLabel}</span>
                    </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-emerald-800/60 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-emerald-200">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>১০০% খাঁটি ও গুণমান পরীক্ষিত</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-400" />
                        <span>দ্রুততম হোম ডেলিভারি</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                        <span>হটলাইন: {hotline}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
