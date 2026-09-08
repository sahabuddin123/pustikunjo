import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Eye,
    Filter,
    CheckCircle2,
    XCircle,
    Printer,
    Truck,
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    ExternalLink,
    ChevronDown,
    RefreshCw
} from 'lucide-react';

export default function Index({ orders, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [methodFilter, setMethodFilter] = useState(filters.payment_method || '');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/orders', {
            q: searchTerm,
            status: statusFilter,
            payment_method: methodFilter,
        }, { preserveState: true });
    };

    const handleQuickStatusChange = (orderId, newStatus) => {
        if (!newStatus) return;
        setUpdatingOrderId(orderId);
        router.post(`/admin/orders/${orderId}/status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setUpdatingOrderId(null),
        });
    };

    const statusBadges = {
        pending: 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200',
        payment_pending: 'bg-pink-100 text-pink-900 border-pink-300 hover:bg-pink-200',
        payment_verified: 'bg-indigo-100 text-indigo-900 border-indigo-300 hover:bg-indigo-200',
        confirmed: 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200',
        shipped: 'bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200',
        delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200',
        cancelled: 'bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200',
        payment_rejected: 'bg-red-100 text-red-900 border-red-300 hover:bg-red-200',
    };

    const orderList = orders.data || orders || [];

    // Helper for rendering fraud badge
    const renderFraudBadge = (analysis) => {
        if (!analysis) return null;

        if (analysis.is_blacklisted || analysis.risk_level === 'fraud') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black bg-rose-700 text-white animate-pulse">
                    <ShieldAlert className="w-3 h-3" />
                    <span>ব্ল্যাকলিস্টেড</span>
                </span>
            );
        }

        if (analysis.risk_level === 'high') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>উচ্চ ঝুঁকি ({analysis.risk_score}%)</span>
                </span>
            );
        }

        if (analysis.risk_level === 'medium') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>সতর্কতা ({analysis.risk_score}%)</span>
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>নিরাপদ</span>
            </span>
        );
    };

    return (
        <AdminLayout title="অর্ডার ও কুরিয়ার ব্যবস্থাপনা (Orders)">
            <div className="space-y-6">
                {/* Filter Toolbar */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
                        <div className="relative flex-1 min-w-[220px]">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="অর্ডার আইডি, ফোন, ট্র্যাকিং কোড..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                router.get('/admin/orders', { q: searchTerm, status: e.target.value, payment_method: methodFilter }, { preserveState: true });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium"
                        >
                            <option value="">সকল স্ট্যাটাস</option>
                            <option value="pending">অপেক্ষমান (Pending)</option>
                            <option value="payment_pending">পেমেন্ট যাচাই বাকি</option>
                            <option value="payment_verified">পেমেন্ট নিশ্চিত (Verified)</option>
                            <option value="confirmed">অর্ডার নিশ্চিত (Confirmed)</option>
                            <option value="shipped">কুরিয়ারে পাঠানো হয়েছে (Shipped)</option>
                            <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
                            <option value="cancelled">বাতিল (Cancelled)</option>
                        </select>

                        <select
                            value={methodFilter}
                            onChange={(e) => {
                                setMethodFilter(e.target.value);
                                router.get('/admin/orders', { q: searchTerm, status: statusFilter, payment_method: e.target.value }, { preserveState: true });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium"
                        >
                            <option value="">সকল পেমেন্ট মাধ্যম</option>
                            <option value="cod">ক্যাশ অন ডেলিভারি (COD)</option>
                            <option value="bkash_manual">বিকাশ সেন্ড মানি (Manual)</option>
                            <option value="bkash_pgw">বিকাশ গেটওয়ে (PGW)</option>
                        </select>
                    </form>
                </div>

                {/* Orders Data Table */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-600 uppercase font-bold text-[11px]">
                                <tr>
                                    <th className="py-3.5 px-4">অর্ডার ও তারিখ</th>
                                    <th className="py-3.5 px-4">গ্রাহক ও ফ্রড স্ট্যাটাস</th>
                                    <th className="py-3.5 px-4">পেমেন্ট</th>
                                    <th className="py-3.5 px-4">স্টেডফাস্ট কুরিয়ার</th>
                                    <th className="py-3.5 px-4">বিল</th>
                                    <th className="py-3.5 px-4">স্ট্যাটাস</th>
                                    <th className="py-3.5 px-4 text-right">একশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orderList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                                            কোনো অর্ডার পাওয়া যায়নি।
                                        </td>
                                    </tr>
                                ) : (
                                    orderList.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                                            {/* Order ID & Date */}
                                            <td className="py-3.5 px-4">
                                                <Link href={`/admin/orders/${order.id}`} className="font-mono font-bold text-emerald-900 hover:underline block text-sm">
                                                    {order.order_number}
                                                </Link>
                                                <span className="text-[11px] text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>

                                            {/* Customer & Fraud Badge */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-gray-900">{order.customer_name}</div>
                                                <div className="font-mono text-xs text-gray-600 mt-0.5">{order.customer_phone}</div>
                                                <div className="mt-1">
                                                    {renderFraudBadge(order.fraud_analysis)}
                                                </div>
                                            </td>

                                            {/* Payment */}
                                            <td className="py-3.5 px-4">
                                                {order.payment_method === 'cod' ? (
                                                    <span className="font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md text-xs">
                                                        ক্যাশ অন ডেলিভারি
                                                    </span>
                                                ) : (
                                                    <div>
                                                        <span className="font-bold text-[#E2136E]">বিকাশ</span>
                                                        {order.bkash_trx_id && (
                                                            <div className="font-mono text-[11px] font-bold text-gray-800 bg-pink-50 px-2 py-0.5 rounded border border-pink-200 mt-1 inline-block">
                                                                TrxID: {order.bkash_trx_id}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Steadfast Courier Tracking */}
                                            <td className="py-3.5 px-4">
                                                {order.courier_tracking_code ? (
                                                    <div className="space-y-1">
                                                        <a
                                                            href={`https://steadfast.com.bd/t/${order.courier_tracking_code}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 font-mono text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline bg-sky-50 px-2 py-0.5 rounded border border-sky-200"
                                                            title="স্টেডফাস্ট ট্র্যাকিং দেখুন"
                                                        >
                                                            <Truck className="w-3.5 h-3.5 text-sky-600" />
                                                            <span>{order.courier_tracking_code}</span>
                                                            <ExternalLink className="w-2.5 h-2.5" />
                                                        </a>
                                                        <div className="text-[11px] font-semibold text-gray-500 capitalize">
                                                            স্ট্যাটাস: <span className="text-emerald-700">{order.courier_status || 'in_review'}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors"
                                                    >
                                                        <Truck className="w-3.5 h-3.5 text-emerald-700" />
                                                        <span>স্টেডফাস্টে পাঠান</span>
                                                    </Link>
                                                )}
                                            </td>

                                            {/* Total Bill */}
                                            <td className="py-3.5 px-4">
                                                <span className="font-bold text-emerald-900 text-sm">৳{order.grand_total}</span>
                                                <span className="text-[11px] text-gray-400 block">চার্জ: ৳{order.shipping_fee}</span>
                                            </td>

                                            {/* Status Interactive Selector */}
                                             <td className="py-3.5 px-4">
                                                 <div className="relative inline-flex items-center">
                                                     <select
                                                         value={order.status}
                                                         disabled={updatingOrderId === order.id}
                                                         onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                                                         className={`text-xs font-bold rounded-xl px-2.5 py-1.5 pr-7 cursor-pointer shadow-2xs border transition-all focus:ring-2 focus:ring-emerald-500 appearance-none ${
                                                             statusBadges[order.status] || 'bg-gray-100 text-gray-800 border-gray-300'
                                                         } ${updatingOrderId === order.id ? 'opacity-50 cursor-wait' : ''}`}
                                                         title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                                                     >
                                                         <option value="pending">অপেক্ষমান (Pending)</option>
                                                         <option value="payment_pending">পেমেন্ট বাকি (Payment Pending)</option>
                                                         <option value="payment_verified">পেমেন্ট নিশ্চিত (Verified)</option>
                                                         <option value="confirmed">অর্ডার নিশ্চিত (Confirmed)</option>
                                                         <option value="shipped">কুরিয়ারে পাঠানো হয়েছে (Shipped)</option>
                                                         <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
                                                         <option value="cancelled">বাতিল (Cancelled)</option>
                                                         <option value="payment_rejected">পেমেন্ট বাতিল (Rejected)</option>
                                                     </select>
                                                     <div className="pointer-events-none absolute right-2 text-current opacity-70">
                                                         {updatingOrderId === order.id ? (
                                                             <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                                                         ) : (
                                                             <ChevronDown className="w-3.5 h-3.5" />
                                                         )}
                                                     </div>
                                                 </div>
                                             </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="p-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors"
                                                        title="বিস্তারিত ও কুরিয়ার বুকিং"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/orders/${order.id}/invoice`}
                                                        target="_blank"
                                                        className="p-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors"
                                                        title="ইনভয়েস প্রিন্ট"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.links && orders.links.length > 3 && (
                        <div className="p-4 border-t border-gray-100 flex justify-center gap-1">
                            {orders.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                        link.active ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
