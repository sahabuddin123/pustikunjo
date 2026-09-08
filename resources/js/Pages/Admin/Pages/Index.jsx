import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit, Trash2, Eye, Layout, FileText } from 'lucide-react';

export default function Index({ pages = [] }) {
    const handleDelete = (id, title) => {
        if (confirm(`আপনি কি "${title}" পেজটি মুছে ফেলতে চান?`)) {
            router.delete(`/admin/pages/${id}`);
        }
    };

    return (
        <AdminLayout title="পেজ বিল্ডার (Page Builder)">
            <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-base text-gray-900">পেজ তালিকা</h2>
                        <p className="text-xs text-gray-500">মডুলার ডব্লিউপিবেকারি স্টাইল ড্র্যাগ-অ্যান্ড-ড্রপ পেজ বিল্ডার</p>
                    </div>
                    <Link
                        href="/admin/pages/create"
                        className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>নতুন পেজ তৈরি করুন</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-600 uppercase font-bold text-[11px]">
                                <tr>
                                    <th className="py-3.5 px-4">পেজের শিরোনাম</th>
                                    <th className="py-3.5 px-4">ইউআরএল স্লাগ (Slug)</th>
                                    <th className="py-3.5 px-4">এডিটর ধরন</th>
                                    <th className="py-3.5 px-4">কন্টেন্ট স্ট্যাটাস</th>
                                    <th className="py-3.5 px-4">স্ট্যাটাস</th>
                                    <th className="py-3.5 px-4 text-right">একশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pages.map((p) => {
                                    const hasHtml = Boolean(p.content && p.content.trim().length > 0);
                                    const hasBlocks = Boolean(p.blocks && p.blocks.length > 0);
                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50/50">
                                            <td className="py-3.5 px-4 font-bold text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-800 font-extrabold">{p.title}</span>
                                                    {p.slug === 'home' && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                                            হোমপেজ
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-gray-500">
                                                /{p.slug}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {hasHtml && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                            <FileText className="w-3 h-3" /> CKEditor
                                                        </span>
                                                    )}
                                                    {hasBlocks && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                                            <Layout className="w-3 h-3" /> {p.blocks.length} ব্লক
                                                        </span>
                                                    )}
                                                    {!hasHtml && !hasBlocks && (
                                                        <span className="text-xs text-gray-400">খালি</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-gray-600">
                                                {hasHtml ? (
                                                    <span className="text-emerald-700 font-semibold">ডায়নামিক কন্টেন্ট সেট</span>
                                                ) : hasBlocks ? (
                                                    <span className="text-blue-700 font-semibold">লেআউট ব্লক সক্রিয়</span>
                                                ) : (
                                                    <span className="text-gray-400">ডিফল্ট স্ট্যাটিক</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    p.is_published !== false
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {p.is_published !== false ? 'প্রকাশিত' : 'ড্রাফট'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={p.slug === 'home' ? '/' : `/${p.slug}`}
                                                        target="_blank"
                                                        className="p-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors"
                                                        title="পেজ লাইভ দেখুন"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/pages/${p.id}/edit`}
                                                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                                                        title="CKEditor ও বিল্ডার সম্পাদনা"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                        <span>এডিট করুন</span>
                                                    </Link>
                                                    {p.slug !== 'home' && p.slug !== '/' && (
                                                        <button
                                                            onClick={() => handleDelete(p.id, p.title)}
                                                            className="p-2 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-700 transition-colors cursor-pointer"
                                                            title="মুছে ফেলুন"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
