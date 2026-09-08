import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, BookOpen, ExternalLink } from 'lucide-react';

export default function BlogIndex({ posts = { data: [] } }) {
    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            router.delete(`/admin/blog/${id}`);
        }
    };

    return (
        <AdminLayout title="Blog Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Blog Articles</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Publish and manage health articles, recipes, and wellness guides.
                        </p>
                    </div>

                    <Link
                        href="/admin/blog/create"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Write Article</span>
                    </Link>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3.5">Title</th>
                                    <th className="px-5 py-3.5">Slug</th>
                                    <th className="px-5 py-3.5">Author</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5">Published Date</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {posts.data && posts.data.length > 0 ? (
                                    posts.data.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    {post.featured_image && (
                                                        <img
                                                            src={post.featured_image}
                                                            alt={post.title}
                                                            className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                                                        />
                                                    )}
                                                    <span className="max-w-xs truncate">{post.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-mono text-gray-500">
                                                /blog/{post.slug}
                                            </td>
                                            <td className="px-5 py-3 text-gray-700">
                                                {post.author_name || 'পুষ্টি কুঞ্জ টিম'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                                                    post.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {post.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-gray-500">
                                                {post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB') : '—'}
                                            </td>
                                            <td className="px-5 py-3 text-right space-x-2">
                                                {post.is_published && (
                                                    <a
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600"
                                                        title="View on site"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/admin/blog/${post.id}/edit`}
                                                    className="inline-flex p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                    className="inline-flex p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                                            No blog articles yet. Click "Write Article" to publish your first one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {posts.links && posts.links.length > 3 && (
                        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                                Showing {posts.from || 0} to {posts.to || 0} of {posts.total || 0}
                            </span>
                            <div className="flex gap-1">
                                {posts.links.map((link, idx) => (
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
