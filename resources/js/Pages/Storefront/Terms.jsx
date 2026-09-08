import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { 
    ShieldCheck, 
    FileText, 
    Scale, 
    Truck, 
    CreditCard, 
    AlertCircle, 
    CheckCircle2, 
    PhoneCall, 
    MessageCircle, 
    HelpCircle, 
    ArrowRight,
    Lock,
    RefreshCw
} from 'lucide-react';

export default function Terms({ page = null, contact = {}, meta = {} }) {
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
                            {page?.title || 'শর্তাবলী ও পলিসিসমূহ'}
                        </h1>
                        <p className="text-emerald-700 font-bold text-base sm:text-lg">
                            পুষ্টি কুঞ্জ ব্যবহারের সাধারণ শর্তাবলী ও বিক্রয় নির্দেশিকা
                        </p>
                    </div>

                    {/* Dynamic CKEditor Content if edited in admin */}
                    {hasDynamicContent ? (
                        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 shadow-xs">
                            <div 
                                className="prose prose-emerald max-w-none text-gray-800 leading-relaxed font-sans"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </div>
                    ) : (
                        <>
                    {/* Green Alert Notice Box */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF4EC] border border-emerald-200/80 text-emerald-900 text-sm sm:text-base flex items-start gap-3 shadow-2xs">
                        <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <span className="font-bold text-emerald-950 block">
                                সেবাগ্রহণের পূর্বে শর্তাবলী মনোযোগ দিয়ে পড়ে নিন:
                            </span>
                            <p className="text-xs sm:text-sm text-emerald-800/90 leading-relaxed">
                                আমাদের ওয়েবসাইট ব্রাউজ, অ্যাকাউন্ট নিবন্ধন বা যেকোনো পণ্য অর্ডারের মাধ্যমে আপনি পুষ্টি কুঞ্জের এই সাধারণ শর্তাবলী, ডেলিভারি ও রিফান্ড পলিসির সাথে সম্পূর্ণ একমত পোষণ করছেন।
                            </p>
                        </div>
                    </div>

                    {/* Section 1: ভূমিকা */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-sm flex items-center justify-center font-black">১</span>
                            <span>ভূমিকা (Introduction)</span>
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed pl-9">
                            <strong>পুষ্টি কুঞ্জ (Pusti Kunjo)</strong> একটি বিশ্বস্ত প্রাকৃতিক ও স্বাস্থ্যসম্মত খাদ্য ব্র্যান্ড। আমাদের উদ্দেশ্য দেশের প্রতিটি পরিবারের কাছে শতভাগ নির্ভেজাল, পুষ্টিকর ও ভেষজ খাদ্যদ্রব্য নিরাপদে পৌঁছে দেওয়া। এই প্ল্যাটফর্মটি ব্যবহারের ক্ষেত্রে গ্রাহক এবং কর্তৃপক্ষের অধিকার, দায়িত্ব ও নিয়মাবলী স্পষ্টভাবে বজায় রাখার লক্ষ্যে নিম্নে নীতিমালাসমূহ প্রণীত হয়েছে।
                        </p>
                    </div>

                    {/* Section 2: এক নজরে মূল বিষয় (Table matching screenshot) */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="bg-[#0B3E25] px-6 py-3.5 text-white">
                            <h2 className="font-bold text-base sm:text-lg">
                                এক নজরে মূল বিষয়
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#104D30] text-white text-xs font-bold uppercase">
                                    <tr>
                                        <th className="px-5 py-3 w-44">বিষয়</th>
                                        <th className="px-5 py-3">তথ্য</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-800">
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">ব্র্যান্ড / প্রতিষ্ঠান</td>
                                        <td className="px-5 py-3.5 font-semibold text-gray-900">পুষ্টি কুঞ্জ (Pusti Kunjo)</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors bg-gray-50/50">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">প্রধান কার্যালয়</td>
                                        <td className="px-5 py-3.5 text-gray-700">{contact.address || 'লেভেল-৫, নূর টাওয়ার, ১১০ বীর উত্তম সি আর দত্ত রোড, ঢাকা ১২০৫'}</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">হেল্পলাইন নম্বর</td>
                                        <td className="px-5 py-3.5 font-bold text-emerald-700">{phone}</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors bg-gray-50/50">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">ইমেইল ঠিকানা</td>
                                        <td className="px-5 py-3.5 text-gray-700">{contact.email || 'info@pustikunjo.com.bd'}</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">প্রধান সেবাসমূহ</td>
                                        <td className="px-5 py-3.5 text-gray-700">খাঁটি মধু, ঘি, হারবাল পণ্য, পুষ্টিকর বীজ ও ভেষজ স্বাস্থ্যসেবা</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section 3: সেবাগ্রহণের শর্ত */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-sm flex items-center justify-center font-black">২</span>
                            <span>সেবাগ্রহণের শর্তাবলী (Terms of Service)</span>
                        </h2>
                        <ul className="space-y-2.5 text-sm sm:text-base text-gray-600 list-disc list-inside leading-relaxed pl-4">
                            <li>গ্রাহকের বয়স ন্যূনতম ১৮ বছর হতে হবে অথবা অভিভাবকের অনুমতি সাপেক্ষে সাইট ব্যবহার করতে হবে।</li>
                            <li>অর্ডার করার সময় অবশ্যই সঠিক নাম, সক্রিয় মোবাইল নম্বর এবং সঠিক ডেলিভারি ঠিকানা প্রদান করতে হবে।</li>
                            <li>ওয়েবসাইটের কোনো কনটেন্ট, ছবি বা বর্ণনা পুষ্টি কুঞ্জের লিখিত অনুমতি ছাড়া বাণিজ্যিক উদ্দেশ্যে ব্যবহার বা অনুকরণ করা আইনত দণ্ডনীয়।</li>
                        </ul>
                    </div>

                    {/* Section 4: পণ্য ও মূল্য সম্পর্কিত শর্তাবলী (Table + Text) */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="bg-[#0B3E25] px-6 py-3.5 text-white">
                            <h2 className="font-bold text-base sm:text-lg">
                                ৩. পণ্য ও মূল্য সম্পর্কিত শর্তাবলী
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#104D30] text-white text-xs font-bold uppercase">
                                    <tr>
                                        <th className="px-5 py-3 w-52">বিষয়</th>
                                        <th className="px-5 py-3">বিবরণ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-800">
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">পণ্যের প্রাপ্যতা (Stock)</td>
                                        <td className="px-5 py-3.5 text-gray-700">স্টক থাকা সাপেক্ষে সকল অর্ডার কার্যকর হয়।</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors bg-gray-50/50">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">মূল্য পরিবর্তন (Price Updates)</td>
                                        <td className="px-5 py-3.5 text-gray-700">বাজারমূল্য অনুযায়ী পূর্ব ঘোষণা ছাড়াই পরিবর্তনশীল।</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">পণ্যের ওজন ও প্যাকিং</td>
                                        <td className="px-5 py-3.5 text-gray-700">শতভাগ নির্ভুল ও হাইজিনিক সিলপ্যাক নিশ্চয়তা।</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-5 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                            প্রাকৃতিক উৎপাদনের ওপর ভিত্তি করে পণ্যের প্রাকৃতিক স্বাদ, গন্ধ বা রঙে সামান্য ভিন্নতা থাকতে পারে, যা পণ্যের খাঁটি হওয়ার পরিচায়ক।
                        </div>
                    </div>

                    {/* Section 5: অর্ডার ও পেমেন্ট পলিসি */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-sm flex items-center justify-center font-black">৪</span>
                            <span>অর্ডার ও পেমেন্ট পলিসি</span>
                        </h2>
                        <ul className="space-y-2.5 text-sm sm:text-base text-gray-600 list-disc list-inside leading-relaxed pl-4">
                            <li><strong>ক্যাশ অন ডেলিভারি (COD):</strong> গ্রাহক পণ্য হাতে পেয়ে মূল্য পরিশোধ করবেন। কোনো হিডেন বা গোপন চার্জ নেই।</li>
                            <li><strong>বিকাশ অনলাইন পেমেন্ট:</strong> বিকাশের মাধ্যমে পেমেন্ট সম্পন্ন করলে ট্রানজেকশন আইডি সংরক্ষণ করতে হবে।</li>
                            <li><strong>অর্ডার ভেরিফিকেশন:</strong> সন্দেহজনক বা অসমাপ্ত তথ্যের ক্ষেত্রে আমাদের কাস্টমার কেয়ার টিম ফোন কলের মাধ্যমে অর্ডার ভেরিফাই করতে পারে।</li>
                        </ul>
                    </div>

                    {/* Section 6: ডেলিভারি ও কুরিয়ার পলিসি (Table + Text) */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="bg-[#0B3E25] px-6 py-3.5 text-white">
                            <h2 className="font-bold text-base sm:text-lg">
                                ৫. ডেলিভারি ও কুরিয়ার পলিসি
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#104D30] text-white text-xs font-bold uppercase">
                                    <tr>
                                        <th className="px-5 py-3 w-52">এরিয়া / অঞ্চল</th>
                                        <th className="px-5 py-3">ডেলিভারি সময়সীমা</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-800">
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">ঢাকা সিটির ভেতরে</td>
                                        <td className="px-5 py-3.5 text-gray-700">২৪ থেকে ৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors bg-gray-50/50">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">ঢাকা সিটির বাইরে সমগ্র বাংলাদেশ</td>
                                        <td className="px-5 py-3.5 text-gray-700">২ থেকে ৩ কর্মদিবস (জেলা ও উপজেলা পর্যায়)</td>
                                    </tr>
                                    <tr className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-emerald-800">কুরিয়ার পার্টনার</td>
                                        <td className="px-5 py-3.5 font-semibold text-emerald-700">স্টেডফাস্ট ও পাঠাও কুরিয়ার</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-5 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                            প্রাকৃতিক দুর্যোগ, হরতাল বা কুরিয়ার নেটওয়ার্কের আকস্মিক জটিলতার কারণে ডেলিভারিতে বিলম্ব হতে পারে। প্রতিটি পার্সেলের ট্র্যাকিং লিংক গ্রাহকের SMS-এ দেওয়া হয়।
                        </div>
                    </div>

                    {/* Section 7: রিটার্ন, রিফান্ড ও রিপ্লেসমেন্ট পলিসি */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-sm flex items-center justify-center font-black">৬</span>
                            <span>রিটার্ন ও রিফান্ড পলিসি (Return & Refund)</span>
                        </h2>
                        <ul className="space-y-2.5 text-sm sm:text-base text-gray-600 list-disc list-inside leading-relaxed pl-4">
                            <li>ডেলিভারি ম্যানের উপস্থিতিতে পার্সেল খুলে পণ্যের সিল ও অক্ষত অবস্থা যাচাই করতে হবে।</li>
                            <li>ভাঙা, ড্যামেজ বা ভুল পণ্য পেলে তৎক্ষণাৎ ডেলিভারি ম্যানের কাছে ফেরত দেওয়া যাবে অথবা ২৪ ঘণ্টার মধ্যে আমাদের <Link href="/complaint" className="text-emerald-700 font-bold hover:underline">অভিযোগ পেজে</Link> জানাতে হবে।</li>
                            <li>খাদ্যনিরাপত্তা ও হাইজিন বজায় রাখার স্বার্থে ব্যবহৃত বা সিল খোলা পণ্য ফেরতযোগ্য নয়।</li>
                        </ul>
                    </div>

                    {/* Section 8: অর্ডার ক্যানসেলেশন পলিসি */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-sm flex items-center justify-center font-black">৭</span>
                            <span>অর্ডার ক্যানসেলেশন পলিসি (Cancellation)</span>
                        </h2>
                        <ul className="space-y-2.5 text-sm sm:text-base text-gray-600 list-disc list-inside leading-relaxed pl-4">
                            <li>পার্সেল কুরিয়ারে হস্তান্তরের পূর্বে কাস্টমার কেয়ারে কল করে যেকোনো সময় অর্ডার বাতিল করা যাবে।</li>
                            <li>পার্সেল প্রেরণের পর অহেতুক বা উদ্দেশ্যপ্রণোদিতভাবে পার্সেল রিফিউজ করলে গ্রাহকের ভবিষ্যৎ ক্যাশ অন ডেলিভারি অর্ডার সাময়িকভাবে ব্লক বা স্থগিত হতে পারে।</li>
                        </ul>
                    </div>

                    {/* Section 9: দায়বদ্ধতার সীমাবদ্ধতা */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-sm flex items-center justify-center font-black">৮</span>
                            <span>মেডিকেল ও পুষ্টি পরামর্শ ডিসক্লেইমার</span>
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed pl-9">
                            পুষ্টি কুঞ্জের পণ্যসমূহ খাদ্য ও পুষ্টিসম্পূরক উপাদান। আমাদের প্রদত্ত পথ্য ও পুষ্টি পরামর্শ কোনো প্রকার প্রেসক্রিপশন বা অ্যালোপ্যাথিক চিকিৎসার বিকল্প নয়। গুরুতর অসুস্থতায় অভিজ্ঞ চিকিৎসকের পরামর্শ গ্রহণ করা বাঞ্ছনীয়।
                        </p>
                    </div>

                    {/* Section 10: যোগাযোগের টেবিল */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="bg-[#0B3E25] px-6 py-3.5 text-white">
                            <h2 className="font-bold text-base sm:text-lg">
                                অভিযোগ ও কাস্টমার কেয়ার যোগাযোগ
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

                    {/* Bottom Assurance Note */}
                    <div className="text-center pt-2 pb-6 space-y-3">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">
                            পুষ্টি কুঞ্জ যেকোনো সময় দেশের প্রচলিত আইনের আলোকে এ সকল নীতিমালা পরিবর্তন বা হালনাগাদ করার অধিকার সংরক্ষণ করে।
                        </p>
                        <p className="text-sm font-bold text-emerald-900">
                            শতভাগ খাঁটি ও নিরাপদ স্বাস্থ্যপণ্য পৌঁছে দিতে আমরা প্রতিজ্ঞাবদ্ধ।
                        </p>
                    </div>
                    </>
                    )}

                </div>
            </div>
        </StorefrontLayout>
    );
}
