import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { X, User, Lock, Phone, Mail, MapPin, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, HelpCircle, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    if (!isOpen) return null;

    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    // Login Form
    const loginForm = useForm({
        phone_or_email: '',
        password: '',
        remember: true,
    });

    // Register Form
    const registerForm = useForm({
        name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
        address: '',
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post('/login', {
            preserveScroll: true,
            onSuccess: () => {
                loginForm.reset();
                onClose();
                router.visit('/my-account');
            },
        });
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        registerForm.post('/register', {
            preserveScroll: true,
            onSuccess: () => {
                registerForm.reset();
                onClose();
                router.visit('/my-account');
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 my-8 transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-200">
                {/* Header with Green Gradient Accent */}
                <div className="bg-gradient-to-r from-[#0B3E25] via-[#0D4D2E] to-[#125D38] px-6 pt-6 pb-5 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="বন্ধ করুন"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-emerald-300">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                            পুষ্টি কুঞ্জ কাস্টমার পোর্টাল
                        </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                        {mode === 'login' ? 'অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                        {mode === 'login' 
                            ? 'অর্ডার ট্র্যাকিং ও দ্রুত চেকআউটের সুবিধা উপভোগ করুন' 
                            : 'সহজে রেজিস্ট্রেশন করে আজই অর্ডার ট্র্যাক করুন'}
                    </p>

                    {/* Mode Tabs */}
                    <div className="flex bg-white/10 p-1 rounded-xl mt-4 border border-white/10 backdrop-blur-xs">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                                mode === 'login' 
                                    ? 'bg-white text-[#0B3E25] shadow-xs' 
                                    : 'text-white/80 hover:text-white'
                            }`}
                        >
                            লগইন (Login)
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                                mode === 'register' 
                                    ? 'bg-white text-[#0B3E25] shadow-xs' 
                                    : 'text-white/80 hover:text-white'
                            }`}
                        >
                            রেজিস্ট্রেশন (Register)
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-7 max-h-[78vh] overflow-y-auto">
                    {mode === 'login' ? (
                        /* LOGIN FORM */
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            {/* General/Phone/Email Error */}
                            {loginForm.errors.phone_or_email && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                                    <span className="font-bold">⚠️</span>
                                    <span>{loginForm.errors.phone_or_email}</span>
                                </div>
                            )}

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-gray-700">
                                        মোবাইল নম্বর অথবা ইমেইল <span className="text-red-500">*</span>
                                    </label>
                                    <Link
                                        href="/forgot-phone"
                                        onClick={onClose}
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
                                        value={loginForm.data.phone_or_email}
                                        onChange={(e) => loginForm.setData('phone_or_email', e.target.value)}
                                        placeholder="০১৭১১-XXXXXX অথবা email@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3E25] focus:border-transparent transition-all"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-semibold text-gray-700">
                                        পাসওয়ার্ড <span className="text-red-500">*</span>
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        onClick={onClose}
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
                                        value={loginForm.data.password}
                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                        placeholder="আপনার পাসওয়ার্ড লিখুন"
                                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3E25] focus:border-transparent transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {loginForm.errors.password && (
                                    <p className="text-[11px] text-red-600 mt-1">{loginForm.errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loginForm.processing}
                                className="w-full py-3 bg-[#0B3E25] hover:bg-[#08301D] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                            >
                                {loginForm.processing ? (
                                    <span>লগইন হচ্ছে...</span>
                                ) : (
                                    <>
                                        <span>লগইন করুন</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <div className="pt-2 text-center text-xs text-gray-600">
                                অ্যাকাউন্ট নেই?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('register')}
                                    className="font-bold text-[#0B3E25] hover:underline cursor-pointer"
                                >
                                    নতুন অ্যাকাউন্ট তৈরি করুন
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* REGISTER FORM */
                        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    আপনার পূর্ণ নাম <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={registerForm.data.name}
                                        onChange={(e) => registerForm.setData('name', e.target.value)}
                                        placeholder="উদা: মোঃ আব্দুর রহমান"
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3E25] transition-all"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {registerForm.errors.name && (
                                    <p className="text-[11px] text-red-600 mt-1">{registerForm.errors.name}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    মোবাইল নম্বর <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={registerForm.data.phone}
                                        onChange={(e) => registerForm.setData('phone', e.target.value)}
                                        placeholder="০১৭১১-XXXXXX"
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3E25] transition-all"
                                        required
                                    />
                                </div>
                                {registerForm.errors.phone && (
                                    <p className="text-[11px] text-red-600 mt-1">{registerForm.errors.phone}</p>
                                )}
                            </div>

                            {/* Optional Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    ইমেইল ঠিকানা <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        value={registerForm.data.email}
                                        onChange={(e) => registerForm.setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3E25] transition-all"
                                    />
                                </div>
                                {registerForm.errors.email && (
                                    <p className="text-[11px] text-red-600 mt-1">{registerForm.errors.email}</p>
                                )}
                            </div>

                            {/* Password Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        পাসওয়ার্ড <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Lock className="w-3.5 h-3.5" />
                                        </div>
                                        <input
                                            type={showRegisterPassword ? 'text' : 'password'}
                                            value={registerForm.data.password}
                                            onChange={(e) => registerForm.setData('password', e.target.value)}
                                            placeholder="কমপক্ষে ৬ অক্ষর"
                                            className="w-full pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3E25] transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                    {registerForm.errors.password && (
                                        <p className="text-[10px] text-red-600 mt-1">{registerForm.errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        পাসওয়ার্ড নিশ্চিতকরণ <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Lock className="w-3.5 h-3.5" />
                                        </div>
                                        <input
                                            type={showRegisterPassword ? 'text' : 'password'}
                                            value={registerForm.data.password_confirmation}
                                            onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                            placeholder="পুনরায় লিখুন"
                                            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3E25] transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Optional Delivery Address */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    ডেলিভারি ঠিকানা <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute top-2.5 left-3 pointer-events-none text-gray-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <textarea
                                        rows={2}
                                        value={registerForm.data.address}
                                        onChange={(e) => registerForm.setData('address', e.target.value)}
                                        placeholder="বাসা/রোড, থানা, জেলা"
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3E25] transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={registerForm.processing}
                                className="w-full py-2.5 bg-[#0B3E25] hover:bg-[#08301D] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                            >
                                {registerForm.processing ? (
                                    <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 text-emerald-300" />
                                        <span>রেজিস্ট্রেশন সম্পন্ন করুন</span>
                                    </>
                                )}
                            </button>

                            <div className="pt-1 text-center text-xs text-gray-600">
                                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="font-bold text-[#0B3E25] hover:underline cursor-pointer"
                                >
                                    লগইন করুন
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer Assurance Banner */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>১০০% নিরাপদ ও সুরক্ষিত ডেটা গোপনীয়তা</span>
                </div>
            </div>
        </div>
    );
}
