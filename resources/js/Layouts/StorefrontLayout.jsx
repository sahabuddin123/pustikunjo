import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { CartProvider, useCart } from '@/Context/CartContext';
import Header from '@/Components/Storefront/Header';
import Footer from '@/Components/Storefront/Footer';
import CartDrawer from '@/Components/Storefront/CartDrawer';
import { MessageCircle, ShoppingBag, Home, Search, PhoneCall, CheckCircle2, AlertCircle, Truck, ChevronUp } from 'lucide-react';
import { trackEvent } from '@/Services/Analytics';
import { formatWhatsAppUrl } from '@/Utils/whatsapp';

function StorefrontContent({ children, meta = {} }) {
    const { siteConfig, flash, marketing, seo } = usePage().props;
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

    const { url } = usePage();
    const isHome = url === '/' || url === '';
    const isShop = typeof url === 'string' && (url.startsWith('/shop') || url.startsWith('/product') || url.startsWith('/category'));
    const isTracking = typeof url === 'string' && url.startsWith('/track-order');

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-gray-900 font-sans selection:bg-emerald-700 selection:text-white">
            <Head>
                <title>
                    {(() => {
                        let t = meta.title || seo?.meta_title || 'পুষ্টি কুঞ্জ — খাঁটি অর্গানিক ফুড ও প্রাকৃতিক স্বাস্থ্য পণ্য | Pusti Kunjo';
                        if (t.includes('Purity Begins here')) {
                            t = 'পুষ্টি কুঞ্জ — খাঁটি অর্গানিক ফুড ও প্রাকৃতিক স্বাস্থ্য পণ্য | Pusti Kunjo';
                        } else if (!t.includes(siteConfig?.name || 'পুষ্টি কুঞ্জ') && !t.includes('Pusti Kunjo')) {
                            t = `${t} — ${siteConfig?.name || 'পুষ্টি কুঞ্জ'}`;
                        }
                        return t;
                    })()}
                </title>
                <meta name="description" content={meta.description || seo?.meta_description || 'পুষ্টি কুঞ্জ বাংলাদেশের শীর্ষস্থানীয় অর্গানিক ও প্রাকৃতিক স্বাস্থ্য পণ্য ব্র্যান্ড।'} />
                {(meta.keywords || seo?.meta_keywords) && <meta name="keywords" content={meta.keywords || seo?.meta_keywords} />}
                {seo?.indexing_directive && <meta name="robots" content={seo.indexing_directive} />}
                {siteConfig?.favicon && <link rel="icon" href={siteConfig.favicon} />}
                {siteConfig?.favicon && <link rel="shortcut icon" href={siteConfig.favicon} />}
                {siteConfig?.favicon && <link rel="apple-touch-icon" href={siteConfig.favicon} />}
                {(meta.ogImage || seo?.og_image) && <meta property="og:image" content={meta.ogImage || seo?.og_image} />}
                <meta property="og:title" content={meta.title || seo?.meta_title || siteConfig?.name} />
                <meta property="og:description" content={meta.description || seo?.meta_description || '১০০% প্রাকৃতিক ও খাঁটি খাদ্য উপাদান।'} />
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

            <main className="flex-1 pb-22 sm:pb-0">
                {children}
            </main>

            <Footer />

            <CartDrawer />

            {/* Scroll To Top Floating Button (matching reference) */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-31 sm:bottom-22 right-3.5 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-emerald-600/30 hover:border-emerald-600 text-emerald-700 hover:text-emerald-900 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    title="উপরে যান"
                    aria-label="উপরে যান"
                >
                    <ChevronUp className="w-4.5 h-4.5 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            )}

            {/* Floating WhatsApp Quick Action */}
            <a
                href={formatWhatsAppUrl(whatsappNumber, 'হ্যালো পুষ্টি কুঞ্জ! পণ্য সম্পর্কে জানতে চাচ্ছি।')}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-18 sm:bottom-6 right-3.5 sm:right-6 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                title="WhatsApp এ সরাসরি কথা বলুন"
                onClick={() => trackEvent('contact_click', { channel: 'whatsapp' })}
            >
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
            </a>

            {/* Mobile Sticky Bottom Navigation (Native App Style with Active States) */}
            <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 z-40 py-1.5 px-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <Link
                    href="/"
                    className={`flex flex-col items-center py-0.5 min-w-[54px] transition-colors ${
                        isHome ? 'text-[#0B3E25] font-black' : 'text-gray-500 hover:text-emerald-700 font-medium'
                    }`}
                >
                    <div className="relative">
                        <Home className={`w-5 h-5 ${isHome ? 'text-[#0B3E25]' : 'text-gray-500'}`} />
                        {isHome && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0B3E25] rounded-full" />
                        )}
                    </div>
                    <span className="text-[11px] mt-0.5">হোম</span>
                </Link>

                <Link
                    href="/shop"
                    className={`flex flex-col items-center py-0.5 min-w-[54px] transition-colors ${
                        isShop ? 'text-[#0B3E25] font-black' : 'text-gray-500 hover:text-emerald-700 font-medium'
                    }`}
                >
                    <div className="relative">
                        <Search className={`w-5 h-5 ${isShop ? 'text-[#0B3E25]' : 'text-gray-500'}`} />
                        {isShop && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0B3E25] rounded-full" />
                        )}
                    </div>
                    <span className="text-[11px] mt-0.5">খুঁজুন</span>
                </Link>

                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex flex-col items-center py-0.5 min-w-[54px] text-gray-700 hover:text-emerald-800 transition-colors"
                    aria-label="কার্ট"
                >
                    <div className="relative">
                        <ShoppingBag className="w-5 h-5 text-[#0B3E25]" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#D99A26] to-[#E5A93B] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs border border-white">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[11px] font-extrabold text-[#0B3E25] mt-0.5">কার্ট</span>
                </button>

                <Link
                    href="/track-order"
                    className={`flex flex-col items-center py-0.5 min-w-[54px] transition-colors ${
                        isTracking ? 'text-[#0B3E25] font-black' : 'text-gray-500 hover:text-emerald-700 font-medium'
                    }`}
                >
                    <div className="relative">
                        <Truck className={`w-5 h-5 ${isTracking ? 'text-[#0B3E25]' : 'text-gray-500'}`} />
                        {isTracking && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0B3E25] rounded-full" />
                        )}
                    </div>
                    <span className="text-[11px] mt-0.5">ট্র্যাকিং</span>
                </Link>

                <a
                    href={`tel:${(siteConfig?.phone || '01700000000').replace(/[^0-9+]/g, '')}`}
                    className="flex flex-col items-center py-0.5 min-w-[54px] text-gray-500 hover:text-emerald-700 font-medium transition-colors"
                >
                    <PhoneCall className="w-5 h-5 text-[#D48828]" />
                    <span className="text-[11px] mt-0.5">কল</span>
                </a>
            </nav>
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
