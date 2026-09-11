import React, { useState, useEffect } from 'react';
import { ShieldCheck, ZoomIn, X, ExternalLink, Award } from 'lucide-react';

export default function CertificationsBlock({ data = {} }) {
    const heading = data.heading || 'Award-winning & Certified';
    const subheading = data.subheading || 'ISO/IEC 17025:2017 আন্তর্জাতিক মান অনুযায়ী এক্রেডিটেড ওয়াফেন রিসার্চ ল্যাব রিপোর্ট';

    const defaultCertificates = [
        {
            image: '/images/certificates/rosella-tea-report.png',
            title: 'রোজেলা চা ল্যাব টেস্ট রিপোর্ট',
            subtitle: 'Waffen Research Lab (ISO/IEC 17025:2017)',
            alt: 'Rosella Tea Lab Test Report'
        },
        {
            image: '/images/certificates/beetroot-powder-report.png',
            title: 'বিটরুট পাউডার ল্যাব টেস্ট রিপোর্ট',
            subtitle: 'Waffen Research Lab (ISO/IEC 17025:2017)',
            alt: 'Beetroot Powder Lab Test Report'
        },
        {
            image: '/images/certificates/methi-mix-report.png',
            title: 'মেথি মিক্স ল্যাব টেস্ট রিপোর্ট',
            subtitle: 'Waffen Research Lab (ISO/IEC 17025:2017)',
            alt: 'Methi Mix Powder Lab Test Report'
        }
    ];

    const rawItems = (data.items && Array.isArray(data.items) && data.items.length > 0)
        ? data.items
        : defaultCertificates;

    // Filter out invalid items
    const items = rawItems.filter((it) => it && (it.image || it.title));

    // Lightbox modal state for full view of test report
    const [activeCertModal, setActiveCertModal] = useState(null);

    // Keyboard ESC to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && activeCertModal) {
                setActiveCertModal(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeCertModal]);

    // Lock body scroll when modal is active
    useEffect(() => {
        if (activeCertModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [activeCertModal]);

    return (
        <section className="w-full bg-[#FAFCFA] py-12 sm:py-16 border-y border-gray-100 select-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Heading and Subtitle */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0B3E25] text-xs font-bold mb-3 shadow-2xs">
                        <Award className="w-3.5 h-3.5 text-emerald-700" />
                        <span>১০০% ল্যাব টেস্টে পরীক্ষিত ও নিরাপদ</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
                        {heading}
                    </h2>

                    {subheading && (
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mt-2 leading-relaxed">
                            {subheading}
                        </p>
                    )}

                    <div className="w-12 h-1 bg-[#0B3E25] mx-auto mt-3 rounded-full" />
                </div>

                {/* 3 Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl border-2 border-emerald-100/70 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden group"
                        >
                            {/* Card Top Pill Badge */}
                            <div className="px-4 py-2.5 bg-emerald-50/70 border-b border-emerald-100/80 flex items-center justify-between text-xs font-bold text-[#0B3E25]">
                                <span className="flex items-center gap-1.5 truncate">
                                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                                    <span className="truncate">ISO 17025 ল্যাব সার্টিফাইড</span>
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-emerald-900 border border-emerald-200 shadow-2xs">
                                    BAB Accredited
                                </span>
                            </div>

                            {/* Certificate Image Preview with Zoom Trigger */}
                            <div
                                onClick={() => setActiveCertModal(item)}
                                className="relative aspect-[1/1.3] w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4 cursor-pointer group/img"
                                title="বড় করে সার্টিফিকেট দেখতে ক্লিক করুন"
                            >
                                <img
                                    src={item.image}
                                    alt={item.alt || item.title || `Certificate ${idx + 1}`}
                                    className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover/img:scale-[1.02]"
                                    loading="lazy"
                                />

                                {/* Hover Overlay with Zoom Button */}
                                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-200">
                                        <ZoomIn className="w-4 h-4 text-emerald-700" />
                                        <span>বড় করে দেখুন</span>
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer Details */}
                            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white border-t border-gray-100">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                                        {item.title || item.alt || 'ল্যাব টেস্ট রিপোর্ট'}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <span>{item.subtitle || 'Waffen Research Lab (ISO 17025)'}</span>
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setActiveCertModal(item)}
                                    className="w-full py-2.5 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50/50 hover:bg-emerald-600 text-[#0B3E25] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs"
                                >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                    <span>সম্পূর্ণ রিপোর্ট দেখুন</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* High-Resolution Certificate Lightbox / Modal */}
            {activeCertModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setActiveCertModal(null)}
                >
                    <div
                        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-5 py-3.5 bg-[#0B3E25] text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2 min-w-0 pr-4">
                                <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm sm:text-base truncate leading-tight">
                                        {activeCertModal.title || 'অফিসিয়াল ল্যাব টেস্ট রিপোর্ট'}
                                    </h4>
                                    <p className="text-[11px] text-emerald-200/90 truncate">
                                        {activeCertModal.subtitle || 'Waffen Research Laboratory Limited'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={activeCertModal.image}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                                    title="নতুন ট্যাবে ফুল ছবি ওপেন করুন"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">নতুন ট্যাবে দেখুন</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setActiveCertModal(null)}
                                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                                    title="বন্ধ করুন (Esc)"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Scrollable Sharp Certificate View */}
                        <div className="p-4 sm:p-6 overflow-y-auto bg-gray-100 flex items-center justify-center min-h-[400px]">
                            <img
                                src={activeCertModal.image}
                                alt={activeCertModal.title || 'Full Lab Report'}
                                className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-md bg-white p-2"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
