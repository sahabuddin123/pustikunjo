import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Upload,
    Image as ImageIcon,
    Check,
    Search,
    RefreshCw,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Plus,
    ExternalLink
} from 'lucide-react';

export default function MediaPickerModal({
    isOpen,
    onClose,
    onSelect,
    title = 'মিডিয়া লাইব্রেরি — ছবি নির্বাচন'
}) {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'upload'
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Fetch media list when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchMedia();
            setSelectedItem(null);
            setUploadError(null);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch('/admin/media/api/list', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (res.ok) {
                const data = await res.json();
                setMedia(data.media || []);
            }
        } catch (err) {
            console.error('Failed to load media:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;

        // Validate image
        if (!file.type.startsWith('image/')) {
            setUploadError('অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP, SVG, GIF) আপলোড করুন।');
            return;
        }

        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('image', file);

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        try {
            const res = await fetch('/admin/media/api/upload', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok && (data.media || data.file)) {
                const newMedia = data.media || data.file;
                setMedia((prev) => [newMedia, ...prev]);
                setSelectedItem(newMedia);
                setActiveTab('browse');
            } else {
                setUploadError(data.message || 'আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setUploadError('সার্ভারে ছবি পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট বা ফাইল চেক করুন।');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleConfirm = () => {
        if (selectedItem) {
            onSelect(selectedItem.url, selectedItem);
            onClose();
        }
    };

    if (!isOpen) return null;

    const filteredMedia = media.filter((item) =>
        item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden z-10 border border-gray-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                            <p className="text-xs text-gray-500">
                                মিডিয়া লাইব্রেরি থেকে ইমেজ নির্বাচন করুন অথবা নতুন ইমেজ আপলোড করুন
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
                        title="বন্ধ করুন"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs & Controls */}
                <div className="px-6 py-3 border-b border-gray-100 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('browse')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                activeTab === 'browse'
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <ImageIcon className="w-4 h-4" />
                            <span>ছবি গ্যালারি ({media.length})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('upload')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                activeTab === 'upload'
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Upload className="w-4 h-4" />
                            <span>নতুন ছবি আপলোড</span>
                        </button>

                        <button
                            type="button"
                            onClick={fetchMedia}
                            disabled={loading}
                            className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                            title="রিফ্রেশ করুন"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
                        </button>
                    </div>

                    {activeTab === 'browse' && (
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="ফাইলের নামে সার্চ করুন..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    )}
                </div>

                {/* Body Area */}
                <div className="flex-1 overflow-y-auto p-6 min-h-[380px]">
                    {activeTab === 'upload' ? (
                        /* Upload Screen */
                        <div className="max-w-xl mx-auto py-6">
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                                    dragActive
                                        ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
                                        : 'border-gray-300 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/30'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleFileUpload(e.target.files[0]);
                                        }
                                    }}
                                />

                                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
                                    <Upload className="w-8 h-8" />
                                </div>

                                <h3 className="text-base font-bold text-gray-900 mb-1">
                                    {uploading ? 'ছবি আপলোড হচ্ছে...' : 'ছবি আপলোড করতে ক্লিক করুন বা টেনে আনুন'}
                                </h3>
                                <p className="text-xs text-gray-500 max-w-sm mb-4">
                                    JPG, PNG, WebP, SVG ফরম্যাট সমর্থিত (সর্বোচ্চ ১০MB)
                                </p>

                                {uploading ? (
                                    <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>প্রসেসিং হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</span>
                                    </div>
                                ) : (
                                    <span className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs sm:text-sm hover:bg-emerald-800 transition-colors shadow-xs">
                                        কম্পিউটার থেকে ছবি বেছে নিন
                                    </span>
                                )}
                            </div>

                            {uploadError && (
                                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                    <span>{uploadError}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Browse Gallery */
                        <div>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
                                    <span className="text-sm font-semibold">ছবি লোড হচ্ছে...</span>
                                </div>
                            ) : filteredMedia.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-base font-bold text-gray-800 mb-1">কোনো ছবি পাওয়া যায়নি</h4>
                                    <p className="text-xs text-gray-500 mb-4">
                                        {searchQuery
                                            ? 'আপনার অনুসন্ধানের সাথে কোনো ছবি মেলেনি।'
                                            : 'লাইব্রেরিতে এখনো কোনো ছবি আপলোড করা হয়নি।'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('upload')}
                                        className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 hover:bg-emerald-800 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>নতুন ছবি আপলোড করুন</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                                    {filteredMedia.map((item, idx) => {
                                        const isSelected = selectedItem?.url === item.url;
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedItem(item)}
                                                onDoubleClick={() => {
                                                    setSelectedItem(item);
                                                    onSelect(item.url, item);
                                                    onClose();
                                                }}
                                                className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all bg-gray-50 flex flex-col ${
                                                    isSelected
                                                        ? 'ring-3 ring-emerald-600 border-emerald-600 shadow-md scale-[1.02]'
                                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
                                                }`}
                                            >
                                                {/* Image Thumbnail */}
                                                <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                                    <img
                                                        src={item.url}
                                                        alt={item.filename}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                        loading="lazy"
                                                    />

                                                    {/* Selected Checkmark Badge */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                                                            <Check className="w-4 h-4 stroke-[3]" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Caption */}
                                                <div className="p-2 bg-white border-t border-gray-100 flex-1">
                                                    <p className="text-xs font-semibold text-gray-800 truncate" title={item.filename}>
                                                        {item.filename}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                                        {item.size}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Bar */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-gray-500 truncate w-full sm:w-auto">
                        {selectedItem ? (
                            <span className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">নির্বাচিত:</span>
                                <span className="text-emerald-700 font-medium truncate max-w-xs sm:max-w-md">
                                    {selectedItem.filename} ({selectedItem.size})
                                </span>
                            </span>
                        ) : (
                            <span>একটি ছবি নির্বাচন করতে ক্লিক করুন (ডাবল-ক্লিকে তাৎক্ষণিক যুক্ত হবে)</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                        >
                            বাতিল
                        </button>
                        <button
                            type="button"
                            disabled={!selectedItem}
                            onClick={handleConfirm}
                            className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Check className="w-4 h-4" />
                            <span>এই ছবি ব্যবহার করুন</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
