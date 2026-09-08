import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function MediaIndex({ media = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        image: null,
    });

    const [copiedUrl, setCopiedUrl] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setData('image', e.target.files[0]);
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        post('/admin/media/upload', {
            onSuccess: () => reset(),
        });
    };

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const handleDelete = (filename) => {
        if (confirm(`Are you sure you want to delete "${filename}"?`)) {
            router.post('/admin/media/destroy', { filename });
        }
    };

    return (
        <AdminLayout title="Media Library">
            <div className="space-y-6">
                {/* Header and Upload Box */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Upload product images, banners, and icons. Images are stored in public storage.
                        </p>
                    </div>

                    <form onSubmit={handleUpload} className="flex items-center gap-2">
                        <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer text-xs font-semibold text-gray-700 bg-gray-50/70 transition-colors">
                            <Upload className="w-4 h-4 text-emerald-700" />
                            <span>{data.image ? data.image.name : 'Choose Image'}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {data.image && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Uploading...' : 'Upload'}
                            </button>
                        )}
                    </form>
                </div>

                {errors.image && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                        {errors.image}
                    </div>
                )}

                {/* Media Grid */}
                {media.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {media.map((item, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                    <img
                                        src={item.url}
                                        alt={item.filename}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(item.url)}
                                            className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-800 shadow transition-transform hover:scale-110"
                                            title="Copy Image URL"
                                        >
                                            {copiedUrl === item.url ? (
                                                <Check className="w-4 h-4 text-emerald-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-800 shadow transition-transform hover:scale-110"
                                            title="Open Original"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.filename)}
                                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow transition-transform hover:scale-110"
                                            title="Delete Image"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-2 text-[11px] border-t border-gray-100">
                                    <p className="truncate font-medium text-gray-800" title={item.filename}>
                                        {item.filename}
                                    </p>
                                    <span className="text-gray-400 block text-[10px]">{item.size}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                        <ImageIcon className="w-12 h-12 mx-auto stroke-1 text-gray-300 mb-2" />
                        <p className="text-sm font-medium">No media uploaded yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Upload your first image using the button above.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
