import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Send, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { trackEvent } from '@/Services/Analytics';

export default function ContactFormBlock({ data = {} }) {
    const heading = data.heading || 'আমাদের সাথে যোগাযোগ করুন';
    const subheading = data.subheading || 'যে কোনো পণ্য বা স্বাস্থ্য সম্পর্কিত তথ্যের জন্য বার্তা পাঠান';

    const { data: form, setData, post, processing, reset, wasSuccessful } = useForm({
        name: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact/submit', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                trackEvent('generate_lead', { channel: 'contact_form' });
            }
        });
    };

    return (
        <section className="py-12 sm:py-16 bg-[#F8FAF8]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        {heading}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        {subheading}
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    {wasSuccessful && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span>আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে! আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-bold text-gray-700 block mb-1">
                                    আপনার নাম <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="যেমন: তানভীর হাসান"
                                    value={form.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 text-sm"
                                />
                            </div>

                            <div>
                                <label className="font-bold text-gray-700 block mb-1">
                                    মোবাইল নম্বর <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="যেমন: 01700000000"
                                    value={form.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-bold text-gray-700 block mb-1">
                                ইমেইল ঠিকানা (ঐচ্ছিক)
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 text-sm"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-gray-700 block mb-1">
                                আপনার বার্তা বা জিজ্ঞাসা <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="আপনার প্রশ্ন বা মতামত বিস্তারিত লিখুন..."
                                value={form.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 text-sm leading-relaxed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                            <span>{processing ? 'বার্তা পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
