import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/Context/CartContext';

const DEFAULT_RECOMMENDATIONS = [
    {
        id: 3,
        name: 'চিয়া সিড বক্স | Boxed Chia Seeds',
        slug: 'chia-seeds',
        price: 1400,
        originalPrice: 2200,
        saving: 800,
        image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&auto=format&fit=crop&q=80',
    },
    {
        id: 1,
        name: 'বিটরুট পাউডার প্রিমিয়াম প্যাক',
        slug: 'beetroot-powder',
        price: 1250,
        originalPrice: 1650,
        saving: 400,
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
    },
    {
        id: 2,
        name: 'মেথিমিক্স অর্গানিক হেলথ প্যাক',
        slug: 'methimix',
        price: 1350,
        originalPrice: 1750,
        saving: 400,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80',
    },
];

export default function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, cartCount, addToCart } = useCart();
    const [recIndex, setRecIndex] = useState(0);

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        setIsCartOpen(false);
        router.visit('/checkout');
    };

    const handlePrevRecommendation = () => {
        setRecIndex((prev) => (prev > 0 ? prev - 1 : DEFAULT_RECOMMENDATIONS.length - 1));
    };

    const handleNextRecommendation = () => {
        setRecIndex((prev) => (prev < DEFAULT_RECOMMENDATIONS.length - 1 ? prev + 1 : 0));
    };

    const currentRec = DEFAULT_RECOMMENDATIONS[recIndex];

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Slide-over Drawer from Right */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-[88vw] max-w-[380px] bg-white shadow-2xl flex flex-col justify-between h-full animate-slide-in-right">
                    {/* Top Bar matching reference screenshot: Back arrow, Centered Title, Round Golden Badge */}
                    <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900 sticky top-0 z-10">
                        {/* Back Arrow */}
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                            aria-label="বন্ধ করুন"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Centered Title */}
                        <h2 className="text-lg font-bold text-[#0B3E25] font-sans tracking-tight">
                            Your Cart
                        </h2>

                        {/* Circular Golden Badge */}
                        <div className="w-6 h-6 rounded-full bg-[#D48828] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            {cartCount}
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBF9]">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                                <div className="w-18 h-18 rounded-full bg-emerald-50 flex items-center justify-center text-[#0B3E25]">
                                    <ShoppingBag className="w-9 h-9" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    আপনার কার্ট বর্তমানে খালি
                                </h3>
                                <p className="text-sm text-gray-500 max-w-xs">
                                    সুস্থ জীবনের জন্য আমাদের সেরা প্রাকৃতিক খাদ্য উপাদানসমূহ ঘুরে দেখুন।
                                </p>
                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        router.visit('/shop');
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-[#0B3E25] hover:bg-[#072F1C] text-white font-bold text-sm transition-colors shadow-xs cursor-pointer"
                                >
                                    শপিং শুরু করুন
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Cart Items List */}
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div
                                            key={item.key || item.id}
                                            className="bg-white rounded-2xl border border-gray-200/90 p-3.5 shadow-2xs flex items-center gap-3"
                                        >
                                            {/* Product Thumbnail */}
                                            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 p-1">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>

                                            {/* Info & Controls */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
                                                        {item.name}
                                                    </h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.key || item.id)}
                                                        className="text-gray-400 hover:text-rose-600 transition-colors p-0.5 shrink-0"
                                                        title="মুছে ফেলুন"
                                                        aria-label="মুছে ফেলুন"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-2.5">
                                                    {/* Pill Quantity Box */}
                                                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-2xs text-xs">
                                                        <button
                                                            onClick={() => updateQuantity(item.key || item.id, -1)}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                                                            title="কমান"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="px-2 font-bold text-gray-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.key || item.id, 1)}
                                                            className="px-2 py-1 text-[#D48828] hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                                                            title="বাড়ান"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-base font-black text-[#0B3E25]">
                                                        ৳{(item.price * item.quantity).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* "You'll also love" Section matching reference */}
                                <div className="bg-[#EDF5F0] rounded-2xl p-4 my-2 border border-emerald-100/70">
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-1">
                                        <div>
                                            <h4 className="text-base font-bold text-[#0B3E25] font-sans">
                                                You'll also love
                                            </h4>
                                            {/* Golden Accent Underline */}
                                            <div className="w-8 h-1 bg-[#D48828] rounded-full mt-1" />
                                        </div>

                                        {/* Prev / Next Buttons */}
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={handlePrevRecommendation}
                                                className="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-700 hover:text-[#0B3E25] hover:border-emerald-300 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                                aria-label="পূর্ববর্তী পণ্য"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleNextRecommendation}
                                                className="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-700 hover:text-[#0B3E25] hover:border-emerald-300 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                                aria-label="পরবর্তী পণ্য"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recommendation Card */}
                                    <div className="mt-3 bg-white rounded-xl p-3 border border-gray-100 shadow-2xs flex flex-col gap-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                                                <img
                                                    src={currentRec.image}
                                                    alt={currentRec.name}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-sm text-gray-900 truncate leading-tight">
                                                    {currentRec.name}
                                                </h5>
                                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                    <span className="text-sm font-black text-[#0B3E25]">
                                                        ৳{currentRec.price.toLocaleString()}
                                                    </span>
                                                    {currentRec.originalPrice && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            ৳{currentRec.originalPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                    {currentRec.saving && (
                                                        <span className="bg-[#20844E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                            Save ৳{currentRec.saving}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => addToCart(currentRec, 1, false)}
                                            className="w-full py-2 rounded-lg border border-[#D48828] text-[#D48828] hover:bg-[#D48828] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom Sticky Total & Gold Checkout Button matching reference */}
                    {cart.length > 0 && (
                        <div className="p-4 bg-white border-t border-gray-100 shadow-lg space-y-3 sticky bottom-0 z-10">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900 text-lg font-sans">
                                    Total
                                </span>
                                <span className="font-black text-xl text-[#0B3E25] font-sans">
                                    ৳{cartSubtotal.toLocaleString()}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-3.5 rounded-xl bg-[#D48828] hover:bg-[#c0791e] active:scale-[0.99] text-white font-bold text-lg shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
                            >
                                অর্ডার করুন
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
