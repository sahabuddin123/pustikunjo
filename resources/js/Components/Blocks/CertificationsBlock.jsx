import React from 'react';

export default function CertificationsBlock({ data = {} }) {
    const heading = data.heading || 'Award-winning & Certified';
    const subheading = data.subheading || 'BSTI, BCSIR & Kuet Lab test';

    const defaultLogos = [
        { image: '/images/certifications/bsti_logo_1.png', alt: 'BSTI Certified' },
        { image: '/images/certifications/bcsir_logo_2.png', alt: 'BCSIR Tested' },
        { image: '/images/certifications/bcsir_logo_3.png', alt: 'Science Lab Certified' },
        { image: '/images/certifications/bsti_logo_4.png', alt: 'BSTI Quality Tested' },
    ];

    const items = (data.items && data.items.length > 0) ? data.items : defaultLogos;

    return (
        <section className="w-full bg-white pt-10 pb-6 sm:pt-14 sm:pb-8 select-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                {/* Heading and Italic Subtitle */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-sans">
                    {heading}
                </h2>
                {subheading && (
                    <p className="text-xs sm:text-sm italic text-gray-400 font-serif mt-1">
                        {subheading}
                    </p>
                )}

                {/* 4 Certification Badges */}
                <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 md:gap-20 mt-8 sm:mt-10">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-center transition-transform duration-300 hover:scale-105"
                        >
                            <img
                                src={item.image}
                                alt={item.alt || `Certification ${idx + 1}`}
                                className="h-14 sm:h-18 md:h-20 w-auto object-contain drop-shadow-xs"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
