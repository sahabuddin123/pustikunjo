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
        <section className="py-12 sm:py-16 bg-gradient-to-b from-[#0B3E25] via-[#08331e] to-[#062313] text-white relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D99A26]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#062313]/90 border border-[#D4AF37]/50 text-[#E5A93B] text-xs font-bold uppercase tracking-wider shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5A93B]" />
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
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D99A26] to-[#E5A93B] hover:from-[#C6891D] hover:to-[#D99A26] text-white font-black text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-[#D99A26]/25 hover:shadow-[#D99A26]/40 transition-all transform hover:-translate-y-0.5"
                    >
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>{primaryLabel}</span>
                    </Link>

                    <Link
                        href={secondaryUrl}
                        className="px-7 py-3.5 rounded-xl bg-[#062313]/90 hover:bg-[#0B3E25] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#E5A93B] hover:text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all"
                    >
                        <PhoneCall className="w-4 h-4 text-[#E5A93B]" />
                        <span>{secondaryLabel}</span>
                    </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-emerald-100">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#E5A93B]" />
                        <span>১০০% খাঁটি ও গুণমান পরীক্ষিত</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-[#E5A93B]" />
                        <span>দ্রুততম হোম ডেলিভারি</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-[#E5A93B]" />
                        <span>হটলাইন: {hotline}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
