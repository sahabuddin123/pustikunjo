import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { 
    User, ShoppingBag, MapPin, Phone, LogOut, Package, ArrowRight, 
    ExternalLink, Clock, CheckCircle2, ShieldCheck, Lock, Edit3, 
    Truck, AlertCircle, Sparkles, KeyRound, Eye, EyeOff
} from 'lucide-react';

export default function MyAccount({ 
    identifier, 
    customer = {}, 
    orders = [], 
    stats = {}, 
    isAuthenticated = false, 
    meta = {} 
}) {
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'security'
    const [showPassword, setShowPassword] = useState(false);

    // Profile Form
    const profileForm = useForm({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
    });

    // Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.post('/customer/profile', {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post('/customer/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleLogout = () => {
        router.post('/customer/logout');
    };

    return (
        <StorefrontLayout meta={meta}>
            {/* Top Dashboard Hero Banner */}
            <div className="bg-gradient-to-r from-[#0B3E25] via-[#0D4D2E] to-[#125D38] text-white py-8 sm:py-10 border-b border-emerald-900 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border border-white/20 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                                {customer.name ? customer.name.charAt(0).toUpperCase() : <User className="w-8 h-8 text-emerald-300" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                                        কাস্টমার ড্যাশবোর্ড
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white mt-0.5">
                                    {customer.name || 'সম্মানিত গ্রাহক'}
                                </h1>
                                <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5 font-mono">
                                    {customer.phone} {customer.email && `• ${customer.email}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 self-start sm:self-center">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
                            >
                                <LogOut className="w-4 h-4 text-emerald-300" />
                                <span>লগআউট (Logout)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
                {/* 4 Stats Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Stat 1: Total Orders */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5 hover:border-emerald-200 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#0B3E25] flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] text-gray-500 font-bold uppercase block">মোট অর্ডার</span>
                            <span className="text-lg sm:text-xl font-black text-gray-900">
                                {stats.total_orders ?? orders.length} টি
                            </span>
                        </div>
                    </div>

                    {/* Stat 2: Pending Orders */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5 hover:border-amber-200 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] text-gray-500 font-bold uppercase block">অপেক্ষমান</span>
                            <span className="text-lg sm:text-xl font-black text-gray-900">
                                {stats.pending_orders ?? 0} টি
                            </span>
                        </div>
                    </div>

                    {/* Stat 3: Completed Orders */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5 hover:border-emerald-200 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] text-gray-500 font-bold uppercase block">সম্পন্ন ডেলিভারি</span>
                            <span className="text-lg sm:text-xl font-black text-gray-900">
                                {stats.completed_orders ?? 0} টি
                            </span>
                        </div>
                    </div>

                    {/* Stat 4: Total Spent */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5 hover:border-emerald-200 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#0B3E25] flex items-center justify-center shrink-0 font-bold text-base">
                            ৳
                        </div>
                        <div>
                            <span className="text-[11px] text-gray-500 font-bold uppercase block">সর্বমোট ক্রয়</span>
                            <span className="text-lg sm:text-xl font-black text-[#0B3E25]">
                                ৳{Number(stats.total_spent ?? 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Tabs Bar */}
                <div className="flex border-b border-gray-200 space-x-2 sm:space-x-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === 'orders'
                                ? 'border-[#0B3E25] text-[#0B3E25]'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Package className="w-4 h-4" />
                        <span>অর্ডার হিস্টোরি ({orders.length})</span>
                    </button>

                    {isAuthenticated && (
                        <>
                            <button
                                type="button"
                                onClick={() => setActiveTab('profile')}
                                className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                                    activeTab === 'profile'
                                        ? 'border-[#0B3E25] text-[#0B3E25]'
                                        : 'border-transparent text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>প্রোফাইল তথ্য</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('security')}
                                className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                                    activeTab === 'security'
                                        ? 'border-[#0B3E25] text-[#0B3E25]'
                                        : 'border-transparent text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <KeyRound className="w-4 h-4" />
                                <span>পাসওয়ার্ড পরিবর্তন</span>
                            </button>
                        </>
                    )}
                </div>

                {/* TAB 1: ORDERS LIST */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order) => {
                                    const grandTotal = order.grand_total || order.total_amount || 0;
                                    return (
                                        <div
                                            key={order.id}
                                            className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                                                <div>
                                                    <div className="flex items-center gap-2.5 flex-wrap">
                                                        <span className="text-sm sm:text-base font-black text-gray-900 font-mono">
                                                            #{order.order_number}
                                                        </span>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                            order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-amber-100 text-amber-800'
                                                        }`}>
                                                            {order.status === 'pending' ? 'অপেক্ষমান (Pending)' :
                                                             order.status === 'confirmed' ? 'নিশ্চিত (Confirmed)' :
                                                             order.status === 'processing' ? 'প্রসেসিং হচ্ছে' :
                                                             order.status === 'shipped' ? 'শিপড (ডেলিভারির পথে)' :
                                                             order.status === 'delivered' ? 'ডেলিভার্ড সম্পন্ন' :
                                                             order.status}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-400 mt-1 block">
                                                        তারিখ: {new Date(order.created_at).toLocaleDateString('bn-BD', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="text-left sm:text-right">
                                                        <span className="text-[11px] text-gray-400 block font-medium">মোট বিল</span>
                                                        <span className="text-base sm:text-lg font-black text-[#0B3E25]">
                                                            ৳{Number(grandTotal).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <Link
                                                        href={`/track-order?order_id=${order.order_number}&phone=${order.customer_phone}`}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0B3E25] text-xs font-bold transition-colors shadow-2xs"
                                                    >
                                                        <Truck className="w-3.5 h-3.5" />
                                                        <span>ট্র্যাক করুন</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Order items */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-xs">
                                                        {item.product_image ? (
                                                            <img
                                                                src={item.product_image}
                                                                alt={item.product_name}
                                                                className="w-11 h-11 rounded-lg object-cover bg-white shrink-0 border border-gray-200/50"
                                                            />
                                                        ) : (
                                                            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#0B3E25] flex items-center justify-center shrink-0">
                                                                <Package className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                        <div className="truncate">
                                                            <p className="font-bold text-gray-900 truncate">{item.product_name}</p>
                                                            <span className="text-gray-500 font-medium">
                                                                {item.quantity} টি × ৳{Number(item.unit_price).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Delivery Address Summary */}
                                            {order.shipping_address && (
                                                <div className="pt-2 text-xs text-gray-500 flex items-start gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                                    <span className="truncate">ঠিকানা: {order.shipping_address}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500 space-y-4 shadow-xs">
                                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 stroke-1" />
                                <h3 className="text-base font-bold text-gray-800">আপনার এখনও কোনো অর্ডার নেই</h3>
                                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                    আমাদের প্রাকৃতিক ও স্বাস্থ্যসম্মত খাঁটি পণ্যগুলো ঘুরে দেখুন এবং আপনার পছন্দের পণ্য অর্ডার করুন।
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-xs font-bold transition-all shadow-md"
                                >
                                    <span>শপ দেখুন (Shop Now)</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: PROFILE SETTINGS */}
                {activeTab === 'profile' && (
                    <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-black text-gray-900">ব্যক্তিগত প্রোফাইল তথ্য</h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                আপনার নাম, মোবাইল নম্বর এবং ডিফল্ট ডেলিভারি ঠিকানা আপডেট করুন।
                            </p>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    আপনার নাম <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                    required
                                />
                                {profileForm.errors.name && (
                                    <p className="text-xs text-red-500 mt-1">{profileForm.errors.name}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        মোবাইল নম্বর <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={profileForm.data.phone}
                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                        required
                                    />
                                    {profileForm.errors.phone && (
                                        <p className="text-xs text-red-500 mt-1">{profileForm.errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        ইমেইল ঠিকানা (ঐচ্ছিক)
                                    </label>
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                    />
                                    {profileForm.errors.email && (
                                        <p className="text-xs text-red-500 mt-1">{profileForm.errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    ডিফল্ট ডেলিভারি ঠিকানা
                                </label>
                                <textarea
                                    rows={3}
                                    value={profileForm.data.address}
                                    onChange={(e) => profileForm.setData('address', e.target.value)}
                                    placeholder="বাসা/রোড নম্বর, এলাকা, থানা, জেলা"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25] resize-none"
                                />
                                {profileForm.errors.address && (
                                    <p className="text-xs text-red-500 mt-1">{profileForm.errors.address}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="px-6 py-2.5 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {profileForm.processing ? 'সংরক্ষণ হচ্ছে...' : 'তথ্য সংরক্ষণ করুন'}
                            </button>
                        </form>
                    </div>
                )}

                {/* TAB 3: SECURITY / PASSWORD */}
                {activeTab === 'security' && (
                    <div className="max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-black text-gray-900">পাসওয়ার্ড পরিবর্তন</h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                অ্যাকাউন্ট নিরাপদ রাখতে নিয়মিত পাসওয়ার্ড আপডেট করুন।
                            </p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    বর্তমান পাসওয়ার্ড <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {passwordForm.errors.current_password && (
                                    <p className="text-xs text-red-500 mt-1">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    placeholder="ন্যূনতম ৬ অক্ষর"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                    required
                                />
                                {passwordForm.errors.password && (
                                    <p className="text-xs text-red-500 mt-1">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    নতুন পাসওয়ার্ড পুনরায় লিখুন <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    placeholder="পুনরায় লিখুন"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="px-6 py-2.5 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {passwordForm.processing ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
