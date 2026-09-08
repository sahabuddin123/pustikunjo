import React from 'react';
import { usePage } from '@inertiajs/react';
import { PhoneCall, MessageCircle } from 'lucide-react';

export default function ContactStripBlock({ data = {} }) {
    const { siteConfig, header } = usePage().props;
    const phone = siteConfig?.phone || header?.hotline_phone || '01700-000000';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const whatsapp = siteConfig?.whatsapp || '01700000000';
    const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

    const title = data.title || 'কিছু জানার আছে?';
    const text = data.text || 'পণ্য বা অর্ডার সংক্রান্ত যেকোনো প্রয়োজনে সরাসরি কল করুন অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন।';

    return (
        <section className="w-full bg-[#072F1C] text-white py-5 sm:py-6 border-b border-emerald-900/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                {/* Left: Text info */}
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                        {title}
                    </h3>
                    <p className="text-sm sm:text-base text-emerald-100 mt-1 max-w-xl font-normal">
                        {text}
                    </p>
                </div>

                {/* Right: Phone button & WhatsApp button */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Phone Button */}
                    <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#D49B28] hover:bg-[#c48e22] text-white text-sm sm:text-base font-bold shadow-xs transition-all"
                        title="ফোনে কল করুন"
                    >
                        <PhoneCall className="w-4 h-4 fill-current" />
                        <span>{phone}</span>
                    </a>

                    {/* WhatsApp Button */}
                    <a
                        href={`https://wa.me/880${cleanWhatsapp}?text=${encodeURIComponent('হ্যালো পুষ্টি কুঞ্জ! পণ্য সম্পর্কে জানতে চাই।')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm sm:text-base font-bold shadow-xs transition-all"
                        title="WhatsApp এ মেসেজ করুন"
                    >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>WhatsApp</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
