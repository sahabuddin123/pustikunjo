import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { 
    Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, 
    Headphones, ShieldCheck, Heart, Clock, ArrowRight, Sparkles 
} from 'lucide-react';

export default function Contact({ contact = {}, meta = {} }) {
    const { siteConfig, flash } = usePage().props;

    const phone = contact?.phone || siteConfig?.phone || '09678812525';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const whatsapp = contact?.whatsapp || siteConfig?.whatsapp || '01700000000';
    const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');
    const email = contact?.email || siteConfig?.email || 'info@pustikunjo.com.bd';
    const address = contact?.address || 'Level-5, Noor Tower, 110/D/A Uttara C/A, Dhaka 1230';
    const messenger = contact?.messenger || 'https://m.me/pustikunjobd';

    // Direct Inquiry Message Form
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors, recentlySuccessful } = useForm({
        name: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        post('/contact/submit', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <StorefrontLayout meta={meta}>
            <div className="bg-white min-h-[85vh]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
                    
                    {/* SECTION 1: TOP HERO (Contact Us + Botanical Illustration) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left Column: Heading & Description */}
                        <div className="lg:col-span-7 space-y-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight flex items-baseline gap-2.5">
                                    <span className="relative inline-block">
                                        Contact
                                        <span className="absolute left-0 -bottom-1 w-12 h-1 bg-[#0B3E25] rounded-full" />
                                    </span>
                                    <span className="text-[#0B3E25]">Us</span>
                                </h1>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl pt-1">
                                We value your feedback and are here to assist you. If you have any questions, concerns, or need support, please feel free to reach out to our customer service team. We are available to help you during our business hours.
                            </p>
                        </div>

                        {/* Right Column: Decorative Botanical Plant & Leaves Graphic */}
                        <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
                            <div className="relative w-72 sm:w-80 h-48 sm:h-56 flex items-center justify-center">
                                {/* Soft organic backdrop splash */}
                                <div className="absolute right-4 top-2 w-48 h-48 sm:w-56 sm:h-56 bg-[#EAF5ED] rounded-[40%_60%_70%_30%/40%_50%_60%_55%] opacity-90 -z-10" />
                                <div className="absolute -left-2 bottom-4 w-16 h-16 bg-[#F4FAF6] rounded-full opacity-70 -z-10" />

                                {/* Plant & Herb Composition */}
                                <div className="relative flex items-center justify-center">
                                    <img
                                        src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80"
                                        alt="Herbal Plant"
                                        className="w-44 sm:w-48 h-44 sm:h-48 object-cover rounded-3xl shadow-sm rotate-2 hover:rotate-0 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    {/* Floating Leaf Badges */}
                                    <div className="absolute -top-3 -left-4 bg-white/90 backdrop-blur-xs p-2 rounded-2xl shadow-xs border border-emerald-100 flex items-center gap-1.5 animate-bounce duration-1000">
                                        <span className="text-base">🌿</span>
                                        <span className="text-[11px] font-bold text-[#0B3E25]">১০০% বিশুদ্ধ</span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-2xl shadow-xs border border-emerald-100 flex items-center gap-1">
                                        <span className="text-xs">✨</span>
                                        <span className="text-[10px] font-bold text-gray-700">সরাসরি সেবা</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: THREE CONTACT INFO CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 1. Hotline 24/7 */}
                        <a
                            href={`tel:${cleanPhone}`}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex items-start gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#EAF5ED] text-[#0B3E25] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#0B3E25] group-hover:text-white transition-all duration-300">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs font-semibold text-gray-500 block">Hotline 24/7</span>
                                <span className="text-base sm:text-lg font-black text-[#0B3E25] block truncate mt-0.5 tracking-tight font-sans">
                                    {phone}
                                </span>
                                <span className="text-xs text-gray-400 block mt-1">We are always here to help you</span>
                            </div>
                        </a>

                        {/* 2. Email */}
                        <a
                            href={`mailto:${email}`}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex items-start gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#EAF5ED] text-[#0B3E25] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#0B3E25] group-hover:text-white transition-all duration-300">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs font-semibold text-gray-500 block">Email</span>
                                <span className="text-base sm:text-lg font-black text-[#0B3E25] block truncate mt-0.5 tracking-tight font-sans">
                                    {email}
                                </span>
                                <span className="text-xs text-gray-400 block mt-1">We reply as soon as possible</span>
                            </div>
                        </a>

                        {/* 3. Address */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-[#EAF5ED] text-[#0B3E25] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#0B3E25] group-hover:text-white transition-all duration-300">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs font-semibold text-gray-500 block">Address</span>
                                <span className="text-sm sm:text-base font-bold text-[#0B3E25] block mt-0.5 leading-snug line-clamp-2">
                                    {address}
                                </span>
                                <span className="text-xs text-gray-400 block mt-1">Visit our central office</span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: LIVE CHAT SECTION */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Text */}
                            <div className="lg:col-span-4 space-y-2">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                    <span className="relative inline-block">
                                        Live
                                        <span className="absolute left-0 -bottom-1 w-10 h-1 bg-[#0B3E25] rounded-full" />
                                    </span>{' '}
                                    Chat
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed pt-1">
                                    Choose your preferred way to start a conversation with our support team.
                                </p>
                            </div>

                            {/* Right 2 Chat Cards */}
                            <div className="lg:col-span-8 relative">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    
                                    {/* 1. Messenger Chat Card */}
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
                                        <div className="w-14 h-14 rounded-full bg-[#0084FF]/10 text-[#0084FF] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            {/* Messenger Logo SVG */}
                                            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.513 3.735 7.209v3.533l3.385-1.86c.925.257 1.905.397 2.88.397 5.523 0 10-4.145 10-9.279C22 6.145 17.523 2 12 2zm1.066 12.443l-2.583-2.756-5.044 2.756 5.549-5.894 2.65 2.756 4.977-2.756-5.549 5.894z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900">Chat on Messenger</h3>
                                        <p className="text-xs text-gray-500 mt-0.5 mb-5">Tap to open a live chat</p>
                                        
                                        <a
                                            href={messenger}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-6 py-2 rounded-full bg-[#EEF5FD] hover:bg-[#0084FF] text-[#0084FF] hover:text-white text-xs font-bold transition-all duration-200 shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <span>Start Chat</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </a>

                                        {/* Subtle bottom wavy background */}
                                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50/60 rounded-full -z-10" />
                                        <div className="absolute -bottom-8 -left-6 w-24 h-24 bg-blue-50/40 rounded-full -z-10" />
                                    </div>

                                    {/* 2. WhatsApp Chat Card */}
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
                                        <div className="w-14 h-14 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            {/* WhatsApp Logo SVG */}
                                            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                                                <path d="M12.031 2c-5.508 0-9.984 4.475-9.984 9.984 0 1.76.459 3.479 1.332 4.999l-1.417 5.176 5.302-1.391c1.464.798 3.119 1.218 4.767 1.218 5.508 0 9.984-4.476 9.984-9.985s-4.476-10.001-9.982-10.001zm5.82 14.184c-.244.686-1.42 1.309-1.96 1.352-.518.04-1.196.06-3.879-1.05-3.21-1.328-5.267-4.59-5.428-4.805-.158-.214-1.298-1.728-1.298-3.298 0-1.57.82-2.343 1.111-2.666.291-.322.637-.402.849-.402.213 0 .426.002.612.012.199.01.464-.076.726.552.27.647.92 2.25.999 2.413.08.163.133.355.027.573-.107.218-.16.353-.319.541-.16.188-.337.42-.481.564-.16.16-.328.334-.141.656.187.322.83 1.368 1.782 2.216 1.226 1.092 2.259 1.43 2.581 1.59.322.16.51.134.7-.085.191-.219.82-1.025 1.04-1.378.22-.353.439-.295.736-.186.297.109 1.884.888 2.207 1.049.323.161.539.241.618.376.08.135.08.784-.164 1.47z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900">Chat on Whatsapp</h3>
                                        <p className="text-xs text-gray-500 mt-0.5 mb-5">Tap to start a conversation</p>
                                        
                                        <a
                                            href={`https://wa.me/880${cleanWhatsapp}?text=${encodeURIComponent('হ্যালো পুষ্টি কুঞ্জ! আমি আপনাদের পণ্য ও সেবা সম্পর্কে জানতে চাচ্ছি।')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-6 py-2 rounded-full bg-[#EAF5ED] hover:bg-[#25D366] text-[#0B3E25] hover:text-white text-xs font-bold transition-all duration-200 shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <span>Start Chat</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </a>

                                        {/* Subtle bottom wavy background */}
                                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-50/60 rounded-full -z-10" />
                                        <div className="absolute -bottom-8 -left-6 w-24 h-24 bg-emerald-50/40 rounded-full -z-10" />
                                    </div>
                                </div>

                                {/* Playful Curly Doodle Arrow pointing to WhatsApp Card (matching screenshot) */}
                                <div className="hidden xl:block absolute -right-8 bottom-2 transform translate-x-full pointer-events-none">
                                    <svg width="48" height="58" viewBox="0 0 48 58" fill="none" className="text-emerald-500">
                                        <path 
                                            d="M38 4C38 4 36 20 20 28C6 35 4 48 18 52C28 55 38 44 26 38" 
                                            stroke="currentColor" 
                                            strokeWidth="2.5" 
                                            strokeLinecap="round" 
                                            strokeDasharray="4 2"
                                        />
                                        <path 
                                            d="M22 36L26 38L28 33" 
                                            stroke="currentColor" 
                                            strokeWidth="2.5" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: 4 BOTTOM ASSURANCE BADGES */}
                    <div className="bg-[#EEF7F0] border border-[#D5EAD9] rounded-3xl p-6 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {/* 1. Dedicated Support */}
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-full bg-[#0B3E25] text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <Headphones className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 leading-tight">Dedicated Support</h4>
                                    <p className="text-xs text-gray-600 mt-1 leading-normal">
                                        Our team is ready to assist you anytime.
                                    </p>
                                </div>
                            </div>

                            {/* 2. Reliable Service */}
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-full bg-[#0B3E25] text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 leading-tight">Reliable Service</h4>
                                    <p className="text-xs text-gray-600 mt-1 leading-normal">
                                        We are committed to providing excellent service.
                                    </p>
                                </div>
                            </div>

                            {/* 3. Customer Satisfaction */}
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-full bg-[#0B3E25] text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 leading-tight">Customer Satisfaction</h4>
                                    <p className="text-xs text-gray-600 mt-1 leading-normal">
                                        Your satisfaction is our top priority.
                                    </p>
                                </div>
                            </div>

                            {/* 4. Business Hours */}
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-full bg-[#0B3E25] text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 leading-tight">Business Hours</h4>
                                    <p className="text-xs text-gray-600 mt-1 leading-normal">
                                        We are available during our business hours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: SEND MESSAGE FORM (Interactive Option) */}
                    <div className="pt-2">
                        {!showForm ? (
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[#0B3E25] text-xs sm:text-sm font-bold shadow-2xs hover:shadow-md transition-all cursor-pointer"
                                >
                                    <Send className="w-4 h-4 text-emerald-600" />
                                    <span>সরাসরি বার্তা পাঠাতে চান? ফর্মটি পূরণ করুন</span>
                                </button>
                            </div>
                        ) : (
                            <div className="max-w-2xl mx-auto bg-gray-50/60 rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900">আমাদের বার্তা পাঠান</h3>
                                        <p className="text-xs text-gray-500">আপনার প্রশ্ন বা মতামত লিখে পাঠান, আমরা দ্রুত উত্তর দেব।</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
                                    >
                                        লুকান ✕
                                    </button>
                                </div>

                                {recentlySuccessful && (
                                    <div className="p-3.5 bg-emerald-100 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-semibold">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                        <span>আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে! দ্রুত যোগাযোগ করা হবে।</span>
                                    </div>
                                )}

                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                                আপনার নাম <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="উদা: মোঃ আরিফুল ইসলাম"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25] bg-white"
                                            />
                                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                        </div>

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
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25] bg-white"
                                            />
                                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            ইমেইল ঠিকানা (ঐচ্ছিক)
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25] bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            আপনার বার্তা <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            placeholder="আপনার প্রশ্ন বা মতামত এখানে বিস্তারিত লিখুন..."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3E25] bg-white resize-none"
                                        />
                                        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 bg-[#0B3E25] hover:bg-[#072F1C] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {processing ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </StorefrontLayout>
    );
}
