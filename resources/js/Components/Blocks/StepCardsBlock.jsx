import React from 'react';

export default function StepCardsBlock({ data = {} }) {
    const heading = data.heading || 'Why PUSTI KUNJO';
    const subheading = data.subheading || 'খাঁটি রাখার প্রতিটি ধাপ — উৎস থেকে আপনার ঘর পর্যন্ত';

    const steps = (data.steps && data.steps.length > 0) ? data.steps : [
        {
            number: '01',
            title: 'সরাসরি উৎস থেকে',
            text: 'বিশ্বস্ত কৃষক ও প্রাকৃতিক বনজ উৎস থেকে সংগৃহীত শতভাগ নির্ভেজাল উপাদান।'
        },
        {
            number: '02',
            title: 'প্রতিটি ব্যাচ পরীক্ষিত',
            text: 'বিএসটিআই ও ল্যাব টেস্টের মাধ্যমে শতভাগ গুণগত মান ও বিশুদ্ধতা নিশ্চিতকরণ।'
        },
        {
            number: '03',
            title: 'হালাল প্রক্রিয়া',
            text: 'সম্পূর্ণ স্বাস্থ্যসম্মত ও হালাল উপায়ে আধুনিক প্রসেসিং এবং প্যাকেজিং।'
        }
    ];

    return (
        <section className="w-full bg-white py-12 sm:py-16 select-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Centered Heading with Golden Accent Bar */}
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0B3E25] tracking-tight font-sans">
                        {heading}
                    </h2>
                    {subheading && (
                        <p className="text-sm sm:text-base text-gray-600 mt-1.5 font-medium">
                            {subheading}
                        </p>
                    )}
                    {/* Golden horizontal accent bar */}
                    <div className="w-10 sm:w-12 h-1 bg-[#D48828] mx-auto mt-2.5 rounded-full" />
                </div>

                {/* 3 Step Cards (01, 02, 03) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="bg-[#FAF6EE] rounded-2xl p-6 sm:p-7 border border-[#F2ECE0] shadow-[0_2px_6px_rgba(0,0,0,0.015)] hover:shadow-md transition-all duration-300 flex flex-col justify-start"
                        >
                            {/* Golden Number */}
                            <span className="text-2xl sm:text-3xl font-extrabold text-[#D48828] font-sans block mb-2">
                                {step.number}
                            </span>
                            {/* Title */}
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 font-sans">
                                {step.title}
                            </h3>
                            {/* Text */}
                            <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed font-sans">
                                {step.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
