import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { KeyRound, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function ForgotPassword({ step = 'request', phone = null, demoOtp = null, meta = {} }) {
    const [showPassword, setShowPassword] = useState(false);

    // Form 1: Request OTP
    const requestForm = useForm({
        phone_or_email: '',
    });

    // Form 2: Verify OTP & New Password
    const resetForm = useForm({
        otp: demoOtp || '',
        password: '',
        password_confirmation: '',
    });

    const handleRequestOtp = (e) => {
        e.preventDefault();
        requestForm.post('/forgot-password/send-otp');
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        resetForm.post('/forgot-password/reset');
    };

    return (
        <StorefrontLayout meta={meta}>
            <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
                <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
                    {/* Header Icon & Title */}
                    <div className="text-center space-y-2">
                        <div className="w-13 h-13 rounded-2xl bg-[#0B3E25] text-white flex items-center justify-center mx-auto shadow-md">
                            <KeyRound className="w-6 h-6 text-emerald-300" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            {step === 'request' ? 'পাসওয়ার্ড রিসেট' : 'নতুন পাসওয়ার্ড দিন'}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            {step === 'request'
                                ? 'আপনার মোবাইল নম্বরে ৬-সংখ্যার ভেরিফিকেশন কোড পাঠিয়ে পাসওয়ার্ড উদ্ধার করুন।'
                                : `আপনার নম্বরে (${phone || 'মোবাইলে'}) পাঠানো ওটিপি কোডটি লিখুন।`}
                        </p>
                    </div>

                    {/* STEP 1: REQUEST OTP */}
                    {step === 'request' ? (
                        <form onSubmit={handleRequestOtp} className="space-y-4">
                            {requestForm.errors.phone_or_email && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{requestForm.errors.phone_or_email}</span>
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    নিবন্ধিত মোবাইল নম্বর অথবা ইমেইল <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="০১৭১১-XXXXXX অথবা email@example.com"
                                        value={requestForm.data.phone_or_email}
                                        onChange={(e) => requestForm.setData('phone_or_email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={requestForm.processing}
                                className="w-full py-3.5 px-4 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {requestForm.processing ? (
                                    <span>ওটিপি পাঠানো হচ্ছে...</span>
                                ) : (
                                    <>
                                        <span>ওটিপি (OTP) পাঠান</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <div className="pt-2 text-center space-y-2 border-t border-gray-100 text-xs">
                                <div>
                                    <Link href="/forgot-phone" className="text-amber-700 hover:text-amber-900 font-medium hover:underline flex items-center justify-center gap-1">
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        <span>মোবাইল নম্বর মনে নেই? অ্যাকাউন্ট উদ্ধার করুন</span>
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/login" className="text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1">
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                        <span>লগইন পেজে ফিরে যান</span>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    ) : (
                        /* STEP 2: VERIFY OTP AND SET NEW PASSWORD */
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            {/* Dev Testing OTP Notice */}
                            {demoOtp && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
                                    <span>টেস্টিং কোড: <strong className="font-mono text-sm tracking-widest">{demoOtp}</strong></span>
                                    <button
                                        type="button"
                                        onClick={() => resetForm.setData('otp', demoOtp)}
                                        className="text-[11px] bg-emerald-700 text-white px-2 py-0.5 rounded-md font-bold"
                                    >
                                        অটো বসান
                                    </button>
                                </div>
                            )}

                            {resetForm.errors.otp && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{resetForm.errors.otp}</span>
                                </div>
                            )}

                            {/* OTP Code Input */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    ৬-সংখ্যার ওটিপি কোড (OTP) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    placeholder="XXXXXX"
                                    value={resetForm.data.otp}
                                    onChange={(e) => resetForm.setData('otp', e.target.value)}
                                    className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                    autoFocus
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="কমপক্ষে ৬ অক্ষর"
                                        value={resetForm.data.password}
                                        onChange={(e) => resetForm.setData('password', e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {resetForm.errors.password && (
                                    <p className="text-xs text-red-500 mt-1">{resetForm.errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    নতুন পাসওয়ার্ড পুনরায় লিখুন <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                                        value={resetForm.data.password_confirmation}
                                        onChange={(e) => resetForm.setData('password_confirmation', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={resetForm.processing}
                                className="w-full py-3.5 px-4 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {resetForm.processing ? (
                                    <span>রিসেট হচ্ছে...</span>
                                ) : (
                                    <>
                                        <span>পাসওয়ার্ড পরিবর্তন ও লগইন</span>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                    </>
                                )}
                            </button>

                            <div className="pt-2 text-center text-xs">
                                <Link href="/forgot-password/restart" className="text-gray-500 hover:text-gray-800 hover:underline">
                                    নম্বর পরিবর্তন করতে চান? নতুন করে শুরু করুন
                                </Link>
                            </div>
                        </form>
                    )}

                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#0B3E25] shrink-0" />
                        <span className="text-[11px] text-emerald-800">
                            পুষ্টি কুঞ্জ সর্বদা আপনার তথ্যের নিরাপত্তা নিশ্চিত করে।
                        </span>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
