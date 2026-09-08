import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Palette, Save, Layout, Sliders, Check, Plus, Trash2 } from 'lucide-react';

export default function Index({ theme = {}, header = {}, footer = {} }) {
    const [activeTab, setActiveTab] = useState('theme'); // theme, header, footer

    const themeForm = useForm({
        primary_color: theme.primary_color || '#0d6838',
        secondary_color: theme.secondary_color || '#f59e0b',
        accent_color: theme.accent_color || '#e11d48',
        font: theme.font || 'Hind Siliguri',
        button_radius: theme.button_radius || '0.5rem',
        container_width: theme.container_width || '1280px',
        logo_url: theme.logo_url || '',
        favicon_url: theme.favicon_url || '',
        custom_css: theme.custom_css || '',
    });

    const headerFooterForm = useForm({
        header: header,
        footer: footer,
    });

    const submitTheme = (e) => {
        e.preventDefault();
        themeForm.post('/admin/appearance/theme');
    };

    const submitHeaderFooter = (e) => {
        e.preventDefault();
        headerFooterForm.post('/admin/appearance/header-footer');
    };

    return (
        <AdminLayout title="অ্যাপিয়ারেন্স ও থিম সেটিংস (Appearance)">
            <div className="space-y-6 w-full">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-3">
                    <button
                        onClick={() => setActiveTab('theme')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'theme' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        🎨 থিম কাস্টমাইজার (Colors & Fonts)
                    </button>
                    <button
                        onClick={() => setActiveTab('header')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'header' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        📌 হেডার ও এনাউন্সমেন্ট বার
                    </button>
                    <button
                        onClick={() => setActiveTab('footer')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'footer' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        📄 ফুটার ও কপিরাইট
                    </button>
                </div>

                {/* Tab 1: Theme Customizer */}
                {activeTab === 'theme' && (
                    <form onSubmit={submitTheme} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6 animate-fade-in">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <h2 className="font-bold text-base text-gray-900">ব্র্যান্ড কালার ও টাইপোগ্রাফি</h2>
                            <button
                                type="submit"
                                disabled={themeForm.processing}
                                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                                <Save className="w-4 h-4" /> সংরক্ষণ করুন
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    প্রাইমারি কালার (Primary Brand Color)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={themeForm.data.primary_color}
                                        onChange={(e) => themeForm.setData('primary_color', e.target.value)}
                                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={themeForm.data.primary_color}
                                        onChange={(e) => themeForm.setData('primary_color', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    সেকেন্ডারি কালার (Secondary Color)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={themeForm.data.secondary_color}
                                        onChange={(e) => themeForm.setData('secondary_color', e.target.value)}
                                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={themeForm.data.secondary_color}
                                        onChange={(e) => themeForm.setData('secondary_color', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    একসেন্ট কালার (Accent Color)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={themeForm.data.accent_color}
                                        onChange={(e) => themeForm.setData('accent_color', e.target.value)}
                                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={themeForm.data.accent_color}
                                        onChange={(e) => themeForm.setData('accent_color', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    ডিফল্ট বাংলা ফন্ট
                                </label>
                                <select
                                    value={themeForm.data.font}
                                    onChange={(e) => themeForm.setData('font', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                >
                                    <option value="Li Ador Noirrit">Li Ador Noirrit / Le Ador (সুপারিশকৃত)</option>
                                    <option value="Hind Siliguri">Hind Siliguri</option>
                                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    বাটন রাউন্ডনেস (Button Radius)
                                </label>
                                <select
                                    value={themeForm.data.button_radius}
                                    onChange={(e) => themeForm.setData('button_radius', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                >
                                    <option value="0.375rem">মৃদু রাউন্ডেড (Rounded-md)</option>
                                    <option value="0.5rem">স্ট্যান্ডার্ড (Rounded-lg)</option>
                                    <option value="0.75rem">আধুনিক কার্ভড (Rounded-xl)</option>
                                    <option value="9999px">সম্পূর্ণ পিল (Pill)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                কাস্টম CSS (Custom CSS Box)
                            </label>
                            <textarea
                                rows={4}
                                placeholder="/* কাস্টম সিএসএস রুলস এখানে লিখুন */"
                                value={themeForm.data.custom_css}
                                onChange={(e) => themeForm.setData('custom_css', e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 text-xs font-mono"
                            />
                        </div>
                    </form>
                )}

                {/* Tab 2: Header Configuration */}
                {activeTab === 'header' && (
                    <form onSubmit={submitHeaderFooter} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6 animate-fade-in">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <h2 className="font-bold text-base text-gray-900">হেডার ও এনাউন্সমেন্ট বার সেটিংস</h2>
                            <button
                                type="submit"
                                disabled={headerFooterForm.processing}
                                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                                <Save className="w-4 h-4" /> সংরক্ষণ করুন
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={headerFooterForm.data.header?.announcement_bar?.enabled}
                                    onChange={(e) => {
                                        const updated = { ...headerFooterForm.data.header };
                                        updated.announcement_bar.enabled = e.target.checked;
                                        headerFooterForm.setData('header', updated);
                                    }}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>টপ এনাউন্সমেন্ট বার চালু রাখুন (Announcement Bar)</span>
                            </label>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    এনাউন্সমেন্ট টেক্সট
                                </label>
                                <input
                                    type="text"
                                    value={headerFooterForm.data.header?.announcement_bar?.text || ''}
                                    onChange={(e) => {
                                        const updated = { ...headerFooterForm.data.header };
                                        updated.announcement_bar.text = e.target.value;
                                        headerFooterForm.setData('header', updated);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    হটলাইন ফোন নম্বর
                                </label>
                                <input
                                    type="text"
                                    value={headerFooterForm.data.header?.hotline_phone || ''}
                                    onChange={(e) => {
                                        const updated = { ...headerFooterForm.data.header };
                                        updated.hotline_phone = e.target.value;
                                        headerFooterForm.setData('header', updated);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                />
                            </div>

                            {/* Mobile Drawer Title */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    মোবাইল ড্রয়ার টাইটেল (Mobile Drawer Title)
                                </label>
                                <input
                                    type="text"
                                    value={headerFooterForm.data.header?.mobile_drawer_title || 'All Products (সকল পণ্য)'}
                                    onChange={(e) => {
                                        const updated = { ...headerFooterForm.data.header };
                                        updated.mobile_drawer_title = e.target.value;
                                        headerFooterForm.setData('header', updated);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                    placeholder="All Products (সকল পণ্য)"
                                />
                            </div>

                            {/* Header & Drawer Menu Items Repeater */}
                            <div className="pt-2 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-700 block">
                                        ন্যাভিগেশন মেনু লিংকসমূহ (Menu Items)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = { ...headerFooterForm.data.header };
                                            const items = [...(updated.menu_items || [])];
                                            items.push({ label: 'নতুন মেনু', url: '/shop' });
                                            updated.menu_items = items;
                                            headerFooterForm.setData('header', updated);
                                        }}
                                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> আইটেম যোগ করুন
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {(headerFooterForm.data.header?.menu_items || []).map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={item.label}
                                                onChange={(e) => {
                                                    const updated = { ...headerFooterForm.data.header };
                                                    updated.menu_items[idx].label = e.target.value;
                                                    headerFooterForm.setData('header', updated);
                                                }}
                                                placeholder="মেনু নাম (যেমন: হোম)"
                                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                                            />
                                            <input
                                                type="text"
                                                value={item.url}
                                                onChange={(e) => {
                                                    const updated = { ...headerFooterForm.data.header };
                                                    updated.menu_items[idx].url = e.target.value;
                                                    headerFooterForm.setData('header', updated);
                                                }}
                                                placeholder="URL (যেমন: /shop)"
                                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = { ...headerFooterForm.data.header };
                                                    updated.menu_items = updated.menu_items.filter((_, i) => i !== idx);
                                                    headerFooterForm.setData('header', updated);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                                title="মুছে ফেলুন"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* Tab 3: Footer Configuration */}
                {activeTab === 'footer' && (
                    <form onSubmit={submitHeaderFooter} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6 animate-fade-in">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <h2 className="font-bold text-base text-gray-900">ফুটার কনফিগারেশন</h2>
                            <button
                                type="submit"
                                disabled={headerFooterForm.processing}
                                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                                <Save className="w-4 h-4" /> সংরক্ষণ করুন
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    ফুটার এবাউট টেক্সট
                                </label>
                                <textarea
                                    rows={3}
                                    value={headerFooterForm.data.footer?.about_text || ''}
                                    onChange={(e) => {
                                        const updated = { ...headerFooterForm.data.footer };
                                        updated.about_text = e.target.value;
                                        headerFooterForm.setData('footer', updated);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    কপিরাইট বার টেক্সট
                                </label>
                                <input
                                    type="text"
                                    value={headerFooterForm.data.footer?.copyright_text || ''}
                                    onChange={(e) => {
                                        const updated = { ...headerFooterForm.data.footer };
                                        updated.copyright_text = e.target.value;
                                        headerFooterForm.setData('footer', updated);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                                />
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
