import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { CartProvider, useCart } from '@/Context/CartContext';
import Header from '@/Components/Storefront/Header';
import Footer from '@/Components/Storefront/Footer';
import CartDrawer from '@/Components/Storefront/CartDrawer';
import { MessageCircle, ShoppingBag, Home, Search, PhoneCall, CheckCircle2, AlertCircle, Truck, ChevronUp } from 'lucide-react';
import { trackEvent } from '@/Services/Analytics';

function StorefrontContent({ children, meta = {} }) {
    const { siteConfig, flash, marketing } = usePage().props;
    const { cartCount, setIsCartOpen, toastMessage } = useCart();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            if (window.scrollY > 250) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', checkScroll, { passive: true });
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Trigger PageView on mount
    useEffect(() => {
        trackEvent('page_view', {
            page_title: meta.title || siteConfig?.name,
            page_location: window.location.href,
        });
    }, [meta.title]);

    const whatsappNumber = siteConfig?.whatsapp || '01700000000';
    const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-gray-900 font-sans selection:bg-emerald-700 selection:text-white">
            <Head>
                <title>{meta.title ? `${meta.title} — ${siteConfig?.name || 'পুষ্টি কুঞ্জ'}` : `${siteConfig?.name || 'পুষ্টি কুঞ্জ'} — খাঁটি ও প্রাকৃতিক স্বাস্থ্য পণ্য`}</title>
                <meta name="description" content={meta.description || 'পুষ্টি কুঞ্জ বাংলাদেশের শীর্ষস্থানীয় অর্গানিক ও প্রাকৃতিক স্বাস্থ্য পণ্য ব্র্যান্ড।'} />
                {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
                <meta property="og:title" content={meta.title || siteConfig?.name} />
                <meta property="og:description" content={meta.description || '১০০% প্রাকৃতিক ও খাঁটি খাদ্য উপাদান।'} />
            </Head>

            {/* Flash Alerts / Toasts */}
            {toastMessage && (
                <div className="fixed top-20 right-4 z-50 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-slide-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {flash?.success && (
                <div className="fixed top-20 right-4 z-50 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-slide-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            {flash?.error && (
                <div className="fixed top-20 right-4 z-50 bg-rose-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-slide-in">
                    <AlertCircle className="w-5 h-5 text-rose-200 shrink-0" />
                    <span>{flash.error}</span>
                </div>
            )}

            <Header />

            <main className="flex-1 pb-16 sm:pb-0">
                {children}
            </main>

            <Footer />

            <CartDrawer />

            {/* Scroll To Top Floating Button (matching reference) */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-36 sm:bottom-22 right-4 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-emerald-600/30 hover:border-emerald-600 text-emerald-700 hover:text-emerald-900 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    title="উপরে যান"
                    aria-label="উপরে যান"
                >
                    <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            )}

            {/* Floating WhatsApp Quick Action */}
            <a
                href={`https://wa.me/880${cleanWhatsapp}?text=${encodeURIComponent('হ্যালো পুষ্টি কুঞ্জ! পণ্য সম্পর্কে জানতে চাচ্ছি।')}`}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                title="WhatsApp এ সরাসরি কথা বলুন"
                onClick={() => trackEvent('contact_click', { channel: 'whatsapp' })}
            >
                <MessageCircle className="w-7 h-7 fill-current" />
            </a>

            {/* Mobile Sticky Bottom Navigation (360px-430px optimized) */}
            <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 py-2 px-3 flex items-center justify-around shadow-2xl">
                <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-emerald-700 py-0.5 min-w-[50px]">
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] font-bold mt-0.5">হোম</span>
                </Link>

                <Link href="/shop" className="flex flex-col items-center text-gray-600 hover:text-emerald-700 py-0.5 min-w-[50px]">
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-bold mt-0.5">খুঁজুন</span>
                </Link>

                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex flex-col items-center text-gray-700 hover:text-emerald-700 py-0.5 min-w-[50px]"
                    aria-label="কার্ট"
                >
                    <div className="relative">
                        <ShoppingBag className="w-5 h-5 text-emerald-800" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-800 mt-0.5">কার্ট</span>
                </button>

                <Link href="/track-order" className="flex flex-col items-center text-gray-600 hover:text-emerald-700 py-0.5 min-w-[50px]">
                    <Truck className="w-5 h-5 text-emerald-700" />
                    <span className="text-[10px] font-bold mt-0.5">ট্র্যাকিং</span>
                </Link>

                <a
                    href={`tel:${(siteConfig?.phone || '01700000000').replace(/[^0-9+]/g, '')}`}
                    className="flex flex-col items-center text-gray-600 hover:text-emerald-700 py-0.5 min-w-[50px]"
                >
                    <PhoneCall className="w-5 h-5 text-amber-600" />
                    <span className="text-[10px] font-bold mt-0.5">কল</span>
                </a>
            </div>
        </div>
    );
}

export default function StorefrontLayout({ children, meta }) {
    return (
        <StorefrontContent meta={meta}>
            {children}
        </StorefrontContent>
    );
}
