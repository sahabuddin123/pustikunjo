import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { User, Phone, Mail, Lock, MapPin, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, LogIn } from 'lucide-react';

export default function CustomerRegister({ meta = {} }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
        address: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <StorefrontLayout meta={meta}>
            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
                <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-13 h-13 rounded-2xl bg-[#0B3E25] text-white flex items-center justify-center mx-auto shadow-md">
                            <Sparkles className="w-6 h-6 text-emerald-300" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            নতুন অ্যাকাউন্ট তৈরি করুন
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            পুষ্টি কুঞ্জে রেজিস্ট্রেশন করে সহজে অর্ডার ট্র্যাক করুন ও বিশেষ অফার উপভোগ করুন।
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                আপনার পূর্ণ নাম <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="উদা: মোঃ আব্দুর রহমান"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                    autoFocus
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                মোবাইল নম্বর <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    type="tel"
                                    required
                                    placeholder="০১৭১১-XXXXXX"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                />
                            </div>
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                ইমেইল ঠিকানা <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    পাসওয়ার্ড <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="ন্যূনতম ৬ অক্ষর"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    পাসওয়ার্ড নিশ্চিতকরণ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="পুনরায় লিখুন"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                ডেলিভারি ঠিকানা <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <textarea
                                    rows={2}
                                    placeholder="বাসা/রোড নম্বর, এলাকা, থানা, জেলা"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all resize-none"
                                />
                            </div>
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                        >
                            <span>রেজিস্ট্রেশন সম্পন্ন করুন</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="text-center pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-600">
                        <span>ইতিমধ্যে অ্যাকাউন্ট আছে?</span>
                        <Link href="/login" className="font-bold text-[#0B3E25] hover:underline flex items-center gap-1">
                            <LogIn className="w-3.5 h-3.5" />
                            <span>লগইন করুন</span>
                        </Link>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#0B3E25] shrink-0" />
                        <span className="text-[11px] text-emerald-800">
                            আপনার তথ্য সম্পূর্ণ নিরাপদ ও গোপনীয় রাখা হয়।
                        </span>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
