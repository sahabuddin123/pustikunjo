import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ImagePickerField from '@/Components/Admin/ImagePickerField';
import MediaPickerModal from '@/Components/Admin/MediaPickerModal';
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
    ExternalLink,
    Image as ImageIcon,
    Copy,
    Check,
    Upload,
    Key,
    MapPin,
    Radio,
    Eye,
    EyeOff,
    Shield,
    Info,
    Link as LinkIcon
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
    blacklistCount = 0,
    courierWebhookUrl = '',
    isCourierSecretConfigured = false
}) {
    const [activeTab, setActiveTab] = useState('general'); // general, appearance, seo, courier, fraud, sms, payment, smtp, shipping, contact
    const [isOgModalOpen, setIsOgModalOpen] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);

    const copyToClipboard = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

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
            indexing_directive: seo?.indexing_directive || 'index, follow',
            meta_title: seo?.meta_title || 'পুষ্টি কুঞ্জ | ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য',
            meta_description: seo?.meta_description || '১০০% প্রাকৃতিক ও অর্গানিক পুষ্টি পণ্যের বিশ্বস্ত প্রতিষ্ঠান। বিটরুট পাউডার, চিয়া সিড, খাঁটি ঘি ও হার্বাল পণ্য।',
            meta_keywords: seo?.meta_keywords || 'পুষ্টি কুঞ্জ, অর্গানিক ফুড, চিয়া সিড, বিটরুট পাউডার, ঘি, Pusti Kunjo',
            og_image: seo?.og_image || '',
            google_site_verification: seo?.google_site_verification || '',
            bing_site_verification: seo?.bing_site_verification || '',
            ga4_measurement_id: seo?.ga4_measurement_id || '',
            google_tag_manager_id: seo?.google_tag_manager_id || '',
            facebook_pixel_id: seo?.facebook_pixel_id || '',
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
            secret_key: '',
            base_url: courierSteadfast?.base_url || 'https://portal.packzy.com/api/v1',
            auto_sync: courierSteadfast?.auto_sync !== undefined ? courierSteadfast.auto_sync : true,
            default_note: courierSteadfast?.default_note || 'পুষ্টি কুঞ্জ অর্গানিক পণ্য — হ্যান্ডেল উইথ কেয়ার',
            pickup_warehouse: courierSteadfast?.pickup_warehouse || 'Fakirapool 1st Lane, Dhaka-1000',
            webhook_token: courierSteadfast?.webhook_token || '',
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

    // Courier security visibility & token helper states
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [showWebhookToken, setShowWebhookToken] = useState(false);

    const generateWebhookToken = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = 'sf_token_';
        for (let i = 0; i < 28; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        form.setData('courierSteadfast', {
            ...form.data.courierSteadfast,
            webhook_token: token,
        });
    };

    const resolvedCallbackUrl = courierWebhookUrl || (typeof window !== 'undefined' ? `${window.location.origin}/api/v1/courier/webhook/steadfast` : 'https://www.techmarket.com.bd/api/v1/courier/webhook/steadfast');

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
        { id: 'seo', label: 'SEO ও মার্কেটিং ট্র্যাকিং', icon: Search },
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
            <form onSubmit={handleSubmit} className="space-y-6 w-full pb-16">
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
                {/* TAB 3: Search Engine Optimization & Marketing Tracking */}
                {/* ======================================================== */}
                {activeTab === 'seo' && (
                    <div className="space-y-6">
                        {/* Main Container Card: Indexing & Meta Info */}
                        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                            {/* Header */}
                            <div className="border-b border-gray-100 pb-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <Search className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-base sm:text-lg text-gray-900">
                                        Search Engine Optimization &amp; Marketing Tracking
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Manage search engine indexing, meta tags, social share graphics, webmaster verification, and tracking IDs
                                    </p>
                                </div>
                            </div>

                            {/* Section 1: Search Engine Indexing Directive */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200/70 space-y-3.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">
                                            Search Engine Indexing Directive (Robots Meta Tag)
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Control whether Google, Bing, and other search engines are allowed to index and rank your pages.
                                        </p>
                                    </div>
                                    <div>
                                        {form.data.seo.indexing_directive === 'index, follow' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Public Indexing Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                Indexing Restricted
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        {
                                            id: 'index, follow',
                                            title: 'index, follow',
                                            desc: 'Recommended for live public stores. All pages indexed & ranked.',
                                        },
                                        {
                                            id: 'noindex, follow',
                                            title: 'noindex, follow',
                                            desc: 'Follow internal links but hide pages from search result listings.',
                                        },
                                        {
                                            id: 'noindex, nofollow',
                                            title: 'noindex, nofollow',
                                            desc: 'Block all search engine indexing (Staging / Maintenance).',
                                        },
                                    ].map((opt) => {
                                        const isSelected = form.data.seo.indexing_directive === opt.id;
                                        return (
                                            <div
                                                key={opt.id}
                                                onClick={() => form.setData('seo', { ...form.data.seo, indexing_directive: opt.id })}
                                                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                                                    isSelected
                                                        ? 'border-indigo-600 bg-white ring-2 ring-indigo-600/20 shadow-xs'
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>
                                                        {opt.title}
                                                    </span>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                                        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                                                    }`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                                                    {opt.desc}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section 2: Global Meta Fields */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs font-bold text-gray-700 block">Default Global Meta Title</label>
                                        <span className="text-[11px] font-mono text-gray-400">
                                            {(form.data.seo.meta_title || '').length} / 60 chars
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={form.data.seo.meta_title}
                                        onChange={(e) => form.setData('seo', { ...form.data.seo, meta_title: e.target.value })}
                                        placeholder="পুষ্টি কুঞ্জ | ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য — Pusti Kunjo"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs font-bold text-gray-700 block">Default Global Meta Description</label>
                                        <span className="text-[11px] font-mono text-amber-600">
                                            {(form.data.seo.meta_description || '').length} / 160 chars (Recommended 150-160)
                                        </span>
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={form.data.seo.meta_description}
                                        onChange={(e) => form.setData('seo', { ...form.data.seo, meta_description: e.target.value })}
                                        placeholder="১০০% প্রাকৃতিক ও অর্গানিক পুষ্টি পণ্যের বিশ্বস্ত প্রতিষ্ঠান। বিটরুট পাউডার, চিয়া সিড, খাঁটি ঘি ও হার্বাল পুষ্টি উপাদান সারা দেশে হোম ডেলিভারি।"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm leading-relaxed focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Default Global Meta Keywords</label>
                                    <input
                                        type="text"
                                        value={form.data.seo.meta_keywords}
                                        onChange={(e) => form.setData('seo', { ...form.data.seo, meta_keywords: e.target.value })}
                                        placeholder="পুষ্টি কুঞ্জ, অর্গানিক ফুড, চিয়া সিড, বিটরুট পাউডার, ঘি, Pusti Kunjo, organic superfood bd"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                    />
                                    <span className="text-[11px] text-gray-500 mt-1 block">
                                        কমা দিয়ে কি-ওয়ার্ড আলাদা করুন (যেমন: পুষ্টি কুঞ্জ, চিয়া সিড, বিটরুট পাউডার, অর্গানিক ফুড, pustikunjo bd)।
                                    </span>
                                </div>
                            </div>

                            {/* Section 3: Social Graph Image */}
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">
                                        Site SEO Social Graph Image (OG Image / Social Share Banner)
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        This image will appear in rich link previews when your website URL is shared on Facebook, WhatsApp, Messenger, Telegram, LinkedIn &amp; Twitter.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    {/* Thumbnail preview */}
                                    <div className="w-44 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-900 flex items-center justify-center shrink-0 shadow-xs relative">
                                        {form.data.seo.og_image ? (
                                            <img
                                                src={form.data.seo.og_image}
                                                alt="OG Banner"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center p-2 text-gray-400 text-xs flex flex-col items-center gap-1">
                                                <ImageIcon className="w-6 h-6 text-gray-500" />
                                                <span>No Preview</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Controls */}
                                    <div className="space-y-1.5 min-w-0 flex-1">
                                        <span className="text-xs font-bold text-gray-700 block">Select Image</span>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsOgModalOpen(true)}
                                                className="px-3.5 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs cursor-pointer flex items-center gap-1.5"
                                            >
                                                <Upload className="w-3.5 h-3.5 text-gray-500" />
                                                Change Image
                                            </button>
                                            {form.data.seo.og_image && (
                                                <button
                                                    type="button"
                                                    onClick={() => form.setData('seo', { ...form.data.seo, og_image: '' })}
                                                    className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 shadow-2xs cursor-pointer"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        {form.data.seo.og_image && (
                                            <div className="text-[11px] text-gray-500 font-mono truncate max-w-lg">
                                                {form.data.seo.og_image}
                                            </div>
                                        )}

                                        {form.data.seo.og_image && (
                                            <button
                                                type="button"
                                                onClick={() => form.setData('seo', { ...form.data.seo, og_image: '' })}
                                                className="text-xs font-semibold text-rose-600 hover:text-rose-700 block cursor-pointer"
                                            >
                                                Remove Custom Graph Image
                                            </button>
                                        )}

                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] font-medium text-amber-800">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                            <span>Recommended Resolution: 1200 × 630 px (1.91:1 ratio, JPG / PNG / WebP)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Webmaster Verification & Analytics Identifiers */}
                        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
                            {/* Webmaster Verification */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        Search Engine Ownership &amp; Webmaster Verification
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Verify site ownership in Google Search Console and Bing Webmaster Tools to submit sitemaps and index pages faster.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                    {/* Google Search Console */}
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-700">Google Search Console Verification Code</label>
                                            <a
                                                href="https://search.google.com/search-console"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                                <span>Open Console</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                        <input
                                            type="text"
                                            value={form.data.seo.google_site_verification}
                                            onChange={(e) => form.setData('seo', { ...form.data.seo, google_site_verification: e.target.value })}
                                            placeholder="e.g. ABC123xyz... or full HTML tag"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                        />
                                        <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100/80 text-xs text-blue-950 space-y-1.5">
                                            <div className="font-bold text-blue-900 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                                কীভাবে কোড পাবেন (How to get Google code):
                                            </div>
                                            <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-900/80 pl-0.5 leading-relaxed">
                                                <li>Google Search Console-এ গিয়ে Add Property → URL prefix সিলেক্ট করুন (যেমন: https://pustikunjo.com.bd) ।</li>
                                                <li>Other verification methods থেকে HTML tag সিলেক্ট করুন।</li>
                                                <li>কোড থেকে content="..." এর ভিতরের অংশটি (অথবা সম্পূর্ণ ট্যাগটি) কপি করে উপরের ঘরে পেস্ট করুন।</li>
                                                <li>নিচের Save Settings বাটনে ক্লিক করে সার্চ কনসোলে গিয়ে Verify চাপুন।</li>
                                            </ol>
                                        </div>
                                    </div>

                                    {/* Bing Webmaster */}
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-700">Bing Webmaster Verification Code</label>
                                            <a
                                                href="https://www.bing.com/webmasters"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                                <span>Open Bing</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                        <input
                                            type="text"
                                            value={form.data.seo.bing_site_verification}
                                            onChange={(e) => form.setData('seo', { ...form.data.seo, bing_site_verification: e.target.value })}
                                            placeholder='<meta name="msvalidate.01" content="1CA41368481E136378ED0CEE68B537E1" />'
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                        />
                                        <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100/80 text-xs text-blue-950 space-y-1.5">
                                            <div className="font-bold text-blue-900 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                                কীভাবে কোড পাবেন (How to get Bing code):
                                            </div>
                                            <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-900/80 pl-0.5 leading-relaxed">
                                                <li>Bing Webmaster Tools-এ গিয়ে সাইট অ্যাড করুন (অথবা Google Search Console থেকে Import করুন)।</li>
                                                <li>HTML Meta Tag মেথড সিলেক্ট করুন।</li>
                                                <li>কোডের content="..." এর টোকেনটি কপি করে উপরের ঘরে পেস্ট করুন।</li>
                                                <li>নিচের Save Settings বাটনে ক্লিক করে Bing-এ গিয়ে Verify চাপুন।</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Identifiers */}
                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-600 font-bold text-base">⚡</span>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        Analytics, Tag Manager &amp; Conversion Pixel Identifiers
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1">GA4 Measurement ID</label>
                                        <input
                                            type="text"
                                            value={form.data.seo.ga4_measurement_id}
                                            onChange={(e) => form.setData('seo', { ...form.data.seo, ga4_measurement_id: e.target.value })}
                                            placeholder="G-739XJECS0D"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono bg-white focus:border-indigo-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1">Google Tag Manager ID</label>
                                        <input
                                            type="text"
                                            value={form.data.seo.google_tag_manager_id}
                                            onChange={(e) => form.setData('seo', { ...form.data.seo, google_tag_manager_id: e.target.value })}
                                            placeholder="GTM-M5NPJS5V"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono bg-white focus:border-indigo-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1">Meta Pixel ID</label>
                                        <input
                                            type="text"
                                            value={form.data.seo.facebook_pixel_id}
                                            onChange={(e) => form.setData('seo', { ...form.data.seo, facebook_pixel_id: e.target.value })}
                                            placeholder="1091602526637309"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono bg-white focus:border-indigo-600"
                                        />
                                    </div>
                                </div>

                                {/* Tracking Setup Guidelines */}
                                <div className="rounded-2xl bg-blue-50/25 border border-blue-100/70 p-4 space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">ℹ</span>
                                        <span>Tracking Setup Guidelines &amp; Instructions</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                                        {/* GA4 */}
                                        <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 space-y-2 shadow-2xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                                    Google Analytics 4 (GA4)
                                                </span>
                                                <a
                                                    href="https://analytics.google.com/"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                                                >
                                                    <span>Open</span>
                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                            </div>
                                            <div className="text-[11px] text-gray-600 space-y-1 pl-0.5">
                                                <p>1. Go to <b>Admin (⚙)</b> in Google Analytics.</p>
                                                <p>2. Click <b>Data Streams</b> → Select your Web stream.</p>
                                                <p>3. Copy the <b>Measurement ID</b> (e.g. <code className="text-blue-600">G-XXXXXXXXXX</code>).</p>
                                            </div>
                                            <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span>Auto-tracks page views, add to cart &amp; checkout in BDT</span>
                                            </div>
                                        </div>

                                        {/* GTM */}
                                        <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 space-y-2 shadow-2xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                                    Google Tag Manager (GTM)
                                                </span>
                                                <a
                                                    href="https://tagmanager.google.com/"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                                                >
                                                    <span>Open</span>
                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                            </div>
                                            <div className="text-[11px] text-gray-600 space-y-1 pl-0.5">
                                                <p>1. Log in to <b>Google Tag Manager</b>.</p>
                                                <p>2. Select your website container.</p>
                                                <p>3. Copy the <b>Container ID</b> in the header (e.g. <code className="text-blue-600">GTM-XXXXXXX</code>).</p>
                                            </div>
                                            <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span>Injects scripts &amp; populates eCommerce dataLayer</span>
                                            </div>
                                        </div>

                                        {/* Meta Pixel */}
                                        <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 space-y-2 shadow-2xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                                                    Meta (Facebook) Pixel
                                                </span>
                                                <a
                                                    href="https://business.facebook.com/events_manager"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                                                >
                                                    <span>Open</span>
                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                            </div>
                                            <div className="text-[11px] text-gray-600 space-y-1 pl-0.5">
                                                <p>1. Open <b>Meta Events Manager</b>.</p>
                                                <p>2. Click <b>Data Sources</b> → Select your Pixel / Dataset.</p>
                                                <p>3. Go to <b>Settings</b> and copy the <b>Dataset ID</b> (15-16 digits).</p>
                                            </div>
                                            <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span>Fires PageView, ViewContent, AddToCart &amp; Purchases</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: E-Commerce Event Tracking Map & GTM Recipes */}
                        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-500 font-bold text-base">⚡</span>
                                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                                        E-Commerce Event Tracking Map &amp; GTM Recipes
                                    </h3>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
                                    <span>⚡</span> Automated DataLayer Engine Active
                                </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {/* Column 1: Automated Events */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                        <span className="text-emerald-700">📋</span>
                                        <span>১. যেসব ইভেন্ট স্বয়ংক্রিয়ভাবে ট্র্যাক হয় (Automated Events)</span>
                                    </h4>

                                    <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100 bg-white shadow-2xs overflow-hidden">
                                        {[
                                            {
                                                event: 'page_view',
                                                tag: 'GA4 + Pixel',
                                                tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                                desc: 'যে কোনো পেজ লোড বা নেভিগেট করলে ফায়ার হয়।',
                                            },
                                            {
                                                event: 'view_item / ViewContent',
                                                tag: 'GA4 + Pixel',
                                                tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                                desc: 'কাস্টমার প্রোডাক্ট ডিটেইল বা কুইক ভিউ ওপেন করলে প্রোডাক্ট আইডি, নাম ও প্রাইস সহ ফায়ার হয়।',
                                            },
                                            {
                                                event: 'add_to_cart / AddToCart',
                                                tag: 'GA4 + Pixel',
                                                tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                                desc: '"Add to Cart" অথবা "Buy Now" বাটনে ক্লিক করলে কার্ড ভ্যালু ও কোয়ান্টিটি সহ ফায়ার হয়।',
                                            },
                                            {
                                                event: 'begin_checkout / InitiateCheckout',
                                                tag: 'GA4 + Pixel',
                                                tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                                desc: 'কাস্টমার চেকআউট পেজে প্রবেশ করলে পুরো কার্টের টোটাল টাকার পরিমাণ সহ ফায়ার হয়।',
                                            },
                                            {
                                                event: 'purchase / Purchase',
                                                tag: 'Conversion',
                                                tagColor: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
                                                desc: 'অর্ডার কনফার্ম হলে অর্ডার নম্বর (Transaction ID), ডেলিভারি চার্জ ও প্রোডাক্ট লিস্ট সহ একবারই রেকর্ড হয়।',
                                            },
                                        ].map((item, idx) => (
                                            <div key={idx} className="p-3.5 space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-bold font-mono text-gray-800">
                                                        {item.event}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${item.tagColor}`}>
                                                        {item.tag}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Column 2: GTM Setup Guide */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                        <span className="text-blue-600">⚙</span>
                                        <span>২. Google Tag Manager (GTM)-এ সেটআপ করার সহজ নিয়ম</span>
                                    </h4>

                                    <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3.5 shadow-2xs">
                                        {/* Step A */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                                                    A
                                                </span>
                                                <span className="text-xs font-bold text-gray-900">
                                                    Google Tag (Main Configuration Tag)
                                                </span>
                                            </div>
                                            <div className="pl-7 text-[11px] text-gray-600 space-y-0.5 font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                                <p>GTM → Tags → New → Tag Type: <span className="font-bold text-gray-800">Google Tag</span>.</p>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span>Tag ID:</span>
                                                    <span className="text-blue-600 font-bold">{form.data.seo.ga4_measurement_id || 'G-739XJECS0D'}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(form.data.seo.ga4_measurement_id || 'G-739XJECS0D', 'gtag_id')}
                                                        className="text-gray-400 hover:text-blue-600 p-0.5 rounded cursor-pointer"
                                                        title="কপি করুন"
                                                    >
                                                        {copiedKey === 'gtag_id' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                    </button>
                                                    <span>→ Trigger: <span className="font-bold text-gray-800">Initialization - All Pages</span>.</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step B */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                                                    B
                                                </span>
                                                <span className="text-xs font-bold text-gray-900">
                                                    GA4 E-Commerce Events Tag (সব ইভেন্টের জন্য ১টি ট্যাগ)
                                                </span>
                                            </div>
                                            <div className="pl-7 text-[11px] text-gray-600 space-y-1 font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                                <p>Tag Type: <span className="font-bold text-gray-800">Google Analytics: GA4 Event</span>.</p>
                                                <p>Event Name: <span className="text-purple-600 font-bold">{"{{Event}}"}</span>.</p>
                                                <p>More Settings → টিক দিন: <span className="font-bold text-gray-800">Send Ecommerce data (Data Layer)</span>.</p>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span>Trigger → Custom Event → Event Name:</span>
                                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">view_item|add_to_cart|begin_checkout|purchase</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard('view_item|add_to_cart|begin_checkout|purchase', 'regex')}
                                                        className="text-gray-400 hover:text-emerald-600 p-0.5 rounded cursor-pointer"
                                                        title="কপি করুন"
                                                    >
                                                        {copiedKey === 'regex' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                    </button>
                                                    <span>(Regex matching: On).</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step C */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                                                    C
                                                </span>
                                                <span className="text-xs font-bold text-gray-900">
                                                    Submit &amp; Publish
                                                </span>
                                            </div>
                                            <p className="pl-7 text-[11px] text-gray-600 leading-relaxed">
                                                ট্যাগ দুটি তৈরি করে GTM-এর উপরের ডানপাশের <span className="font-bold text-gray-800">Submit → Publish</span> বাটনে ক্লিক করুন। সাথে সাথে সব ইভেন্ট লাইভ ট্র্যাক হওয়া শুরু হবে!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* OG Image Media Picker Modal */}
                        <MediaPickerModal
                            isOpen={isOgModalOpen}
                            onClose={() => setIsOgModalOpen(false)}
                            onSelect={(url) => {
                                form.setData('seo', { ...form.data.seo, og_image: url });
                                setIsOgModalOpen(false);
                            }}
                            title="সোশ্যাল শেয়ার ব্যানার (OG Image) নির্বাচন"
                        />
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 4: Steadfast Courier Configuration (User Reference Layout) */}
                {/* ======================================================== */}
                {activeTab === 'courier' && (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-7">
                        {/* Header Banner */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[11px] font-black tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-300">
                                        API V1
                                    </span>
                                    <h2 className="font-black text-base sm:text-lg text-gray-900 uppercase tracking-wide">
                                        STEADFAST COURIER CONFIGURATION
                                    </h2>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Connect your Steadfast Merchant Portal API Key &amp; Secret Key.
                                </p>
                            </div>

                            {/* Courier Active Toggle */}
                            <div className="flex items-center gap-3 self-start sm:self-auto">
                                <span className="text-xs sm:text-sm font-bold text-gray-800">Courier Active</span>
                                <button
                                    type="button"
                                    onClick={() => form.setData('courierSteadfast', { ...form.data.courierSteadfast, enabled: !form.data.courierSteadfast.enabled })}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                        form.data.courierSteadfast.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                            form.data.courierSteadfast.enabled ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* API Base Endpoint */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-gray-800">API Base Endpoint</label>
                                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                                    Official Gateway: portal.packzy.com
                                </span>
                            </div>
                            <input
                                type="text"
                                value={form.data.courierSteadfast.base_url}
                                onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, base_url: e.target.value })}
                                placeholder="https://portal.packzy.com/api/v1"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono text-gray-800 bg-gray-50/50 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                            />
                        </div>

                        {/* API Key & Secret Key */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Steadfast API Key */}
                            <div>
                                <label className="text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Steadfast API Key *</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.data.courierSteadfast.api_key}
                                    onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, api_key: e.target.value })}
                                    placeholder="e.g. ku6vnpqkzhiqphdkitzy0@pyd7gqs0a"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono text-gray-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                />
                            </div>

                            {/* Steadfast Secret Key */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                        <Key className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Steadfast Secret Key *</span>
                                    </label>
                                    {(isCourierSecretConfigured || form.data.courierSteadfast.secret_key) && (
                                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                                            ✓ Configured in DB
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showSecretKey ? 'text' : 'password'}
                                        value={form.data.courierSteadfast.secret_key}
                                        onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, secret_key: e.target.value })}
                                        placeholder="Leave blank to keep existing Secret"
                                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono text-gray-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSecretKey(!showSecretKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Default Pickup Location Note / Warehouse */}
                        <div>
                            <label className="text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Default Pickup Location Note / Warehouse</span>
                            </label>
                            <input
                                type="text"
                                value={form.data.courierSteadfast.pickup_warehouse}
                                onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, pickup_warehouse: e.target.value })}
                                placeholder="Fakirapool 1st Lane, Dhaka-1000"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                            />
                        </div>

                        {/* STEADFAST WEBHOOK INTEGRATION Section */}
                        <div className="pt-5 border-t border-gray-100 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                                        <h3 className="font-black text-sm sm:text-base text-gray-900 tracking-wide uppercase">
                                            STEADFAST WEBHOOK INTEGRATION
                                        </h3>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                            AUTO STATUS SYNC
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Receive real-time delivery status updates and transit tracking pings directly from Steadfast Courier.
                                    </p>
                                </div>

                                <a
                                    href="https://portal.packzy.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-2xs"
                                >
                                    <span>Open Steadfast Portal</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                                </a>
                            </div>

                            {/* Callback URL */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                        <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                                        <span>Callback URL (Paste into Steadfast "Callback Url")</span>
                                    </label>
                                    <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold">POST Endpoint</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={resolvedCallbackUrl}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono text-gray-700 bg-gray-50 select-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(resolvedCallbackUrl, 'webhook_url')}
                                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                                    >
                                        {copiedKey === 'webhook_url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        <span>{copiedKey === 'webhook_url' ? 'Copied!' : 'Copy URL'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Auth Token (Bearer) */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Auth Token (Bearer) (Paste into Steadfast "Auth Token(Bearer)")</span>
                                    </label>
                                    {form.data.courierSteadfast.webhook_token && (
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                            Token Set
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type={showWebhookToken ? 'text' : 'password'}
                                            value={form.data.courierSteadfast.webhook_token}
                                            onChange={(e) => form.setData('courierSteadfast', { ...form.data.courierSteadfast, webhook_token: e.target.value })}
                                            placeholder="Click Generate Token or enter your secret token"
                                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono text-gray-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowWebhookToken(!showWebhookToken)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            {showWebhookToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={generateWebhookToken}
                                            className="px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                                        >
                                            <span>Generate Token</span>
                                        </button>
                                        <button
                                            type="button"
                                            disabled={!form.data.courierSteadfast.webhook_token}
                                            onClick={() => copyToClipboard(form.data.courierSteadfast.webhook_token, 'webhook_token')}
                                            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                                        >
                                            {copiedKey === 'webhook_token' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                            <span>{copiedKey === 'webhook_token' ? 'Copied' : 'Copy Token'}</span>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Steadfast will send this as <code className="text-gray-600 font-mono">Authorization: Bearer {'{token}'}</code> to secure all incoming webhook calls.
                                </p>
                            </div>

                            {/* 3 Step instruction bar */}
                            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-2 text-xs text-blue-900 font-medium">
                                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Setup in 3 steps: 1) Copy Callback URL &rarr; 2) Generate &amp; Copy Token &rarr; 3) Paste &amp; Save in Steadfast Portal.</span>
                            </div>
                        </div>

                        {/* Test Connection Button */}
                        <div className="pt-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleTestCourier}
                                disabled={testingCourier}
                                className="px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 text-indigo-600 ${testingCourier ? 'animate-spin' : ''}`} />
                                <span>{testingCourier ? 'Testing connection...' : 'Test Connection'}</span>
                            </button>
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
