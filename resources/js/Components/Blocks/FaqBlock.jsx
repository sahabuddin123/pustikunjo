import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FaqBlock({ data }) {
    const heading = data.heading || 'সাধারণ জিজ্ঞাসা (FAQ)';
    const items = data.items || [];
    const [openIdx, setOpenIdx] = useState(0);

    if (!items || items.length === 0) return null;

    return (
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 space-y-2">
                    <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wider block">
                        প্রশ্ন ও উত্তর
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        {heading}
                    </h2>
                </div>

                <div className="space-y-3">
                    {items.map((item, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div
                                key={idx}
                                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-gray-900 hover:bg-emerald-50/50 transition-colors"
                                >
                                    <span className="text-sm sm:text-base">{item.question}</span>
                                    {isOpen ? (
                                        <ChevronUp className="w-5 h-5 text-emerald-700 shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                    )}
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-5 sm:px-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-emerald-50/20">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
