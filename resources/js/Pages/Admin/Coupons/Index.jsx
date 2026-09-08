import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Tag, Plus, Trash2, Edit } from 'lucide-react';

export default function Index({ coupons = [] }) {
    const [editingCoupon, setEditingCoupon] = useState(null);

    const form = useForm({
        code: '',
        type: 'fixed', // fixed or percent
        value: '',
        min_order_amount: 0,
        usage_limit: 100,
        expires_at: '',
        is_active: true,
    });

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        form.setData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            min_order_amount: coupon.min_order_amount || 0,
            usage_limit: coupon.usage_limit || 100,
            expires_at: coupon.expires_at || '',
            is_active: coupon.is_active,
        });
    };

    const handleCancel = () => {
        setEditingCoupon(null);
        form.reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCoupon) {
            form.put(`/admin/coupons/${editingCoupon.id}`, {
                onSuccess: () => handleCancel(),
            });
        } else {
            form.post('/admin/coupons', {
                onSuccess: () => form.reset(),
            });
        }
    };

    const handleDelete = (id, code) => {
        if (confirm(`আপনি কি "${code}" কুপনটি মুছে ফেলতে চান?`)) {
            router.delete(`/admin/coupons/${id}`);
        }
    };

    return (
        <AdminLayout title="কুপন ও ডিসকাউন্ট (Coupons)">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-700" />
                        <span>{editingCoupon ? `কুপন এডিট: ${editingCoupon.code}` : 'নতুন কুপন তৈরি'}</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">কুপন কোড *</label>
                            <input
                                type="text"
                                required
                                placeholder="যেমন: PUSTI50"
                                value={form.data.code}
                                onChange={(e) => form.setData('code', e.target.value.toUpperCase())}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono uppercase focus:border-emerald-600"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">ডিসকাউন্ট টাইপ</label>
                                <select
                                    value={form.data.type}
                                    onChange={(e) => form.setData('type', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                >
                                    <option value="fixed">নির্দিষ্ট টাকা (Fixed BDT ৳)</option>
                                    <option value="percent">শতাংশ ছাড় (Percent %)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">ছাড়ের মান (Value) *</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="50"
                                    value={form.data.value}
                                    onChange={(e) => form.setData('value', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">সর্বনিম্ন অর্ডার বিল (৳)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.data.min_order_amount}
                                    onChange={(e) => form.setData('min_order_amount', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">ব্যবহারের সর্বোচ্চ সীমা</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.data.usage_limit}
                                    onChange={(e) => form.setData('usage_limit', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs"
                            >
                                {editingCoupon ? 'আপডেট করুন' : 'তৈরি করুন'}
                            </button>
                            {editingCoupon && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold"
                                >
                                    বাতিল
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-gray-100 font-bold text-base text-gray-900">
                        সক্রিয় কুপনসমূহ ({coupons.length})
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-[11px]">
                                <tr>
                                    <th className="py-3 px-4">কুপন কোড</th>
                                    <th className="py-3 px-4">ছাড়</th>
                                    <th className="py-3 px-4">সর্বনিম্ন বিল</th>
                                    <th className="py-3 px-4">ব্যবহার</th>
                                    <th className="py-3 px-4 text-right">একশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {coupons.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50">
                                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                                            {c.code}
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-gray-800">
                                            {c.type === 'percent' ? `${c.value}%` : `৳${c.value}`}
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-600">
                                            ৳{c.min_order_amount}
                                        </td>
                                        <td className="py-3.5 px-4 text-xs">
                                            {c.used_count} / {c.usage_limit || '∞'}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(c)}
                                                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.id, c.code)}
                                                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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
