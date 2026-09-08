import React from 'react';
import { Link } from '@inertiajs/react';
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
    ShieldCheck
} from 'lucide-react';

export default function Dashboard({ metrics, recentOrders = [], lowStockList = [] }) {
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

    return (
        <AdminLayout title="এডমিন ড্যাশবোর্ড">
            <div className="space-y-8">
                {/* 4 Core KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Today's Orders */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                                আজকের মোট অর্ডার
                            </span>
                            <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                                {metrics.todayOrders}
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">
                                সর্বমোট অর্ডার: {metrics.totalOrders} টি
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Card 2: Today's Revenue */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                                আজকের বিক্রয় (Revenue)
                            </span>
                            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                                ৳{metrics.todayRevenue.toLocaleString()}
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">
                                মোট রেভিনিউ: ৳{metrics.totalRevenue.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <Banknote className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Card 3: Pending Payments (bKash) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                                পেমেন্ট যাচাই বাকি
                            </span>
                            <div className="text-2xl sm:text-3xl font-black text-pink-600 mt-1">
                                {metrics.pendingPayments}
                            </div>
                            <span className="text-xs text-pink-500 mt-1 block font-medium">
                                বিকাশ ট্রানজেকশন পেন্ডিং
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Card 4: Low Stock Alert */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                                স্টক সতর্কতা (Low Stock)
                            </span>
                            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                                {metrics.lowStockCount}
                            </div>
                            <span className="text-xs text-amber-600 mt-1 block font-medium">
                                ৫ বা তার কম মজুদ পণ্য
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Main Tables Grid: Recent Orders & Low Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Recent Orders (Col 8) */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4 text-emerald-700" /> সাম্প্রতিক অর্ডারসমূহ
                            </h2>
                            <Link
                                href="/admin/orders"
                                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                            >
                                <span>সব দেখুন</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-500">
                                এখনো কোনো অর্ডার পাওয়া যায়নি।
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-600 uppercase font-bold text-[11px]">
                                        <tr>
                                            <th className="py-3 px-4">অর্ডার আইডি</th>
                                            <th className="py-3 px-4">গ্রাহক</th>
                                            <th className="py-3 px-4">পেমেন্ট</th>
                                            <th className="py-3 px-4">মোট বিল</th>
                                            <th className="py-3 px-4">স্ট্যাটাস</th>
                                            <th className="py-3 px-4 text-right">একশন</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                                                    <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                                                        {order.order_number}
                                                    </Link>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="font-semibold text-gray-900">{order.customer_name}</div>
                                                    <div className="text-xs text-gray-500">{order.customer_phone}</div>
                                                </td>
                                                <td className="py-3.5 px-4 uppercase text-xs font-bold">
                                                    {order.payment_method === 'cod' ? (
                                                        <span className="text-gray-700">ক্যাশ অন ডেলিভারি</span>
                                                    ) : (
                                                        <span className="text-[#E2136E]">বিকাশ {order.bkash_trx_id ? `(${order.bkash_trx_id})` : ''}</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-emerald-800">
                                                    ৳{order.grand_total}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        statusBadges[order.status] || 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 inline-block"
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
                        )}
                    </div>

                    {/* Low Stock Items (Col 4) */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-600" /> লো স্টক পণ্য
                                </h2>
                                <Link
                                    href="/admin/products"
                                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    সকল পণ্য
                                </Link>
                            </div>

                            <div className="p-4 space-y-3">
                                {lowStockList.length === 0 ? (
                                    <p className="text-xs text-gray-500 text-center py-6">
                                        সব পণ্যের পর্যাপ্ত স্টক রয়েছে।
                                    </p>
                                ) : (
                                    lowStockList.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-3 rounded-xl border border-gray-100 bg-amber-50/30 flex items-center justify-between text-xs sm:text-sm"
                                        >
                                            <div className="min-w-0 pr-2">
                                                <span className="font-bold text-gray-900 block truncate">{item.name}</span>
                                                <span className="text-xs text-gray-500">SKU: {item.sku}</span>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold block">
                                                    {item.stock} টি বাকি
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Quick Action bar */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <Link
                                href="/admin/products/create"
                                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                            >
                                <Package className="w-4 h-4" />
                                <span>নতুন পণ্য যুক্ত করুন</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
