import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';

export default function BlogForm({ post = null }) {
    const isEdit = Boolean(post);

    const { data, setData, post: submitPost, put, processing, errors } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        author_name: post?.author_name || 'পুষ্টি কুঞ্জ টিম',
        featured_image: post?.featured_image || '',
        summary: post?.summary || '',
        content: post?.content || '',
        is_published: post?.is_published !== undefined ? Boolean(post.is_published) : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/blog/${post.id}`);
        } else {
            submitPost('/admin/blog');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Article' : 'Write Article'}>
            <div className="space-y-6 w-full">
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/blog"
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Articles</span>
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900">
                        {isEdit ? 'Edit Blog Article' : 'Create New Blog Article'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs space-y-5">
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                            Article Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. বিটরুট পাউডারের আশ্চর্য ১০টি স্বাস্থ্য উপকারিতা"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                        />
                        {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                URL Slug (leave blank to auto-generate)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. beetroot-powder-benefits"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-emerald-600"
                            />
                            {errors.slug && <p className="text-xs text-rose-500 mt-1">{errors.slug}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                Author Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. পুষ্টি কুঞ্জ টিম"
                                value={data.author_name}
                                onChange={(e) => setData('author_name', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                            Featured Image URL
                        </label>
                        <input
                            type="url"
                            placeholder="https://images.unsplash.com/... or /uploads/..."
                            value={data.featured_image}
                            onChange={(e) => setData('featured_image', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-600"
                        />
                        {data.featured_image && (
                            <img
                                src={data.featured_image}
                                alt="Preview"
                                className="mt-2 w-32 h-20 rounded-lg object-cover border border-gray-100"
                            />
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                            Short Summary
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Brief summary shown on blog list cards..."
                            value={data.summary}
                            onChange={(e) => setData('summary', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-600"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                            Article Content (Rich Text / Markdown / HTML) <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={12}
                            placeholder="Write your article in detailed paragraphs..."
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 text-sm font-sans focus:outline-none focus:border-emerald-600 leading-relaxed"
                        />
                        {errors.content && <p className="text-xs text-rose-500 mt-1">{errors.content}</p>}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={data.is_published}
                            onChange={(e) => setData('is_published', e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                        />
                        <label htmlFor="is_published" className="text-xs font-bold text-gray-800 cursor-pointer">
                            Publish article publicly
                        </label>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-sm disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isEdit ? 'Update Article' : 'Publish Article'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
