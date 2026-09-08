import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Phone, ArrowRight, ShieldCheck, Leaf, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function CustomerLogin({ meta = {} }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        phone_or_email: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <StorefrontLayout meta={meta}>
            <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
                <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-13 h-13 rounded-2xl bg-[#0B3E25] text-white flex items-center justify-center mx-auto shadow-md">
                            <Leaf className="w-6 h-6 fill-current text-emerald-300" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            গ্রাহক লগইন
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            পুষ্টি কুঞ্জ অ্যাকাউন্টে প্রবেশ করে আপনার পূর্বের অর্ডার ও ড্যাশবোর্ড দেখুন।
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errors.phone_or_email && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                                <span className="font-bold">⚠️</span>
                                <span>{errors.phone_or_email}</span>
                            </div>
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-gray-700">
                                    মোবাইল নম্বর অথবা ইমেইল <span className="text-red-500">*</span>
                                </label>
                                <Link
                                    href="/forgot-phone"
                                    className="text-[11px] font-semibold text-amber-700 hover:underline"
                                >
                                    নম্বর মনে নেই?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="০১৭১১-XXXXXX অথবা email@example.com"
                                    value={data.phone_or_email}
                                    onChange={(e) => setData('phone_or_email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-gray-700">
                                    পাসওয়ার্ড
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[11px] font-semibold text-[#0B3E25] hover:underline"
                                >
                                    পাসওয়ার্ড ভুলে গেছেন?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <span>লগইন করুন</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="text-center pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                        <Link href="/register" className="font-bold text-[#0B3E25] hover:underline flex items-center gap-1">
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>নতুন অ্যাকাউন্ট তৈরি</span>
                        </Link>
                        <Link href="/track-order" className="text-gray-500 hover:text-gray-800">
                            সরাসরি ট্র্যাক করুন
                        </Link>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                            <ShieldCheck className="w-4 h-4 text-[#0B3E25] shrink-0" />
                            <span>নিরাপদ ও দ্রুত চেকআউট</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 leading-relaxed">
                            লগইন থাকলে আপনার পূর্বের যেকোনো অর্ডারের লাইভ ট্র্যাকিং, ইনভয়েস ডাউনলোড এবং ঠিকানা দ্রুত নির্বাচন করতে পারবেন।
                        </p>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
