import React, { useState, useEffect } from 'react';
import { usePage, useForm, router, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { useCart } from '@/Context/CartContext';
import { trackEvent } from '@/Services/Analytics';
import {
    ShieldCheck,
    Truck,
    CreditCard,
    Copy,
    Check,
    AlertCircle,
    ShoppingBag,
    ArrowLeft,
    Tag,
    Lock
} from 'lucide-react';

export default function Checkout({ shippingZones = [], bkashSettings = {}, meta = {} }) {
    const { cart, cartSubtotal, cartCount, clearCart } = useCart();

    const [copiedNumber, setCopiedNumber] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const defaultZone = shippingZones.length > 0 ? shippingZones[0].name : 'ঢাকার ভিতরে';
    const [shippingArea, setShippingArea] = useState(defaultZone);

    const activeZone = shippingZones.find((z) => z.name === shippingArea) || { fee: 60 };
    const shippingFee = Number(activeZone.fee);
    const grandTotal = Math.max(0, cartSubtotal + shippingFee - couponDiscount);

    const form = useForm({
        customer_name: '',
        customer_phone: '',
        customer_alt_phone: '',
        customer_email: '',
        shipping_address: '',
        shipping_area: defaultZone,
        order_notes: '',
        payment_method: 'cod', // cod, bkash_manual, bkash_pgw
        bkash_sender_number: '',
        bkash_trx_id: '',
        coupon_code: '',
        items: [],
    });

    // Update form items when cart changes
    useEffect(() => {
        form.setData('items', cart.map((item) => ({ id: item.id, quantity: item.quantity })));
    }, [cart]);

    // Track InitiateCheckout
    useEffect(() => {
        if (cartSubtotal > 0) {
            trackEvent('begin_checkout', {
                value: grandTotal,
                num_items: cartCount,
            });
        }
    }, []);

    const handleZoneChange = (zoneName) => {
        setShippingArea(zoneName);
        form.setData('shipping_area', zoneName);
    };

    const handleCopyNumber = () => {
        const num = bkashSettings.manual_number || '01700000000';
        navigator.clipboard.writeText(num);
        setCopiedNumber(true);
        setTimeout(() => setCopiedNumber(false), 2500);
    };

    const applyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setCouponLoading(true);
        setCouponError('');

        try {
            const res = await fetch('/api/validate-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ code: couponCode.trim(), amount: cartSubtotal }),
            });

            const data = await res.json();
            if (res.ok && data.valid) {
                setCouponDiscount(Number(data.discount));
                setAppliedCoupon(data.code);
                form.setData('coupon_code', data.code);
            } else {
                setCouponError(data.message || 'কুপনটি প্রযোজ্য নয়।');
            }
        } catch (err) {
            setCouponError('কুপন যাচাই করা সম্ভব হয়নি।');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode('');
        form.setData('coupon_code', '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        form.post('/checkout/process', {
            preserveScroll: true,
            onSuccess: () => {
                clearCart();
            },
        });
    };

    if (cart.length === 0) {
        return (
            <StorefrontLayout meta={meta}>
                <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">
                        আপনার শপিং কার্ট খালি!
                    </h2>
                    <p className="text-sm text-gray-600">
                        অর্ডার করার জন্য প্রথমে কার্টে কিছু পণ্য যোগ করুন।
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md"
                    >
                        <span>শপিং শুরু করুন</span>
                    </Link>
                </div>
            </StorefrontLayout>
        );
    }

    const bkashInstructions = (bkashSettings.manual_instructions || 'অর্ডার কনফার্ম করতে {amount} টাকা {number} নম্বরে সেন্ড মানি করুন। সেন্ড মানি করার পর নিচে ট্রানজেকশন আইডি (TrxID) লিখুন।')
        .replace('{amount}', `৳${grandTotal.toLocaleString()}`)
        .replace('{number}', bkashSettings.manual_number || '01700000000');

    return (
        <StorefrontLayout meta={meta}>
            <div className="bg-emerald-900 text-white py-8 border-b border-emerald-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                            সহজ ও দ্রুত চেকআউট
                        </h1>
                        <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                            সঠিক তথ্য দিয়ে অর্ডারটি সম্পন্ন করুন।
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-200 bg-emerald-800/80 px-3 py-1.5 rounded-lg">
                        <Lock className="w-3.5 h-3.5 text-emerald-300" />
                        <span>১০০% নিরাপদ লেনদেন</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Customer Info & Payment Methods */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Step 1: Contact & Delivery Address */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">১</span>
                                <span>ডেলিভারি তথ্য</span>
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                                        আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="যেমন: তানভীর হাসান"
                                        value={form.data.customer_name}
                                        onChange={(e) => form.setData('customer_name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                                    />
                                    {form.errors.customer_name && (
                                        <span className="text-xs text-rose-500 mt-1 block">{form.errors.customer_name}</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                                            মোবাইল নম্বর <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="যেমন: 01700000000"
                                            value={form.data.customer_phone}
                                            onChange={(e) => form.setData('customer_phone', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                                        />
                                        {form.errors.customer_phone && (
                                            <span className="text-xs text-rose-500 mt-1 block">{form.errors.customer_phone}</span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                                            বিকল্প নম্বর (ঐচ্ছিক)
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="বিকল্প ফোন নম্বর"
                                            value={form.data.customer_alt_phone}
                                            onChange={(e) => form.setData('customer_alt_phone', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                                        />
                                    </div>
                                </div>

                                {/* Delivery Area Zones Selection */}
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                                        ডেলিভারি এলাকা নির্বাচন করুন <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {shippingZones.map((zone, idx) => {
                                            const isSelected = shippingArea === zone.name;
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleZoneChange(zone.name)}
                                                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                                                        isSelected
                                                            ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                                >
                                                    <div>
                                                        <span className="font-bold text-sm text-gray-900 block">{zone.name}</span>
                                                        <span className="text-xs text-gray-500">চার্জ: ৳{zone.fee}</span>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'
                                                    }`}>
                                                        {isSelected && <Check className="w-3 h-3 stroke-3" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                                        পূর্ণ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="বাড়ি নং, রোড নং, এলাকা, থানা, জেলা..."
                                        value={form.data.shipping_address}
                                        onChange={(e) => form.setData('shipping_address', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                                    />
                                    {form.errors.shipping_address && (
                                        <span className="text-xs text-rose-500 mt-1 block">{form.errors.shipping_address}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                                        অর্ডার সম্পর্কিত বিশেষ নোট (ঐচ্ছিক)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ডেলিভারির বিশেষ কোনো নির্দেশনা থাকলে লিখুন..."
                                        value={form.data.order_notes}
                                        onChange={(e) => form.setData('order_notes', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Payment Method Selection (bKash & COD) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">২</span>
                                <span>পেমেন্ট মাধ্যম নির্বাচন করুন</span>
                            </h2>

                            <div className="space-y-3">
                                {/* Option 1: Cash on Delivery */}
                                <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                    form.data.payment_method === 'cod'
                                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cod"
                                                checked={form.data.payment_method === 'cod'}
                                                onChange={(e) => form.setData('payment_method', e.target.value)}
                                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <div>
                                                <span className="font-bold text-sm sm:text-base text-gray-900 block">
                                                    ক্যাশ অন ডেলিভারি (Cash on Delivery)
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                                            জনপ্রিয়
                                        </span>
                                    </div>
                                </label>

                                {/* Option 2: bKash Manual Send Money */}
                                {bkashSettings.manual_enabled && (
                                    <div className={`p-4 rounded-2xl border-2 transition-all ${
                                        form.data.payment_method === 'bkash_manual'
                                            ? 'border-[#E2136E] bg-rose-50/20 shadow-xs'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="bkash_manual"
                                                    checked={form.data.payment_method === 'bkash_manual'}
                                                    onChange={(e) => form.setData('payment_method', e.target.value)}
                                                    className="w-4 h-4 text-[#E2136E] focus:ring-[#E2136E]"
                                                />
                                                <div>
                                                    <span className="font-bold text-sm sm:text-base text-gray-900 block">
                                                        বিকাশ (সেন্ড মানি) — bKash
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        বিকাশে পেমেন্ট করে TrxID দিয়ে অর্ডার কনফার্ম করুন।
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-16 h-8 bg-[#E2136E] text-white rounded-lg flex items-center justify-center text-xs font-black">
                                                bKash
                                            </div>
                                        </label>

                                        {/* bKash Manual Box when selected */}
                                        {form.data.payment_method === 'bkash_manual' && (
                                            <div className="mt-4 pt-4 border-t border-rose-100 space-y-4 animate-fade-in">
                                                {/* Instructions Card */}
                                                <div className="p-4 rounded-xl bg-pink-50/80 border border-pink-200 text-xs sm:text-sm text-gray-800 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-[#E2136E]">
                                                            বিকাশ {bkashSettings.manual_type === 'merchant' ? 'মার্চেন্ট' : 'ব্যক্তিগত'} নম্বর:
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={handleCopyNumber}
                                                            className="px-2.5 py-1 rounded-md bg-[#E2136E] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#c2105e] transition-colors"
                                                        >
                                                            {copiedNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                            <span>{copiedNumber ? 'কপি হয়েছে' : 'নম্বর কপি'}</span>
                                                        </button>
                                                    </div>
                                                    <div className="text-base font-black text-gray-900 font-mono tracking-wider">
                                                        {bkashSettings.manual_number || '01700000000'}
                                                    </div>
                                                    <p className="text-gray-600 text-xs leading-relaxed">
                                                        {bkashInstructions}
                                                    </p>
                                                </div>

                                                {/* TrxID Input */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 block mb-1">
                                                            প্রেরক বিকাশ নম্বর <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন"
                                                            value={form.data.bkash_sender_number}
                                                            onChange={(e) => form.setData('bkash_sender_number', e.target.value)}
                                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#E2136E]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 block mb-1">
                                                            ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="যেমন: BLG904944"
                                                            value={form.data.bkash_trx_id}
                                                            onChange={(e) => form.setData('bkash_trx_id', e.target.value.toUpperCase())}
                                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono uppercase focus:border-[#E2136E]"
                                                        />
                                                        {form.errors.bkash_trx_id && (
                                                            <span className="text-xs text-rose-500 mt-1 block">{form.errors.bkash_trx_id}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                                অর্ডারের বিবরণ ({cartCount} টি পণ্য)
                            </h2>

                            {/* Cart Items List */}
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-lg object-cover bg-white border border-gray-100 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                                                {item.name}
                                            </h4>
                                            <span className="text-xs text-gray-500">
                                                ৳{item.price.toLocaleString()} × {item.quantity}
                                            </span>
                                        </div>
                                        <div className="text-xs sm:text-sm font-bold text-emerald-800">
                                            ৳{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code Section */}
                            <div className="pt-2 border-t border-gray-100">
                                {appliedCoupon ? (
                                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs sm:text-sm">
                                        <div className="flex items-center gap-2 text-emerald-800 font-bold">
                                            <Tag className="w-4 h-4" />
                                            <span>কুপন কোড '{appliedCoupon}' যুক্ত হয়েছে (-৳{couponDiscount})</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeCoupon}
                                            className="text-xs text-rose-600 hover:underline font-bold"
                                        >
                                            বাতিল
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="কুপন কোড (যদি থাকে)"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm uppercase font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={applyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold disabled:opacity-50 transition-colors"
                                            >
                                                {couponLoading ? '...' : 'প্রয়োগ'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <span className="text-xs text-rose-500 block">{couponError}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2.5 pt-4 border-t border-gray-100 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>সাবটোটাল</span>
                                    <span className="font-semibold text-gray-900">৳{cartSubtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>ডেলিভারি চার্জ ({shippingArea})</span>
                                    <span className="font-semibold text-gray-900">৳{shippingFee}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-700 font-semibold">
                                        <span>কুপন ছাড়</span>
                                        <span>-৳{couponDiscount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base sm:text-lg font-black text-emerald-950 pt-2 border-t border-gray-200">
                                    <span>সর্বমোট প্রদেয় বিল</span>
                                    <span className="text-xl sm:text-2xl font-black text-emerald-800">
                                        ৳{grandTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Order Button */}
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-60"
                            >
                                <ShieldCheck className="w-5 h-5" />
                                <span>{form.processing ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}</span>
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 text-center">
                                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span>সারা দেশে ২৪ থেকে ৪৮ ঘণ্টায় হোম ডেলিভারি</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </StorefrontLayout>
    );
}
