import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Timer, ArrowRight, Flame } from 'lucide-react';

export default function CountdownOfferBlock({ data = {} }) {
    const heading = data.heading || 'সীমিত সময়ের বিশেষ পুষ্টি অফার!';
    const subheading = data.subheading || 'পুষ্টি কুঞ্জের বাছাইকৃত পণ্যে উপভোগ করুন আকর্ষণীয় মূল্যছাড়।';
    const ctaLabel = data.cta_label || 'অফারটি দেখুন';
    const ctaUrl = data.cta_url || '/shop';
    const bgImage = data.bg_image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80';

    // Countdown calculation
    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 14,
        minutes: 32,
        seconds: 45,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: 59, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-12 sm:py-16 relative overflow-hidden bg-emerald-950 text-white">
            <div className="absolute inset-0 opacity-20">
                <img src={bgImage} alt="Offer Background" className="w-full h-full object-cover" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    <Flame className="w-4 h-4" />
                    <span>ধামাকা অফার</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                    {heading}
                </h2>
                <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
                    {subheading}
                </p>

                {/* Countdown Digit Boxes */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 py-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[90px]">
                        <span className="text-2xl sm:text-4xl font-black block font-mono text-emerald-300">{timeLeft.days}</span>
                        <span className="text-[10px] sm:text-xs text-emerald-100 font-semibold uppercase tracking-wider">দিন</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">:</span>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[90px]">
                        <span className="text-2xl sm:text-4xl font-black block font-mono text-emerald-300">{timeLeft.hours}</span>
                        <span className="text-[10px] sm:text-xs text-emerald-100 font-semibold uppercase tracking-wider">ঘণ্টা</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">:</span>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[90px]">
                        <span className="text-2xl sm:text-4xl font-black block font-mono text-emerald-300">{timeLeft.minutes}</span>
                        <span className="text-[10px] sm:text-xs text-emerald-100 font-semibold uppercase tracking-wider">মিনিট</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">:</span>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[90px]">
                        <span className="text-2xl sm:text-4xl font-black block font-mono text-emerald-300">{timeLeft.seconds}</span>
                        <span className="text-[10px] sm:text-xs text-emerald-100 font-semibold uppercase tracking-wider">সেকেন্ড</span>
                    </div>
                </div>

                <div>
                    <Link
                        href={ctaUrl}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
                    >
                        <span>{ctaLabel}</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
