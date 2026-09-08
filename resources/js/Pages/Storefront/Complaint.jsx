import React, { useState, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { 
    Phone, 
    MessageSquareQuote, 
    ShieldCheck, 
    ArrowLeft, 
    Upload, 
    Plus, 
    X, 
    Image as ImageIcon, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    Search,
    Link as LinkIcon
} from 'lucide-react';

export default function Complaint({ 
    trackedComplaint = null, 
    myComplaints = [], 
    initialPhone = '', 
    initialName = '' 
}) {
    const [photos, setPhotos] = useState([]);
    const [photoFiles, setPhotoFiles] = useState([]);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [searchTicket, setSearchTicket] = useState(trackedComplaint?.ticket_number || '');
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        phone: initialPhone || '',
        name: initialName || '',
        order_number: '',
        issue_details: '',
        photos: [],
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const newPreviews = [];
        files.forEach((file) => {
            const previewUrl = URL.createObjectURL(file);
            newPreviews.push({
                url: previewUrl,
                isLocal: true,
                file: file
            });
        });

        setPhotoFiles((prev) => [...prev, ...files]);
        setPhotos((prev) => [...prev, ...newPreviews.map(p => p.url)]);
    };

    const handleAddFromUrl = () => {
        if (!urlInput.trim()) return;
        setPhotos((prev) => [...prev, urlInput.trim()]);
        setData('photos', [...(data.photos || []), urlInput.trim()]);
        setUrlInput('');
        setShowUrlInput(false);
    };

    const handleRemovePhoto = (indexToRemove) => {
        setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setPhotoFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setData('photos', (data.photos || []).filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Use router.post with FormData for file uploads + text data
        const formData = new FormData();
        formData.append('phone', data.phone);
        if (data.name) formData.append('name', data.name);
        if (data.order_number) formData.append('order_number', data.order_number);
        formData.append('issue_details', data.issue_details);

        // Append photo strings (URLs)
        photos.forEach((photo, idx) => {
            if (typeof photo === 'string' && (photo.startsWith('http') || photo.startsWith('/'))) {
                formData.append(`photos[${idx}]`, photo);
            }
        });

        // Append actual binary files
        photoFiles.forEach((file, idx) => {
            formData.append(`photo_files[${idx}]`, file);
        });

        router.post('/complaint', formData, {
            forceFormData: true,
            onSuccess: () => {
                reset('issue_details', 'order_number');
                setPhotos([]);
                setPhotoFiles([]);
            },
        });
    };

    const handleTrackSearch = (e) => {
        e.preventDefault();
        if (searchTicket.trim()) {
            router.get('/complaint', { ticket: searchTicket.trim() });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'resolved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        সমাধান সম্পন্ন (Resolved)
                    </span>
                );
            case 'under_review':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        <Clock className="w-3.5 h-3.5" />
                        পর্যালোচনাধীন (Under Review)
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                        <AlertCircle className="w-3.5 h-3.5" />
                        বাতিল (Rejected)
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        অপেক্ষারত (Pending)
                    </span>
                );
        }
    };

    return (
        <StorefrontLayout meta={{ title: 'Submit a Complaint — অভিযোগ দাখিল' }}>
            <div className="min-h-screen bg-[#F8FAF8] py-8 sm:py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    
                    {/* Back to Home Link */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-emerald-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Home</span>
                        </Link>

                        {/* Search existing complaint ticket trigger */}
                        <div className="flex items-center gap-2">
                            <form onSubmit={handleTrackSearch} className="flex items-center">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Track Ticket (e.g. PK-CMP-...)"
                                        value={searchTicket}
                                        onChange={(e) => setSearchTicket(e.target.value)}
                                        className="text-xs sm:text-sm pl-8 pr-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                                    />
                                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                </div>
                                <button
                                    type="submit"
                                    className="ml-1 px-2.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
                                >
                                    খুঁজুন
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Tracked Ticket Banner if present */}
                    {trackedComplaint && (
                        <div className="mb-6 bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 space-y-4 animate-fade-in">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                                        অভিযোগ টিকিট
                                    </span>
                                    <span className="text-lg font-black text-gray-900 font-mono">
                                        {trackedComplaint.ticket_number}
                                    </span>
                                </div>
                                <div>
                                    {getStatusBadge(trackedComplaint.status)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-500 text-xs block">ফোন নম্বর:</span>
                                    <span className="font-semibold text-gray-800">{trackedComplaint.phone}</span>
                                </div>
                                {trackedComplaint.order_number && (
                                    <div>
                                        <span className="text-gray-500 text-xs block">অর্ডার নম্বর:</span>
                                        <span className="font-semibold text-gray-800">{trackedComplaint.order_number}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-gray-500 text-xs block">দাখিলের তারিখ:</span>
                                    <span className="font-semibold text-gray-800">
                                        {new Date(trackedComplaint.created_at).toLocaleDateString('bn-BD', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3.5 text-sm text-gray-700">
                                <span className="font-bold text-gray-900 block mb-1">অভিযোগের বিবরণ:</span>
                                <p className="whitespace-pre-line leading-relaxed">{trackedComplaint.issue_details}</p>
                            </div>

                            {trackedComplaint.admin_notes && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-sm text-emerald-900">
                                    <span className="font-bold block mb-1">কাস্টমার কেয়ার টিম উত্তর:</span>
                                    <p className="whitespace-pre-line leading-relaxed">{trackedComplaint.admin_notes}</p>
                                </div>
                            )}

                            {trackedComplaint.photos && trackedComplaint.photos.length > 0 && (
                                <div>
                                    <span className="text-xs font-bold text-gray-500 block mb-2">সংযুক্ত ছবিসমূহ:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {trackedComplaint.photos.map((imgUrl, i) => (
                                            <a key={i} href={imgUrl} target="_blank" rel="noreferrer">
                                                <img 
                                                    src={imgUrl} 
                                                    alt="Complaint photo" 
                                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Main White Card matching screenshot */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden">
                        
                        {/* Pale Green Card Header */}
                        <div className="bg-[#EBF4EC] px-6 sm:px-8 py-5 flex items-start gap-4 border-b border-emerald-100/70">
                            <div className="w-10 h-10 rounded-xl bg-white/90 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100 mt-0.5">
                                <MessageSquareQuote className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                                    Submit a Complaint
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                    Have an issue with your order? Let us know and we will resolve it as soon as possible.
                                </p>
                            </div>
                        </div>

                        {/* Complaint Form Body */}
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            
                            {/* Phone Number Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Phone Number <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="01XXXXXXXXX"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">
                                    We will contact you on this number regarding your complaint.
                                </p>
                                {errors.phone && (
                                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone}</p>
                                )}
                            </div>

                            {/* Optional Order Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Order Number <span className="text-xs font-normal text-gray-500">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. PK-260908-1234"
                                    value={data.order_number}
                                    onChange={(e) => setData('order_number', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                                />
                                {errors.order_number && (
                                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.order_number}</p>
                                )}
                            </div>

                            {/* Describe your issue Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Describe your issue <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Please describe your complain or issue in detail..."
                                    value={data.issue_details}
                                    onChange={(e) => setData('issue_details', e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-all resize-y"
                                />
                                {errors.issue_details && (
                                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.issue_details}</p>
                                )}
                            </div>

                            {/* Attach Photos Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Attach Photos <span className="text-xs font-normal text-gray-500">(optional)</span>
                                </label>
                                
                                {/* Dashed Dropzone Box */}
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/40 hover:bg-emerald-50/20 transition-all">
                                    
                                    {/* Upload trigger buttons */}
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-400 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4 text-gray-500" />
                                            <span>Add</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setShowUrlInput(!showUrlInput)}
                                            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                                        >
                                            Add From URL
                                        </button>
                                    </div>

                                    {/* Inline URL Input */}
                                    {showUrlInput && (
                                        <div className="mt-4 flex items-center gap-2 max-w-md mx-auto">
                                            <input
                                                type="url"
                                                placeholder="https://example.com/photo.jpg"
                                                value={urlInput}
                                                onChange={(e) => setUrlInput(e.target.value)}
                                                className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddFromUrl}
                                                className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
                                            >
                                                Attach
                                            </button>
                                        </div>
                                    )}

                                    {/* Photo Previews */}
                                    {photos.length > 0 && (
                                        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                                            {photos.map((photoUrl, idx) => (
                                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                                                    <img
                                                        src={photoUrl}
                                                        alt={`Attached ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePhoto(idx)}
                                                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors"
                                                        title="Remove"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 mt-1.5">
                                    Upload screenshots or images that help explain your issue.
                                </p>
                            </div>

                            {/* Privacy Guarantee Box */}
                            <div className="bg-[#F3F9F4] border border-emerald-200/70 rounded-xl p-3.5 flex items-center gap-2.5 text-xs sm:text-sm text-gray-700">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Your information is kept private and used only to resolve your complaint.</span>
                            </div>

                            {/* Buttons */}
                            <div className="pt-2 flex items-center justify-end gap-3">
                                <Link
                                    href="/"
                                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-lg bg-[#96B878] hover:bg-[#85A668] text-white font-semibold text-sm shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <span>Submit Complaint</span>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Pre-existing Customer Complaints list if logged in */}
                    {myComplaints.length > 0 && (
                        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                                আপনার সাম্প্রতিক অভিযোগসমূহ (Recent Complaints)
                            </h3>
                            <div className="divide-y divide-gray-100">
                                {myComplaints.map((c) => (
                                    <div key={c.id} className="py-3 flex items-center justify-between gap-4">
                                        <div>
                                            <Link
                                                href={`/complaint?ticket=${c.ticket_number}`}
                                                className="text-sm font-bold font-mono text-emerald-700 hover:underline"
                                            >
                                                {c.ticket_number}
                                            </Link>
                                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                {c.issue_details}
                                            </p>
                                        </div>
                                        <div>
                                            {getStatusBadge(c.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </StorefrontLayout>
    );
}
