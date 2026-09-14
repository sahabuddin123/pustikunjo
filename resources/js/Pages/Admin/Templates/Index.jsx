import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    MessageSquare,
    Mail,
    Save,
    RotateCcw,
    Send,
    Eye,
    Tag,
    Copy,
    Check,
    AlertCircle,
    CheckCircle2,
    Shield,
    ExternalLink,
    Smartphone,
    Inbox,
    Info,
    Sparkles,
    Hash
} from 'lucide-react';

export default function Index({
    smsTemplates = [],
    emailTemplates = [],
    sampleData = {},
    defaultTags = {},
    smsConfig = {},
    emailSmtp = {},
}) {
    const [activeChannel, setActiveChannel] = useState('sms'); // 'sms' or 'email'
    const [selectedTemplateId, setSelectedTemplateId] = useState(
        smsTemplates.length > 0 ? smsTemplates[0].id : null
    );

    const [copiedTag, setCopiedTag] = useState(null);
    const [testModalOpen, setTestModalOpen] = useState(false);
    const [testRecipient, setTestRecipient] = useState('');
    const [testing, setTesting] = useState(false);

    // List of templates for active channel
    const currentTemplates = activeChannel === 'sms' ? smsTemplates : emailTemplates;
    const selectedTemplate = currentTemplates.find(t => t.id === selectedTemplateId) || currentTemplates[0];

    // Form for editing the currently selected template
    const form = useForm({
        name: selectedTemplate?.name || '',
        subject: selectedTemplate?.subject || '',
        body: selectedTemplate?.body || '',
        is_active: selectedTemplate?.is_active ?? true,
        send_to_admin: selectedTemplate?.send_to_admin ?? false,
        admin_recipient: selectedTemplate?.admin_recipient || '',
    });

    // Update form when selected template changes
    const handleSelectTemplate = (template) => {
        setSelectedTemplateId(template.id);
        form.setData({
            name: template.name || '',
            subject: template.subject || '',
            body: template.body || '',
            is_active: template.is_active ?? true,
            send_to_admin: template.send_to_admin ?? false,
            admin_recipient: template.admin_recipient || '',
        });
    };

    // When switching channel
    const handleChannelChange = (channel) => {
        setActiveChannel(channel);
        const list = channel === 'sms' ? smsTemplates : emailTemplates;
        if (list.length > 0) {
            handleSelectTemplate(list[0]);
        }
    };

    // Save changes
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedTemplate) return;

        form.put(`/admin/templates/${selectedTemplate.id}`, {
            preserveScroll: true,
        });
    };

    // Reset to default
    const handleReset = () => {
        if (!selectedTemplate) return;
        if (confirm(`আপনি কি নিশ্চিত যে '${selectedTemplate.name}' টেমপ্লেটটি ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?`)) {
            router.post(`/admin/templates/${selectedTemplate.id}/reset`, {}, {
                preserveScroll: true,
                onSuccess: (page) => {
                    // Update current form data
                    const updatedList = activeChannel === 'sms' ? page.props.smsTemplates : page.props.emailTemplates;
                    const found = updatedList?.find(t => t.id === selectedTemplate.id);
                    if (found) {
                        form.setData({
                            name: found.name,
                            subject: found.subject || '',
                            body: found.body,
                            is_active: found.is_active,
                            send_to_admin: found.send_to_admin,
                            admin_recipient: found.admin_recipient || '',
                        });
                    }
                }
            });
        }
    };

    // Send Test Notification
    const handleSendTest = (e) => {
        e.preventDefault();
        if (!testRecipient) {
            alert('অনুগ্রহ করে টেস্ট প্রাপকের মোবাইল নম্বর বা ইমেইল লিখুন।');
            return;
        }

        setTesting(true);
        router.post('/admin/templates/test-send', {
            channel: selectedTemplate.channel,
            event_key: selectedTemplate.event_key,
            recipient: testRecipient,
            subject: form.data.subject,
            body: form.data.body,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setTesting(false);
                setTestModalOpen(false);
            }
        });
    };

    // Insert tag at cursor position or append to body
    const insertTag = (tag) => {
        const textarea = document.getElementById('template-body-textarea');
        if (!textarea) {
            form.setData('body', form.data.body + ' ' + tag);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = form.data.body;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);

        form.setData('body', before + tag + after);

        // Copy to clipboard notification
        setCopiedTag(tag);
        setTimeout(() => setCopiedTag(null), 2000);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length, start + tag.length);
        }, 50);
    };

    // Compute live preview text with mock replacements
    const computePreview = (rawText) => {
        if (!rawText) return '';
        let result = rawText;
        Object.entries(sampleData).forEach(([key, val]) => {
            result = result.split(key).join(val);
        });
        return result;
    };

    // SMS Character & Part Calculator
    const currentBody = form.data.body || '';
    const hasUnicode = /[^\u0020-\u007E]/.test(currentBody);
    const charCount = currentBody.length;
    const maxCharsPerSms = hasUnicode ? 70 : 160;
    const smsCount = charCount === 0 ? 1 : Math.ceil(charCount / (hasUnicode ? 67 : 153));

    return (
        <AdminLayout title="ডায়নামিক নোটিফিকেশন ও টেমপ্লেট হাব">
            <div className="space-y-6 w-full pb-16">
                {/* Header Banner */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                                    ডায়নামিক এসএমএস ও ইমেইল টেমপ্লেট
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    অর্ডার প্লেস, কুরিয়ার ট্র্যাকিং, ডেলিভারি ও ভেরিফিকেশনের জন্য ডায়নামিক ট্যাগযুক্ত মেসেজ কাস্টমাইজ করুন।
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/admin/sms"
                            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                            <span>এসএমএস গেটওয়ে</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                        <a
                            href="/admin/settings"
                            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                            <Mail className="w-3.5 h-3.5 text-indigo-700" />
                            <span>SMTP সেটিংস</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                    </div>
                </div>

                {/* Channel Switcher Tabs */}
                <div className="flex items-center gap-2 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => handleChannelChange('sms')}
                        className={`flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                            activeChannel === 'sms'
                                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50 rounded-t-xl'
                                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>এসএমএস টেমপ্লেট ({smsTemplates.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleChannelChange('email')}
                        className={`flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                            activeChannel === 'email'
                                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50 rounded-t-xl'
                                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                        }`}
                    >
                        <Mail className="w-4 h-4" />
                        <span>ইমেইল টেমপ্লেট ({emailTemplates.length})</span>
                    </button>
                </div>

                {/* Main Workspace Layout (Left List, Center Editor, Right Live Preview) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar: Events List */}
                    <div className="lg:col-span-4 space-y-2.5">
                        <div className="bg-white p-3 rounded-2xl border border-gray-200/90 shadow-xs space-y-1.5">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 px-3 py-1 block">
                                ইভেন্ট তালিকা ({activeChannel.toUpperCase()})
                            </span>

                            {currentTemplates.map((tpl) => {
                                const isSelected = selectedTemplate?.id === tpl.id;
                                return (
                                    <button
                                        key={tpl.id}
                                        type="button"
                                        onClick={() => handleSelectTemplate(tpl)}
                                        className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-2 cursor-pointer ${
                                            isSelected
                                                ? 'bg-emerald-700 text-white shadow-xs'
                                                : 'hover:bg-gray-100/80 text-gray-700'
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs sm:text-sm block truncate">
                                                    {tpl.name}
                                                </span>
                                            </div>
                                            <span className={`text-[11px] block truncate mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                                                {tpl.event_key}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className={`w-2 h-2 rounded-full ${tpl.is_active ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                                            {tpl.send_to_admin && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                    isSelected ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
                                                }`}>
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Available Tags Helper Card */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5 text-emerald-600" /> ক্লিক করে ট্যাগ বসান
                                </span>
                                {copiedTag && (
                                    <span className="text-[10px] text-emerald-600 font-bold animate-pulse">
                                        কপি হয়েছে!
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-gray-500">
                                নিচের যেকোনো ট্যাগে ক্লিক করলে তা স্বয়ংক্রিয়ভাবে মেসেজে যুক্ত হয়ে যাবে:
                            </p>
                            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                                {Object.entries(defaultTags).map(([tag, label]) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => insertTag(tag)}
                                        title={label}
                                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-100 hover:text-emerald-800 border border-gray-200 text-[11px] font-mono font-bold text-gray-700 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                        <span>{tag}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Template Editor */}
                    <div className="lg:col-span-5 space-y-5">
                        {selectedTemplate && (
                            <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                                    <div>
                                        <h2 className="font-extrabold text-base text-gray-900">
                                            {selectedTemplate.name}
                                        </h2>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {selectedTemplate.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <button
                                            type="button"
                                            onClick={() => setTestModalOpen(true)}
                                            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                            title="টেস্ট মেসেজ পাঠান"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>টেস্ট</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                            title="ডিফল্ট টেমপ্লেটে রিসেট করুন"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>রিসেট</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Controls: Active Toggle & Send to Admin */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                                    {/* Active Switch */}
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={form.data.is_active}
                                            onChange={(e) => form.setData('is_active', e.target.checked)}
                                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-gray-900 block">নোটিফিকেশন চালু রাখুন</span>
                                            <span className="text-[10px] text-gray-500 block">গ্রাহকের কাছে এই ইভেন্টে মেসেজ যাবে</span>
                                        </div>
                                    </label>

                                    {/* Send To Admin Checkbox */}
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={form.data.send_to_admin}
                                            onChange={(e) => form.setData('send_to_admin', e.target.checked)}
                                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-gray-900 block">এডমিন অ্যালার্ট পাঠান</span>
                                            <span className="text-[10px] text-gray-500 block">এডমিন নম্বর/ইমেইলেও নোটিফিকেশন যাবে</span>
                                        </div>
                                    </label>
                                </div>

                                {/* Email Subject Line (Only for Email templates) */}
                                {activeChannel === 'email' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1.5">
                                            ইমেইল সাবজেক্ট (Email Subject) *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.subject}
                                            onChange={(e) => form.setData('subject', e.target.value)}
                                            placeholder="ইমেইলের সাবজেক্ট লিখুন (যেমন: পুষ্টি কুঞ্জ অর্ডার {{order_number}})"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold focus:border-emerald-600"
                                        />
                                    </div>
                                )}

                                {/* Message Body Textarea */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-bold text-gray-700">
                                            {activeChannel === 'sms' ? 'এসএমএস কন্টেন্ট (SMS Body) *' : 'ইমেইল কন্টেন্ট (HTML/Text Body) *'}
                                        </label>

                                        {/* SMS Character Counter */}
                                        {activeChannel === 'sms' && (
                                            <div className="flex items-center gap-2 text-[11px] font-mono">
                                                <span className={`px-2 py-0.5 rounded-md font-bold ${
                                                    hasUnicode ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                                                }`}>
                                                    {hasUnicode ? 'Unicode (বাংলা)' : 'Text (English)'}
                                                </span>
                                                <span className="text-gray-500">
                                                    {charCount} বর্ণ / <strong>{smsCount} SMS</strong>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <textarea
                                        id="template-body-textarea"
                                        rows={activeChannel === 'sms' ? 5 : 9}
                                        value={form.data.body}
                                        onChange={(e) => form.setData('body', e.target.value)}
                                        placeholder="মেসেজের বডি লিখুন। ডায়নামিক ভ্যালুর জন্য ট্যাগ ব্যবহার করুন..."
                                        className="w-full p-3.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono text-gray-800 leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                    />
                                </div>

                                {/* Custom Admin Recipient (Optional) */}
                                {form.data.send_to_admin && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1">
                                            কাস্টম এডমিন প্রাপক ({activeChannel === 'sms' ? 'মোবাইল নম্বর' : 'ইমেইল'}) (ঐচ্ছিক)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.admin_recipient}
                                            onChange={(e) => form.setData('admin_recipient', e.target.value)}
                                            placeholder={activeChannel === 'sms' ? '017XXXXXXXX (খালি রাখলে সেটিংসের হেল্পলাইন নম্বর নেবে)' : 'admin@domain.com (খালি রাখলে জেনারেল ইমেইল নেবে)'}
                                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                        />
                                    </div>
                                )}

                                {/* Save Button */}
                                <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                                    <span className="text-[11px] text-gray-400">
                                        পরিবর্তন সাথে সাথে কার্যকর হবে।
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>সংরক্ষণ করুন</span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Right: Real-time Live Interactive Preview */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Eye className="w-4 h-4 text-emerald-700" />
                                <span className="text-xs font-bold text-gray-900">
                                    লাইভ প্রিভিউ (Customer View)
                                </span>
                            </div>

                            {activeChannel === 'sms' ? (
                                /* Mobile Phone Mockup for SMS */
                                <div className="rounded-2xl border border-gray-300 bg-gray-100 p-3 shadow-inner">
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 text-[10px] text-gray-400 font-bold">
                                        <span className="flex items-center gap-1">
                                            <Smartphone className="w-3 h-3" /> 8809601017199
                                        </span>
                                        <span>এখন</span>
                                    </div>

                                    <div className="mt-3">
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs text-xs text-gray-800 leading-relaxed border border-gray-200 break-words">
                                            {computePreview(form.data.body) || 'মেসেজ প্রিভিউ দেখতে টাইপ করুন...'}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Email Box Mockup for Email */
                                <div className="rounded-2xl border border-gray-300 bg-white overflow-hidden shadow-xs text-xs">
                                    <div className="bg-emerald-900 text-white p-3 text-center">
                                        <span className="font-extrabold text-sm block">পুষ্টি কুঞ্জ</span>
                                        <span className="text-[9px] text-emerald-200 block uppercase tracking-wider">১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য</span>
                                    </div>
                                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                                        <span className="font-bold text-gray-800 block text-[11px]">
                                            বিষয়: {computePreview(form.data.subject) || '(কোনো সাবজেক্ট নেই)'}
                                        </span>
                                    </div>
                                    <div
                                        className="p-3 text-[11px] text-gray-700 leading-relaxed max-h-72 overflow-y-auto"
                                        dangerouslySetInnerHTML={{ __html: computePreview(form.data.body) || '<p>ইমেইল প্রিভিউ...</p>' }}
                                    />
                                </div>
                            )}

                            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-800 flex items-start gap-2">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-700" />
                                <span>
                                    প্রিভিউতে ডামি ডেটা (যেমন রাকিবুল হাসান, PK-10025, ৳১,৫০০) দিয়ে ডায়নামিক ট্যাগগুলো টেস্ট করা হচ্ছে।
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test Send Modal */}
                {testModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                                    <Send className="w-4 h-4 text-sky-600" />
                                    <span>টেস্ট {activeChannel === 'sms' ? 'এসএমএস' : 'ইমেইল'} পাঠান</span>
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setTestModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSendTest} className="p-5 space-y-4">
                                <p className="text-xs text-gray-600">
                                    বর্তমান টেমপ্লেটটি স্যাম্পল ডেটাসহ আপনার দেওয়া ঠিকানায় সাথে সাথে টেস্ট পাঠানো হবে।
                                </p>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                                        প্রাপকের {activeChannel === 'sms' ? 'মোবাইল নম্বর' : 'ইমেইল অ্যাড্রেস'} *
                                    </label>
                                    <input
                                        type={activeChannel === 'sms' ? 'tel' : 'email'}
                                        required
                                        value={testRecipient}
                                        onChange={(e) => setTestRecipient(e.target.value)}
                                        placeholder={activeChannel === 'sms' ? '01XXXXXXXXX' : 'yourname@gmail.com'}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono focus:border-sky-600"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setTestModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                                    >
                                        বাতিল
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={testing}
                                        className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>{testing ? 'পাঠানো হচ্ছে...' : 'এখনই পাঠান'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
