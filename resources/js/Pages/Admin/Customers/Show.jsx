import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, ShoppingBag, Phone, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';

export default function CustomerShow({ customer }) {
    return (
        <AdminLayout title={`Customer: ${customer.name}`}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/customers"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Customers</span>
                    </Link>
                </div>

                {/* Customer Profile Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Customer Name</span>
                        <h2 className="text-lg font-bold text-gray-900 mt-1">{customer.name}</h2>
                        <span className="text-xs text-gray-500 font-mono mt-0.5 block">{customer.phone}</span>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Contact & Address</span>
                        <div className="text-xs text-gray-700 mt-1 space-y-1">
                            {customer.email && <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gray-400" />{customer.email}</div>}
                            <div className="flex items-start gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />{customer.address}</div>
                        </div>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                        <div className="text-2xl font-black text-emerald-800 mt-1">{customer.total_orders}</div>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Lifetime Spend</span>
                        <div className="text-2xl font-black text-gray-900 mt-1">৳{Number(customer.total_spent).toLocaleString()}</div>
                    </div>
                </div>

                {/* Order History Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-100 font-bold text-sm text-gray-900">
                        Order History ({customer.orders.length})
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3">Order Number</th>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Items</th>
                                    <th className="px-5 py-3">Payment</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Total</th>
                                    <th className="px-5 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customer.orders.map((o) => (
                                    <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-3 font-mono font-bold text-gray-900">
                                            #{o.order_number}
                                        </td>
                                        <td className="px-5 py-3 text-gray-500">
                                            {new Date(o.created_at).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-5 py-3">
                                            {o.items?.length || 0} items
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="capitalize font-medium text-gray-700">
                                                {o.payment_method === 'cod' ? 'Cash on Delivery' : 'bKash'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                                                o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                o.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                                                'bg-amber-100 text-amber-800'
                                            }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 font-bold text-gray-900">
                                            ৳{Number(o.grand_total).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <Link
                                                href={`/admin/orders/${o.id}`}
                                                className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-100 text-gray-700 font-medium"
                                            >
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
