import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Sparkles, HeartPulse, ShieldCheck, Scale, Zap, ArrowRight, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/Context/CartContext';
import { trackEvent } from '@/Services/Analytics';
import ProductCard from '../Storefront/ProductCard';

export default function HealthRegimenBlock({ data, products = [] }) {
    const { addToCart } = useCart();

    const heading = data.heading || 'দৈনিক সুস্বাস্থ্যের প্রাকৃতিক সমাধান';
    const subheading = data.subheading || 'পুষ্টি কুঞ্জের ৩টি বিশেষ উপাদান দিয়ে সুস্থ রাখুন নিজেকে ও আপনার পরিবারকে';

    if (!products || products.length === 0) return null;

    // If more than 3 products in store, render regular product card grid
    if (products.length > 3) {
        return (
            <section className="py-8 sm:py-12 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-6 bg-emerald-700 rounded-full inline-block" />
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                                {heading}
                            </h2>
                        </div>
                        <Link
                            href="/shop"
                            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
                        >
                            <span>সব দেখুন</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {products.slice(0, 4).map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Curated 3-Product Health Benefit Presentation
    const regimenHighlights = {
        'beetroot-powder': {
            focus: 'হিমোগ্লোবিন ও রক্ত সঞ্চালন',
            icon: HeartPulse,
            color: 'from-rose-50 to-pink-50 border-rose-200 text-rose-800',
            badgeBg: 'bg-rose-600',
        },
        'methimix': {
            focus: 'ডায়াবেটিস ও হজম সুস্থতা',
            icon: ShieldCheck,
            color: 'from-amber-50 to-orange-50 border-amber-200 text-amber-900',
            badgeBg: 'bg-amber-600',
        },
        'chia-seeds': {
            focus: 'হার্ট কেয়ার ও ওজন নিয়ন্ত্রণ',
            icon: Scale,
            color: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900',
            badgeBg: 'bg-emerald-700',
        }
    };

    return (
        <section className="py-10 sm:py-14 bg-[#FAFBF9] border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                    <span className="text-xs sm:text-sm font-bold text-emerald-700 tracking-wider uppercase block mb-1">
                        স্বাস্থ্য সুরক্ষা
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                        {heading}
                    </h2>
                    {subheading && (
                        <p className="text-sm sm:text-base text-gray-600 mt-2">
                            {subheading}
                        </p>
                    )}
                </div>

                {/* 3 Health Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {products.map((product) => {
                        const meta = regimenHighlights[product.slug] || {
                            focus: 'প্রাকৃতিক স্বাস্থ্য উপাদান',
                            icon: Sparkles,
                            color: 'from-emerald-50 to-green-50 border-emerald-200 text-emerald-900',
                            badgeBg: 'bg-emerald-700',
                        };
                        const IconComponent = meta.icon;

                        const price = product.sale_price && product.sale_price > 0 && product.sale_price < product.price
                            ? Number(product.sale_price)
                            : Number(product.price);
                        const originalPrice = Number(product.price);
                        const hasDiscount = product.sale_price && product.sale_price > 0 && product.sale_price < product.price;

                        const image = (product.images && product.images.length > 0)
                            ? product.images[0]
                            : (product.primary_image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80');

                        const handleInstantOrder = (e) => {
                            e.preventDefault();
                            addToCart(product, 1, false);
                            trackEvent('add_to_cart', { name: product.name, sku: product.sku, value: price });
                            router.visit('/checkout');
                        };

                        const handleAddCart = (e) => {
                            e.preventDefault();
                            addToCart(product, 1, true);
                            trackEvent('add_to_cart', { name: product.name, sku: product.sku, value: price });
                        };

                        return (
                            <div
                                key={product.id}
                                className={`rounded-3xl bg-white border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden`}
                            >
                                <div>
                                    {/* Focus Tag */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                                            <IconComponent className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>{meta.focus}</span>
                                        </div>
                                        {product.weight && (
                                            <span className="text-xs font-semibold text-gray-500">
                                                {product.weight}
                                            </span>
                                        )}
                                    </div>

                                    {/* Photo */}
                                    <Link href={`/product/${product.slug}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                                        <img
                                            src={image}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* Title & Description */}
                                    <Link
                                        href={`/product/${product.slug}`}
                                        className="block font-black text-gray-900 group-hover:text-emerald-800 text-base sm:text-lg leading-snug mb-2"
                                    >
                                        {product.name}
                                    </Link>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                                        {product.short_description}
                                    </p>
                                </div>

                                <div>
                                    {/* Price */}
                                    <div className="flex items-baseline gap-2 pt-3 border-t border-gray-100 mb-4">
                                        <span className="text-xl sm:text-2xl font-black text-emerald-800">
                                            ৳{price.toLocaleString()}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                                                ৳{originalPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleAddCart}
                                            type="button"
                                            className="p-2.5 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 transition-colors"
                                            title="কার্টে যোগ করুন"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleInstantOrder}
                                            type="button"
                                            className="flex-1 py-2.5 px-3 rounded-xl bg-[#c52d2f] hover:bg-[#a82325] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                                        >
                                            <Zap className="w-3.5 h-3.5 fill-current" />
                                            <span>অর্ডার করুন</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
