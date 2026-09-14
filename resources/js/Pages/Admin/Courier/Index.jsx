import React, { useState } from 'react';
import { Link, router, usePage, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Truck,
    Search,
    ShieldAlert,
    ShieldCheck,
    RefreshCw,
    ExternalLink,
    Copy,
    Check,
    Wallet,
    PackageCheck,
    ArrowUpRight,
    AlertTriangle,
    Eye,
    Phone,
    MapPin,
    FileText,
    Clock,
    Radio,
    Settings,
    CheckCircle2,
    XCircle,
    User,
    ChevronRight,
    X
} from 'lucide-react';

export default function Index({
    parcels,
    stats = {},
    filters = {},
    config = {},
    recentWebhookLogs = []
}) {
    const { flash } = usePage().props;

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [syncingAll, setSyncingAll] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);

    // Live Tracking Widget state
    const [trackCodeInput, setTrackCodeInput] = useState('');
    const [isTrackingLoading, setIsTrackingLoading] = useState(false);
    const [trackingResult, setTrackingResult] = useState(null);
    const [trackingModalOpen, setTrackingModalOpen] = useState(false);

    // Quick Fraud Check Widget state
    const [fraudPhoneInput, setFraudPhoneInput] = useState('');
    const [isFraudLoading, setIsFraudLoading] = useState(false);
    const [fraudResult, setFraudResult] = useState(null);

    const copyToClipboard = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get('/admin/courier', {
            search: searchQuery,
            status: statusFilter
        }, { preserveState: true });
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        router.get('/admin/courier', {
            search: searchQuery,
            status: status
        }, { preserveState: true });
    };

    const handleSyncAll = () => {
        if (confirm('আপনি কি সকল সক্রিয় পার্সেলের বর্তমান স্ট্যাটাস স্টেডফাস্ট থেকে সিঙ্ক করতে চান?')) {
            setSyncingAll(true);
            router.post('/admin/courier/sync-all', {}, {
                preserveScroll: true,
                onFinish: () => setSyncingAll(false)
            });
        }
    };

    // Trigger live tracking query
    const handleTrackParcel = async (code) => {
        const queryCode = code || trackCodeInput;
        if (!queryCode) return;

        setIsTrackingLoading(true);
        setTrackingModalOpen(true);
        try {
            const response = await fetch('/admin/courier/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ code: queryCode })
            });
            const data = await response.json();
            setTrackingResult(data);
        } catch (err) {
            setTrackingResult({ success: false, message: 'ট্র্যাকিং তথ্য লোড করতে ব্যর্থ হয়েছে।' });
        } finally {
            setIsTrackingLoading(false);
        }
    };

    // Trigger instant fraud check query
    const handleCheckFraud = async (phone) => {
        const queryPhone = phone || fraudPhoneInput;
        if (!queryPhone) return;

        setIsFraudLoading(true);
        try {
            const response = await fetch('/admin/courier/fraud-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ phone: queryPhone })
            });
            const data = await response.json();
            setFraudResult(data);
        } catch (err) {
            alert('ফ্রড তথ্য লোড করতে ব্যর্থ হয়েছে।');
        } finally {
            setIsFraudLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'delivered' || s === 'delivered_approval_pending') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ডেলিভারড</span>
                </span>
            );
        }
        if (s === 'in_transit' || s === 'picked_up' || s === 'out_for_delivery') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
                    <Truck className="w-3.5 h-3.5" />
                    <span>ট্রানজিটে আছে</span>
                </span>
            );
        }
        if (s === 'cancelled' || s === 'cancelled_approval_pending' || s === 'return' || s === 'returned') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>বাতিল / রিটার্ন</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                <span>রিভিউতে আছে ({status || 'Pending'})</span>
            </span>
        );
    };

    return (
        <AdminLayout title="স্টেডফাস্ট কুরিয়ার ড্যাশবোর্ড">
            <Head title="স্টেডফাস্ট কুরিয়ার হাব — পুষ্টি কুঞ্জ এডমিন" />

            <div className="space-y-6 w-full pb-16">
                {/* Top Action Header */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                    <span>স্টেডফাস্ট কুরিয়ার ড্যাশবোর্ড ও হাব</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                                        Live Hub
                                    </span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    পার্সেল ট্র্যাকিং, রাইডার ও কাস্টমার নোট, ব্যালেন্স এবং ইনস্ট্যান্ট ফ্রড ভেরিফিকেশন
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleSyncAll}
                            disabled={syncingAll}
                            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 text-indigo-600 ${syncingAll ? 'animate-spin' : ''}`} />
                            <span>{syncingAll ? 'সিঙ্ক হচ্ছে...' : 'সব স্ট্যাটাস সিঙ্ক'}</span>
                        </button>

                        <Link
                            href="/admin/settings"
                            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
                        >
                            <Settings className="w-4 h-4 text-gray-500" />
                            <span>API কনফিগারেশন</span>
                        </Link>

                        <a
                            href="https://portal.packzy.com"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                        >
                            <span>Steadfast Portal</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Key Statistics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
                    {/* Live Account Balance */}
                    <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">স্টেডফাস্ট ব্যালেন্স</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Wallet className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-gray-900 tracking-tight">
                                ৳ {Number(stats.balance || 0).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{stats.balance_success ? 'রিয়েল-টাইম কানেক্টেড' : 'স্যান্ডবক্স / রেডি'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total Booked */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">মোট বুকিং পার্সেল</span>
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Truck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-gray-900">{stats.total_booked || 0}</div>
                            <span className="text-[11px] text-gray-400 font-medium">স্টেডফাস্টের মাধ্যমে প্রেরিত</span>
                        </div>
                    </div>

                    {/* In Transit */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">চলমান (In Transit)</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-blue-600">{stats.in_transit || 0}</div>
                            <span className="text-[11px] text-blue-500 font-medium">ডেলিভারির পথে আছে</span>
                        </div>
                    </div>

                    {/* Delivered */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">সফল ডেলিভারি</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <PackageCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-emerald-600">{stats.delivered || 0}</div>
                            <span className="text-[11px] text-emerald-600 font-medium">গ্রাহক রিসিভ করেছেন</span>
                        </div>
                    </div>

                    {/* Returns / Cancelled */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">রিটার্ন / বাতিল</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-rose-600">{stats.cancelled || 0}</div>
                            <span className="text-[11px] text-rose-500 font-medium">বাতিল বা ফেরত পার্সেল</span>
                        </div>
                    </div>
                </div>

                {/* Interactive Tools: Quick Live Track & Instant Fraud Check */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Tool 1: Live Parcel Tracking */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                                    <Search className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm sm:text-base font-black text-gray-900">
                                    লাইভ পার্সেল ট্র্যাকিং (Live Track)
                                </h3>
                            </div>
                            <span className="text-[11px] text-gray-400 font-mono">SF... / Consignment / Invoice</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={trackCodeInput}
                                onChange={(e) => setTrackCodeInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleTrackParcel()}
                                placeholder="ট্র্যাকিং কোড বা ইনভয়েস নম্বর লিখুন (e.g. SF...)"
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono text-gray-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                            />
                            <button
                                type="button"
                                onClick={() => handleTrackParcel()}
                                disabled={isTrackingLoading || !trackCodeInput}
                                className="px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
                            >
                                <Search className="w-4 h-4" />
                                <span>{isTrackingLoading ? 'ট্র্যাক হচ্ছে...' : 'ট্র্যাক করুন'}</span>
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-500">
                            স্টেডফাস্ট সার্ভার থেকে পার্সেলের রিয়েল-টাইম ট্রানজিট স্ট্যাটাস, রাইডার এবং গ্রাহকের নোট সরাসরি দেখুন।
                        </p>
                    </div>

                    {/* Tool 2: Instant Customer Fraud & Delivery Risk Checker */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                                    <ShieldAlert className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm sm:text-base font-black text-gray-900">
                                    ইনস্ট্যান্ট ফ্রড ও ঝুঁকি চেকার (Fraud Check)
                                </h3>
                            </div>
                            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                                AI &amp; Blacklist Scan
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={fraudPhoneInput}
                                onChange={(e) => setFraudPhoneInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCheckFraud()}
                                placeholder="গ্রাহকের মোবাইল নম্বর লিখুন (e.g. 017XXXXXXXX)"
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono text-gray-800 focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                            />
                            <button
                                type="button"
                                onClick={() => handleCheckFraud()}
                                disabled={isFraudLoading || !fraudPhoneInput}
                                className="px-4 sm:px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                <span>{isFraudLoading ? 'যাচাই হচ্ছে...' : 'রিস্ক চেক'}</span>
                            </button>
                        </div>

                        {/* Inline Fraud Result if checked */}
                        {fraudResult && (
                            <div className={`p-4 rounded-xl border transition-all ${fraudResult.badge?.badge_class || 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-wider">
                                        {fraudResult.badge?.label}
                                    </span>
                                    <span className="text-xs font-mono font-bold">
                                        সফলতার হার: {fraudResult.metrics?.success_rate}%
                                    </span>
                                </div>
                                <p className="text-xs mt-1 leading-relaxed">{fraudResult.risk_reason}</p>
                                <div className="mt-2.5 pt-2 border-t border-black/10 flex items-center gap-4 text-[11px]">
                                    <span>মোট অর্ডার: <b>{fraudResult.metrics?.total_orders}</b></span>
                                    <span>ডেলিভারি: <b>{fraudResult.metrics?.delivered_orders}</b></span>
                                    <span>বাতিল/ফেরত: <b className="text-rose-700">{fraudResult.metrics?.cancelled_orders}</b></span>
                                </div>
                            </div>
                        )}

                        {!fraudResult && (
                            <p className="text-[11px] text-gray-500">
                                অর্ডার নিশ্চিত করার পূর্বে যেকোনো কাস্টমারের অতীত ডেলিভারি ইতিহাস ও ক্যান্সেলেশন রেট এক ক্লিকে যাচাই করুন।
                            </p>
                        )}
                    </div>
                </div>

                {/* Filter and Search Bar for Parcels */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Status filter tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                        {[
                            { id: '', label: 'সকল পার্সেল' },
                            { id: 'in_transit', label: 'ইন-ট্রানজিট' },
                            { id: 'delivered', label: 'ডেলিভারড' },
                            { id: 'cancelled', label: 'বাতিল / রিটার্ন' },
                            { id: 'in_review', label: 'রিভিউতে' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleStatusFilterChange(tab.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    statusFilter === tab.id
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search input */}
                    <form onSubmit={handleFilterSubmit} className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="অর্ডার #, ট্র্যাকিং কোড বা ফোন..."
                                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs text-gray-800 focus:border-indigo-600"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                            খুঁজুন
                        </button>
                    </form>
                </div>

                {/* Parcels Table */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-indigo-600" />
                            <span>স্টেডফাস্ট পার্সেলসমূহ ({parcels.total || 0})</span>
                        </h2>
                        <span className="text-xs text-gray-400 font-medium">সর্বশেষ বুকিং অনুযায়ী সাজানো</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-gray-50/80 text-gray-600 font-bold border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">ইনভয়েস / অর্ডার #</th>
                                    <th className="px-4 py-3">গ্রাহকের তথ্য</th>
                                    <th className="px-4 py-3">ট্র্যাকিং কোড ও CID</th>
                                    <th className="px-4 py-3">COD টাকা</th>
                                    <th className="px-4 py-3">রাইডার ও কাস্টমার নোট</th>
                                    <th className="px-4 py-3">কুরিয়ার স্ট্যাটাস</th>
                                    <th className="px-4 py-3 text-right">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                                {parcels.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                            কোনো কুরিয়ার পার্সেল রেকর্ড পাওয়া যায়নি।
                                        </td>
                                    </tr>
                                )}

                                {parcels.data?.map((order) => (
                                    <tr key={order.id} className="hover:bg-indigo-50/20 transition-colors">
                                        {/* Order Number */}
                                        <td className="px-4 py-3.5">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="font-mono font-bold text-indigo-700 hover:text-indigo-900 hover:underline block"
                                            >
                                                #{order.order_number}
                                            </Link>
                                            <span className="text-[11px] text-gray-400 block mt-0.5">
                                                {new Date(order.created_at).toLocaleDateString('bn-BD')}
                                            </span>
                                        </td>

                                        {/* Customer Info */}
                                        <td className="px-4 py-3.5">
                                            <div className="font-bold text-gray-900">{order.customer_name}</div>
                                            <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                                                <Phone className="w-3 h-3" />
                                                <span className="font-mono">{order.customer_phone}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCheckFraud(order.customer_phone)}
                                                    className="ml-1 text-rose-600 hover:underline cursor-pointer text-[10px] font-bold"
                                                    title="এই গ্রাহকের ফ্রড হিস্ট্রি চেক করুন"
                                                >
                                                    [ফ্রড চেক]
                                                </button>
                                            </div>
                                            <div className="text-[11px] text-gray-400 truncate max-w-xs mt-0.5">
                                                {order.shipping_address}
                                            </div>
                                        </td>

                                        {/* Tracking & CID */}
                                        <td className="px-4 py-3.5">
                                            {order.courier_tracking_code ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono font-bold text-xs text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                                                            {order.courier_tracking_code}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(order.courier_tracking_code, `trk_${order.id}`)}
                                                            className="text-gray-400 hover:text-gray-700 cursor-pointer"
                                                            title="কপি করুন"
                                                        >
                                                            {copiedKey === `trk_${order.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                    {order.courier_consignment_id && (
                                                        <span className="text-[11px] font-mono text-gray-400 block">
                                                            CID: {order.courier_consignment_id}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">অ্যাসাইন হয়নি</span>
                                            )}
                                        </td>

                                        {/* COD Amount */}
                                        <td className="px-4 py-3.5">
                                            <span className="font-black text-gray-900">
                                                ৳ {Number(order.grand_total).toLocaleString()}
                                            </span>
                                            <span className="text-[11px] text-gray-400 block uppercase">
                                                {order.payment_method}
                                            </span>
                                        </td>

                                        {/* Rider & Customer Notes */}
                                        <td className="px-4 py-3.5">
                                            <div className="space-y-1 max-w-xs">
                                                {order.courier_rider_note ? (
                                                    <div className="flex items-start gap-1 text-[11px] bg-amber-50 text-amber-900 border border-amber-200 p-1.5 rounded-lg">
                                                        <Truck className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="font-bold">রাইডার: </span>
                                                            <span>{order.courier_rider_note}</span>
                                                        </div>
                                                    </div>
                                                ) : null}

                                                {order.order_notes ? (
                                                    <div className="flex items-start gap-1 text-[11px] bg-blue-50 text-blue-900 border border-blue-200 p-1.5 rounded-lg">
                                                        <FileText className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="font-bold">কাস্টমার: </span>
                                                            <span>{order.order_notes}</span>
                                                        </div>
                                                    </div>
                                                ) : null}

                                                {!order.courier_rider_note && !order.order_notes && (
                                                    <span className="text-gray-400 text-[11px] italic">কোনো বিশেষ নোট নেই</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5">
                                            {getStatusBadge(order.courier_status)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                                            {order.courier_tracking_code && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleTrackParcel(order.courier_tracking_code)}
                                                    className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer inline-flex"
                                                    title="লাইভ ট্র্যাকিং পপআপ"
                                                >
                                                    <Search className="w-4 h-4" />
                                                </button>
                                            )}

                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer inline-flex"
                                                title="অর্ডার দেখুন"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {parcels.links && (
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                পেজ {parcels.current_page} এর মধ্যে {parcels.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {parcels.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'text-gray-300 pointer-events-none'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Webhook Activity Logs */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                            <h3 className="font-bold text-sm sm:text-base text-gray-900">
                                স্টেডফাস্ট ওয়েবহুক অ্যাক্টিভিটি লগ (Webhook Sync Logs)
                            </h3>
                        </div>
                        <span className="text-xs text-gray-400">সর্বশেষ রিয়েল-টাইম কলব্যাক</span>
                    </div>

                    {recentWebhookLogs.length === 0 ? (
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-500">
                            এখনো কোনো ওয়েবহুক পিং আসেনি। স্টেডফাস্ট পোর্টালে Callback URL যুক্ত করার পর এখানে লাইভ আপডেট দেখতে পাবেন।
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden text-xs">
                            {recentWebhookLogs.map((log) => (
                                <div key={log.id} className="p-3 flex items-center justify-between bg-white hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="font-mono font-bold text-gray-800">
                                            {log.tracking_code || log.consignment_id || 'Webhook Call'}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold uppercase text-[10px]">
                                            {log.status || 'Received'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                                        <span>IP: {log.ip_address}</span>
                                        <span>{new Date(log.created_at).toLocaleTimeString('bn-BD')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Live Tracking Modal */}
            {trackingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-black text-base text-gray-900">পার্সেল লাইভ ট্র্যাকিং</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTrackingModalOpen(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isTrackingLoading ? (
                            <div className="py-12 text-center space-y-2">
                                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                                <p className="text-xs text-gray-500 font-semibold">স্টেডফাস্ট থেকে ট্র্যাকিং আনা হচ্ছে...</p>
                            </div>
                        ) : trackingResult ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-indigo-600 font-bold block">বর্তমান ডেলিভারি স্ট্যাটাস</span>
                                        <span className="text-base font-black text-indigo-950 uppercase mt-0.5 block">
                                            {trackingResult.status || 'In Transit'}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-lg border border-indigo-200 text-indigo-700">
                                        {trackingResult.tracking_code}
                                    </span>
                                </div>

                                {trackingResult.order && (
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">অর্ডার নম্বর:</span>
                                            <span className="font-mono font-bold text-gray-900">#{trackingResult.order.order_number}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">গ্রাহক:</span>
                                            <span className="font-bold text-gray-900">{trackingResult.order.customer_name} ({trackingResult.order.customer_phone})</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">ঠিকানা:</span>
                                            <span className="text-gray-800 text-right truncate max-w-xs">{trackingResult.order.shipping_address}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">সংগ্রহযোগ্য COD:</span>
                                            <span className="font-black text-emerald-700">৳ {Number(trackingResult.order.grand_total).toLocaleString()}</span>
                                        </div>

                                        {/* Rider Note */}
                                        {trackingResult.order.rider_note && (
                                            <div className="pt-2 border-t border-gray-200">
                                                <span className="font-bold text-amber-900 block mb-0.5">রাইডার নির্দেশনা (Rider Note):</span>
                                                <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                    {trackingResult.order.rider_note}
                                                </p>
                                            </div>
                                        )}

                                        {/* Customer Note */}
                                        {trackingResult.order.customer_note && (
                                            <div className="pt-1">
                                                <span className="font-bold text-blue-900 block mb-0.5">গ্রাহকের নোট (Customer Note):</span>
                                                <p className="text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-200">
                                                    {trackingResult.order.customer_note}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <a
                                        href={`https://steadfast.com.bd/t/${trackingResult.tracking_code}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                    >
                                        <span>অফিশিয়াল পোর্টালে দেখুন</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setTrackingModalOpen(false)}
                                        className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
                                    >
                                        বন্ধ করুন
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
