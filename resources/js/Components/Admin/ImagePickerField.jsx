import React, { useState } from 'react';
import { Image as ImageIcon, Upload, X, ExternalLink } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

export default function ImagePickerField({
    label = 'ইমেজ URL',
    value = '',
    onChange,
    placeholder = 'https://... বা মিডিয়া লাইব্রেরি থেকে নির্বাচন করুন',
    helperText = '',
    required = false,
    className = ''
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectImage = (url) => {
        onChange(url);
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-xs sm:text-sm font-bold text-gray-800 block">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 pr-8"
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                            title="ইমেজ মুছে ফেলুন"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-2xs"
                >
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>মিডিয়া লাইব্রেরি</span>
                </button>
            </div>

            {/* Thumbnail Preview if URL exists */}
            {value && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200/80 max-w-md">
                    <div className="w-14 h-14 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <span className="text-xs font-bold text-gray-700 block truncate">ইমেজ প্রিভিউ</span>
                        <a
                            href={value}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-emerald-700 hover:underline truncate flex items-center gap-1 mt-0.5"
                        >
                            <span>মূল ছবি দেখুন</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-2 py-1 bg-white rounded-lg border border-emerald-200 shadow-2xs shrink-0"
                    >
                        পরিবর্তন করুন
                    </button>
                </div>
            )}

            {helperText && (
                <p className="text-[11px] text-gray-500 mt-1">{helperText}</p>
            )}

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectImage}
                title={`${label} — মিডিয়া লাইব্রেরি`}
            />
        </div>
    );
}
