import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { TrendingUp, Save, ExternalLink, Copy, Check, ShieldCheck, Tag } from 'lucide-react';

export default function Index({ integrations = {}, events = [], catalogFeedUrl = '' }) {
    const [copiedFeed, setCopiedFeed] = useState(false);

    const intForm = useForm({
        integrations: integrations,
    });

    const eventForm = useForm({
        events: events,
    });

    const submitIntegrations = (e) => {
        e.preventDefault();
        intForm.post('/admin/marketing/integrations');
    };

    const submitEvents = (e) => {
        e.preventDefault();
        eventForm.post('/admin/marketing/events');
    };

    const copyFeedUrl = () => {
        navigator.clipboard.writeText(catalogFeedUrl);
        setCopiedFeed(true);
        setTimeout(() => setCopiedFeed(false), 2000);
    };

    return (
        <AdminLayout title="মার্কেটিং ও ট্র্যাকিং ইন্টিগ্রেশন (Marketing)">
            <div className="space-y-8 w-full">
                {/* Meta Commerce Catalog Feed Card */}
                <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 rounded-2xl shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-emerald-300" />
                            <h2 className="font-bold text-base">Meta / Facebook Commerce Catalog Feed (CSV)</h2>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-700/80 border border-emerald-500">
                            Auto Updated
                        </span>
                    </div>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                        ফেসবুক কমার্স ম্যানেজারে স্বয়ংক্রিয় প্রোডাক্ট ক্যাটালগ সিঙ্কের জন্য নিচের CSV ফিড ইউআরএল ব্যবহার করুন। পিক্সেলের <code className="bg-emerald-950 px-1 py-0.5 rounded font-mono">content_ids</code> এবং ক্যাটালগের <code className="bg-emerald-950 px-1 py-0.5 rounded font-mono">id</code> শতভাগ ম্যাচ করা আছে।
                    </p>

                    <div className="flex items-center gap-2 bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-700">
                        <span className="text-xs font-mono text-emerald-200 flex-1 truncate">{catalogFeedUrl}</span>
                        <button
                            type="button"
                            onClick={copyFeedUrl}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                        >
                            {copiedFeed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedFeed ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
                        </button>
                    </div>
                </div>

                {/* Third-party Analytics Pixels Config */}
                <form onSubmit={submitIntegrations} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                        <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-700" /> ট্র্যাকিং পিক্সেল ও ট্যাগ ম্যানেজার
                        </h2>
                        <button
                            type="submit"
                            disabled={intForm.processing}
                            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                            <Save className="w-4 h-4" /> সংরক্ষণ করুন
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Meta Pixel */}
                        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={intForm.data.integrations?.fb_pixel_enabled}
                                    onChange={(e) => {
                                        const updated = { ...intForm.data.integrations, fb_pixel_enabled: e.target.checked };
                                        intForm.setData('integrations', updated);
                                    }}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>Meta / Facebook Pixel সক্রিয় করুন</span>
                            </label>
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">Pixel ID</label>
                                <input
                                    type="text"
                                    placeholder="যেমন: 123456789012345"
                                    value={intForm.data.integrations?.fb_pixel_id || ''}
                                    onChange={(e) => {
                                        const updated = { ...intForm.data.integrations, fb_pixel_id: e.target.value };
                                        intForm.setData('integrations', updated);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                                />
                            </div>
                        </div>

                        {/* Google Analytics 4 */}
                        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={intForm.data.integrations?.ga4_enabled}
                                    onChange={(e) => {
                                        const updated = { ...intForm.data.integrations, ga4_enabled: e.target.checked };
                                        intForm.setData('integrations', updated);
                                    }}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>Google Analytics 4 (GA4) সক্রিয় করুন</span>
                            </label>
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">Measurement ID</label>
                                <input
                                    type="text"
                                    placeholder="যেমন: G-XXXXXXXXXX"
                                    value={intForm.data.integrations?.ga4_measurement_id || ''}
                                    onChange={(e) => {
                                        const updated = { ...intForm.data.integrations, ga4_measurement_id: e.target.value };
                                        intForm.setData('integrations', updated);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                                />
                            </div>
                        </div>

                        {/* Google Tag Manager */}
                        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={intForm.data.integrations?.gtm_enabled}
                                    onChange={(e) => {
                                        const updated = { ...intForm.data.integrations, gtm_enabled: e.target.checked };
                                        intForm.setData('integrations', updated);
                                    }}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>Google Tag Manager (GTM) সক্রিয় করুন</span>
                            </label>
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">GTM Container ID</label>
                                <input
                                    type="text"
                                    placeholder="যেমন: GTM-XXXXXXX"
                                    value={intForm.data.integrations?.gtm_container_id || ''}
                                    onChange={(e) => {
                                        const updated = { ...intForm.data.integrations, gtm_container_id: e.target.value };
                                        intForm.setData('integrations', updated);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                                />
                            </div>
                        </div>

                        {/* TikTok Pixel */}
                        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={intForm.data.integrations?.tiktok_pixel_enabled}
                                    onChange={(e) => {
                                        const updated = { ...intForm.data.integrations, tiktok_pixel_enabled: e.target.checked };
                                        intForm.setData('integrations', updated);
                                    }}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>TikTok Pixel (Future Ready)</span>
                            </label>
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">TikTok Pixel ID</label>
                                <input
                                    type="text"
                                    placeholder="TikTok Pixel ID"
                                    value={intForm.data.integrations?.tiktok_pixel_id || ''}
                                    onChange={(e) => {
                                        const updated = { ...intForm.data.integrations, tiktok_pixel_id: e.target.value };
                                        intForm.setData('integrations', updated);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Event Manager Table */}
                <form onSubmit={submitEvents} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                        <h2 className="font-bold text-base text-gray-900">ইভেন্ট ম্যানেজার (Event Tracking Matrix)</h2>
                        <button
                            type="submit"
                            disabled={eventForm.processing}
                            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                            <Save className="w-4 h-4" /> ইভেন্ট সংরক্ষণ
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-[11px]">
                                <tr>
                                    <th className="py-3 px-4">ইভেন্টের নাম</th>
                                    <th className="py-3 px-4">GA4 ট্র্যাকিং</th>
                                    <th className="py-3 px-4">Meta Pixel ইভেন্ট</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {eventForm.data.events?.map((ev, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="py-3 px-4 font-bold text-gray-900">
                                            {ev.label || ev.name}
                                            <span className="text-xs text-gray-400 font-mono block">{ev.name}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="checkbox"
                                                checked={ev.ga4}
                                                onChange={(e) => {
                                                    const updated = [...eventForm.data.events];
                                                    updated[idx].ga4 = e.target.checked;
                                                    eventForm.setData('events', updated);
                                                }}
                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </td>
                                        <td className="py-3 px-4 font-mono font-semibold text-emerald-800">
                                            {ev.pixel}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
