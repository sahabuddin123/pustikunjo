import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_SLIDES = [
    {
        image: '/images/banners/rosella-tea-banner.jpg',
        url: '/product/rosella-tea',
        alt: 'পুষ্টি কুঞ্জ রোজেলা চা — ১০০% খাঁটি ও প্রাকৃতিক হারবাল চা',
    },
    {
        image: '/images/banners/beetroot-powder-banner.jpg',
        url: '/product/beetroot-powder',
        alt: 'স্প্রে ড্রাইড বিটরুট পাউডার — ১০০% অর্গানিক সুপারফুড',
    },
    {
        image: '/images/banners/methi-mix-banner.jpg',
        url: '/product/methi-mix',
        alt: 'মেথি মিক্স — প্রাকৃতিক হজম ও সুগার নিয়ন্ত্রণ',
    },
];

export default function HeroBlock({ data = {} }) {
    const rawSlides = (data.slides && data.slides.length > 0) ? data.slides : DEFAULT_SLIDES;

    const slides = rawSlides.map((slide, idx) => {
        const fallback = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];
        if (typeof slide === 'string') {
            return { image: slide, url: fallback.url, alt: fallback.alt };
        }
        return {
            image: slide.image || fallback.image,
            url: slide.url || fallback.url,
            alt: slide.alt || fallback.alt,
        };
    });

    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Auto-advance slides every 5 seconds (paused on hover)
    useEffect(() => {
        if (slides.length <= 1 || isPaused) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length, isPaused]);

    const prevSlide = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        if (distance > 50) {
            nextSlide();
        } else if (distance < -50) {
            prevSlide();
        }
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    if (!slides || slides.length === 0) return null;

    return (
        <section className="w-full bg-white overflow-hidden select-none">
            {/* 100% Full Width Clean Image Slider - Perfectly Proportioned */}
            <div
                className="group relative w-full aspect-[16/9] sm:aspect-[2.2/1] md:aspect-[2.6/1] lg:aspect-[2.95/1] max-h-[500px] overflow-hidden bg-[#0B3E25]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Carousel Image Slides */}
                {slides.map((slide, idx) => {
                    const isActive = idx === current;

                    return (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                        >
                            <Link
                                href={slide.url}
                                className="block w-full h-full cursor-pointer"
                                title={slide.alt}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.alt}
                                    className="w-full h-full object-cover object-center"
                                    loading={idx === 0 ? 'eager' : 'lazy'}
                                />
                            </Link>
                        </div>
                    );
                })}

                {/* Left & Right Navigation Arrows */}
                {slides.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            type="button"
                            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#0B3E25] hover:text-[#E5A93B] text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer shadow-md"
                            aria-label="পূর্ববর্তী ব্যানার"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        <button
                            onClick={nextSlide}
                            type="button"
                            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#0B3E25] hover:text-[#E5A93B] text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer shadow-md"
                            aria-label="পরবর্তী ব্যানার"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Indicator Pill Dots */}
                        <div className="absolute bottom-3 sm:bottom-5 inset-x-0 z-20 flex items-center justify-center gap-1.5 sm:gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrent(i);
                                    }}
                                    type="button"
                                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                                        i === current
                                            ? 'w-7 sm:w-9 h-2 sm:h-2.5 bg-gradient-to-r from-[#D99A26] to-[#E5A93B] shadow-sm'
                                            : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/70 hover:bg-white'
                                    }`}
                                    aria-label={`স্লাইড ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
