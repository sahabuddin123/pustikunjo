import React from 'react';
import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export default function ConsultationCtaBlock({ data = {} }) {
    const isEnabled = data.enabled !== false;
    if (!isEnabled) return null;

    const label = data.label || 'FREE CONSULTATION';
    const heading = data.heading || 'Hakim Consultation';
    const description = data.description || 'অভিজ্ঞ হাকিমের কাছ থেকে বিনামূল্যে ইউনানি পরামর্শ নিন';
    const ctaLabel = data.cta_label || 'Get Advice';
    const ctaUrl = data.cta_url || '/contact';

    return (
        <section className="w-full bg-[#FAF6EE] py-10 sm:py-14 select-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Deep Green Rounded Card matching screenshot */}
                <div className="rounded-2xl sm:rounded-3xl bg-[#0F4229] text-white p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
                    {/* Left Info */}
                    <div className="space-y-1.5">
                        {/* Free Consultation Pill Badge */}
                        <div>
                            <span className="border border-[#D48828]/60 text-[#E5A952] text-xs sm:text-[13px] font-bold px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-[#E5A952]" />
                                {label}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight font-sans">
                            {heading}
                        </h3>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-emerald-100/95 font-medium">
                            {description}
                        </p>
                    </div>

                    {/* Right CTA Button */}
                    <div className="shrink-0">
                        <Link
                            href={ctaUrl}
                            className="inline-flex items-center justify-center px-7 sm:px-9 py-3 rounded-xl bg-[#D48828] hover:bg-[#c0791e] text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                        >
                            {ctaLabel}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
