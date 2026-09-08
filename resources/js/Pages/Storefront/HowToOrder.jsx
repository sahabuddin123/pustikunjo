import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { 
    ShoppingBag, 
    Truck, 
    CreditCard, 
    ShieldCheck, 
    CheckCircle2, 
    PhoneCall, 
    MessageCircle, 
    Search, 
    PackageCheck, 
    AlertCircle, 
    Clock, 
    HelpCircle, 
    ArrowRight,
    MapPin,
    Mail
} from 'lucide-react';

export default function HowToOrder({ page = null, contact = {}, meta = {} }) {
    const phone = contact.phone || '09678812525';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const whatsapp = contact.whatsapp || '01700000000';
    const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

    const hasDynamicContent = Boolean(page?.content && page.content.trim().length > 20);

    return (
        <StorefrontLayout meta={meta}>
            <div className="bg-[#FAFBF9] min-h-screen py-10 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    
                    {/* Header Section matching screenshot */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-widest uppercase">
                            PUSTI KUNJO • BACK TO NATURE
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                            {page?.title || 'কীভাবে অর্ডার করবেন'}
                        </h1>
                        <p className="text-emerald-700 font-bold text-base sm:text-lg">
                            সহজ ৪টি ধাপে অর্ডার করার নিয়ম
                        </p>
                        <div className="max-w-2xl mx-auto p-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs text-gray-600 text-sm sm:text-base leading-relaxed">
                            পুষ্টি কুঞ্জ থেকে পণ্য অর্ডার করা অত্যন্ত সহজ এবং নিরাপদ। নিচে বিস্তারিত গাইডলাইন দেওয়া হলো যাতে আপনি যেকোনো সময় সহজে ও নিশ্চিন্তে আপনার পছন্দের খাঁটি ও পুষ্টিকর স্বাস্থ্যপণ্য অর্ডার করতে পারেন।
                        </div>
                    </div>

                    {/* Dynamic CKEditor Content */}
                    {hasDynamicContent ? (
                        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 shadow-xs">
                            <div 
                                className="prose prose-emerald max-w-none text-gray-800 leading-relaxed font-sans"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </div>
                    ) : (
                        <>

                    {/* Section 1: এক নজরে ৪টি ধাপ (Table matching reference) */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="bg-[#0B3E25] px-6 py-3.5 text-white flex items-center justify-between">
                            <h2 className="font-bold text-base sm:text-lg">
                                এক নজরে ৪টি ধাপ
                            </h2>
                            <span className="text-xs text-emerald-200 font-semibold">
                                দ্রুত অর্ডার গাইড
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#104D30] text-white text-xs font-bold uppercase">
                                    <tr>
                                        <th className="px-5 py-3 w-28">ধাপ</th>
                                        <th className="px-5 py-3">প্রক্রিয়া</th>
                                        <th className="px-5 py-3">সময়সীমা / বিবরণ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-800">
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800 whitespace-nowrap">ধাপ ১</td>
                                        <td className="px-5 py-3.5 font-medium">পণ্য নির্বাচন ও ভ্যারিয়েন্ট সাইজ বাছাই</td>
                                        <td className="px-5 py-3.5 text-gray-600">৩০ সেকেন্ড</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors bg-gray-50/50">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800 whitespace-nowrap">ধাপ ২</td>
                                        <td className="px-5 py-3.5 font-medium">'অর্ডার করুন' বাটনে ক্লিক করে নাম, মোবাইল ও ঠিকানা দিন</td>
                                        <td className="px-5 py-3.5 text-gray-600">১ মিনিট</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800 whitespace-nowrap">ধাপ ৩</td>
                                        <td className="px-5 py-3.5 font-medium">পেমেন্ট মেথড বাছাই (ক্যাশ অন ডেলিভারি বা বিকাশ)</td>
                                        <td className="px-5 py-3.5 text-gray-600">তাৎক্ষণিক</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors bg-gray-50/50">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800 whitespace-nowrap">ধাপ ৪</td>
                                        <td className="px-5 py-3.5 font-medium">অর্ডার নিশ্চিতকরণ — স্ক্রিন ও মোবাইলে কনফার্মেশন SMS</td>
                                        <td className="px-5 py-3.5 text-emerald-700 font-bold">সম্পূর্ণ সফল</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section 2: বিস্তারিত অর্ডার নির্দেশিকা */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="border-b border-gray-200 pb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                বিস্তারিত অর্ডার নির্দেশিকা
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                প্রতিটি ধাপ সহজভাবে সম্পন্ন করার নিয়মাবলী
                            </p>
                        </div>

                        <div className="space-y-6 text-sm sm:text-base text-gray-700">
                            
                            {/* Step 1 */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-emerald-800 text-base sm:text-lg flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">১</span>
                                    <span>পণ্য নির্বাচন ও ব্যাগে যুক্ত করুন:</span>
                                </h3>
                                <p className="leading-relaxed pl-8 text-gray-600">
                                    আমাদের ওয়েবসাইট বা <Link href="/shop" className="text-emerald-700 font-bold hover:underline">শপ পেজ</Link> ব্রাউজ করে আপনার পছন্দের অর্গানিক বা পুষ্টিপণ্যটি বেছে নিন। আপনার পছন্দমতো পণ্যের সাইজ বা ভ্যারিয়েন্ট নির্বাচন করে সরাসরি <strong>"অর্ডার করুন"</strong> অথবা <strong>"কার্টে যোগ করুন"</strong> বাটনে ক্লিক করুন।
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-emerald-800 text-base sm:text-lg flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">২</span>
                                    <span>চেকআউট ফর্মে কাস্টমার তথ্য দিন:</span>
                                </h3>
                                <p className="leading-relaxed pl-8 text-gray-600">
                                    চেকআউট পেজে গিয়ে আপনার সঠিক তথ্য প্রদান করুন:
                                </p>
                                <ul className="list-disc list-inside pl-10 space-y-1 text-gray-600 text-sm">
                                    <li>আপনার পুরো নাম (Full Name)</li>
                                    <li>সচল মোবাইল নম্বর (যেটিতে ডেলিভারির দিন রাইডার যোগাযোগ করতে পারবে)</li>
                                    <li>সম্পূর্ণ ডেলিভারি ঠিকানা (জেলা, থানা/উপজেলা, এরিয়া, বাসা ও রোড নম্বর)</li>
                                </ul>
                            </div>

                            {/* Step 3 */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-emerald-800 text-base sm:text-lg flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">৩</span>
                                    <span>ডেলিভারি চার্জ ও কুপন কোড:</span>
                                </h3>
                                <p className="leading-relaxed pl-8 text-gray-600">
                                    আপনার ডেলিভারি ঠিকানা অনুযায়ী ডেলিভারি চার্জ স্বয়ংক্রিয়ভাবে মোট মূল্যের সাথে যুক্ত হবে (ঢাকা সিটি ৭০ টাকা, ঢাকার বাইরে ১২০ টাকা)। আপনার কাছে কোনো প্রমোশনাল ডিসকাউন্ট কুপন কোড থাকলে তা 'কুপন প্রয়োগ' বক্সে লিখে অ্যাপ্লাই করুন।
                                </p>
                            </div>

                            {/* Special Note Box */}
                            <div className="ml-8 p-4 rounded-xl bg-[#EBF4EC] border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block">বিশেষ দ্রষ্টব্য:</span>
                                    <span>ক্যাশ অন ডেলিভারিতে অর্ডার করতে কোনো প্রকার অগ্রিম পেমেন্ট বা টাকা দিতে হয় না। কোনো গোপন চার্জ নেই।</span>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-emerald-800 text-base sm:text-lg flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">৪</span>
                                    <span>পেমেন্ট পদ্ধতি নির্বাচন করুন:</span>
                                </h3>
                                <div className="pl-8 space-y-2">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <strong className="text-gray-900 block">১. ক্যাশ অন ডেলিভারি (Cash on Delivery):</strong>
                                        <span className="text-gray-600 text-sm">পণ্য ডেলিভারি ম্যানের কাছ থেকে হাতে পেয়ে দেখে মূল্য পরিশোধ করুন।</span>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <strong className="text-gray-900 block">২. বিকাশ (bKash Payment):</strong>
                                        <span className="text-gray-600 text-sm">বিকাশ অপশন বেছে নিয়ে নির্দেশনানুযায়ী দ্রুত ও নিরাপদ অনলাইন পেমেন্ট সম্পন্ন করুন।</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-emerald-800 text-base sm:text-lg flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">৫</span>
                                    <span>অর্ডার নিশ্চিত করুন:</span>
                                </h3>
                                <p className="leading-relaxed pl-8 text-gray-600">
                                    সব তথ্য ঠিক থাকলে <strong>"অর্ডার কনফার্ম করুন"</strong> বাটনে ক্লিক করুন। সাথে সাথে স্ক্রিনে আপনার অর্ডার নম্বর (যেমন: PK-260908-XXXX) প্রদর্শিত হবে এবং আপনার মোবাইলে একটি নিশ্চিতকরণ SMS বার্তা পৌঁছে যাবে।
                                </p>
                            </div>

                            {/* Step 6 */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-emerald-800 text-base sm:text-lg flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">৬</span>
                                    <span>ডেলিভারি সময়সীমা:</span>
                                </h3>
                                <div className="pl-8 space-y-2 text-gray-600">
                                    <p>অর্ডার কনফার্ম হওয়ার পর আমাদের নিজস্ব টিম সতর্কতার সাথে স্বাস্থ্যসম্মত প্যাকেজিং করে কুরিয়ারে হস্তান্তর করে:</p>
                                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                        <li><strong>ঢাকা সিটির ভেতরে:</strong> ২৪ থেকে ৪৮ ঘণ্টার মধ্যে দ্রুত হোম ডেলিভারি।</li>
                                        <li><strong>ঢাকা সিটির বাইরে ও সমগ্র বাংলাদেশে:</strong> ২ থেকে ৩ কর্মদিবসের মধ্যে জেলা/উপজেলা পর্যায়ে ডেলিভারি।</li>
                                        <li><strong>কুরিয়ার পার্টনার:</strong> স্টেডফাস্ট ও পাঠাও কুরিয়ারের মাধ্যমে দেশজুড়ে ক্যাশ অন ডেলিভারি সুবিধা।</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Step 7 */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-emerald-800 text-base sm:text-lg flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">৭</span>
                                    <span>পার্সেল লাইভ ট্র্যাকিং:</span>
                                </h3>
                                <p className="leading-relaxed pl-8 text-gray-600">
                                    পার্সেল কুরিয়ারে প্রেরণের সাথে সাথে আপনার ফোনে ট্র্যাকিং নম্বরসহ SMS পাঠানো হবে। আমাদের ওয়েবসাইটের <Link href="/track-order" className="text-emerald-700 font-bold hover:underline">অর্ডার ট্র্যাকিং পেজে</Link> গিয়ে আপনার অর্ডার নম্বর ও ফোন নম্বর দিয়ে সরাসরি পার্সেলের বর্তমান অবস্থান ট্র্যাক করতে পারবেন।
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Section 3: ডেলিভারি চার্জের তালিকা (Table matching screenshot) */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="bg-[#0B3E25] px-6 py-3.5 text-white">
                            <h2 className="font-bold text-base sm:text-lg">
                                ডেলিভারি চার্জের তালিকা
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#104D30] text-white text-xs font-bold uppercase">
                                    <tr>
                                        <th className="px-5 py-3 w-20">ক্রম</th>
                                        <th className="px-5 py-3">অঞ্চল / এরিয়া</th>
                                        <th className="px-5 py-3">চার্জ</th>
                                        <th className="px-5 py-3">আনুমানিক সময়</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-800">
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">১</td>
                                        <td className="px-5 py-3.5 font-semibold">ঢাকা সিটি কর্পোরেশন (ভিতরে)</td>
                                        <td className="px-5 py-3.5 font-bold text-emerald-700">৭০ টাকা</td>
                                        <td className="px-5 py-3.5 text-gray-600">২৪ - ৪৮ ঘণ্টা</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors bg-gray-50/50">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">২</td>
                                        <td className="px-5 py-3.5 font-semibold">ঢাকা সাব-এরিয়া (সাভার, কেরানীগঞ্জ, গাজীপুর)</td>
                                        <td className="px-5 py-3.5 font-bold text-emerald-700">১০০ টাকা</td>
                                        <td className="px-5 py-3.5 text-gray-600">১ - ২ কার্যদিবস</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">৩</td>
                                        <td className="px-5 py-3.5 font-semibold">সমগ্র বাংলাদেশ (ঢাকার বাইরে সকল জেলা ও উপজেলা)</td>
                                        <td className="px-5 py-3.5 font-bold text-emerald-700">১২০ টাকা</td>
                                        <td className="px-5 py-3.5 text-gray-600">২ - ৩ কার্যদিবস</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-[#EBF4EC] border-t border-emerald-100 text-emerald-900 text-xs sm:text-sm font-medium">
                            💡 <strong>গুরুত্বপূর্ণ নোট:</strong> বিশেষ অফার বা নির্দিষ্ট টাকার বেশি অর্ডারে ফ্রি ডেলিভারি সুবিধা প্রযোজ্য হতে পারে।
                        </div>
                    </div>

                    {/* Section 4: পণ্য গ্রহণ ও আনবক্সিং সতর্কতা */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            <span>পণ্য গ্রহণ ও আনবক্সিং সতর্কতা</span>
                        </h2>
                        <ul className="space-y-2.5 text-sm text-gray-600 list-disc list-inside leading-relaxed pl-2">
                            <li>ডেলিভারি ম্যানের উপস্থিতিতে পার্সেলটি ভালো করে দেখে বুঝে নিন।</li>
                            <li>কোনো ত্রুটি, ভুল পণ্য বা প্যাকেজিং ক্ষতিগ্রস্ত মনে হলে ডেলিভারি ম্যান থাকা অবস্থাতেই একটি আনবক্সিং ভিডিও করুন অথবা আমাদের হটলাইনে জানান।</li>
                            <li>প্যাকেট অক্ষত রেখে রিটার্ন করতে চাইলে আমাদের <Link href="/refund-policy" className="text-emerald-700 font-bold hover:underline">রিফান্ড ও রিটার্ন পলিসি</Link> অনুসরণ করুন।</li>
                            <li>যেকোনো অভিযোগ দ্রুত জানাতে আমাদের <Link href="/complaint" className="text-emerald-700 font-bold hover:underline">অভিযোগ দাখিল পেজে</Link> ছবিসহ অভিযোগ জানাতে পারেন।</li>
                        </ul>
                    </div>

                    {/* Section 5: সরাসরি ফোনে বা হোয়াটসঅ্যাপে অর্ডার */}
                    <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">
                                    সরাসরি ফোনে বা হোয়াটসঅ্যাপে অর্ডার করতে চান?
                                </h3>
                                <p className="text-xs sm:text-sm text-emerald-300 mt-1">
                                    ওয়েবসাইটে সমস্যা হলে সরাসরি কল দিন অথবা হোয়াটসঅ্যাপে নাম-ঠিকানা মেসেজ করে দিন।
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                <a
                                    href={`tel:${cleanPhone}`}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D99A26] hover:bg-[#c5891e] text-white text-sm font-bold shadow-xs transition-all"
                                >
                                    <PhoneCall className="w-4 h-4" />
                                    <span>{phone}</span>
                                </a>
                                <a
                                    href={`https://wa.me/880${cleanWhatsapp}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-xs transition-all"
                                >
                                    <MessageCircle className="w-4 h-4 fill-current" />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Section 6: সাহায্য প্রয়োজন? (Contacts Table) */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="bg-[#0B3E25] px-6 py-3.5 text-white">
                            <h2 className="font-bold text-base sm:text-lg">
                                সাহায্য প্রয়োজন?
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#104D30] text-white text-xs font-bold uppercase">
                                    <tr>
                                        <th className="px-5 py-3 w-40">মাধ্যম</th>
                                        <th className="px-5 py-3">ঠিকানা / নম্বর</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-800">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">হটলাইন নম্বর</td>
                                        <td className="px-5 py-3.5 font-medium">{phone} (সকাল ৯টা - রাত ১০টা)</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">হোয়াটসঅ্যাপ</td>
                                        <td className="px-5 py-3.5 font-medium">{whatsapp}</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">ইমেইল</td>
                                        <td className="px-5 py-3.5 font-medium">{contact.email || 'info@pustikunjo.com.bd'}</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">অফিস ঠিকানা</td>
                                        <td className="px-5 py-3.5 font-medium">{contact.address || 'লেভেল-৫, নূর টাওয়ার, ১১০ বীর উত্তম সি আর দত্ত রোড, ঢাকা ১২০৫'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Action CTAs */}
                    <div className="text-center pt-4 pb-8 space-y-3">
                        <p className="text-sm font-bold text-gray-700">
                            পুষ্টি কুঞ্জ, শতভাগ নির্ভেজাল প্রাকৃতিক খাদ্য উপাদান।
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all"
                            >
                                <span>শপ থেকে কেনাকাটা করুন</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                href="/track-order"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm shadow-2xs transition-all"
                            >
                                <Truck className="w-4 h-4 text-emerald-600" />
                                <span>অর্ডার ট্র্যাক করুন</span>
                            </Link>
                        </div>
                    </div>
                    </>
                    )}

                </div>
            </div>
        </StorefrontLayout>
    );
}
