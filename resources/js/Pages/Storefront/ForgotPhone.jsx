import React, { useState } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Phone, Mail, Package, Search, HelpCircle, ArrowRight, ArrowLeft, PhoneCall, CheckCircle2, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';

export default function ForgotPhone({ hotline = '01700-000000', meta = {} }) {
    const { flash } = usePage().props;
    const [searchType, setSearchType] = useState('email'); // 'email' | 'order'

    const emailForm = useForm({
        search_type: 'email',
        email: '',
    });

    const orderForm = useForm({
        search_type: 'order',
        order_number: '',
    });

    const handleEmailSearch = (e) => {
        e.preventDefault();
        emailForm.post('/forgot-phone/search');
    };

    const handleOrderSearch = (e) => {
        e.preventDefault();
        orderForm.post('/forgot-phone/search');
    };

    const recovered = flash?.recovered_account;

    return (
        <StorefrontLayout meta={meta}>
            <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
                <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-13 h-13 rounded-2xl bg-[#0B3E25] text-white flex items-center justify-center mx-auto shadow-md">
                            <HelpCircle className="w-6 h-6 text-emerald-300" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            ফোন নম্বর ও অ্যাকাউন্ট উদ্ধার
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            কোন ফোন নম্বরটি ব্যবহার করেছিলেন মনে নেই? ইমেইল বা পূর্বের অর্ডার নম্বর দিয়ে সহজে নম্বরটি দেখে নিন।
                        </p>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setSearchType('email')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                searchType === 'email'
                                    ? 'bg-white text-[#0B3E25] shadow-xs'
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <Mail className="w-3.5 h-3.5" />
                            <span>ইমেইল দিয়ে খুঁজুন</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSearchType('order')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                searchType === 'order'
                                    ? 'bg-white text-[#0B3E25] shadow-xs'
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <Package className="w-3.5 h-3.5" />
                            <span>অর্ডার নম্বর দিয়ে খুঁজুন</span>
                        </button>
                    </div>

                    {/* RECOVERED RESULT CARD */}
                    {recovered && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <span>অ্যাকাউন্ট রেকর্ড পাওয়া গেছে!</span>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">গ্রাহকের নাম:</span>
                                    <span className="font-bold text-gray-900">{recovered.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">সংযুক্ত ফোন নম্বর:</span>
                                    <span className="font-mono font-black text-base text-[#0B3E25] tracking-wider">
                                        {recovered.masked_phone}
                                    </span>
                                </div>
                                {recovered.order_number && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">অর্ডার নম্বর:</span>
                                        <span className="font-mono font-bold text-gray-800">#{recovered.order_number}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <Link
                                    href="/forgot-password"
                                    className="py-2 px-3 bg-[#0B3E25] hover:bg-[#072F1C] text-white text-xs font-bold rounded-xl text-center transition-all shadow-xs flex items-center justify-center gap-1"
                                >
                                    <KeyRound className="w-3.5 h-3.5 text-emerald-300" />
                                    <span>পাসওয়ার্ড রিসেট</span>
                                </Link>
                                <Link
                                    href="/login"
                                    className="py-2 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl text-center transition-all shadow-2xs flex items-center justify-center gap-1"
                                >
                                    <span>লগইন করুন</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* SEARCH FORM 1: BY EMAIL */}
                    {searchType === 'email' ? (
                        <form onSubmit={handleEmailSearch} className="space-y-4">
                            {emailForm.errors.email && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{emailForm.errors.email}</span>
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    আপনার নিবন্ধিত ইমেইল ঠিকানা <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="email@example.com"
                                        value={emailForm.data.email}
                                        onChange={(e) => emailForm.setData('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={emailForm.processing}
                                className="w-full py-3.5 px-4 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {emailForm.processing ? (
                                    <span>অনুসন্ধান করা হচ্ছে...</span>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        <span>নম্বর খুঁজুন</span>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        /* SEARCH FORM 2: BY ORDER NUMBER */
                        <form onSubmit={handleOrderSearch} className="space-y-4">
                            {orderForm.errors.order_number && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{orderForm.errors.order_number}</span>
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    পূর্বের অর্ডার নম্বর <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Package className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="যেমন: PK-10023"
                                        value={orderForm.data.order_number}
                                        onChange={(e) => orderForm.setData('order_number', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B3E25] focus:ring-2 focus:ring-[#0B3E25]/20 transition-all font-mono"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={orderForm.processing}
                                className="w-full py-3.5 px-4 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {orderForm.processing ? (
                                    <span>অর্ডার অনুসন্ধান করা হচ্ছে...</span>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        <span>অর্ডার থেকে নম্বর খুঁজুন</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Support Notice */}
                    <div className="pt-2 text-center space-y-3 border-t border-gray-100 text-xs">
                        <p className="text-gray-500">
                            কিছুই মনে পড়ছে না? সরাসরি আমাদের কাস্টমার সাপোর্টে কল করুন:
                        </p>
                        <a
                            href={`tel:${hotline.replace(/[^0-9+]/g, '')}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold hover:bg-amber-100 transition-colors"
                        >
                            <PhoneCall className="w-4 h-4 text-amber-700" />
                            <span>হটলাইন: {hotline}</span>
                        </a>

                        <div>
                            <Link href="/login" className="text-gray-500 hover:text-gray-800 inline-flex items-center gap-1">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>লগইন পেজে ফিরে যান</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
