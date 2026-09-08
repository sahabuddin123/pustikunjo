import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { TrendingUp, ShoppingBag, CheckCircle, Banknote, Calendar, BarChart } from 'lucide-react';

export default function ReportsIndex({ summary = {}, paymentMethods = [], statusBreakdown = [], topProducts = [], dailySales = [], days = 30 }) {
    const handleDaysChange = (newDays) => {
        router.get('/admin/reports', { days: newDays }, { preserveState: true });
    };

    return (
        <AdminLayout title="Reports & Analytics">
            <div className="space-y-6">
                {/* Header with Date Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Sales Reports & Analytics</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Real-time order revenue, product performance, and payment distributions.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {[7, 30, 90, 365].map((d) => (
                            <button
                                key={d}
                                onClick={() => handleDaysChange(d)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                                    days === d
                                        ? 'bg-emerald-800 text-white shadow-xs'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {d} Days
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Net Revenue</span>
                        <div className="text-2xl font-black text-gray-900 mt-1">৳{Number(summary.total_revenue || 0).toLocaleString()}</div>
                        <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Excluding cancelled orders</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                        <div className="text-2xl font-black text-emerald-800 mt-1">{summary.total_orders || 0}</div>
                        <span className="text-[11px] text-gray-500 font-medium mt-1 block">{summary.delivered_orders || 0} successfully delivered</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Average Order Value</span>
                        <div className="text-2xl font-black text-gray-900 mt-1">৳{Number(summary.avg_order_value || 0).toLocaleString()}</div>
                        <span className="text-[11px] text-gray-500 font-medium mt-1 block">AOV per placed order</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Success Rate</span>
                        <div className="text-2xl font-black text-emerald-700 mt-1">
                            {summary.total_orders > 0 ? Math.round((summary.delivered_orders / summary.total_orders) * 100) : 0}%
                        </div>
                        <span className="text-[11px] text-gray-500 font-medium mt-1 block">Fulfilled orders</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Selling Products */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-emerald-700" />
                            <span>Top Selling Products</span>
                        </h2>

                        {topProducts.length > 0 ? (
                            <div className="space-y-3">
                                {topProducts.map((p, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 text-xs">
                                        <div>
                                            <div className="font-bold text-gray-900">{p.product_name}</div>
                                            <div className="text-[11px] text-gray-500 mt-0.5">{p.total_qty} units sold</div>
                                        </div>
                                        <div className="font-bold text-emerald-800 text-sm">
                                            ৳{Number(p.total_revenue).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-6 text-center">No product sales yet.</p>
                        )}
                    </div>

                    {/* Payment & Order Status Distribution */}
                    <div className="space-y-6">
                        {/* Payment Breakdown */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-emerald-700" />
                                <span>Payment Methods Breakdown</span>
                            </h2>
                            <div className="space-y-2">
                                {paymentMethods.map((pm, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-gray-50">
                                        <span className="font-semibold text-gray-800 uppercase tracking-wider">
                                            {pm.payment_method === 'cod' ? 'Cash on Delivery' : 'bKash Send Money'}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500">{pm.count} orders</span>
                                            <span className="font-bold text-gray-900">৳{Number(pm.total || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status Breakdown */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-700" />
                                <span>Order Status Distribution</span>
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {statusBreakdown.map((sb, idx) => (
                                    <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                                        <div className="text-base font-black text-gray-900">{sb.count}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{sb.status}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily Sales Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-100 font-bold text-sm text-gray-900">
                        Daily Sales Trend (Last {days} Days)
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Orders Count</th>
                                    <th className="px-5 py-3 text-right">Daily Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {dailySales.length > 0 ? (
                                    dailySales.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/60">
                                            <td className="px-5 py-2.5 font-mono">{row.date}</td>
                                            <td className="px-5 py-2.5">{row.orders_count} orders</td>
                                            <td className="px-5 py-2.5 font-bold text-gray-900 text-right">
                                                ৳{Number(row.revenue).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-6 text-center text-gray-400">
                                            No sales recorded for this period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
