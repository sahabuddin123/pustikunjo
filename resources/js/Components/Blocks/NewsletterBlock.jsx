import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterBlock({ data }) {
    const heading = data.heading || 'পুষ্টি কুঞ্জের অফার ও স্বাস্থ্য টিপস পেতে যুক্ত থাকুন';
    const text = data.text || 'আপনার ইমেইল বা ফোন নম্বর দিয়ে সাবস্ক্রাইব করুন এবং বিশেষ ডিসকাউন্ট উপভোগ করুন।';
    const [input, setInput] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setSubmitted(true);
            setInput('');
        }
    };

    return (
        <section className="py-12 sm:py-16 bg-[#07381e] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Mail className="w-7 h-7" />
                </div>

                <div className="max-w-2xl mx-auto space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                        {heading}
                    </h2>
                    <p className="text-sm text-emerald-100/80">
                        {text}
                    </p>
                </div>

                {submitted ? (
                    <div className="p-4 rounded-xl bg-emerald-800/80 text-emerald-200 text-sm font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="আপনার মোবাইল নম্বর অথবা ইমেইল..."
                            required
                            className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm shadow-md transition-all"
                        >
                            সাবস্ক্রাইব
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
