import React, { useState } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Printer,
    Send,
    Truck,
    Clock,
    CreditCard,
    AlertCircle,
    User,
    MapPin,
    Package,
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    RefreshCw,
    ExternalLink,
    Copy,
    Check,
    PhoneCall
} from 'lucide-react';

export default function Show({ order, fraudAnalysis = {}, steadfastConfigured = false }) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('ট্রানজেকশন আইডি (TrxID) বা প্রদেয় পরিমাণের অমিল পাওয়া গেছে।');

    // Courier booking modal state
    const [showCourierModal, setShowCourierModal] = useState(false);
    const [courierLoading, setCourierLoading] = useState(false);
    const [courierSyncing, setCourierSyncing] = useState(false);
    const [copiedTracking, setCopiedTracking] = useState(false);

    const courierForm = useForm({
        recipient_name: order.customer_name || '',
        recipient_phone: order.customer_phone || '',
        recipient_address: `${order.shipping_address || ''} (${order.shipping_area || ''})`,
        cod_amount: order.payment_method === 'cod' ? order.grand_total : 0,
        note: order.order_notes || 'পুষ্টি কুঞ্জ অর্গানিক পণ্য — হ্যান্ডেল উইথ কেয়ার',
    });

    // Blacklist / Fraud modal state
    const [showBlacklistModal, setShowBlacklistModal] = useState(false);
    const [blacklistReason, setBlacklistReason] = useState('অর্ডার গ্রহণের পর পার্সেল রিসিভ করে না / ভুয়া নম্বর');

    const statusForm = useForm({
        status: order.status,
        admin_notes: order.admin_notes || '',
    });

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        statusForm.post(`/admin/orders/${order.id}/status`);
    };

    const handleVerifyPayment = () => {
        if (confirm('আপনি কি নিশ্চিত যে এই বিকাশ পেমেন্ট ও TrxID সঠিক রয়েছে?')) {
            router.post(`/admin/orders/${order.id}/verify-payment`);
        }
    };

    const handleRejectPayment = (e) => {
        e.preventDefault();
        router.post(`/admin/orders/${order.id}/reject-payment`, {
            reason: rejectReason,
        }, {
            onSuccess: () => setShowRejectModal(false),
        });
    };

    const handleResendSms = (eventName) => {
        if (confirm(`গ্রাহকের নম্বরে "${eventName}" এসএমএস পুনরায় পাঠাতে চান?`)) {
            router.post(`/admin/orders/${order.id}/resend-sms`, {
                event: eventName,
            });
        }
    };

    const handleBookCourier = (e) => {
        e.preventDefault();
        setCourierLoading(true);
        courierForm.post(`/admin/orders/${order.id}/courier`, {
            preserveScroll: true,
            onSuccess: () => setShowCourierModal(false),
            onFinish: () => setCourierLoading(false),
        });
    };

    const handleSyncCourier = () => {
        setCourierSyncing(true);
        router.post(`/admin/orders/${order.id}/courier-sync`, {}, {
            preserveScroll: true,
            onFinish: () => setCourierSyncing(false),
        });
    };

    const handleToggleBlacklist = (action) => {
        if (action === 'whitelist') {
            if (confirm('আপনি কি এই গ্রাহককে ব্ল্যাকলিস্ট থেকে খালাস করতে চান?')) {
                router.post(`/admin/orders/${order.id}/blacklist`, { action: 'whitelist' });
            }
            return;
        }

        router.post(`/admin/orders/${order.id}/blacklist`, {
            action: 'blacklist',
            reason: blacklistReason,
        }, {
            onSuccess: () => setShowBlacklistModal(false),
        });
    };

    const copyTracking = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedTracking(true);
        setTimeout(() => setCopiedTracking(false), 2000);
    };

    const statusBadges = {
        pending: 'bg-amber-100 text-amber-800',
        payment_pending: 'bg-pink-100 text-pink-800',
        payment_verified: 'bg-indigo-100 text-indigo-800',
        confirmed: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-rose-100 text-rose-800',
        payment_rejected: 'bg-red-100 text-red-800',
    };

    const stats = fraudAnalysis?.stats || {
        total_orders: 1,
        delivered_orders: 0,
        cancelled_orders: 0,
        success_rate: 100,
    };

    const isBlacklisted = fraudAnalysis?.is_blacklisted || fraudAnalysis?.risk_level === 'fraud';

    return (
        <AdminLayout title={`অর্ডার বিবরণ: ${order.order_number}`}>
            <div className="space-y-6 w-full pb-16">
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                    <Link
                        href="/admin/orders"
                        className="text-xs sm:text-sm font-bold text-gray-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> অর্ডার তালিকায় ফিরে যান
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            href={`/admin/orders/${order.id}/invoice`}
                            target="_blank"
                            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            <span>ইনভয়েস প্রিন্ট</span>
                        </Link>
                    </div>
                </div>

                {/* Fraud Alert Banner if Blacklisted or High Risk */}
                {isBlacklisted ? (
                    <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-md flex items-center justify-between gap-4 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="w-8 h-8 shrink-0 text-white" />
                            <div>
                                <h3 className="text-sm sm:text-base font-black tracking-wide">
                                    সতর্কতা: এই গ্রাহকের নম্বর প্রতারক (Fraud / Blacklisted) হিসেবে চিহ্নিত!
                                </h3>
                                <p className="text-xs text-rose-100 mt-0.5">
                                    কারণ: {fraudAnalysis?.reason || 'পূর্বের একাধিক পার্সেল রিজেক্ট/ভুয়া অর্ডার প্রদান করেছে।'}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggleBlacklist('whitelist')}
                            className="px-3.5 py-1.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold shrink-0 transition-colors shadow-xs"
                        >
                            ব্ল্যাকলিস্ট থেকে মুক্ত করুন
                        </button>
                    </div>
                ) : fraudAnalysis?.risk_level === 'high' ? (
                    <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-xs flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-7 h-7 text-rose-600 shrink-0" />
                            <div>
                                <h3 className="text-xs sm:text-sm font-bold">
                                    উচ্চ ঝুঁকি সতর্কতা (High Risk Score: {fraudAnalysis?.risk_score}%)
                                </h3>
                                <p className="text-xs text-rose-700">
                                    এই নম্বরে পূর্বের {stats.cancelled_orders} টি বাতিল/রিটার্ন অর্ডার রয়েছে। পার্সেল পাঠানোর আগে ফোন করে কনফার্ম হন।
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowBlacklistModal(true)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 shadow-xs"
                        >
                            ব্ল্যাকলিস্ট করুন
                        </button>
                    </div>
                ) : null}

                {/* bKash Manual Verification Action Card */}
                {order.payment_method === 'bkash_manual' && (
                    <div className="bg-pink-50/80 border-2 border-pink-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center md:text-left">
                            <span className="text-xs font-bold text-[#E2136E] uppercase tracking-wide block">
                                বিকাশ ম্যানুয়াল পেমেন্ট যাচাইকরণ
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700">প্রেরক নম্বর: {order.bkash_sender_number || 'উল্লেখ নেই'}</span>
                                <span className="font-mono text-sm font-black bg-white px-3 py-1 rounded-lg border border-pink-300 text-[#E2136E]">
                                    TrxID: {order.bkash_trx_id || 'N/A'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600">
                                বিকাশ একাউন্টে টাকা ও TrxID চেক করে নিচের বাটনে ক্লিক করুন।
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                            {order.status !== 'payment_verified' && (
                                <button
                                    onClick={handleVerifyPayment}
                                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>পেমেন্ট নিশ্চিত করুন (Verify)</span>
                                </button>
                            )}
                            {order.status !== 'payment_rejected' && (
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                                >
                                    <XCircle className="w-4 h-4" />
                                    <span>পেমেন্ট বাতিল (Reject)</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Col (8): Products & Customer Info */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Order Items Table */}
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-emerald-700" /> অর্ডারের পণ্যসমূহ
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    statusBadges[order.status] || 'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status_label || order.status}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-600 uppercase font-bold text-[11px]">
                                        <tr>
                                            <th className="py-3 px-4">পণ্য</th>
                                            <th className="py-3 px-4">মূল্য</th>
                                            <th className="py-3 px-4">পরিমাণ</th>
                                            <th className="py-3 px-4 text-right">মোট</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {order.items?.map((item) => (
                                            <tr key={item.id}>
                                                <td className="py-3.5 px-4 flex items-center gap-3">
                                                    <img
                                                        src={item.product_image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=100&auto=format&fit=crop&q=80'}
                                                        alt={item.product_name}
                                                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                                    />
                                                    <div>
                                                        <span className="font-bold text-gray-900 block">{item.product_name}</span>
                                                        <span className="text-[11px] text-gray-400 font-mono">{item.product_sku}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 font-semibold text-gray-700">
                                                    ৳{item.unit_price}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-gray-900">
                                                    {item.quantity} টি
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-bold text-emerald-800">
                                                    ৳{item.subtotal}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Totals */}
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>সাবটোটাল</span>
                                    <span className="font-semibold text-gray-900">৳{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ডেলিভারি চার্জ ({order.shipping_area})</span>
                                    <span className="font-semibold text-gray-900">৳{order.shipping_fee}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-emerald-700 font-semibold">
                                        <span>কুপন ছাড় {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                                        <span>-৳{order.discount_amount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                                    <span>সর্বমোট প্রদেয় বিল</span>
                                    <span className="text-emerald-800 text-lg">৳{order.grand_total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                                <User className="w-4 h-4 text-emerald-700" /> গ্রাহক ও ডেলিভারি তথ্য
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                <div>
                                    <span className="text-gray-400 block font-medium">নাম:</span>
                                    <span className="font-bold text-gray-900 text-base">{order.customer_name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block font-medium">ফোন নম্বর:</span>
                                    <span className="font-bold text-emerald-800">{order.customer_phone}</span>
                                    {order.customer_alt_phone && (
                                        <span className="text-xs text-gray-500 block">বিকল্প: {order.customer_alt_phone}</span>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="text-gray-400 block font-medium">ডেলিভারি ঠিকানা:</span>
                                    <span className="font-semibold text-gray-800">{order.shipping_address} ({order.shipping_area})</span>
                                </div>
                                {order.order_notes && (
                                    <div className="sm:col-span-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                                        <span className="font-bold block">গ্রাহকের বিশেষ নোট:</span>
                                        {order.order_notes}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fraud Risk Analysis Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div>
                                    <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-emerald-700" /> ফ্রড স্কোর ও গ্রাহক ইতিহাস (Fraud Checker)
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        মোবাইল নম্বর <span className="font-mono font-bold text-gray-800">{order.customer_phone}</span> এর সামগ্রিক বিশ্লেষণ
                                    </p>
                                </div>

                                {isBlacklisted ? (
                                    <button
                                        type="button"
                                        onClick={() => handleToggleBlacklist('whitelist')}
                                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        ব্ল্যাকলিস্ট থেকে মুক্ত করুন
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowBlacklistModal(true)}
                                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        ব্ল্যাকলিস্ট করুন
                                    </button>
                                )}
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-center">
                                    <span className="text-[11px] font-bold text-gray-500 block">মোট অর্ডার</span>
                                    <span className="text-lg font-black text-gray-900">{stats.total_orders}</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                                    <span className="text-[11px] font-bold text-emerald-700 block">সফল ডেলিভারি</span>
                                    <span className="text-lg font-black text-emerald-800">{stats.delivered_orders}</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-center">
                                    <span className="text-[11px] font-bold text-rose-700 block">বাতিল / রিটার্ন</span>
                                    <span className="text-lg font-black text-rose-800">{stats.cancelled_orders}</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-center">
                                    <span className="text-[11px] font-bold text-sky-700 block">সফলতার হার</span>
                                    <span className="text-lg font-black text-sky-800">{stats.success_rate}%</span>
                                </div>
                            </div>

                            {/* Risk Meter */}
                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base ${
                                        isBlacklisted || fraudAnalysis?.risk_level === 'high' ? 'bg-rose-600' : fraudAnalysis?.risk_level === 'medium' ? 'bg-amber-500' : 'bg-emerald-600'
                                    }`}>
                                        {fraudAnalysis?.risk_score}%
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-500">ঝুঁকির পরিমাণ (Risk Level)</div>
                                        <div className="text-sm font-black text-gray-900">{fraudAnalysis?.risk_label || 'নিরাপদ'}</div>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500 text-center sm:text-right">
                                    {isBlacklisted ? (
                                        <span className="text-rose-600 font-bold">⛔ ডাটাবেজে ভুয়া বা ব্ল্যাকলিস্টেড গ্রাহক হিসেবে নথিবদ্ধ</span>
                                    ) : stats.cancelled_orders > 0 ? (
                                        <span>পূর্বের {stats.cancelled_orders} টি বাতিল অর্ডারের কারণে ঝুঁকি কিছুটা বেশি</span>
                                    ) : (
                                        <span className="text-emerald-700 font-bold">✓ নির্ভরযোগ্য গ্রাহক, কোনো ক্যান্সেলেশন রেকর্ড নেই</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col (4): Courier & Status Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Steadfast Courier Dispatch & Tracking Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-emerald-700" /> স্টেডফাস্ট কুরিয়ার
                                </h2>
                                {order.courier_tracking_code && (
                                    <button
                                        type="button"
                                        onClick={handleSyncCourier}
                                        disabled={courierSyncing}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        title="কুরিয়ার স্ট্যাটাস রিফ্রেশ করুন"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${courierSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                                    </button>
                                )}
                            </div>

                            {order.courier_tracking_code ? (
                                <div className="space-y-4">
                                    {/* Tracking Badge */}
                                    <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-2">
                                        <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wide block">
                                            পার্সেল বুকিং সম্পন্ন
                                        </span>
                                        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-sky-300">
                                            <span className="font-mono text-sm font-black text-sky-900">
                                                {order.courier_tracking_code}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => copyTracking(order.courier_tracking_code)}
                                                className="p-1 text-gray-400 hover:text-sky-700 rounded transition-colors"
                                                title="কপি করুন"
                                            >
                                                {copiedTracking ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between text-xs pt-1">
                                            <span className="text-gray-500">কনসাইনমেন্ট আইডি:</span>
                                            <span className="font-mono font-bold text-gray-800">#{order.courier_consignment_id || 'N/A'}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">কুরিয়ার স্ট্যাটাস:</span>
                                            <span className="font-bold capitalize text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                                                {order.courier_status || 'in_review'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Direct Live Tracking Link */}
                                    <a
                                        href={`https://steadfast.com.bd/t/${order.courier_tracking_code}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                                    >
                                        <span>লাইভ ট্র্যাকিং পেজ দেখুন</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>

                                    <button
                                        type="button"
                                        onClick={handleSyncCourier}
                                        disabled={courierSyncing}
                                        className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${courierSyncing ? 'animate-spin' : ''}`} />
                                        <span>{courierSyncing ? 'সিঙ্ক হচ্ছে...' : 'স্ট্যাটাস রিফ্রেশ / সিঙ্ক'}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-xs text-gray-500">
                                        এই অর্ডারটি এখনও স্টেডফাস্ট কুরিয়ারে বুক করা হয়নি। নিচের বাটনে ক্লিক করে সরাসরি পার্সেল বুকিং কনফার্ম করুন।
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowCourierModal(true)}
                                        className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                                    >
                                        <Truck className="w-4 h-4" />
                                        <span>স্টেডফাস্টে পার্সেল বুক করুন</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Status Updater */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
                                স্ট্যাটাস পরিবর্তন
                            </h2>
                            <form onSubmit={handleStatusUpdate} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">
                                        অর্ডারের বর্তমান অবস্থা
                                    </label>
                                    <select
                                        value={statusForm.data.status}
                                        onChange={(e) => statusForm.setData('status', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800"
                                    >
                                        <option value="pending">অপেক্ষমান (Pending)</option>
                                        <option value="payment_pending">পেমেন্ট যাচাই বাকি (Payment Pending)</option>
                                        <option value="payment_verified">পেমেন্ট নিশ্চিত (Payment Verified)</option>
                                        <option value="confirmed">অর্ডার নিশ্চিত (Confirmed)</option>
                                        <option value="shipped">ডেলিভারিতে আছে (Shipped)</option>
                                        <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
                                        <option value="cancelled">বাতিল (Cancelled)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">
                                        এডমিন নোট (অভ্যন্তরীণ)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={statusForm.data.admin_notes}
                                        onChange={(e) => statusForm.setData('admin_notes', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={statusForm.processing}
                                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    স্ট্যাটাস আপডেট করুন
                                </button>
                            </form>
                        </div>

                        {/* Re-send SMS Trigger Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                                <Send className="w-4 h-4 text-emerald-700" /> এসএমএস পুনঃপ্রেরণ
                            </h2>
                            <p className="text-xs text-gray-500">
                                গ্রাহকের নম্বরে সরাসরি যেকোনো ইভেন্ট এসএমএস ট্রিগার করুন:
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleResendSms('order_placed')}
                                    className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 text-xs font-bold text-left border border-gray-200 transition-colors"
                                >
                                    📩 অর্ডার গ্রহণ এসএমএস (Order Placed)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleResendSms('order_confirmed')}
                                    className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 text-xs font-bold text-left border border-gray-200 transition-colors"
                                >
                                    ✅ অর্ডার কনফার্ম এসএমএস (Order Confirmed)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleResendSms('order_shipped')}
                                    className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 text-xs font-bold text-left border border-gray-200 transition-colors"
                                >
                                    🚚 ডেলিভারি প্রেরণ এসএমএস (Order Shipped)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleResendSms('order_delivered')}
                                    className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 text-xs font-bold text-left border border-gray-200 transition-colors"
                                >
                                    🎉 ডেলিভারি সম্পন্ন এসএমএস (Order Delivered)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Steadfast Courier Booking Modal */}
            {showCourierModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-emerald-700" />
                                <h3 className="font-bold text-base text-gray-900">স্টেডফাস্ট পার্সেল বুকিং কনফার্ম করুন</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCourierModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleBookCourier} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">প্রাপকের নাম *</label>
                                    <input
                                        type="text"
                                        required
                                        value={courierForm.data.recipient_name}
                                        onChange={(e) => courierForm.setData('recipient_name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">প্রাপকের ফোন নম্বর *</label>
                                    <input
                                        type="text"
                                        required
                                        value={courierForm.data.recipient_phone}
                                        onChange={(e) => courierForm.setData('recipient_phone', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">ডেলিভারি সম্পূর্ণ ঠিকানা *</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={courierForm.data.recipient_address}
                                    onChange={(e) => courierForm.setData('recipient_address', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">ক্যাশ অন ডেলিভারি (COD) টাকা *</label>
                                    <input
                                        type="number"
                                        required
                                        value={courierForm.data.cod_amount}
                                        onChange={(e) => courierForm.setData('cod_amount', Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold text-emerald-800"
                                    />
                                    <span className="text-[11px] text-gray-400 mt-0.5 block">পেইড হলে ০ লিখুন</span>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">ডেলিভারি নোট</label>
                                    <input
                                        type="text"
                                        value={courierForm.data.note}
                                        onChange={(e) => courierForm.setData('note', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                                ℹ️ সাবমিট করার সাথে সাথে অর্ডারটি স্টেডফাস্ট পোর্টালে পাঠানো হবে এবং স্বয়ংক্রিয় ট্র্যাকিং কোড জেনারেট হবে।
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCourierModal(false)}
                                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={courierLoading}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                                >
                                    <Truck className="w-4 h-4" />
                                    <span>{courierLoading ? 'বুকিং হচ্ছে...' : 'পার্সেল বুক কনফার্ম করুন'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Blacklist Modal */}
            {showBlacklistModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
                        <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                            <ShieldAlert className="w-6 h-6" />
                            <span>গ্রাহককে ব্ল্যাকলিস্ট / প্রতারক হিসেবে চিহ্নিত করুন</span>
                        </div>
                        <p className="text-xs text-gray-600">
                            গ্রাহকের ফোন নম্বর (<span className="font-mono font-bold text-gray-800">{order.customer_phone}</span>) ব্ল্যাকলিস্ট ডাটাবেজে অন্তর্ভুক্ত হবে এবং ভবিষ্যতে অর্ডার আসলে সতর্ক করবে।
                        </p>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">ব্ল্যাকলিস্টের কারণ উল্লেখ করুন *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={blacklistReason}
                                    onChange={(e) => setBlacklistReason(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-rose-600"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowBlacklistModal(false)}
                                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToggleBlacklist('blacklist')}
                                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                                >
                                    ব্ল্যাকলিস্ট নিশ্চিত করুন
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Payment Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
                        <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                            <XCircle className="w-6 h-6" />
                            <span>পেমেন্ট বাতিলের কারণ উল্লেখ করুন</span>
                        </div>
                        <p className="text-xs text-gray-600">
                            বাতিলের কারণটি গ্রাহকের মোবাইলে এসএমএসের মাধ্যমে প্রেরিত হবে।
                        </p>

                        <form onSubmit={handleRejectPayment} className="space-y-4">
                            <textarea
                                required
                                rows={3}
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:border-rose-600"
                            />

                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                                >
                                    পেমেন্ট রিজেক্ট করুন ও এসএমএস পাঠান
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
