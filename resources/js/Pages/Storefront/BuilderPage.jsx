import React from 'react';
import { useForm } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import BlockRenderer from '@/Components/Blocks/BlockRenderer';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function BuilderPage({ page, meta = {} }) {
    const blocks = page?.blocks || [];

    // Contact Form
    const contactForm = useForm({
        name: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleContactSubmit = (e) => {
        e.preventDefault();
        contactForm.post('/contact/submit', {
            preserveScroll: true,
            onSuccess: () => contactForm.reset(),
        });
    };

    return (
        <StorefrontLayout meta={meta}>
            {/* Page Header Banner */}
            <div className="bg-emerald-900 text-white py-12 border-b border-emerald-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        {page?.title || 'পুষ্টি কুঞ্জ'}
                    </h1>
                    <p className="text-emerald-100/80 text-sm sm:text-base">
                        খাঁটি ও স্বাস্থ্যসম্মত অর্গানিক খাদ্যপণ্য
                    </p>
                </div>
            </div>

            {/* If has blocks, render BlockRenderer */}
            {blocks.length > 0 ? (
                <BlockRenderer blocks={blocks} />
            ) : (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-8">
                        {page?.content && (
                            <div 
                                className="prose prose-emerald max-w-none text-gray-700 leading-relaxed text-base sm:text-lg"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        )}

                        {/* If contact page, render interactive contact form */}
                        {page?.slug === 'contact' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        যোগাযোগের ঠিকানা
                                    </h3>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <span>হটলাইন: 01700-000000</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <span>info@pustikunjo.com.bd</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <span>বাড়ি #১২, রোড #০৪, ধানমন্ডি, ঢাকা</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-emerald-50 text-xs text-emerald-900 font-medium">
                                        সকাল ৯টা থেকে রাত ১০টা পর্যন্ত আমাদের হটলাইন খোলা থাকে।
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        বার্তা পাঠান
                                    </h3>
                                    <form onSubmit={handleContactSubmit} className="space-y-3">
                                        <div>
                                            <input
                                                type="text"
                                                required
                                                placeholder="আপনার নাম *"
                                                value={contactForm.data.name}
                                                onChange={(e) => contactForm.setData('name', e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="মোবাইল নম্বর *"
                                                value={contactForm.data.phone}
                                                onChange={(e) => contactForm.setData('phone', e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                required
                                                rows={4}
                                                placeholder="আপনার বার্তা বা জিজ্ঞাসা লিখুন... *"
                                                value={contactForm.data.message}
                                                onChange={(e) => contactForm.setData('message', e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={contactForm.processing}
                                            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>বার্তা পাঠান</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </StorefrontLayout>
    );
}
