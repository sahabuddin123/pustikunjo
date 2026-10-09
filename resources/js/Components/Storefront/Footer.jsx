import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Leaf, Phone, Mail, MapPin, ShieldCheck, Heart, MessageCircle, PhoneCall } from 'lucide-react';

export default function Footer() {
    const { siteConfig, footer } = usePage().props;

    const aboutText = footer?.about_text || 'পুষ্টি কুঞ্জ একটি বিশ্বস্ত স্বাস্থ্য ও ভেষজ অর্গানিক ফুড ব্র্যান্ড। আমাদের লক্ষ্য প্রতিটি সচেতন ঘরে শতভাগ নির্ভেজাল পুষ্টি ও প্রাকৃতিক সুস্থতা উপহার দেওয়া।';
    const copyright = footer?.copyright_text || '© ২০২৬ পুষ্টি কুঞ্জ। সর্বস্বত্ব সংরক্ষিত।';

    const phone = siteConfig?.phone || '09678812525';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const whatsapp = siteConfig?.whatsapp || '01700000000';
    const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

    const socialLinks = footer?.social_links || {};
    const fbUrl = socialLinks.facebook || 'https://facebook.com';
    const ytUrl = socialLinks.youtube || 'https://youtube.com';
    const instaUrl = socialLinks.instagram || 'https://instagram.com';
    const rawWhatsapp = socialLinks.whatsapp || siteConfig?.whatsapp || '01700000000';
    const cleanWaDigits = rawWhatsapp.replace(/[^0-9]/g, '');
    const waUrl = rawWhatsapp.startsWith('http')
        ? rawWhatsapp
        : `https://wa.me/${cleanWaDigits.startsWith('880') ? cleanWaDigits : '880' + cleanWaDigits.replace(/^0+/, '')}`;

    return (
        <div className="w-full">
            {/* Pre-Footer CTA Bar matching reference */}
            <div className="bg-[#0B3E25] text-white py-6 border-b border-emerald-900/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                            কিছু জানার আছে?
                        </h3>
                        <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                            অর্ডার, পণ্য বা ডেলিভারি — যেকোনো প্রশ্নে সরাসরি কথা বলুন
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <a
                            href={`tel:${cleanPhone}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D99A26] hover:bg-[#c5891e] text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer"
                        >
                            <PhoneCall className="w-4 h-4 fill-current" />
                            <span>{phone}</span>
                        </a>

                        <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#092B19] hover:bg-[#072013] border border-[#D99A26]/50 text-[#E5A93B] hover:text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer"
                        >
                            <MessageCircle className="w-4 h-4 fill-current text-[#E5A93B]" />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <footer className="bg-[#052013] text-gray-300 pt-14 pb-10 border-t border-emerald-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* 5-Column Grid matching reference */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-emerald-900/40">
                        
                        {/* Col 1: Brand Info & Social Icons */}
                        <div className="space-y-4">
                            <div className="flex items-center mb-1">
                                <Link href="/" className="inline-block hover:opacity-95 transition-opacity">
                                    <img
                                        src={siteConfig?.logo || "/images/logo-white.png"}
                                        alt={siteConfig?.name || "পুষ্টি কুঞ্জ"}
                                        className="h-10 sm:h-11 w-auto object-contain max-w-[200px]"
                                        onError={(e) => {
                                            if (e.currentTarget.src !== '/images/logo-white.png' && !e.currentTarget.src.endsWith('/images/logo-white.png')) {
                                                e.currentTarget.src = '/images/logo-white.png';
                                            }
                                        }}
                                    />
                                </Link>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                {aboutText}
                            </p>

                            {/* Dynamic Social Media Icons */}
                            <div className="space-y-2 pt-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                                    সোশ্যাল মিডিয়া ও চ্যানেল:
                                </span>
                                <div className="flex items-center gap-2">
                                    {/* Facebook */}
                                    <a
                                        href={fbUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-xs group"
                                        title="ফেসবুক পেজ (Facebook Page)"
                                        aria-label="ফেসবুক পেজ"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>

                                    {/* YouTube */}
                                    <a
                                        href={ytUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-xs group"
                                        title="ইউটিউব চ্যানেল (YouTube Channel)"
                                        aria-label="ইউটিউব চ্যানেল"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>

                                    {/* WhatsApp */}
                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-xs group"
                                        title="হোয়াটসঅ্যাপে চ্যাট (WhatsApp Chat)"
                                        aria-label="হোয়াটসঅ্যাপ"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.477-.15-.678.15-.201.3-.778.978-.954 1.179-.176.2-.351.226-.652.075s-1.272-.469-2.424-1.496c-.896-.799-1.501-1.786-1.677-2.087-.176-.3-.019-.463.132-.613.136-.134.301-.35.452-.526.15-.175.201-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.678-1.636-.929-2.241-.244-.588-.493-.508-.678-.518-.175-.009-.376-.011-.577-.011s-.527.075-.803.376c-.276.3-1.054 1.03-1.054 2.512 0 1.482 1.079 2.914 1.23 3.115.15.201 2.123 3.242 5.143 4.547.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.579-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.176-1.429-.075-.125-.276-.201-.577-.351zM12.04 21.785h-.002a9.78 9.78 0 0 1-4.992-1.372l-.358-.213-3.712.973.99-3.618-.233-.371A9.76 9.76 0 0 1 2.25 12.04c0-5.399 4.391-9.79 9.79-9.79a9.75 9.75 0 0 1 6.924 2.868 9.75 9.75 0 0 1 2.868 6.924c0 5.4-4.391 9.791-9.792 9.791zm0-18.04A8.25 8.25 0 0 0 3.79 12.04c0 1.633.483 3.153 1.316 4.434l.205.318-.621 2.27 2.327-.61.309.184a8.21 8.21 0 0 0 4.714 1.45h.002a8.25 8.25 0 0 0 8.25-8.25 8.22 8.22 0 0 0-2.417-5.834A8.22 8.22 0 0 0 12.04 3.745z" />
                                        </svg>
                                    </a>

                                    {/* Instagram */}
                                    <a
                                        href={instaUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-xs group"
                                        title="ইনস্টাগ্রাম প্রোফাইল (Instagram)"
                                        aria-label="ইনস্টাগ্রাম"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Col 2: Quick Links */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b-2 border-[#D99A26] pb-1.5 inline-block">
                                Quick Links
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm font-normal">
                                <li>
                                    <Link href="/shop" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/consultation" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Hakim Consultation
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/faq" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/checkout" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Cart
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Blog
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Useful Links */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b-2 border-[#D99A26] pb-1.5 inline-block">
                                Useful Links
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm font-normal">
                                <li>
                                    <Link href="/about-us" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Cookie Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Terms and Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/refund-policy" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Return and Refund
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: Help Center */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b-2 border-[#D99A26] pb-1.5 inline-block">
                                Help Center
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm font-normal">
                                <li>
                                    <Link href="/track-order" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Order Tracking
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/how-to-order" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        How to Order (অর্ডার নির্দেশিকা)
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/complaint" className="text-[#E5A93B] font-semibold hover:text-white transition-colors flex items-center gap-1.5">
                                        <span>Complaint (অভিযোগ)</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93B]"></span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/refund-policy" className="text-gray-300 hover:text-[#E5A93B] transition-colors">
                                        Product Returns
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 5: Contact */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b-2 border-[#D99A26] pb-1.5 inline-block">
                                Contact
                            </h4>
                            <div className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#E5A93B] shrink-0" />
                                    <a href={`tel:${cleanPhone}`} className="hover:text-[#E5A93B] transition-colors">
                                        {phone}
                                    </a>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-[#E5A93B] shrink-0 mt-0.5" />
                                    <span>{siteConfig?.address || 'লেভেল-৫, নূর টাওয়ার, ১১০ বীর উত্তম সি আর দত্ত রোড, ঢাকা ১২০৫'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#E5A93B] shrink-0" />
                                    <a href={`mailto:${siteConfig?.email || 'info@pustikunjo.com.bd'}`} className="hover:text-[#E5A93B] transition-colors">
                                        {siteConfig?.email || 'info@pustikunjo.com.bd'}
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                        <div>
                            {copyright}
                        </div>
                        <div className="flex items-center gap-1.5 text-[#E5A93B] font-medium">
                            <ShieldCheck className="w-4 h-4 text-[#E5A93B]" />
                            <span>১০০% খাঁটি ও গুণমান নিশ্চিত স্বাস্থ্যপণ্য</span>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
