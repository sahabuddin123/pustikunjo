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
                            href={`https://wa.me/880${cleanWhatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#092B19] hover:bg-[#072013] border border-emerald-700/60 text-emerald-300 hover:text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer"
                        >
                            <MessageCircle className="w-4 h-4 fill-current text-emerald-400" />
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
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-white text-[#0B3E25] flex items-center justify-center shadow-xs">
                                    <Leaf className="w-5 h-5 fill-current text-[#0B3E25]" />
                                </div>
                                <div>
                                    <span className="text-xl font-black tracking-tight text-white block">
                                        {siteConfig?.name || 'পুষ্টি কুঞ্জ'}
                                    </span>
                                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest block">
                                        {siteConfig?.tagline || 'BACK TO NATURE'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                {aboutText}
                            </p>

                            {/* Social Icons */}
                            <div className="flex items-center gap-2.5 pt-1">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors text-xs font-bold"
                                    title="Facebook"
                                >
                                    f
                                </a>
                                <a
                                    href={`https://wa.me/880${cleanWhatsapp}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-colors text-xs font-bold"
                                    title="WhatsApp"
                                >
                                    <MessageCircle className="w-4 h-4 fill-current" />
                                </a>
                            </div>
                        </div>

                        {/* Col 2: Quick Links */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-800/60 pb-1.5 inline-block">
                                Quick Links
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm font-normal">
                                <li>
                                    <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/consultation" className="text-gray-300 hover:text-white transition-colors">
                                        Hakim Consultation
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/checkout" className="text-gray-300 hover:text-white transition-colors">
                                        Cart
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                                        Blog
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Useful Links */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-800/60 pb-1.5 inline-block">
                                Useful Links
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm font-normal">
                                <li>
                                    <Link href="/about-us" className="text-gray-300 hover:text-white transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                                        Cookie Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                                        Terms and Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/refund-policy" className="text-gray-300 hover:text-white transition-colors">
                                        Return and Refund
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: Help Center */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-800/60 pb-1.5 inline-block">
                                Help Center
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm font-normal">
                                <li>
                                    <Link href="/track-order" className="text-gray-300 hover:text-white transition-colors">
                                        Order Tracking
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/how-to-order" className="text-gray-300 hover:text-white transition-colors">
                                        How to Order (অর্ডার নির্দেশিকা)
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/complaint" className="text-emerald-400 font-semibold hover:text-white transition-colors flex items-center gap-1.5">
                                        <span>Complaint (অভিযোগ)</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/refund-policy" className="text-gray-300 hover:text-white transition-colors">
                                        Product Returns
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 5: Contact */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-800/60 pb-1.5 inline-block">
                                Contact
                            </h4>
                            <div className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <a href={`tel:${cleanPhone}`} className="hover:text-white">
                                        {phone}
                                    </a>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{siteConfig?.address || 'লেভেল-৫, নূর টাওয়ার, ১১০ বীর উত্তম সি আর দত্ত রোড, ঢাকা ১২০৫'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <a href={`mailto:${siteConfig?.email || 'info@pustikunjo.com.bd'}`} className="hover:text-white">
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
                        <div className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            <span>১০০% খাঁটি ও গুণমান নিশ্চিত স্বাস্থ্যপণ্য</span>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
