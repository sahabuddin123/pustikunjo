import React from 'react';

export default function StatsCounterBlock({ data }) {
    const items = data.items || [
        { number: '১০,০০০+', label: 'সন্তুষ্ট গ্রাহক' },
        { number: '৫০+', label: 'খাঁটি স্বাস্থ্য পণ্য' },
        { number: '৬৪', label: 'জেলায় নিয়মিত ডেলিভারি' },
        { number: '৯৯%', label: 'ইতিবাচক রিভিউ' },
    ];

    return (
        <section className="py-12 bg-emerald-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-800/80">
                    {items.map((item, idx) => (
                        <div key={idx} className="p-4 sm:p-6 space-y-1">
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-300 tracking-tight">
                                {item.number}
                            </div>
                            <div className="text-xs sm:text-sm font-semibold text-emerald-100/80">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
