import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ImagePickerField from '@/Components/Admin/ImagePickerField';
import {
    Settings,
    Save,
    Plus,
    Trash2,
    ShieldCheck,
    CreditCard,
    Truck,
    Phone,
    Globe,
    Palette,
    Search,
    Send,
    Mail,
    MessageSquare,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    ExternalLink
} from 'lucide-react';

export default function Index({
    general = {},
    appearance = {},
    seo = {},
    contact = {},
    shippingZones = [],
    courierSteadfast = {},
    fraudSettings = {},
    sms = {},
    paymentBkash = {},
    emailSmtp = {},
    blacklistCount = 0
}) {
    const [activeTab, setActiveTab] = useState('general'); // general, appearance, seo, courier, fraud, sms, payment, smtp, shipping, contact

    // Form data with all settings groups
    const form = useForm({
        general: {
            site_name: general?.site_name || 'Pusti Kunjo',
            tagline: general?.tagline || 'Purity Begins here',
            email: general?.email || 'info@pustikunjo.com.bd',
            logo: general?.logo || '',
            favicon: general?.favicon || '',
            currency: general?.currency || 'BDT',
            currency_symbol: general?.currency_symbol || '৳',
            timezone: general?.timezone || 'Asia/Dhaka',
        },
        appearance: {
            primary_color: appearance?.primary_color || '#0d6838',
            primary_hover: appearance?.primary_hover || '#0a522c',
            accent_color: appearance?.accent_color || '#f59e0b',
            light_bg: appearance?.light_bg || '#f0fdf4',
        },
        seo: {
            meta_title: seo?.meta_title || 'পুষ্টি কুঞ্জ | ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য',
            meta_description: seo?.meta_description || '১০০% প্রাকৃতিক ও অর্গানিক পুষ্টি পণ্যের বিশ্বস্ত প্রতিষ্ঠান।',
            meta_keywords: seo?.meta_keywords || 'পুষ্টি কুঞ্জ, অর্গানিক ফুড, চিয়া সিড, বিটরুট পাউডার, ঘি',
            og_image: seo?.og_image || '',
            facebook_pixel_id: seo?.facebook_pixel_id || '',
            google_tag_manager_id: seo?.google_tag_manager_id || '',
        },
        contact: {
            phone: contact?.phone || '01700-000000',
            whatsapp: contact?.whatsapp || '01700000000',
            email: contact?.email || 'info@pustikunjo.com.bd',
            address: contact?.address || 'ঢাকা, বাংলাদেশ',
            hotline_hours: contact?.hotline_hours || 'সকাল ৯টা - রাত ১০টা',
        },
        shippingZones: shippingZones || [
            { name: 'ঢাকার ভিতরে', fee: 60 },
            { name: 'ঢাকার বাইরে', fee: 120 },
        ],
        courierSteadfast: {
            enabled: courierSteadfast?.enabled !== undefined ? courierSteadfast.enabled : true,
            api_key: courierSteadfast?.api_key || '',
            secret_key: courierSteadfast?.secret_key || '',
            base_url: courierSteadfast?.base_url || 'https://portal.steadfast.com.bd/api/v1',
            auto_sync: courierSteadfast?.auto_sync !== undefined ? courierSteadfast.auto_sync : true,
            default_note: courierSteadfast?.default_note || 'পুষ্টি কুঞ্জ অর্গানিক পণ্য — হ্যান্ডেল উইথ কেয়ার',
        },
        fraudSettings: {
            auto_check_enabled: fraudSettings?.auto_check_enabled !== undefined ? fraudSettings.auto_check_enabled : true,
            high_risk_threshold_cancels: fraudSettings?.high_risk_threshold_cancels || 2,
            medium_risk_threshold_cancels: fraudSettings?.medium_risk_threshold_cancels || 1,
        },
        sms: {
            provider: sms?.provider || 'ssl_wireless',
            api_key: sms?.api_key || '',
            sender_id: sms?.sender_id || '',
            client_id: sms?.client_id || '',
        },
        paymentBkash: {
            cod_enabled: paymentBkash?.cod_enabled !== undefined ? paymentBkash.cod_enabled : true,
            manual_enabled: paymentBkash?.manual_enabled !== undefined ? paymentBkash.manual_enabled : true,
            manual_type: paymentBkash?.manual_type || 'merchant',
            manual_number: paymentBkash?.manual_number || '01700000000',
            manual_instructions: paymentBkash?.manual_instructions || 'অর্ডার কনফার্ম করতে {amount} টাকা {number} নম্বরে সেন্ড মানি করুন।',
            pgw_enabled: paymentBkash?.pgw_enabled || false,
            pgw_mode: paymentBkash?.pgw_mode || 'sandbox',
            pgw_app_key: paymentBkash?.pgw_app_key || '',
            pgw_app_secret: paymentBkash?.pgw_app_secret || '',
            pgw_username: paymentBkash?.pgw_username || '',
            pgw_password: paymentBkash?.pgw_password || '',
        },
        emailSmtp: {
            mailer: emailSmtp?.mailer || 'smtp',
            host: emailSmtp?.host || 'smtp.gmail.com',
            port: emailSmtp?.port || '587',
            username: emailSmtp?.username || '',
            password: emailSmtp?.password || '',
            encryption: emailSmtp?.encryption || 'tls',
            from_address: emailSmtp?.from_address || 'info@pustikunjo.com.bd',
            from_name: emailSmtp?.from_name || 'পুষ্টি কুঞ্জ (Pusti Kunjo)',
        }
    });

    // Test states
    const [testEmail, setTestEmail] = useState('');
    const [testPhone, setTestPhone] = useState('');
    const [testingCourier, setTestingCourier] = useState(false);
    const [testingSmtp, setTestingSmtp] = useState(false);
    const [testingSms, setTestingSms] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/admin/settings', {
            preserveScroll: true,
        });
    };

    const handleTestCourier = () => {
        setTestingCourier(true);
        router.post('/admin/settings/test-courier', {}, {
            preserveScroll: true,
            onFinish: () => setTestingCourier(false),
        });
    };

    const handleTestSmtp = () => {
        if (!testEmail) {
            alert('অনুগ্রহ করে টেস্ট ইমেইল ঠিকানা লিখুন');
            return;
        }
        setTestingSmtp(true);
        router.post('/admin/settings/test-smtp', { test_email: testEmail }, {
            preserveScroll: true,
            onFinish: () => setTestingSmtp(false),
        });
    };

    const handleTestSms = () => {
        if (!testPhone) {
            alert('অনুগ্রহ করে টেস্ট মোবাইল নম্বর লিখুন');
            return;
        }
        setTestingSms(true);
        router.post('/admin/settings/test-sms', { test_phone: testPhone }, {
            preserveScroll: true,
            onFinish: () => setTestingSms(false),
        });
    };

    // Shipping helpers
    const addShippingZone = () => {
        form.setData('shippingZones', [
            ...form.data.shippingZones,
            { name: 'নতুন জোন', fee: 100 }
        ]);
    };

    const removeShippingZone = (index) => {
        form.setData('shippingZones', form.data.shippingZones.filter((_, i) => i !== index));
    };

    const updateZone = (index, field, value) => {
        const updated = [...form.data.shippingZones];
        updated[index][field] = value;
        form.setData('shippingZones', updated);
    };

    const tabs = [
        { id: 'general', label: 'সাধারণ ও ব্র্যান্ডিং', icon: Globe },
        { id: 'appearance', label: 'কালার ও থিম', icon: Palette },
        { id: 'seo', label: 'এসইও ও মেটা', icon: Search },
        { id: 'courier', label: 'স্টেডফাস্ট কুরিয়ার API', icon: Truck },
        { id: 'fraud', label: 'ফ্রড চেকার সেটিংস', icon: ShieldCheck },
        { id: 'sms', label: 'এসএমএস গেটওয়ে', icon: MessageSquare },
        { id: 'payment', label: 'বিকাশ ও পেমেন্ট', icon: CreditCard },
        { id: 'smtp', label: 'ইমেইল ও SMTP', icon: Mail },
        { id: 'shipping', label: 'ডেলিভারি জোন', icon: Truck },
        { id: 'contact', label: 'যোগাযোগ তথ্য', icon: Phone },
    ];

    return (
        <AdminLayout title="গ্লোবাল সেটিংস হাব (Global System Settings)">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl pb-16">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <Settings className="w-6 h-6 text-emerald-700" />
                            <span>গ্লোবাল সাইট সেটিংস</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            লোগো, এসইও, কালার থিম, স্টেডফাস্ট কুরিয়ার, ফ্রড ডিটেকশন ও পেমেন্ট এপিআই কনফিগার করুন
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{form.processing ? 'সংরক্ষণ হচ্ছে...' : 'সব পরিবর্তন সংরক্ষণ করুন'}</span>
                    </button>
                </div>

                {/* Tab Navigation Wrapping Pill Bar */}
                <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200/80 shadow-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-emerald-700 text-white shadow-xs'
                                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-emerald-50/50 hover:border-emerald-200 hover:text-emerald-900'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                                    <span className="whitespace-nowrap">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ======================================================== */}
                {/* TAB 1: General & Branding */}
                {/* ======================================================== */}
                {activeTab === 'general' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                        <div className="border-b border-gray-100 pb-3">
                            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-700" /> সাধারণ ব্র্যান্ডিং ও সাইট পরিচয়
                            </h2>
                            <p className="text-xs text-gray-500">সাইটের নাম, ট্যাগলাইন এবং মিডিয়া লাইব্রেরি থেকে লোগো ও ফেভিকন নির্বাচন করুন।</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">সাইটের নাম (Site Name) *</label>
                                <input
                                    type="text"
                                    value={form.data.general.site_name}
                                    onChange={(e) => form.setData('general', { ...form.data.general, site_name: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">ট্যাগলাইন (Tagline)</label>
                                <input
                                    type="text"
                                    value={form.data.general.tagline}
                                    onChange={(e) => form.setData('general', { ...form.data.general, tagline: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:border-emerald-600"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <ImagePickerField
                                    label="সাইট লোগো (Site Logo)"
                                    value={form.data.general.logo}
                                    onChange={(url) => form.setData('general', { ...form.data.general, logo: url })}
                                    placeholder="লোগো ইমেজ লিঙ্ক অথবা মিডিয়া লাইব্রেরি থেকে আপলোড বা নির্বাচন করুন"
                                    helperText="সুপারিশকৃত সাইজ: 300x80 px (PNG or SVG with transparent background)"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <ImagePickerField
                                    label="সাইট ফেভিকন (Favicon)"
                                    value={form.data.general.favicon}
                                    onChange={(url) => form.setData('general', { ...form.data.general, favicon: url })}
                                    placeholder="ফেভিকন ইমেজ লিঙ্ক অথবা মিডিয়া লাইব্রেরি থেকে আপলোড করুন"
                                    helperText="সুপারিশকৃত সাইজ: 64x64 বা 32x32 px (PNG or ICO)"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">অফিশিয়াল ইমেইল</label>
                                <input
                                    type="email"
                                    value={form.data.general.email}
                                    onChange={(e) => form.setData('general', { ...form.data.general, email: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">কারেন্সি কোড ও সিম্বল</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        value={form.data.general.currency}
                                        onChange={(e) => form.setData('general', { ...form.data.general, currency: e.target.value })}
                                        placeholder="BDT"
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm uppercase"
                                    />
                                    <input
                                        type="text"
                                        value={form.data.general.currency_symbol}
                                        onChange={(e) => form.setData('general', { ...form.data.general, currency_symbol: e.target.value })}
                                        placeholder="৳"
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-bold text-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 2: Colors & Appearance */}
                {/* ======================================================== */}
                {activeTab === 'appearance' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                        <div className="border-b border-gray-100 pb-3">
                            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-emerald-700" /> সাইট কালার প্যালেট ও থিম
                            </h2>
                            <p className="text-xs text-gray-500">কালার পিকার অথবা হেক্স কোড লিখে স্টোরফ্রন্টের মূল রং নির্ধারণ করুন।</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {/* Primary Color */}
                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                                <label className="text-xs font-bold text-gray-800 block">Primary Color (মূল রং)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={form.data.appearance.primary_color}
                                        onChange={(e) => form.setData('appearance', { ...form.data.appearance, primary_color: e.target.value })}
                                        className="w-12 h-12 rounded-xl border border-gray-300 p-0.5 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={form.data.appearance.primary_color}
                                        onChange={(e) => form.setData('appearance', { ...form.data.appearance, primary_color: e.target.value })}
                                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono uppercase font-bold"
                                    />
                                </div>
                            </div>

                            {/* Primary Hover */}
                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                                <label className="text-xs font-bold text-gray-800 block">Primary Hover (হোভার রং)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={form.data.appearance.primary_hover}
                                        onChange={(e) => form.setData('appearance', { ...form.data.appearance, primary_hover: e.target.value })}
                                        className="w-12 h-12 rounded-xl border border-gray-300 p-0.5 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={form.data.appearance.primary_hover}
                                        onChange={(e) => form.setData('appearance', { ...form.data.appearance, primary_hover: e.target.value })}
                                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono uppercase font-bold"
                                    />
                                </div>
                            </div>

                            {/* Accent Color */}
                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                                <label className="text-xs font-bold text-gray-800 block">Accent Color (হাইলাইট/অফার)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={form.data.appearance.accent_color}
                                        onChange={(e) => form.setData('appearance', { ...form.data.appearance, accent_color: e.target.value })}
                                        className="w-12 h-12 rounded-xl border border-gray-300 p-0.5 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={form.data.appearance.accent_color}
                                        onChange={(e) => form.setData('appearance', { ...form.data.appearance, accent_color: e.target.value })}
                                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono uppercase font-bold"
                                    />
                                </div>
                            </div>

                            {/* Light Background */}
                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                                <label className="text-xs font-bold text-gray-800 block">Light Background (হালকা ব্যাকগ্রাউন্ড)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={form.data.appearance.light_bg}
                                        onChange={(e) => form.setData('appearance', { ...form.data.appearance, light_bg: e.target.value })}
                                        className="w-12 h-12 rounded-xl border border-gray-300 p-0.5 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={form.data.appearance.light_bg}
                                        onChange={(e) => form.setData('appearance', { ...form.data.appearance, light_bg: e.target.value })}
                                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono uppercase font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Visual Live Preview Swatch */}
                        <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
                            <span className="text-xs font-bold text-gray-700 block">লাইভ প্রিভিউ ডেমো:</span>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    style={{ backgroundColor: form.data.appearance.primary_color }}
                                    className="px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs cursor-default"
                                >
                                    Primary Button
                                </button>
                                <button
                                    type="button"
                                    style={{ backgroundColor: form.data.appearance.accent_color }}
                                    className="px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs cursor-default"
                                >
                                    Accent Badge
                                </button>
                                <div
                                    style={{ backgroundColor: form.data.appearance.light_bg, borderColor: form.data.appearance.primary_color }}
                                    className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-800"
                                >
                                    Light Container Card
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 3: SEO & Meta */}
                {/* ======================================================== */}
                {activeTab === 'seo' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                        <div className="border-b border-gray-100 pb-3">
                            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                <Search className="w-5 h-5 text-emerald-700" /> সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO) ও মেটা
                            </h2>
                            <p className="text-xs text-gray-500">গুগল সার্চ ও ফেসবুক শেয়ারের জন্য মেটা ট্যাগ ও সোশ্যাল ব্যানার সেট করুন।</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">মেটা টাইটেল (Meta Title)</label>
                                <input
                                    type="text"
                                    value={form.data.seo.meta_title}
                                    onChange={(e) => form.setData('seo', { ...form.data.seo, meta_title: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:border-emerald-600"
                                />
                                <span className="text-[11px] text-gray-400 mt-0.5 block">সর্বোচ্চ ৬০-৭০ অক্ষরের মধ্যে রাখা ভালো</span>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">মেটা ডেসক্রিপশন (Meta Description)</label>
                                <textarea
                                    rows={3}
                                    value={form.data.seo.meta_description}
                                    onChange={(e) => form.setData('seo', { ...form.data.seo, meta_description: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:border-emerald-600"
                                />
                                <span className="text-[11px] text-gray-400 mt-0.5 block">সর্বোচ্চ ১৫০-১৬০ অক্ষরের মধ্যে রাখা ভালো</span>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">মেটা কি-ওয়ার্ডস (Keywords - কমা দিয়ে লিখুন)</label>
                                <input
                                    type="text"
                                    value={form.data.seo.meta_keywords}
                                    onChange={(e) => form.setData('seo', { ...form.data.seo, meta_keywords: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm"
                                />
                            </div>

                            <div>
                                <ImagePickerField
                                    label="সোশ্যাল শেয়ার ইমেজ (Open Graph / Facebook Share Image)"
                                    value={form.data.seo.og_image}
                                    onChange={(url) => form.setData('seo', { ...form.data.seo, og_image: url })}
                                    placeholder="ফেসবুক বা সোশ্যাল মিডিয়াতে লিংক শেয়ার করলে যে ছবি শো করবে"
                                    helperText="সুপারিশকৃত সাইজ: 1200x630 px"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Facebook Pixel ID</label>
                                    <input
                                        type="text"
                                        value={form.data.seo.facebook_pixel_id}
                                        onChange={(e) => form.setData('seo', { ...form.data.seo, facebook_pixel_id: e.target.value })}
                                        placeholder="যেমন: 123456789012345"
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Google Tag Manager / Analytics ID</label>
                                    <input
                                        type="text"
                                        value={form.data.seo.google_tag_manager_id}
                                        onChange={(e) => form.setData('seo', { ...form.data.seo, google_tag_manager_id: e.target.value })}
                                        placeholder="যেমন: G-XXXXXXXXXX বা GTM-XXXXXXX"
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 4: Steadfast Courier API */}
                {/* ======================================================== */}
                {activeTab === 'courier' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-emerald-700" /> স্টেডফাস্ট কুরিয়ার API কনফিগারেশন (Steadfast Courier)
                                </h2>
                                <p className="text-xs text-gray-500">অর্ডার ডিটেইলস পেজ থেকে ১-ক্লিকে সরাসরি স্টেডফাস্টে পার্সেল বুকিং ও ট্র্যাকিংয়ের জন্য।</p>
                            </div>

                            <button
                                type="button"
                                onClick={handleTestCourier}
                                disabled={testingCourier}
                                className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${testingCourier ? 'animate-spin' : ''}`} />
                                <span>{testingCourier ? 'পরীক্ষা চলছে...' : 'API কানেকশন টেস্ট'}</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-950 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.courierSteadfast.enabled}
                                        onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, enabled: e.target.checked })}
                                        className="rounded text-emerald-700 focus:ring-emerald-600"
                                    />
                                    <span>স্টেডফাস্ট কুরিয়ার ইন্টিগ্রেশন সক্রিয় রাখুন</span>
                                </label>
                                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-700 text-white">Steadfast API v1</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">API Key *</label>
                                    <input
                                        type="text"
                                        value={form.data.courierSteadfast.api_key}
                                        onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, api_key: e.target.value })}
                                        placeholder="স্টেডফাস্ট পোর্টাল থেকে প্রাপ্ত API Key"
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Secret Key *</label>
                                    <input
                                        type="password"
                                        value={form.data.courierSteadfast.secret_key}
                                        onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, secret_key: e.target.value })}
                                        placeholder="স্টেডফাস্ট পোর্টাল থেকে প্রাপ্ত Secret Key"
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Base Endpoint URL</label>
                                    <input
                                        type="text"
                                        value={form.data.courierSteadfast.base_url}
                                        onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, base_url: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">ডিফল্ট নোট (Default Delivery Note)</label>
                                    <input
                                        type="text"
                                        value={form.data.courierSteadfast.default_note}
                                        onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, default_note: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.courierSteadfast.auto_sync}
                                        onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, auto_sync: e.target.checked })}
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span>অটো স্ট্যাটাস সিঙ্ক সক্রিয় রাখুন (Auto-sync delivery status)</span>
                                </label>
                                <span className="text-[11px] text-gray-500">স্টেডফাস্ট ট্র্যাকিং: https://steadfast.com.bd/t/[code]</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 5: Fraud Checker Settings */}
                {/* ======================================================== */}
                {activeTab === 'fraud' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-700" /> ফ্রড চেকার সেটিংস (Fraud Detection System)
                                </h2>
                                <p className="text-xs text-gray-500">অর্ডার আসার সাথে সাথে গ্রাহকের হিস্ট্রি স্ক্যান করে ঝুঁকি ও ক্যান্সেলেশন রেট নির্ণয়।</p>
                            </div>

                            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black">
                                বর্তমানে ব্ল্যাকলিস্টেড: {blacklistCount} টি নম্বর
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-950 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.fraudSettings.auto_check_enabled}
                                        onChange={(e) => form.setData('fraudSettings', { ...form.data.fraudSettings, auto_check_enabled: e.target.checked })}
                                        className="rounded text-emerald-700 focus:ring-emerald-600"
                                    />
                                    <span>অর্ডার পেজে স্বয়ংক্রিয় ফ্রড রিস্ক চেকার সক্রিয় রাখুন (Auto Fraud Check)</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                                    <label className="text-xs font-bold text-amber-900 block">
                                        মাঝারি ঝুঁকি থ্রেশহোল্ড (Medium Risk Threshold)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={form.data.fraudSettings.medium_risk_threshold_cancels}
                                            onChange={(e) => form.setData('fraudSettings', { ...form.data.fraudSettings, medium_risk_threshold_cancels: Number(e.target.value) })}
                                            className="w-24 px-3 py-2 rounded-xl border border-amber-300 text-sm font-bold text-center"
                                        />
                                        <span className="text-xs text-amber-800">টি অর্ডার বাতিল/রিটার্ন থাকলে মাঝারি ঝুঁকি চিহ্নিত হবে</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
                                    <label className="text-xs font-bold text-rose-900 block">
                                        উচ্চ ঝুঁকি থ্রেশহোল্ড (High Risk Threshold)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={form.data.fraudSettings.high_risk_threshold_cancels}
                                            onChange={(e) => form.setData('fraudSettings', { ...form.data.fraudSettings, high_risk_threshold_cancels: Number(e.target.value) })}
                                            className="w-24 px-3 py-2 rounded-xl border border-rose-300 text-sm font-bold text-center"
                                        />
                                        <span className="text-xs text-rose-800">টি বা তার বেশি অর্ডার বাতিল থাকলে উচ্চ ঝুঁকি হিসেবে লাল সতর্কবার্তা দেখাবে</span>
                                    </div>
                                </div>
                            </div>

                            {/* Informational guide */}
                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-600 space-y-1.5">
                                <p className="font-bold text-gray-800">ফ্রড চেকার কীভাবে কাজ করে?</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>সিস্টেম গ্রাহকের মোবাইল নম্বর বিশ্লেষণ করে পূর্বের সফল ডেলিভারি ও ক্যান্সেলেশন গণনা করে।</li>
                                    <li>অর্ডার ডিটেইলস পেজ থেকে এডমিন যেকোনো গ্রাহককে ১-ক্লিকে ব্ল্যাকলিস্ট করতে বা ক্ষমা (Pardon) করতে পারেন।</li>
                                    <li>ব্ল্যাকলিস্টেড গ্রাহক থেকে নতুন অর্ডার আসলে তা স্বয়ংক্রিয়ভাবে ১০০% হাই রিস্ক ও লাল ব্যাজ সহ হাইলাইট হবে।</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 6: SMS Gateway API */}
                {/* ======================================================== */}
                {activeTab === 'sms' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                        <div className="border-b border-gray-100 pb-3">
                            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-emerald-700" /> বাল্ক এসএমএস গেটওয়ে সেটিংস (SMS Gateway API)
                            </h2>
                            <p className="text-xs text-gray-500">অর্ডার নিশ্চিতকরণ ও স্ট্যাটাস আপডেটের জন্য এসএমএস গেটওয়ে কনফিগারেশন।</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">এসএমএস প্রোভাইডার</label>
                                <select
                                    value={form.data.sms.provider}
                                    onChange={(e) => form.setData('sms', { ...form.data.sms, provider: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold"
                                >
                                    <option value="ssl_wireless">SSL Wireless SMS API</option>
                                    <option value="bulksmsbd">BulkSMSBD</option>
                                    <option value="custom">Generic HTTP API</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">API Key / Token *</label>
                                <input
                                    type="password"
                                    value={form.data.sms.api_key}
                                    onChange={(e) => form.setData('sms', { ...form.data.sms, api_key: e.target.value })}
                                    placeholder="এসএমএস গেটওয়ে API Key"
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Sender ID / Masking Name</label>
                                <input
                                    type="text"
                                    value={form.data.sms.sender_id}
                                    onChange={(e) => form.setData('sms', { ...form.data.sms, sender_id: e.target.value })}
                                    placeholder="যেমন: PUSTIKUNJO"
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm uppercase font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Client ID / SID (ঐচ্ছিক)</label>
                                <input
                                    type="text"
                                    value={form.data.sms.client_id}
                                    onChange={(e) => form.setData('sms', { ...form.data.sms, client_id: e.target.value })}
                                    placeholder="Client ID (প্রয়োজন হলে)"
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                />
                            </div>
                        </div>

                        {/* Test SMS section */}
                        <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-3">
                            <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                                <Send className="w-4 h-4 text-sky-700" /> টেস্ট এসএমএস পাঠান (Test SMS Delivery)
                            </span>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md">
                                <input
                                    type="tel"
                                    value={testPhone}
                                    onChange={(e) => setTestPhone(e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                    className="flex-1 px-3.5 py-2 rounded-xl border border-sky-300 text-xs sm:text-sm font-mono bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleTestSms}
                                    disabled={testingSms}
                                    className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                                >
                                    {testingSms ? 'পাঠানো হচ্ছে...' : 'টেস্ট এসএমএস পাঠান'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 7: Payment (bKash & COD) */}
                {/* ======================================================== */}
                {activeTab === 'payment' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                        <div className="border-b border-gray-100 pb-3">
                            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-emerald-700" /> পেমেন্ট গেটওয়ে কনফিগারেশন (bKash & COD)
                            </h2>
                            <p className="text-xs text-gray-500">বিকাশ ম্যানুয়াল সেন্ড মানি, মার্চেন্ট একাউন্ট ও অফিসিয়াল টোকেনাইজড পেমেন্ট গেটওয়ে।</p>
                        </div>

                        {/* COD Toggle */}
                        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.data.paymentBkash.cod_enabled}
                                    onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, cod_enabled: e.target.checked })}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>ক্যাশ অন ডেলিভারি (COD) পেমেন্ট চালু রাখুন</span>
                            </label>
                        </div>

                        {/* bKash Manual */}
                        <div className="p-5 rounded-2xl border-2 border-pink-200 bg-pink-50/30 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-900 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.paymentBkash.manual_enabled}
                                        onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, manual_enabled: e.target.checked })}
                                        className="rounded text-[#E2136E] focus:ring-[#E2136E]"
                                    />
                                    <span>বিকাশ সেন্ড মানি (Manual bKash with TrxID Verification)</span>
                                </label>
                                <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-[#E2136E] text-white">bKash Manual</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">একাউন্টের ধরন</label>
                                    <select
                                        value={form.data.paymentBkash.manual_type}
                                        onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, manual_type: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm"
                                    >
                                        <option value="merchant">মার্চেন্ট একাউন্ট (Merchant)</option>
                                        <option value="personal">ব্যক্তিগত একাউন্ট (Personal)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">বিকাশ নম্বর *</label>
                                    <input
                                        type="tel"
                                        value={form.data.paymentBkash.manual_number}
                                        onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, manual_number: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">চেকআউট নির্দেশনা টেমপ্লেট</label>
                                <textarea
                                    rows={2}
                                    value={form.data.paymentBkash.manual_instructions}
                                    onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, manual_instructions: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                                />
                            </div>
                        </div>

                        {/* bKash Tokenized PGW */}
                        <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-4">
                            <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-900 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.data.paymentBkash.pgw_enabled}
                                    onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, pgw_enabled: e.target.checked })}
                                    className="rounded text-[#E2136E] focus:ring-[#E2136E]"
                                />
                                <span>অফিশিয়াল টোকেনাইজড বিকাশ পেমেন্ট গেটওয়ে (Tokenized PGW API)</span>
                            </label>

                            {form.data.paymentBkash.pgw_enabled && (
                                <div className="space-y-3 pt-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 block mb-1">পরিবেশ (Mode)</label>
                                            <select
                                                value={form.data.paymentBkash.pgw_mode}
                                                onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, pgw_mode: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                                            >
                                                <option value="sandbox">Sandbox (টেস্টিং মোড)</option>
                                                <option value="live">Live (লাইভ প্রোডাকশন)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 block mb-1">App Key</label>
                                            <input
                                                type="text"
                                                value={form.data.paymentBkash.pgw_app_key}
                                                onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, pgw_app_key: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 block mb-1">App Secret</label>
                                            <input
                                                type="password"
                                                value={form.data.paymentBkash.pgw_app_secret}
                                                onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, pgw_app_secret: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 block mb-1">Username</label>
                                            <input
                                                type="text"
                                                value={form.data.paymentBkash.pgw_username}
                                                onChange={(e) => form.setData('paymentBkash', { ...form.data.paymentBkash, pgw_username: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 8: Email & SMTP */}
                {/* ======================================================== */}
                {activeTab === 'smtp' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                        <div className="border-b border-gray-100 pb-3">
                            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-emerald-700" /> ইমেইল ও SMTP কনফিগারেশন
                            </h2>
                            <p className="text-xs text-gray-500">গ্রাহকদের ইনভয়েস ও সিস্টেম নোটিফিকেশন পাঠানোর জন্য মেইল সার্ভার সেটিংস।</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">SMTP Host *</label>
                                <input
                                    type="text"
                                    value={form.data.emailSmtp.host}
                                    onChange={(e) => form.setData('emailSmtp', { ...form.data.emailSmtp, host: e.target.value })}
                                    placeholder="smtp.gmail.com"
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Port</label>
                                    <input
                                        type="text"
                                        value={form.data.emailSmtp.port}
                                        onChange={(e) => form.setData('emailSmtp', { ...form.data.emailSmtp, port: e.target.value })}
                                        placeholder="587"
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono text-center"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Encryption</label>
                                    <select
                                        value={form.data.emailSmtp.encryption}
                                        onChange={(e) => form.setData('emailSmtp', { ...form.data.emailSmtp, encryption: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm"
                                    >
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Username / Email</label>
                                <input
                                    type="text"
                                    value={form.data.emailSmtp.username}
                                    onChange={(e) => form.setData('emailSmtp', { ...form.data.emailSmtp, username: e.target.value })}
                                    placeholder="your-email@gmail.com"
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Password / App Password</label>
                                <input
                                    type="password"
                                    value={form.data.emailSmtp.password}
                                    onChange={(e) => form.setData('emailSmtp', { ...form.data.emailSmtp, password: e.target.value })}
                                    placeholder="••••••••••••"
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">From Email Address</label>
                                <input
                                    type="email"
                                    value={form.data.emailSmtp.from_address}
                                    onChange={(e) => form.setData('emailSmtp', { ...form.data.emailSmtp, from_address: e.target.value })}
                                    placeholder="info@pustikunjo.com.bd"
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">From Sender Name</label>
                                <input
                                    type="text"
                                    value={form.data.emailSmtp.from_name}
                                    onChange={(e) => form.setData('emailSmtp', { ...form.data.emailSmtp, from_name: e.target.value })}
                                    placeholder="পুষ্টি কুঞ্জ (Pusti Kunjo)"
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold"
                                />
                            </div>
                        </div>

                        {/* Test Email Section */}
                        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                                <Send className="w-4 h-4 text-emerald-700" /> টেস্ট ইমেইল পাঠান (Test SMTP Dispatch)
                            </span>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md">
                                <input
                                    type="email"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="আপনার ইমেইল এড্রেস লিখুন"
                                    className="flex-1 px-3.5 py-2 rounded-xl border border-emerald-300 text-xs sm:text-sm font-mono bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleTestSmtp}
                                    disabled={testingSmtp}
                                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                                >
                                    {testingSmtp ? 'পাঠানো হচ্ছে...' : 'টেস্ট ইমেইল পাঠান'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 9: Shipping Zones */}
                {/* ======================================================== */}
                {activeTab === 'shipping' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-emerald-700" /> ডেলিভারি চার্জ ও শিপিং জোন
                                </h2>
                                <p className="text-xs text-gray-500">গ্রাহক চেকআউটে এর মধ্য থেকে এলাকা নির্বাচন করবেন।</p>
                            </div>
                            <button
                                type="button"
                                onClick={addShippingZone}
                                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> নতুন জোন যোগ করুন
                            </button>
                        </div>

                        <div className="space-y-3">
                            {form.data.shippingZones.map((zone, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={zone.name}
                                            onChange={(e) => updateZone(idx, 'name', e.target.value)}
                                            placeholder="জোনের নাম (যেমন: ঢাকার ভিতরে)"
                                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-bold bg-white"
                                        />
                                    </div>
                                    <div className="w-36">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">৳</span>
                                            <input
                                                type="number"
                                                value={zone.fee}
                                                onChange={(e) => updateZone(idx, 'fee', Number(e.target.value))}
                                                placeholder="60"
                                                className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-bold bg-white"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeShippingZone(idx)}
                                        className="p-2 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                                        title="জোন মুছে ফেলুন"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 10: Contact Settings */}
                {/* ======================================================== */}
                {activeTab === 'contact' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                        <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-emerald-700" /> অফিশিয়াল যোগাযোগ তথ্য (Contact Details)
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">হটলাইন ফোন নম্বর</label>
                                <input
                                    type="text"
                                    value={form.data.contact.phone}
                                    onChange={(e) => form.setData('contact', { ...form.data.contact, phone: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-semibold"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">হোয়াটসঅ্যাপ নম্বর</label>
                                <input
                                    type="text"
                                    value={form.data.contact.whatsapp}
                                    onChange={(e) => form.setData('contact', { ...form.data.contact, whatsapp: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-mono font-semibold"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">ইমেইল</label>
                                <input
                                    type="email"
                                    value={form.data.contact.email}
                                    onChange={(e) => form.setData('contact', { ...form.data.contact, email: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">হটলাইন সময়সীমা</label>
                                <input
                                    type="text"
                                    value={form.data.contact.hotline_hours}
                                    onChange={(e) => form.setData('contact', { ...form.data.contact, hotline_hours: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-bold text-gray-700 block mb-1">অফিসের ঠিকানা</label>
                                <textarea
                                    rows={2}
                                    value={form.data.contact.address}
                                    onChange={(e) => form.setData('contact', { ...form.data.contact, address: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </AdminLayout>
    );
}
