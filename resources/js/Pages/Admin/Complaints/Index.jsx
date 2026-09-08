import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    MessageSquareWarning, 
    Search, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    ExternalLink, 
    Phone, 
    Image as ImageIcon, 
    Send,
    Filter,
    X,
    Eye
} from 'lucide-react';

export default function Index({ complaints, filters = {}, stats = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    
    // Status update modal state
    const [editStatus, setEditStatus] = useState('pending');
    const [adminNotes, setAdminNotes] = useState('');
    const [notifyCustomer, setNotifyCustomer] = useState(true);
    const [updating, setUpdating] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/complaints', {
            ...filters,
            search: searchTerm,
        }, { preserveState: true });
    };

    const handleFilterStatus = (status) => {
        router.get('/admin/complaints', {
            ...filters,
            status: status === filters.status ? undefined : status,
        }, { preserveState: true });
    };

    const openDetailsModal = (complaint) => {
        setSelectedComplaint(complaint);
        setEditStatus(complaint.status);
        setAdminNotes(complaint.admin_notes || '');
        setNotifyCustomer(true);
        setModalOpen(true);
    };

    const handleQuickStatusChange = (complaintId, newStatus) => {
        router.post(`/admin/complaints/${complaintId}/status`, {
            status: newStatus,
            notify_customer: false,
        }, {
            preserveScroll: true,
        });
    };

    const handleSaveStatusAndNotes = (e) => {
        e.preventDefault();
        if (!selectedComplaint) return;

        setUpdating(true);
        router.post(`/admin/complaints/${selectedComplaint.id}/status`, {
            status: editStatus,
            admin_notes: adminNotes,
            notify_customer: notifyCustomer,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setModalOpen(false);
                setUpdating(false);
            },
            onError: () => {
                setUpdating(false);
            }
        });
    };

    const getStatusPill = (status) => {
        switch (status) {
            case 'resolved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved (সমাধান)
                    </span>
                );
            case 'under_review':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        <Clock className="w-3.5 h-3.5" />
                        Under Review (পর্যালোচনা)
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Rejected (বাতিল)
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        Pending (অপেক্ষারত)
                    </span>
                );
        }
    };

    return (
        <AdminLayout title="কাস্টমার অভিযোগ ব্যবস্থাপনা">
            <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
                            <MessageSquareWarning className="w-7 h-7 text-emerald-700" />
                            <span>অভিযোগ ও সাপোর্ট টিকেট (Complaints)</span>
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            কাস্টমারদের অর্ডার বা পণ্য সংক্রান্ত অভিযোগ পর্যালোচনা করুন এবং সমাধান প্রদান করুন।
                        </p>
                    </div>

                    <Link
                        href="/complaint"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors"
                    >
                        <span>Storefront Form দেখুন</span>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                    </Link>
                </div>

                {/* Stats Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <button
                        onClick={() => handleFilterStatus('')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            !filters.status
                                ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                                : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                            সর্বমোট অভিযোগ
                        </span>
                        <span className="text-2xl font-black mt-1 block">
                            {stats.total || 0}
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterStatus('pending')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            filters.status === 'pending'
                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                            অপেক্ষারত (Pending)
                        </span>
                        <span className="text-2xl font-black mt-1 block text-amber-600" style={{ color: filters.status === 'pending' ? '#fff' : undefined }}>
                            {stats.pending || 0}
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterStatus('under_review')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            filters.status === 'under_review'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                            পর্যালোচনাধীন
                        </span>
                        <span className="text-2xl font-black mt-1 block text-blue-600" style={{ color: filters.status === 'under_review' ? '#fff' : undefined }}>
                            {stats.under_review || 0}
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterStatus('resolved')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            filters.status === 'resolved'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                            সমাধানকৃত (Resolved)
                        </span>
                        <span className="text-2xl font-black mt-1 block text-emerald-600" style={{ color: filters.status === 'resolved' ? '#fff' : undefined }}>
                            {stats.resolved || 0}
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterStatus('rejected')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            filters.status === 'rejected'
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                            বাতিল (Rejected)
                        </span>
                        <span className="text-2xl font-black mt-1 block text-rose-600" style={{ color: filters.status === 'rejected' ? '#fff' : undefined }}>
                            {stats.rejected || 0}
                        </span>
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <form onSubmit={handleSearch} className="w-full sm:w-96 flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="টিকেট নং, ফোন, বা অভিযোগের বিষয়..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                        >
                            খুঁজুন
                        </button>
                    </form>

                    <span className="text-xs text-gray-500 font-medium">
                        মোট {complaints?.total || 0} টি অভিযোগের ফলাফল
                    </span>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">টিকেট নম্বর</th>
                                    <th className="px-5 py-3.5">কাস্টমার ফোন</th>
                                    <th className="px-5 py-3.5">অর্ডার নং</th>
                                    <th className="px-5 py-3.5">অভিযোগের বিবরণ</th>
                                    <th className="px-5 py-3.5">ছবি</th>
                                    <th className="px-5 py-3.5">স্ট্যাটাস</th>
                                    <th className="px-5 py-3.5 text-right">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {complaints?.data?.length > 0 ? (
                                    complaints.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                                            {/* Ticket */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => openDetailsModal(c)}
                                                    className="font-mono font-bold text-emerald-700 hover:text-emerald-900 hover:underline block text-left"
                                                >
                                                    {c.ticket_number}
                                                </button>
                                                <span className="text-xs text-gray-400 block mt-0.5">
                                                    {new Date(c.created_at).toLocaleDateString('bn-BD', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </td>

                                            {/* Customer */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                                                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                                    <a href={`tel:${c.phone}`} className="hover:underline">
                                                        {c.phone}
                                                    </a>
                                                </div>
                                                {c.name && (
                                                    <span className="text-xs text-gray-500 block mt-0.5">
                                                        {c.name}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Order # */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                {c.order_number ? (
                                                    <Link
                                                        href={`/admin/orders?search=${c.order_number}`}
                                                        className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                    >
                                                        {c.order_number}
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </td>

                                            {/* Issue Details */}
                                            <td className="px-5 py-4 max-w-xs">
                                                <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                                                    {c.issue_details}
                                                </p>
                                                {c.admin_notes && (
                                                    <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium mt-1">
                                                        রিপ্লাই যুক্ত আছে
                                                    </span>
                                                )}
                                            </td>

                                            {/* Photos */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                {c.photos && c.photos.length > 0 ? (
                                                    <div className="flex items-center gap-1">
                                                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-xs font-semibold text-gray-700">
                                                            {c.photos.length} টি
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">নেই</span>
                                                )}
                                            </td>

                                            {/* Status Dropdown */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <select
                                                    value={c.status}
                                                    onChange={(e) => handleQuickStatusChange(c.id, e.target.value)}
                                                    className="text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-gray-300 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                                                >
                                                    <option value="pending">অপেক্ষারত (Pending)</option>
                                                    <option value="under_review">পর্যালোচনা (Under Review)</option>
                                                    <option value="resolved">সমাধান সম্পন্ন (Resolved)</option>
                                                    <option value="rejected">বাতিল (Rejected)</option>
                                                </select>
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => openDetailsModal(c)}
                                                    className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-700 hover:text-white rounded-lg text-xs font-bold text-gray-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>বিস্তারিত</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-5 py-12 text-center text-gray-500">
                                            কোন অভিযোগ পাওয়া যায়নি।
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {complaints?.links?.length > 3 && (
                        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                দেখানো হচ্ছে {complaints.from || 0} থেকে {complaints.to || 0} (মোট {complaints.total || 0})
                            </span>
                            <div className="flex gap-1">
                                {complaints.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                            link.active
                                                ? 'bg-emerald-700 text-white border-emerald-700'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        } ${!link.url ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Complaint Detail & Resolution Modal */}
            {modalOpen && selectedComplaint && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                                    <MessageSquareWarning className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">
                                        অভিযোগ টিকেট #{selectedComplaint.ticket_number}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        দাখিল: {new Date(selectedComplaint.created_at).toLocaleString('bn-BD')}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Scrollable Content */}
                        <div className="p-6 overflow-y-auto space-y-5 flex-1">
                            {/* Customer Meta */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-xl text-xs">
                                <div>
                                    <span className="text-gray-500 block">কাস্টমার ফোন:</span>
                                    <span className="font-bold text-gray-900">{selectedComplaint.phone}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">কাস্টমার নাম:</span>
                                    <span className="font-bold text-gray-900">{selectedComplaint.name || 'উল্লেখ নেই'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">অর্ডার আইডি:</span>
                                    <span className="font-bold text-gray-900">{selectedComplaint.order_number || 'উল্লেখ নেই'}</span>
                                </div>
                            </div>

                            {/* Issue Content */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                    অভিযোগের বিস্তারিত বিবরণ:
                                </label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                                    {selectedComplaint.issue_details}
                                </div>
                            </div>

                            {/* Attached Photos */}
                            {selectedComplaint.photos && selectedComplaint.photos.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                        সংযুক্ত ছবিসমূহ ({selectedComplaint.photos.length} টি):
                                    </label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                                        {selectedComplaint.photos.map((url, i) => (
                                            <a
                                                key={i}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="aspect-square rounded-lg border border-gray-200 overflow-hidden group relative block bg-gray-100"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Photo ${i + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resolution & Admin Note Form */}
                            <form id="resolveForm" onSubmit={handleSaveStatusAndNotes} className="space-y-4 pt-4 border-t border-gray-200">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        স্ট্যাটাস পরিবর্তন করুন:
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 font-semibold"
                                    >
                                        <option value="pending">অপেক্ষারত (Pending)</option>
                                        <option value="under_review">পর্যালোচনাধীন (Under Review)</option>
                                        <option value="resolved">সমাধান সম্পন্ন (Resolved)</option>
                                        <option value="rejected">বাতিল (Rejected)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        অ্যাডমিন মন্তব্য / গ্রাহককে সমাধানের উত্তর:
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="গ্রাহকের অভিযোগ সমাধানের পদক্ষেপ বা নোট লিখুন..."
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="notifyCustomer"
                                        checked={notifyCustomer}
                                        onChange={(e) => setNotifyCustomer(e.target.checked)}
                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <label htmlFor="notifyCustomer" className="text-xs text-gray-700 font-medium">
                                        গ্রাহকের মোবাইলে SMS নোটিফিকেশন প্রেরণ করুন
                                    </label>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                বন্ধ করুন
                            </button>
                            <button
                                type="submit"
                                form="resolveForm"
                                disabled={updating}
                                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>{updating ? 'আপডেট হচ্ছে...' : 'সংরক্ষণ ও আপডেট করুন'}</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
