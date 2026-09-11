import React from 'react';
import { ShieldCheck, Truck, Banknote, RotateCcw, Headphones, Leaf, CheckCircle2, Award } from 'lucide-react';

const iconMap = {
    ShieldCheck,
    Truck,
    Banknote,
    RotateCcw,
    Headphones,
    Leaf,
    CheckCircle2,
    Award,
};

export default function UspBlock({ data }) {
    const items = data.items || [
        { icon: 'ShieldCheck', title: 'বিশুদ্ধ ও মানসম্মত', text: 'প্রাকৃতিক উপাদানে তৈরি শতভাগ নির্ভেজাল' },
        { icon: 'Truck', title: 'দ্রুত ডেলিভারি', text: 'সারা দেশে দ্রুততম হোম ডেলিভারি' },
        { icon: 'Banknote', title: 'নিরাপদ পেমেন্ট', text: 'হাতে পেয়ে দেখে ক্যাশ অন ডেলিভারি' },
        { icon: 'RotateCcw', title: 'সহজ রিটার্ন', text: 'পণ্য সমস্যা হলে তাৎক্ষণিক সহায়তা' },
    ];

    return (
        <section className="py-3 sm:py-5 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                    {items.map((item, idx) => {
                        const IconComponent = iconMap[item.icon] || ShieldCheck;
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:border-[#D4AF37]/60 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FEF9EE] text-[#0B3E25] border border-[#E5A93B]/30 flex items-center justify-center shrink-0 group-hover:bg-[#0B3E25] group-hover:text-[#E5A93B] group-hover:border-[#0B3E25] transition-all duration-300">
                                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div className="text-left min-w-0">
                                    <h3 className="font-bold text-gray-900 group-hover:text-[#0B3E25] text-xs sm:text-sm md:text-base leading-tight truncate transition-colors">
                                        {item.title}
                                    </h3>
                                    {item.text && (
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-snug line-clamp-1">
                                            {item.text}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

