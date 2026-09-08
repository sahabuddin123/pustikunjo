import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Eye, ShoppingCart, UserCheck, Calendar } from 'lucide-react';

export default function CustomersIndex({ customers = { data: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/customers', { search: search.trim() }, { preserveState: true });
    };

    return (
        <AdminLayout title="Customers">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Customers</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Total registered & guest customers from completed orders ({customers.total || customers.data.length})
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
                        <div className="relative w-full">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or phone..."
                                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 bg-gray-50/50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors"
                        >
                            Filter
                        </button>
                    </form>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3.5">Customer Name</th>
                                    <th className="px-5 py-3.5">Phone Number</th>
                                    <th className="px-5 py-3.5">Email / Alt Phone</th>
                                    <th className="px-5 py-3.5">Total Orders</th>
                                    <th className="px-5 py-3.5">Total Spent</th>
                                    <th className="px-5 py-3.5">Last Order</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customers.data && customers.data.length > 0 ? (
                                    customers.data.map((c, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-gray-900">
                                                {c.customer_name || 'N/A'}
                                            </td>
                                            <td className="px-5 py-3 font-mono text-emerald-800 font-medium">
                                                {c.customer_phone}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div>{c.customer_email || '—'}</div>
                                                {c.customer_alt_phone && (
                                                    <div className="text-[11px] text-gray-400">Alt: {c.customer_alt_phone}</div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                                                    {c.total_orders} orders
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 font-bold text-gray-900">
                                                ৳{Number(c.total_spent || 0).toLocaleString()}
                                            </td>
                                            <td className="px-5 py-3 text-gray-500">
                                                {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString('en-GB') : '—'}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <Link
                                                    href={`/admin/customers/${encodeURIComponent(c.customer_phone)}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-gray-500" />
                                                    <span>View</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                                            No customers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {customers.links && customers.links.length > 3 && (
                        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                                Showing {customers.from || 0} to {customers.to || 0} of {customers.total || 0}
                            </span>
                            <div className="flex gap-1">
                                {customers.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-2.5 py-1 rounded-md border ${
                                            link.active
                                                ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                                                : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                                        } ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
