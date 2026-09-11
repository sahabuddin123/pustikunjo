import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { X, Leaf, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';

const FALLBACK_PRODUCTS = [
    {
        id: 1,
        name: 'রোজেলা চা (Rosella Tea)',
        slug: 'rosella-tea',
        price: '950.00',
        sale_price: '850.00',
        primary_image: '/images/products/rosella-tea.jpg',
    },
    {
        id: 2,
        name: 'স্প্রে ড্রাইড বিটরুট পাউডার (Beetroot Powder)',
        slug: 'beetroot-powder',
        price: '1050.00',
        sale_price: '950.00',
        primary_image: '/images/products/beetroot-powder.jpg',
    },
    {
        id: 3,
        name: 'মেথি মিক্স (Methi Mix)',
        slug: 'methi-mix',
        price: '880.00',
        sale_price: '780.00',
        primary_image: '/images/products/methi-mix.jpg',
    },
];

export default function MobileNavDrawer({ isOpen, onClose }) {
    const { siteConfig, navProducts, header } = usePage().props;

    if (!isOpen) return null;

    // Use dynamic products from database (Admin managed) or fallback
    const products = (navProducts && navProducts.length > 0) ? navProducts : FALLBACK_PRODUCTS;

    const menuItems = header?.menu_items || [
        { label: 'হোম', url: '/' },
        { label: 'সকল পণ্য (Shop)', url: '/shop' },
        { label: 'আমাদের সম্পর্কে', url: '/about-us' },
        { label: 'ব্লগ', url: '/blog' },
        { label: 'অর্ডার ট্র্যাক', url: '/track-order' },
        { label: 'যোগাযোগ', url: '/contact' },
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
                onClick={onClose}
            />

            {/* Slide-over Drawer from Left */}
            <div className="fixed inset-y-0 left-0 max-w-full flex">
                <div className="w-[84vw] max-w-[340px] bg-white shadow-2xl flex flex-col justify-between h-full animate-slide-in-left">
                    {/* 1. Header: Deep Green with Brand Logo & Close Button */}
                    <div className="bg-[#0B3E25] text-white px-4 py-3.5 flex items-center justify-between shadow-xs">
                        {/* Brand Logo */}
                        <Link href="/" onClick={onClose} className="flex items-center">
                            <img
                                src="/images/logo-white.png"
                                alt="পুষ্টি কুঞ্জ"
                                className="h-9 w-auto object-contain"
                            />
                        </Link>

                        {/* Circular Close Button */}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                            aria-label="মেনু বন্ধ করুন"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* 2. Sub-Header: All Products (Dynamic Admin Products) */}
                    <div className="px-5 py-3 border-b border-gray-100 bg-[#FAFAFA] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-[#0B3E25]" />
                            <h3 className="text-base font-bold text-gray-900 font-sans tracking-tight">
                                {header?.mobile_drawer_title || 'All Products (সকল পণ্য)'}
                            </h3>
                        </div>
                        <span className="text-xs font-bold text-[#D99A26] bg-[#FEF9EE] px-2.5 py-0.5 rounded-full border border-[#E5A93B]/40 shadow-2xs">
                            {products.length}টি পণ্য
                        </span>
                    </div>

                    {/* 3. Scrollable List of Dynamic Products */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                        {/* Products List (Dynamic from DB / Admin Panel) */}
                        {products.map((product) => {
                            const imgSrc = product.primary_image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80';
                            const price = product.sale_price && Number(product.sale_price) > 0 ? product.sale_price : product.price;

                            return (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.slug}`}
                                    onClick={onClose}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-emerald-50/50 active:bg-emerald-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                                        {/* Product Round Image Thumbnail */}
                                        <div className="w-11 h-11 rounded-full p-1 bg-[#FAF6EE] border border-[#F2ECE0] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 group-hover:border-[#D4AF37] transition-all">
                                            <img
                                                src={imgSrc}
                                                alt={product.name}
                                                className="w-full h-full object-contain rounded-full"
                                                loading="lazy"
                                            />
                                        </div>
                                        {/* Product Details */}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-[14px] sm:text-[15px] font-bold text-gray-900 group-hover:text-[#0B3E25] transition-colors truncate leading-tight">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-xs font-black text-[#0B3E25]">
                                                    ৳{Number(price).toLocaleString()}
                                                </span>
                                                {product.sale_price && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price) && (
                                                    <span className="text-[11px] text-gray-400 line-through">
                                                        ৳{Number(product.price).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0B3E25] group-hover:translate-x-0.5 transition-all shrink-0" />
                                </Link>
                            );
                        })}

                        {/* Secondary Section: Storefront Menu Links */}
                        <div className="pt-3 pb-1 px-4 bg-gray-50/60 border-t border-gray-100">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                                মেনু ও লিংক
                            </span>
                            <div className="grid grid-cols-2 gap-1.5 pb-2">
                                {menuItems.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.url}
                                        onClick={onClose}
                                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#0B3E25] hover:bg-emerald-100/50 transition-colors truncate"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. Sticky Bottom Action Button */}
                    <div className="p-4 bg-white border-t border-gray-100 shadow-lg">
                        <Link
                            href="/shop"
                            onClick={onClose}
                            className="block w-full py-2.5 rounded-xl bg-[#0B3E25] hover:bg-[#062313] border-2 border-[#D99A26] text-white hover:text-[#E5A93B] font-bold text-base text-center transition-all duration-200 shadow-sm"
                        >
                            সব পণ্য দেখুন (All Products)
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
