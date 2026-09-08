import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ShoppingCart,
    Banknote,
    AlertTriangle,
    Clock,
    ArrowRight,
    Eye,
    TrendingUp,
    Package,
    ShieldCheck,
    Users,
    Truck,
    MessageSquare,
    Plus,
    ExternalLink,
    Calendar,
    Search,
    Sparkles,
    CheckCircle2,
    RefreshCw,
    Layers,
    CreditCard,
    ChevronRight,
    Printer,
    FileText
} from 'lucide-react';

export default function Dashboard({
    metrics = {},
    statusCounts = {},
    sevenDaysTrend = [],
    recentOrders = [],
    lowStockList = [],
    topProducts = [],
    systemStatus = {}
}) {
    const [searchPhone, setSearchPhone] = useState('');

    const statusBadges = {
        pending: 'bg-amber-100 text-amber-800 border-amber-200',
        payment_pending: 'bg-pink-100 text-pink-800 border-pink-200 animate-pulse',
        payment_verified: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
        processing: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        shipped: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
        payment_rejected: 'bg-red-100 text-red-800 border-red-200',
    };

    const statusLabels = {
        pending: 'অপেক্ষমাণ',
        payment_pending: 'পেমেন্ট যাচাই বাকি',
        payment_verified: 'পেমেন্ট নিশ্চিত',
        confirmed: 'কনফার্মড',
        processing: 'প্রসেসিং',
        shipped: 'কুরিয়ারে পাঠানো',
        delivered: 'ডেলিভার্ড',
        cancelled: 'বাতিল',
        payment_rejected: 'পেমেন্ট প্রত্যাখ্যাত',
    };

    // Calculate max revenue for dynamic 7-day bar chart scaling
    const maxRevenue = Math.max(...sevenDaysTrend.map(d => d.revenue), 1000);

    const handleFraudSearch = (e) => {
        e.preventDefault();
        if (searchPhone.trim()) {
            router.get(`/admin/customers/${searchPhone.trim()}`);
        }
    };

    const needsAttentionCount = (metrics.pendingPayments || 0) + (metrics.courierPending || 0) + (metrics.lowStockCount || 0);

    return (
        <AdminLayout title="এডমিন কন্ট্রোল ড্যাশবোর্ড">
            <div className="space-y-7 w-full">
                {/* 1. Header Banner & Quick Actions */}
                <div className="bg-gradient-to-r from-[#042013] via-[#07381E] to-[#0A4D2A] text-white p-6 sm:p-7 rounded-3xl shadow-lg border border-emerald-900/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
                    {/* Background Decorative Pattern */}
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="space-y-2 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>পুষ্টি কুঞ্জ লাইভ বিজনেস ড্যাশবোর্ড</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            স্বাগতম, এডমিন প্যানেলে!
                        </h1>
                        <p className="text-xs sm:text-sm text-emerald-200/90 font-normal max-w-xl">
                            আজকের লাইভ অর্ডার, ডেলিভারি স্ট্যাটাস, কুরিয়ার সিঙ্ক এবং আর্থিক পরিসংখ্যান এক নজরে পর্যবেক্ষণ করুন।
                        </p>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="flex flex-wrap items-center gap-2.5 z-10 w-full lg:w-auto">
                        <Link
                            href="/admin/products/create"
                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs"
                        >
                            <Plus className="w-4 h-4 text-emerald-300" />
                            <span>নতুন পণ্য</span>
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>অর্ডার ম্যানেজ</span>
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-[#D99A26] hover:bg-[#c6891d] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ml-auto lg:ml-0"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>ভিজিট শপ</span>
                        </a>
                    </div>
                </div>

                {/* 2. Top 4 Modern Hero KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Today's Revenue */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                আজকের বিক্রয় (Revenue)
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Banknote className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-gray-900">
                                ৳{(metrics.todayRevenue || 0).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-gray-500">
                                <span className="text-emerald-700 font-bold">মোট লাইফটাইম:</span>
                                <span>৳{(metrics.totalRevenue || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-emerald-600 rounded-full mt-4"></div>
                    </div>

                    {/* Card 2: Today's Orders */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                আজকের মোট অর্ডার
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-gray-900">
                                {metrics.todayOrders || 0} <span className="text-sm font-bold text-gray-500">টি</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-gray-500">
                                <span className="text-blue-700 font-bold">চলতি মাসে:</span>
                                <span>{metrics.thisMonthOrders || 0} টি অর্ডার</span>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-blue-600 rounded-full mt-4"></div>
                    </div>

                    {/* Card 3: Monthly Revenue & AOV */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                চলতি মাসের বিক্রয়
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-purple-900">
                                ৳{(metrics.thisMonthRevenue || 0).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-gray-500">
                                <span className="text-purple-700 font-bold">গড় অর্ডার (AOV):</span>
                                <span>৳{Math.round(metrics.averageOrderValue || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-purple-600 rounded-full mt-4"></div>
                    </div>

                    {/* Card 4: Action Required (Attention Box) */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                অ্যাকশন প্রয়োজন
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-amber-700">
                                {needsAttentionCount} <span className="text-sm font-bold text-gray-500">টি আইটেম</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] font-bold">
                                {metrics.pendingPayments > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-800">
                                        বিকাশ: {metrics.pendingPayments}
                                    </span>
                                )}
                                {metrics.courierPending > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                        কুরিয়ার বাকি: {metrics.courierPending}
                                    </span>
                                )}
                                {metrics.lowStockCount > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                        লো স্টক: {metrics.lowStockCount}
                                    </span>
                                )}
                                {needsAttentionCount === 0 && (
                                    <span className="text-emerald-700 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> সব আপডেট আছে
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="h-1 w-full bg-amber-500 rounded-full mt-4"></div>
                    </div>
                </div>

                {/* 3. Order Workflow Pipeline & Status Matrix */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-emerald-700" />
                            <span>অর্ডার প্রসেসিং লাইফসাইকেল (Workflow Pipeline)</span>
                        </h2>
                        <span className="text-xs text-gray-500 font-semibold">
                            মোট অর্ডার: {metrics.totalOrders || 0} টি
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {/* 1. Pending */}
                        <Link
                            href="/admin/orders"
                            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 transition-all text-center space-y-1 block group"
                        >
                            <span className="text-[11px] font-bold text-amber-800 block">১. অপেক্ষমাণ</span>
                            <span className="text-xl font-black text-amber-900 block group-hover:scale-110 transition-transform">
                                {statusCounts.pending || 0}
                            </span>
                            <span className="text-[10px] text-amber-700 block">নতুন অর্ডার</span>
                        </Link>

                        {/* 2. Payment Pending */}
                        <Link
                            href="/admin/orders"
                            className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/50 hover:bg-pink-100/70 transition-all text-center space-y-1 block group"
                        >
                            <span className="text-[11px] font-bold text-pink-800 block">২. পেমেন্ট যাচাই</span>
                            <span className="text-xl font-black text-pink-900 block group-hover:scale-110 transition-transform">
                                {statusCounts.payment_pending || 0}
                            </span>
                            <span className="text-[10px] text-pink-700 block">বিকাশ TrxID যাচাই</span>
                        </Link>

                        {/* 3. Confirmed / Packing */}
                        <Link
                            href="/admin/orders"
                            className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 transition-all text-center space-y-1 block group"
                        >
                            <span className="text-[11px] font-bold text-blue-800 block">৩. কনফার্মড</span>
                            <span className="text-xl font-black text-blue-900 block group-hover:scale-110 transition-transform">
                                {statusCounts.confirmed || 0}
                            </span>
                            <span className="text-[10px] text-blue-700 block">প্যাকিং প্রস্তুত</span>
                        </Link>

                        {/* 4. Shipped / In Courier */}
                        <Link
                            href="/admin/orders"
                            className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 transition-all text-center space-y-1 block group"
                        >
                            <span className="text-[11px] font-bold text-purple-800 block">৪. কুরিয়ারে</span>
                            <span className="text-xl font-black text-purple-900 block group-hover:scale-110 transition-transform">
                                {statusCounts.shipped || 0}
                            </span>
                            <span className="text-[10px] text-purple-700 block">স্টিডফাস্ট ট্রানজিট</span>
                        </Link>

                        {/* 5. Delivered */}
                        <Link
                            href="/admin/orders"
                            className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 transition-all text-center space-y-1 block group"
                        >
                            <span className="text-[11px] font-bold text-emerald-800 block">৫. ডেলিভার্ড</span>
                            <span className="text-xl font-black text-emerald-900 block group-hover:scale-110 transition-transform">
                                {statusCounts.delivered || 0}
                            </span>
                            <span className="text-[10px] text-emerald-700 block">সফল ডেলিভারি</span>
                        </Link>

                        {/* 6. Cancelled */}
                        <Link
                            href="/admin/orders"
                            className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-100/70 transition-all text-center space-y-1 block group"
                        >
                            <span className="text-[11px] font-bold text-rose-800 block">৬. বাতিল</span>
                            <span className="text-xl font-black text-rose-900 block group-hover:scale-110 transition-transform">
                                {statusCounts.cancelled || 0}
                            </span>
                            <span className="text-[10px] text-rose-700 block">রিটার্ন/বাতিল</span>
                        </Link>
                    </div>
                </div>

                {/* 4. Mid Section: 7-Day Performance Chart & Fraud Detection Widget */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                    {/* 7-Day Sales Trend Bar Chart (Col 8) */}
                    <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                                    <span>বিগত ৭ দিনের বিক্রয় চিত্র (Sales Trend)</span>
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">দৈনিক রেভিনিউ ও অর্ডার সংখ্যার ভিজ্যুয়াল অ্যানালিটিক্স</p>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                                রিয়েল-টাইম
                            </span>
                        </div>

                        {/* Visual SVG / HTML Bars Chart */}
                        <div className="pt-6 pb-2">
                            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 border-b border-gray-100 pb-2">
                                {sevenDaysTrend.map((item, idx) => {
                                    const heightPercent = maxRevenue > 0 ? Math.max((item.revenue / maxRevenue) * 100, 8) : 8;
                                    const isToday = idx === sevenDaysTrend.length - 1;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 group relative">
                                            {/* Tooltip on hover */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-20">
                                                ৳{item.revenue.toLocaleString()} ({item.orders} অর্ডার)
                                            </div>

                                            {/* Bar */}
                                            <div className="w-full bg-gray-100 rounded-t-lg h-36 flex items-end justify-center p-1">
                                                <div
                                                    style={{ height: `${heightPercent}%` }}
                                                    className={`w-full rounded-t-md transition-all duration-500 ${
                                                        isToday
                                                            ? 'bg-gradient-to-t from-emerald-700 to-emerald-500 shadow-xs'
                                                            : item.revenue > 0
                                                            ? 'bg-gradient-to-t from-emerald-800 to-emerald-600'
                                                            : 'bg-gray-200'
                                                    }`}
                                                ></div>
                                            </div>

                                            {/* Labels */}
                                            <div className="text-center">
                                                <span className={`text-xs font-bold block ${isToday ? 'text-emerald-700' : 'text-gray-700'}`}>
                                                    {item.day}
                                                </span>
                                                <span className="text-[10px] text-gray-400 block mt-0.5">
                                                    {item.date}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chart Bottom Summary */}
                        <div className="flex items-center justify-between pt-3 text-xs text-gray-500 border-t border-gray-50">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                                    <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span> দৈনিক আয় (৳)
                                </span>
                            </div>
                            <Link href="/admin/reports" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                                <span>বিস্তারিত রিপোর্ট দেখুন</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Fraud Radar & System Health Widget (Col 4) */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Quick Fraud Search Tool */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                                    <span>ফ্রড চেকার (Quick Radar)</span>
                                </h3>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    সক্রিয়
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                গ্রাহকের অর্ডার ইতিহাস, সফল ডেলিভারি রেশিও এবং কাস্টমার হিস্ট্রি সার্চ করুন।
                            </p>
                            <form onSubmit={handleFraudSearch} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="মোবাইল নম্বর (e.g. 017...)"
                                    value={searchPhone}
                                    onChange={(e) => setSearchPhone(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                />
                                <button
                                    type="submit"
                                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    <span>খুঁজুন</span>
                                </button>
                            </form>
                        </div>

                        {/* Integration Status Cards */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Sparkles className="w-4 h-4 text-emerald-700" />
                                <span>কানেক্টেড সার্ভিস ও ইন্টিগ্রেশন</span>
                            </h3>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-2 font-bold text-gray-800">
                                        <Truck className="w-4 h-4 text-emerald-700" />
                                        <span>Steadfast Courier</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        systemStatus.steadfastConnected
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {systemStatus.steadfastConnected ? 'API সংযুক্ত' : 'সেটিংস বাকি'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-2 font-bold text-gray-800">
                                        <CreditCard className="w-4 h-4 text-[#E2136E]" />
                                        <span>bKash Payment Gateway</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                        সক্রিয়
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-2 font-bold text-gray-800">
                                        <Users className="w-4 h-4 text-blue-700" />
                                        <span>রেজিস্টার্ড কাস্টমার</span>
                                    </div>
                                    <span className="font-extrabold text-gray-900">
                                        {metrics.totalCustomers || 0} জন
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Main Content Columns: Recent Orders (Col 8) & Products / Stock Radar (Col 4) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* Left: Recent Orders Table (Col 8) */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4 text-emerald-700" />
                                    <span>সাম্প্রতিক অর্ডারসমূহ (Live Orders)</span>
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">গ্রাহকদের সর্বশেষ অর্ডারসমূহ ও লাইভ পেমেন্ট স্ট্যাটাস</p>
                            </div>
                            <Link
                                href="/admin/orders"
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                                <span>সবগুলো দেখুন</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 space-y-2">
                                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                                <p className="font-bold text-gray-700">এখনো কোনো অর্ডার পাওয়া যায়নি</p>
                                <p className="text-xs text-gray-400">নতুন অর্ডার আসলে সাথে সাথে এখানে তালিকাভুক্ত হবে।</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-600 uppercase font-bold text-[11px]">
                                        <tr>
                                            <th className="py-3 px-4">অর্ডার নং</th>
                                            <th className="py-3 px-4">গ্রাহকের নাম ও ফোন</th>
                                            <th className="py-3 px-4">পেমেন্ট মেথড</th>
                                            <th className="py-3 px-4">মোট বিল</th>
                                            <th className="py-3 px-4">স্ট্যাটাস</th>
                                            <th className="py-3 px-4 text-right">একশন</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="font-mono font-bold text-emerald-900 hover:underline block"
                                                    >
                                                        {order.order_number}
                                                    </Link>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(order.created_at).toLocaleDateString('bn-BD', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="font-bold text-gray-900">{order.customer_name}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{order.customer_phone}</div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    {order.payment_method === 'cod' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                                                            ক্যাশ অন ডেলিভারি
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-800 border border-pink-200">
                                                            বিকাশ {order.bkash_trx_id ? `(${order.bkash_trx_id.slice(-6)})` : ''}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 font-black text-gray-900">
                                                    ৳{Number(order.grand_total).toLocaleString()}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                        statusBadges[order.status] || 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {statusLabels[order.status] || order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors"
                                                            title="অর্ডার দেখুন"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <a
                                                            href={`/admin/orders/${order.id}/invoice`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors"
                                                            title="ইনভয়েস প্রিন্ট"
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Right: Low Stock & Top Products Showcase (Col 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Low Stock Radar */}
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                    <span>স্টক সতর্কতা (Low Stock Alert)</span>
                                </h3>
                                <Link href="/admin/products" className="text-xs font-bold text-emerald-700 hover:underline">
                                    সকল পণ্য
                                </Link>
                            </div>

                            <div className="p-4 space-y-2.5">
                                {lowStockList.length === 0 ? (
                                    <div className="p-4 rounded-xl bg-emerald-50/60 text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>সকল পণ্যের পর্যাপ্ত স্টক রয়েছে।</span>
                                    </div>
                                ) : (
                                    lowStockList.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between text-xs"
                                        >
                                            <div className="min-w-0 pr-2">
                                                <span className="font-bold text-gray-900 block truncate">{item.name}</span>
                                                <span className="text-[11px] text-gray-500 font-mono">SKU: {item.sku}</span>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="px-2.5 py-1 rounded-lg bg-amber-200/80 text-amber-900 font-black text-xs block">
                                                    {item.stock} টি বাকি
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-3 bg-gray-50 border-t border-gray-100">
                                <Link
                                    href="/admin/products/create"
                                    className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>নতুন পণ্য বা স্টক আপডেট</span>
                                </Link>
                            </div>
                        </div>

                        {/* Top Products Showcase */}
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-emerald-700" />
                                    <span>শীর্ষ বিক্রিত পণ্যসমূহ (Top Catalog)</span>
                                </h3>
                            </div>

                            <div className="p-4 divide-y divide-gray-100 space-y-2">
                                {topProducts.map((prod) => (
                                    <div key={prod.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-3">
                                            {prod.thumbnail ? (
                                                <img src={prod.thumbnail} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                                                    PK
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-bold text-gray-900 block line-clamp-1">{prod.name}</span>
                                                <span className="text-[11px] text-gray-500 font-mono">৳{prod.price}</span>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/admin/products/${prod.id}/edit`}
                                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold text-[11px] transition-colors"
                                        >
                                            সম্পাদনা
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
