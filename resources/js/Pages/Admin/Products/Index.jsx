import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Search, Edit, Trash2, Eye, Filter, FolderTree } from 'lucide-react';

export default function Index({ products, categories = [], filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.q || '');
    const [selectedCat, setSelectedCat] = useState(filters.category || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', { q: searchTerm, category: selectedCat }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`আপনি কি নিশ্চিত যে "${name}" পণ্যটি মুছে ফেলতে চান?`)) {
            router.delete(`/admin/products/${id}`);
        }
    };

    const productList = products.data || products || [];

    return (
        <AdminLayout title="পণ্য তালিকা (Products)">
            <div className="space-y-6 w-full">
                {/* Top Action Bar */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="নাম বা SKU দিয়ে খুঁজুন..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <select
                            value={selectedCat}
                            onChange={(e) => {
                                setSelectedCat(e.target.value);
                                router.get('/admin/products', { q: searchTerm, category: e.target.value }, { preserveState: true });
                            }}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                        >
                            <option value="">সকল ক্যাটাগরি</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </form>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <Link
                            href="/admin/categories"
                            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            <FolderTree className="w-4 h-4 text-emerald-700" />
                            <span>ক্যাটাগরি সমূহ</span>
                        </Link>
                        <Link
                            href="/admin/products/create"
                            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>নতুন পণ্য যোগ করুন</span>
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-600 uppercase font-bold text-[11px]">
                                <tr>
                                    <th className="py-3.5 px-4">ছবি ও নাম</th>
                                    <th className="py-3.5 px-4">SKU</th>
                                    <th className="py-3.5 px-4">ক্যাটাগরি</th>
                                    <th className="py-3.5 px-4">মূল্য (বিক্রয় মূল্য)</th>
                                    <th className="py-3.5 px-4">স্টক</th>
                                    <th className="py-3.5 px-4">ফিচার্ড</th>
                                    <th className="py-3.5 px-4 text-right">একশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {productList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-500">
                                            কোনো পণ্য পাওয়া যায়নি।
                                        </td>
                                    </tr>
                                ) : (
                                    productList.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={(product.images && product.images.length > 0) ? product.images[0] : (product.primary_image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=100&auto=format&fit=crop&q=80')}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-gray-900 line-clamp-1">{product.name}</div>
                                                        {product.badge && (
                                                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                                                {product.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-gray-700">
                                                {product.sku}
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-600">
                                                {product.category?.name || '—'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="font-bold text-emerald-800">৳{product.price}</span>
                                                {product.sale_price && (
                                                    <span className="text-xs text-rose-600 block font-semibold">
                                                        অফার: ৳{product.sale_price}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    product.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {product.stock} টি
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {product.is_featured ? (
                                                    <span className="text-xs font-bold text-emerald-700">হ্যাঁ</span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">না</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/product/${product.slug}`}
                                                        target="_blank"
                                                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700"
                                                        title="শপ পেজ দেখুন"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700"
                                                        title="সম্পাদনা করুন"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-700"
                                                        title="মুছে ফেলুন"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="p-4 border-t border-gray-100 flex justify-center gap-1">
                            {products.links.map((link, idx) => (
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
