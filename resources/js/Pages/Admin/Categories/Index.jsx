import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit, Trash2, FolderTree, Check } from 'lucide-react';

export default function Index({ categories = [] }) {
    const [editingCategory, setEditingCategory] = useState(null);

    const form = useForm({
        name: '',
        slug: '',
        image: '',
        description: '',
        sort_order: 0,
        is_featured: true,
    });

    const handleEdit = (cat) => {
        setEditingCategory(cat);
        form.setData({
            name: cat.name,
            slug: cat.slug,
            image: cat.image || '',
            description: cat.description || '',
            sort_order: cat.sort_order || 0,
            is_featured: cat.is_featured,
        });
    };

    const handleCancel = () => {
        setEditingCategory(null);
        form.reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            form.put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => handleCancel(),
            });
        } else {
            form.post('/admin/categories', {
                onSuccess: () => form.reset(),
            });
        }
    };

    const handleDelete = (id, name) => {
        if (confirm(`আপনি কি "${name}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout title="ক্যাটাগরি ব্যবস্থাপনা (Categories)">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Create/Edit Form */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-emerald-700" />
                        <span>{editingCategory ? `ক্যাটাগরি সম্পাদনা: ${editingCategory.name}` : 'নতুন ক্যাটাগরি তৈরি'}</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                ক্যাটাগরির নাম *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="যেমন: ভেষজ ও পুষ্টিকর পাউডার"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                ইমেজ URL (Image)
                            </label>
                            <input
                                type="url"
                                placeholder="https://... ছবি লিংক"
                                value={form.data.image}
                                onChange={(e) => form.setData('image', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                সংক্ষিপ্ত বিবরণ
                            </label>
                            <textarea
                                rows={3}
                                placeholder="ক্যাটাগরি সম্পর্কিত সংক্ষিপ্ত তথ্য..."
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_featured}
                                    onChange={(e) => form.setData('is_featured', e.target.checked)}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>হোমপেজে ফিচার্ড করুন</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors"
                            >
                                {editingCategory ? 'আপডেট করুন' : 'তৈরি করুন'}
                            </button>
                            {editingCategory && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                                >
                                    বাতিল
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right: Categories Table */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-gray-100 font-bold text-base text-gray-900">
                        বিদ্যমান ক্যাটাগরি সমূহ ({categories.length})
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-600 uppercase font-bold text-[11px]">
                                <tr>
                                    <th className="py-3 px-4">ছবি ও নাম</th>
                                    <th className="py-3 px-4">পণ্য সংখ্যা</th>
                                    <th className="py-3 px-4">ফিচার্ড</th>
                                    <th className="py-3 px-4 text-right">একশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/50">
                                        <td className="py-3.5 px-4 flex items-center gap-3">
                                            <img
                                                src={cat.image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=100&auto=format&fit=crop&q=80'}
                                                alt={cat.name}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                            />
                                            <div>
                                                <span className="font-bold text-gray-900 block">{cat.name}</span>
                                                <span className="text-xs text-gray-400 font-mono">/{cat.slug}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-gray-700">
                                            {cat.products_count || 0} টি
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {cat.is_featured ? (
                                                <span className="text-xs font-bold text-emerald-700">হ্যাঁ</span>
                                            ) : (
                                                <span className="text-xs text-gray-400">না</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id, cat.name)}
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
