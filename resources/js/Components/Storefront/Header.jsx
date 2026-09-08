import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, Search, Menu, X, Leaf, Truck, User } from 'lucide-react';
import { useCart } from '@/Context/CartContext';
import MobileNavDrawer from '@/Components/Storefront/MobileNavDrawer';
import AuthModal from '@/Components/Storefront/AuthModal';

export default function Header() {
    const { siteConfig, header, auth } = usePage().props;
    const { cartCount, setIsCartOpen } = useCart();

    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const isLoggedIn = !!(auth?.user || auth?.customer_identifier);
    const userName = auth?.user?.name || (auth?.customer_identifier ? 'গ্রাহক' : null);

    const menuItems = header?.menu_items || [
        { label: 'হোম', url: '/' },
        { label: 'শপ', url: '/shop' },
        { label: 'ভেষজ ও পুষ্টিকর পাউডার', url: '/category/organic-powders' },
        { label: 'সুপার ফুড ও বীজ', url: '/category/super-food' },
        { label: 'অর্ডার ট্র্যাক', url: '/track-order' },
        { label: 'যোগাযোগ', url: '/contact' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.visit(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
            setIsMobileSearchOpen(false);
        }
    };

    return (
        <header className="w-full bg-[#0B3E25] text-white z-40 relative shadow-sm">
            {/* Main Header Bar matching home_dektop.jpg */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
                    {/* Mobile Menu Toggle Button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors"
                            aria-label="মেনু খুলুন"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Left: Brand Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-[#0B3E25] flex items-center justify-center shadow-xs">
                            <Leaf className="w-5 h-5 fill-current text-[#0B3E25]" />
                        </div>
                        <div>
                            <div className="text-lg sm:text-xl font-black tracking-tight text-white leading-none">
                                {siteConfig?.name || 'পুষ্টি কুঞ্জ'}
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-300 uppercase tracking-widest block mt-0.5">
                                {siteConfig?.tagline || 'Purity Begins here'}
                            </span>
                        </div>
                    </Link>

                    {/* Center: Large White Pill Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-xl mx-8">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="পণ্য খুঁজুন (বিটরুট, মেথিমিক্স, চিয়া সিড)..."
                                className="w-full pl-5 pr-12 py-2 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm shadow-inner"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0B3E25] hover:bg-[#072F1C] text-white flex items-center justify-center transition-colors shadow-xs"
                                title="অনুসন্ধান"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Right: Order Tracking & Cart */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                            className="lg:hidden p-2 rounded-lg text-emerald-100 hover:text-white"
                            aria-label="অনুসন্ধান"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Order Tracking (Desktop) */}
                        <Link
                            href="/track-order"
                            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white/95 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                            <Truck className="w-4 h-4 text-emerald-300" />
                            <span>অর্ডার ট্র্যাক</span>
                        </Link>

                        {/* Cart Trigger */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all shadow-xs cursor-pointer"
                            title="শপিং কার্ট"
                            aria-label="শপিং কার্ট"
                        >
                            <div className="relative">
                                <ShoppingCart className="w-4 h-4 text-white" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2.5 bg-[#c52d2f] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:inline text-sm font-medium text-white">
                                কার্ট
                            </span>
                        </button>

                        {/* User Account / Auth Modal Trigger */}
                        {isLoggedIn ? (
                            <Link
                                href="/my-account"
                                className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-700/80 hover:bg-emerald-600/90 border border-emerald-500/40 text-white transition-all shadow-xs cursor-pointer group"
                                title="আমার অ্যাকাউন্ট / ড্যাশবোর্ড"
                                aria-label="আমার ড্যাশবোর্ড"
                            >
                                <div className="w-5 h-5 rounded-full bg-white text-[#0B3E25] flex items-center justify-center text-[11px] font-black shrink-0 shadow-2xs">
                                    {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : <User className="w-3 h-3 text-[#0B3E25]" />}
                                </div>
                                <span className="hidden md:inline text-sm font-medium text-white max-w-[85px] truncate">
                                    {userName ? userName.split(' ')[0] : 'প্রোফাইল'}
                                </span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsAuthModalOpen(true)}
                                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all shadow-xs cursor-pointer"
                                title="লগইন বা রেজিস্ট্রেশন করুন"
                                aria-label="লগইন বা রেজিস্ট্রেশন"
                            >
                                <User className="w-4 h-4 text-white" />
                                <span className="hidden md:inline text-sm font-medium text-white">
                                    লগইন
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Expandable Search */}
                {isMobileSearchOpen && (
                    <div className="lg:hidden pb-3 pt-1">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="পণ্য খুঁজুন (বিটরুট, মেথিমিক্স, চিয়া সিড)..."
                                className="w-full pl-4 pr-10 py-2 rounded-full bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0B3E25]"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Second Row: Clean Navigation Menu (Desktop) */}
            <div className="hidden lg:block border-t border-emerald-900/80 bg-[#072818]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-center gap-8 py-3 text-base sm:text-[17px] font-medium tracking-normal">
                        {menuItems.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.url}
                                className="text-white/95 hover:text-[#CCF381] transition-colors py-1 relative group"
                            >
                                <span>{item.label}</span>
                                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#CCF381] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Mobile Slide-Over Navigation Drawer */}
            <MobileNavDrawer
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Customer Login / Register Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </header>
    );
}
