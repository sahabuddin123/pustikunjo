import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle, PhoneCall } from 'lucide-react';

export default function TrackOrder({ order, searched, initialOrder = '', initialPhone = '', meta = {} }) {
    const [orderNumber, setOrderNumber] = useState(initialOrder);
    const [phone, setPhone] = useState(initialPhone);

    const handleSearch = (e) => {
        e.preventDefault();
        if (orderNumber.trim() && phone.trim()) {
            router.get('/track-order', {
                order: orderNumber.trim(),
                phone: phone.trim(),
            });
        }
    };

    const statusSteps = [
        { key: 'pending', label: 'অর্ডার গ্রহণ', icon: Clock },
        { key: 'confirmed', label: 'অর্ডার নিশ্চিত', icon: CheckCircle2 },
        { key: 'shipped', label: 'ডেলিভারিতে প্রেরণ', icon: Truck },
        { key: 'delivered', label: 'ডেলিভারি সম্পন্ন', icon: Package },
    ];

    const getStepIndex = (status) => {
        switch (status) {
            case 'pending':
            case 'payment_pending':
                return 0;
            case 'payment_verified':
            case 'confirmed':
                return 1;
            case 'shipped':
                return 2;
            case 'delivered':
                return 3;
            default:
                return 0;
        }
    };

    const currentStepIndex = order ? getStepIndex(order.status) : 0;

    return (
        <StorefrontLayout meta={meta}>
            <div className="bg-emerald-900 text-white py-12 border-b border-emerald-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        লাইভ অর্ডার ট্র্যাকিং
                    </h1>
                    <p className="text-emerald-100/80 text-sm sm:text-base">
                        আপনার অর্ডার নম্বর ও ফোন নম্বর দিয়ে সহজেই পণ্যের অবস্থান ও ডেলিভারি স্ট্যাটাস জানুন।
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
                {/* Search Form Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                                    অর্ডার আইডি / ট্র্যাকিং নম্বর *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="যেমন: PK-260908-0001"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono uppercase focus:outline-none focus:border-emerald-600"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                                    অর্ডারে ব্যবহৃত মোবাইল নম্বর *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="যেমন: 01700000000"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            <span>অর্ডারের অবস্থা দেখুন</span>
                        </button>
                    </form>
                </div>

                {/* Result Section */}
                {searched && (
                    order ? (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg space-y-8 animate-fade-in">
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
                                <div>
                                    <span className="text-xs text-gray-500 font-medium">অর্ডার আইডি:</span>
                                    <h2 className="text-xl sm:text-2xl font-black text-emerald-900 font-mono">
                                        {order.order_number}
                                    </h2>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        তারিখ: {new Date(order.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm inline-block self-start sm:self-auto">
                                    {order.status_label || order.status}
                                </div>
                            </div>

                            {/* Progress Timeline */}
                            <div className="py-4">
                                <div className="grid grid-cols-4 gap-2 relative">
                                    {statusSteps.map((step, idx) => {
                                        const isCompleted = idx <= currentStepIndex;
                                        const isCurrent = idx === currentStepIndex;
                                        const StepIcon = step.icon;

                                        return (
                                            <div key={idx} className="flex flex-col items-center text-center relative z-10">
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                                                    isCompleted
                                                        ? 'bg-emerald-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-400'
                                                } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}>
                                                    <StepIcon className="w-5 h-5" />
                                                </div>
                                                <span className={`text-[11px] sm:text-xs font-bold mt-2 ${
                                                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Items and Delivery info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div>
                                    <span className="text-gray-500 block">গ্রাহকের নাম:</span>
                                    <span className="font-bold text-gray-900">{order.customer_name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">পেমেন্ট মাধ্যম:</span>
                                    <span className="font-bold text-gray-900 uppercase">
                                        {order.payment_method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'বিকাশ পেমেন্ট'}
                                    </span>
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="text-gray-500 block">ডেলিভারি ঠিকানা:</span>
                                    <span className="font-semibold text-gray-800">{order.shipping_address} ({order.shipping_area})</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md text-center space-y-3 animate-fade-in">
                            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                            <h3 className="text-lg font-bold text-gray-900">
                                কোনো অর্ডার পাওয়া যায়নি
                            </h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                প্রদত্ত অর্ডার আইডি অথবা মোবাইল নম্বরটি সঠিক নয়। অনুগ্রহ করে তথ্য পুনরায় চেক করে চেষ্টা করুন।
                            </p>
                        </div>
                    )
                )}
            </div>
        </StorefrontLayout>
    );
}
