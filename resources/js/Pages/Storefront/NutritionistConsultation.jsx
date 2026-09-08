import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { 
    User, Phone, MessageSquare, CheckCircle2, AlertCircle, X, 
    ArrowRight, Sparkles, HeartPulse, Scale, ShieldCheck, Clock, 
    FileText, PhoneCall, HelpCircle, Activity, ChevronRight 
} from 'lucide-react';

export default function NutritionistConsultation({ categories = [], hotline = '09678812525', whatsapp = '01700000000', meta = {} }) {
    const { flash, siteConfig } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors, recentlySuccessful } = useForm({
        name: '',
        phone: '',
        category: '',
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        problem_details: '',
        contact_method: 'whatsapp',
    });

    const openFormWithCategory = (cat) => {
        setSelectedCategory(cat);
        setData((prev) => ({
            ...prev,
            category: cat.title,
        }));
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/consultation/submit', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            },
        });
    };

    const cleanWhatsapp = (whatsapp || siteConfig?.whatsapp || '01700000000').replace(/[^0-9]/g, '');

    return (
        <StorefrontLayout meta={meta}>
            <div className="bg-[#FAF9F5] min-h-screen pb-16">
                
                {/* 1. TOP HERO SECTION (Forest Green with Golden Pill Badge) */}
                <div className="bg-gradient-to-b from-[#072F1C] to-[#0B3E25] text-white py-12 sm:py-16 relative overflow-hidden text-center shadow-md">
                    {/* Subtle decorative background pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CCF381_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3.5">
                        {/* Golden Top Pill */}
                        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/10 border border-[#D48828]/60 text-amber-200 text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#D48828]" />
                            <span>FREE EXPERT CONSULTATION</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
                            পুষ্টিবিদ ও হাকিমের পরামর্শ
                        </h1>

                        <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
                            আপনার যে কোনো শারীরিক দুর্বলতা, অনিয়মিত খাদ্যাভ্যাস বা দীর্ঘমেয়াদী স্বাস্থ্যগত সমস্যায় অভিজ্ঞ হাকিম ও সার্টিফাইড পুষ্টিবিদের কাছ থেকে পান শতভাগ বিশুদ্ধ ও প্রাকৃতিক খাদ্যভিত্তিক গাইডলাইন।
                        </p>
                    </div>
                </div>

                {/* 2. SECTION: সমস্যা অনুযায়ী ফরম (CONSULTATION FORMS) */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-8">
                    {/* Section Header */}
                    <div className="text-center space-y-2">
                        <span className="text-xs font-bold text-[#D48828] uppercase tracking-widest block">
                            CONSULTATION FORMS
                        </span>
                        <div className="inline-block relative">
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                সমস্যা অনুযায়ী ফরম
                            </h2>
                            <div className="w-12 h-1 bg-[#D48828] mx-auto mt-1 rounded-full" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
                            যে বিষয়ের ওপর পরামর্শ চান, সঠিক ক্যাটাগরি বেছে নিয়ে তথ্য পূরণ করুন — অভিজ্ঞ পুষ্টিবিদ আপনার সমস্যা পর্যালোচনা করে সমাধান জানাবেন।
                        </p>
                    </div>

                    {/* Success notification if direct submitted */}
                    {recentlySuccessful && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm font-bold shadow-xs">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                            <span>আপনার পরামর্শের আবেদনটি সফলভাবে গৃহীত হয়েছে! আমাদের বিশেষজ্ঞ পুষ্টিবিদ খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</span>
                        </div>
                    )}

                    {/* Category Cards List */}
                    <div className="space-y-5">
                        {categories.map((cat, idx) => (
                            <div
                                key={cat.id || idx}
                                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Left: Category Icon & Title */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B3E25] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#0B3E25] group-hover:text-white transition-all duration-300">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                                                {cat.badge}
                                            </span>
                                            <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-0.5 group-hover:text-[#0B3E25] transition-colors">
                                                {cat.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Right: Big Faded Number (e.g. ০১, ০২) */}
                                    <span className="text-3xl sm:text-4xl font-black text-gray-200 group-hover:text-emerald-200/80 transition-colors font-mono select-none">
                                        {cat.number}
                                    </span>
                                </div>

                                {/* Problem Description */}
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-3.5 mb-4 pl-0 sm:pl-16">
                                    {cat.description}
                                </p>

                                {/* Bottom Row: Tags & Action Button */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-100 pl-0 sm:pl-16">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {cat.tags?.map((tag, tIdx) => (
                                            <span
                                                key={tIdx}
                                                className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200/60 text-[11px] font-semibold text-gray-600"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        type="button"
                                        onClick={() => openFormWithCategory(cat)}
                                        className="px-5 py-2.5 rounded-xl bg-[#0B3E25] hover:bg-[#072F1C] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                                    >
                                        <span>ফরম পূরণ করুন</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-xs text-gray-400 pt-2">
                        আপনার প্রেরিত সকল ব্যক্তিগত তথ্য ও স্বাস্থ্য বিবরণ সম্পূর্ণ গোপন রাখা হয়।
                    </p>
                </div>

                {/* 3. SECTION: কীভাবে কাজ করে (HOW IT WORKS / PROCESS) */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-8">
                        {/* Section Header */}
                        <div className="text-center space-y-1">
                            <span className="text-xs font-bold text-[#D48828] uppercase tracking-widest block">
                                PROCESS
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                                কীভাবে কাজ করে
                            </h3>
                            <div className="w-10 h-0.5 bg-[#D48828] mx-auto mt-1 rounded-full" />
                        </div>

                        {/* 3 Step Timeline */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-0" />

                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                                <div className="w-13 h-13 rounded-2xl bg-white border-2 border-emerald-600 text-emerald-800 flex items-center justify-center shadow-xs">
                                    <FileText className="w-6 h-6 text-[#0B3E25]" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-[#D48828] block uppercase">ধাপ ১</span>
                                    <h4 className="text-sm sm:text-base font-black text-gray-900 mt-0.5">সমস্যা জানান</h4>
                                    <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                                        আপনার স্বাস্থ্যগত সমস্যা ও উপসর্গ নির্বাচন করে বিস্তারিত তথ্য দিন।
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                                <div className="w-13 h-13 rounded-2xl bg-white border-2 border-emerald-600 text-emerald-800 flex items-center justify-center shadow-xs">
                                    <Activity className="w-6 h-6 text-[#0B3E25]" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-[#D48828] block uppercase">ধাপ ২</span>
                                    <h4 className="text-sm sm:text-base font-black text-gray-900 mt-0.5">প্রস্তাব পর্যালোচনা</h4>
                                    <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                                        অভিজ্ঞ পুষ্টিবিদ আপনার স্বাস্থ্য বিবরণী ও ডায়েট হিস্টোরি বিশ্লেষণ করবেন।
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                                <div className="w-13 h-13 rounded-2xl bg-white border-2 border-emerald-600 text-emerald-800 flex items-center justify-center shadow-xs">
                                    <ShieldCheck className="w-6 h-6 text-[#0B3E25]" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-[#D48828] block uppercase">ধাপ ৩</span>
                                    <h4 className="text-sm sm:text-base font-black text-gray-900 mt-0.5">পরামর্শ ও চার্ট পান</h4>
                                    <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                                        ফোন বা হোয়াটসঅ্যাপে বিশেষজ্ঞ পরামর্শ ও প্রাকৃতিক খাদ্যাভ্যাস গাইডলাইন পাবেন।
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Direct Connect Action Row */}
                        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-2 text-gray-600">
                                <PhoneCall className="w-4 h-4 text-emerald-700" />
                                <span>জরুরি প্রয়োজনে সরাসরি আমাদের হেল্পলাইনে কথা বলুন: <strong>{hotline}</strong></span>
                            </div>

                            <a
                                href={`https://wa.me/880${cleanWhatsapp}?text=${encodeURIComponent('হ্যালো পুষ্টি কুঞ্জ! আমি পুষ্টিবিদের সাথে পরামর্শ করতে চাচ্ছি।')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1fa951] text-white font-bold transition-colors cursor-pointer shadow-xs"
                            >
                                <span>হোয়াটসঅ্যাপে সরাসরি লিখুন</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 4. MODAL POPUP FORM (When customer clicks "ফরম পূরণ করুন >") */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <div 
                            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
                            onClick={() => setIsModalOpen(false)} 
                        />

                        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 my-8">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-[#0B3E25] to-[#125D38] text-white px-6 py-5 relative">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                                    {selectedCategory?.badge || 'CONSULTATION FORM'}
                                </span>
                                <h3 className="text-xl font-black text-white mt-0.5">
                                    {selectedCategory?.title || 'পরামর্শের আবেদন ফরম'}
                                </h3>
                                <p className="text-xs text-emerald-100/80 mt-1">
                                    আপনার সঠিক তথ্য দিয়ে ফরমটি পূরণ করুন।
                                </p>
                            </div>

                            {/* Modal Form Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        আপনার পূর্ণ নাম <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="উদা: মোঃ আরিফুল ইসলাম"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                        autoFocus
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        মোবাইল নম্বর <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="০১৭১১-XXXXXX"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                </div>

                                {/* Age & Gender */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            বয়স (বছর)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="যেমন: ২৮"
                                            value={data.age}
                                            onChange={(e) => setData('age', e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            লিঙ্গ
                                        </label>
                                        <select
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25] bg-white"
                                        >
                                            <option value="male">পুরুষ (Male)</option>
                                            <option value="female">মহিলা (Female)</option>
                                            <option value="other">অন্যান্য</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Height & Weight (Optional) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            উচ্চতা <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="যেমন: ৫ ফুট ৬ ইঞ্চি"
                                            value={data.height}
                                            onChange={(e) => setData('height', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            ওজন <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="যেমন: ৬৮ কেজি"
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25]"
                                        />
                                    </div>
                                </div>

                                {/* Problem Details */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        সমস্যার বিস্তারিত বিবরণ <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        placeholder="আপনার সমস্যাটি কত দিন ধরে এবং কী কী লক্ষণ বা অনুভূতি লক্ষ্য করছেন বিস্তারিত লিখুন..."
                                        value={data.problem_details}
                                        onChange={(e) => setData('problem_details', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25] resize-none"
                                    />
                                    {errors.problem_details && <p className="text-xs text-red-500 mt-1">{errors.problem_details}</p>}
                                </div>

                                {/* Preferred Contact Method */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        পরামর্শ গ্রহণের পছন্দের মাধ্যম
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold ${
                                            data.contact_method === 'whatsapp' 
                                                ? 'bg-emerald-50 border-emerald-500 text-[#0B3E25]' 
                                                : 'border-gray-200 text-gray-600'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="contact_method"
                                                value="whatsapp"
                                                checked={data.contact_method === 'whatsapp'}
                                                onChange={() => setData('contact_method', 'whatsapp')}
                                                className="hidden"
                                            />
                                            <span>💬 হোয়াটসঅ্যাপ চ্যাট/কল</span>
                                        </label>

                                        <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold ${
                                            data.contact_method === 'phone_call' 
                                                ? 'bg-emerald-50 border-emerald-500 text-[#0B3E25]' 
                                                : 'border-gray-200 text-gray-600'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="contact_method"
                                                value="phone_call"
                                                checked={data.contact_method === 'phone_call'}
                                                onChange={() => setData('contact_method', 'phone_call')}
                                                className="hidden"
                                            />
                                            <span>📞 সরাসরি ফোন কল</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                                >
                                    {processing ? 'জমা দেওয়া হচ্ছে...' : 'পরামর্শের আবেদন সম্পন্ন করুন'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </StorefrontLayout>
    );
}
