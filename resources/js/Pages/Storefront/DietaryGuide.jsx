import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import {
    Heart,
    Activity,
    AlertCircle,
    Search,
    Printer,
    PhoneCall,
    CheckCircle2,
    XCircle,
    FileText,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    MessageCircle,
    Info,
    HelpCircle
} from 'lucide-react';

export default function DietaryGuide({ hotline = '01700-000000', whatsapp = '01700000000', meta = {} }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const handlePrint = () => {
        window.print();
    };

    const categories = [
        { id: 'heart', label: 'হৃদরোগ ও রক্তনালী' },
        { id: 'liver', label: 'ফ্যাটি লিভার' },
        { id: 'cholesterol', label: 'কোলেস্টেরল' },
        { id: 'kidney', label: 'কিডনি রোগ' },
        { id: 'gastric', label: 'গ্যাস্ট্রিক ও আলসার' },
        { id: 'diabetes', label: 'ডায়াবেটিস' },
        { id: 'hypertension', label: 'উচ্চ রক্তচাপ' },
        { id: 'thyroid', label: 'থাইরয়েড' },
        { id: 'uric-acid', label: 'ইউরিক এসিড' },
        { id: 'anemia', label: 'রক্তশূন্যতা' },
        { id: 'weight', label: 'ওজন নিয়ন্ত্রণ' },
        { id: 'constipation', label: 'কোষ্ঠকাঠিন্য ও পাইলস' },
        { id: 'vitality', label: 'যৌন স্বাস্থ্য ও ভাইটালিটি' },
    ];

    const guideItems = [
        {
            id: 'heart',
            title: '০১. হৃদরোগ ও রক্তনালীর স্বাস্থ্য (Cardiovascular Health)',
            subtitle: 'করোনারি আর্টারি ডিজিজ, হার্ট ব্লক ও বুক ধড়ফড়ের পথ্য নির্দেশিকা',
            table: [
                {
                    element: 'চর্বি ও তেল',
                    avoid: 'ডালডা, বনস্পতি, পাম তেল, ট্রান্স ফ্যাট, প্রাণিজ চর্বিযুক্ত মাংস, ফ্রায়েড ফুড।',
                    allow: 'খাঁটি কোল্ড-প্রেসড সরিষার তেল, এক্সট্রা ভার্জিন অলিভ অয়েল, তিসির তেল (পরিমিত)।'
                },
                {
                    element: 'প্রোটিন জাতীয়',
                    avoid: 'খাসি ও গরুর চর্বিযুক্ত লাল মাংস, প্রসেসড সসেজ, খাসির কলিজা, চিংড়ি মাছ।',
                    allow: 'ছোট মাছ, দেশি মুরগি (চামড়া ছাড়া), সামুদ্রিক মাছ (রুপচাঁদা, টুনা), ডিমের সাদা অংশ।'
                },
                {
                    element: 'কার্বোহাইড্রেট ও শস্য',
                    avoid: 'সাদা চাল, ময়দা, বেকারির বিস্কুট, প্যাকেটজাত নুডলস, অতিরিক্ত চিনি।',
                    allow: 'লাল চালের ভাত, লাল আটার রুটি, ওটস, বার্লি ও মিষ্টি আলু।'
                },
                {
                    element: 'লবণ ও পানীয়',
                    avoid: 'পাতে অতিরিক্ত কাঁচা লবণ, টেস্টিং সল্ট, চিপস, আচারের অতিরিক্ত লবণ, কোমল পানীয়।',
                    allow: 'দৈনিক ৫ গ্রামের কম লবণ, ডাবের পানি, খাঁটি মধু মেশানো উষ্ণ পানি।'
                }
            ],
            tips: [
                'প্রতিদিন সকালে খালি পেটে ১-২ কোয়া কাঁচা রসুন খেলে রক্ত চলাচল স্বাভাবিক থাকে ও এলডিএল কমে।',
                'তিসি (Flaxseed) ও চিয়া সিডে প্রচুর ওমেগা-৩ ফ্যাটি এসিড থাকে যা রক্তনালীর ব্লকেজ প্রতিরোধে সাহায্য করে।',
                'ধূমপান ও জর্দা সম্পূর্ণ পরিহার করুন এবং দৈনিক অন্তত ৩০ মিনিট হালকা হাঁটার অভ্যাস করুন।'
            ]
        },
        {
            id: 'liver',
            title: '০২. ফ্যাটি লিভার ও লিভারের সমস্যায় পথ্য (Fatty Liver Care)',
            subtitle: 'নন-অ্যালকোহলিক ফ্যাটি লিভার (NAFLD) ও হেপাটিক টক্সিন দূরীকরণের পথ্য',
            table: [
                {
                    element: 'শর্করা ও মিষ্টি',
                    avoid: 'পরিশোধিত চিনি, মিষ্টি, কোমল পানীয়, প্যাকেটজাত ফলের রস, ময়দার খাবার।',
                    allow: 'কম মিষ্টি ফল (যেমন: সবুজ আপেল, জামরুল, পেয়ারা), বিটরুট, লাল আটা।'
                },
                {
                    element: 'স্ন্যাক্স ও তেল',
                    avoid: 'ডুবো তেলে ভাজা খাবার, ডালডা, ফাস্টফুড, ডোনাট, পরাটা।',
                    allow: 'কাঁচা বাদাম (কাঠবাদাম, আখরোট), গ্রিন টি, শসা ও লেবুর শরবত।'
                },
                {
                    element: 'শাকসবজি',
                    avoid: 'অতি মসলাযুক্ত ভাজি বা গ্রেভিযুক্ত তরকারি।',
                    allow: 'ব্রকলি, বাঁধাকপি, পালং শাক, করলা, সজনে পাতা, কাঁচা রসুন।'
                }
            ],
            tips: [
                'বিটরুট পাউডার বা কাঁচা বিটরুট জুস লিভারের ডিটক্সিফিকেশন প্রক্রিয়াকে বহুগুণে ত্বরান্বিত করে।',
                'আমলকী ও লেবুতে থাকা প্রাকৃতিক ভিটামিন সি ফ্যাটি লিভারের প্রদাহ কমাতে পরীক্ষিত।'
            ]
        },
        {
            id: 'cholesterol',
            title: '০৩. রক্তে উচ্চ কোলেস্টেরল ও ট্রাইগ্লিসারাইড কমাতে পথ্য (Cholesterol & Triglycerides)',
            subtitle: 'খারাপ কোলেস্টেরল (LDL) ও ট্রাইগ্লিসারাইড কমিয়ে ভালো কোলেস্টেরল (HDL) বাড়ানোর নিয়ম',
            table: [
                {
                    element: 'তেল ও চর্বি',
                    avoid: 'ডালডা, মার্জারিন, মেয়োনিজ, মাখন, খাসির চর্বি।',
                    allow: 'খাঁটি কোল্ড-প্রেসড সরিষার তেল, এক্সট্রা ভার্জিন অলিভ অয়েল, কাঁচা তিসি গুঁড়া।'
                },
                {
                    element: 'দুগ্ধজাত খাবার',
                    avoid: 'ফুল-ক্রিম ঘন দুধ, মিষ্টি দই, চিজ, ক্ষীর।',
                    allow: 'ফ্যাট-মুক্ত দুধ, ঘরে পাতা টক দই।'
                },
                {
                    element: 'ফাইবার ও দানাশস্য',
                    avoid: 'রিফাইন করা সাদা পাস্তা ও সাদা চাল।',
                    allow: 'ইসবগুলের ভুসি, ওটস, লাল চালের ভাত, চিয়া সিড।'
                }
            ],
            tips: [
                'রাতে ১ গ্লাস পানিতে ১ চামচ চিয়া সিড ও ইসবগুল ভিজিয়ে সকালে খেলে রক্তে কোলেস্টেরল শোষিত হতে পারে না।',
                'দৈনিক মুঠোভর বাদাম (আখরোট ও কাঠবাদাম) হার্টের ধমনীকে সুরক্ষিত রাখে।'
            ]
        },
        {
            id: 'kidney',
            title: '০৪. কিডনি রোগীর খাদ্যতালিকা (Chronic Kidney Disease - Renal Diet)',
            subtitle: 'রক্তে ক্রিয়েটিনিন, ইউরিয়া, পটাশিয়াম ও সোডিয়াম নিয়ন্ত্রণে রাখার পথ্য নির্দেশিকা',
            table: [
                {
                    element: 'প্রোটিন নিয়ন্ত্রণ',
                    avoid: 'অতিরিক্ত গরুর মাংস, খাসির মাংস, মসুর ডাল, রাজমা, প্রোটিন পাউডার।',
                    allow: 'ডাক্তারের পরামর্শ অনুযায়ী নির্দিষ্ট গ্রাম ডিমের সাদা অংশ বা দেশি মুরগির মাংস।'
                },
                {
                    element: 'পটাশিয়ামযুক্ত খাবার',
                    avoid: 'কলা, ডালিম/বেদানা, কমলা, মাল্টা, ডাবের পানি, আলু (না ভিজিয়ে খেলে), টমেটো।',
                    allow: 'পেঁপে, আপেল, পেয়ারা (বিচি ছাড়া), লাউ, ধুন্দুল, চিচিঙ্গা, চালকুমড়া।'
                },
                {
                    element: 'ফসফরাসযুক্ত খাবার',
                    avoid: 'কোলা বা কার্বোনেটেড কোমল পানীয়, প্রক্রিয়াজাত প্যাকেট খাবার, বাদাম ও চকলেট।',
                    allow: 'পরিমিত ভাত, সাদা আটার পাতলা রুটি।'
                },
                {
                    element: 'পানি ও তরল',
                    avoid: 'অনিয়ন্ত্রিত পানি পান করা (যদি ইডিমা বা ফোলা থাকে)।',
                    allow: 'নেফ্রোলজিস্ট নির্দেশিত পরিমাপে দৈনিক তরল গ্রহণ।'
                }
            ],
            tips: [
                'সবজি রান্নার আগে ছোট ছোট করে কেটে অন্তত আধা ঘণ্টা হালকা গরম পানিতে ভিজিয়ে রাখলে অতিরিক্ত পটাশিয়াম দূর হয় (Leaching process)।',
                'কিডনি রোগীরা কখনোই লবণের বিকল্প ‘লো-সোডিয়াম সল্ট’ খাবেন না, কারণ এতে অতিরিক্ত পটাশিয়াম থাকে।'
            ]
        },
        {
            id: 'gastric',
            title: '০৫. আলসার, গ্যাস্ট্রিক ও আইবিএস (Gastritis, Peptic Ulcer & IBS)',
            subtitle: 'দীর্ঘদিনের বুক জ্বালাপোড়া, পেট ফাঁপা ও পেপটিক আলসারের প্রাকৃতিক পথ্য',
            table: [
                {
                    element: 'মসলা ও রান্না',
                    avoid: 'অতিরিক্ত শুকনা মরিচ, গোলমরিচ, ভিনেগার, পোড়া তেল, অতিরিক্ত আদা-রসুন পেস্ট।',
                    allow: 'হালকা জিরার গুঁড়া, হলুদ, ধনেপাতা এবং স্টিম বা সেদ্ধ রান্না।'
                },
                {
                    element: 'পানীয় ও খাবার',
                    avoid: 'খালি পেটে চা, কফি, কোমল পানীয়, সিগারেট, জর্দা, অতিরিক্ত টক খাবার।',
                    allow: 'বেলের শরবত, ডাবের পানি, অ্যালোভেরা জেল, থানকুনি পাতার রস, খাঁটি তালমিছরি।'
                },
                {
                    element: 'ফাইবার ও ফল',
                    avoid: 'কাঁচা পেয়ারা, আনারস, অতিরিক্ত শক্ত খাবার।',
                    allow: 'পাকা পেঁপে, মিষ্টি কলা, ইসবগুলের ভুসি (উষ্ণ পানিতে ভিজিয়ে), লাউ ও শসা।'
                }
            ],
            tips: [
                'সকালে খালি পেটে হালকা কুসুম গরম পানি পানের পর থানকুনি পাতার রস বা বেলের শরবত খেলে আলসারের ক্ষত দ্রুত শুকায়।',
                'খাওয়ার পরপরই ঘুমাতে যাবেন না; খাওয়ার অন্তত ২ ঘণ্টা পর বিছানায় যান।'
            ]
        },
        {
            id: 'diabetes',
            title: '০৬. ডায়াবেটিস ও ইনসুলিন রেজিস্টেন্সের রোগীদের খাদ্যতালিকা (Diabetes Diet)',
            subtitle: 'রক্তে গ্লুকোজ স্থিতিশীল রাখতে লো-গ্লাইসেমিক ইনডেক্স (Low-GI) খাদ্য তালিকা',
            table: [
                {
                    element: 'শর্করা ও মিষ্টি',
                    avoid: 'চিনি, গুড়, মধু (অতিরিক্ত), মিষ্টি, কেক, পেস্ট্রি, কন্ডেন্সড মিল্ক, সাদা রুটি।',
                    allow: 'লাল চালের ভাত (পরিমিত), ওটস, বার্লি, লাল আটার রুটি, কাওন।'
                },
                {
                    element: 'ফলমূল',
                    avoid: 'আম, কাঁঠাল, পাকা কলা, কিশমিশ, খেজুর (অতিরিক্ত), আখের রস।',
                    allow: 'সবুজ আপেল, আমলকী, জাম্বুরা, পেয়ারা, জাম, কামরাঙা, ড্রাগন ফল।'
                },
                {
                    element: 'ভেষজ উপাদান',
                    avoid: 'কৃত্রিম মিষ্টি কারক কেমিক্যাল (অ্যাসপার্টাম অতিরিক্ত)।',
                    allow: 'মেথি গুঁড়া, দারুচিনি গুঁড়া, করলার রস, কালোজিরা, চিয়া সিড।'
                }
            ],
            tips: [
                'খাবার গ্রহণের ক্রমানুসারে প্রথমে সালাদ/শাকসবজি, এরপর প্রোটিন এবং সবশেষে শর্করা গ্রহণ করলে পোস্ট-প্রান্ডিয়াল সুগার স্পাইক হয় না।',
                'মেথি দানা রাতে ভিজিয়ে সকালে সেই পানি ও মেথি চিবিয়ে খেলে ইনসুলিন সংবেদনশীলতা বৃদ্ধি পায়।'
            ]
        },
        {
            id: 'hypertension',
            title: '০৭. উচ্চ রক্তচাপ ও হাইপারটেনশন নিয়ন্ত্রণ (Hypertension - DASH Diet)',
            subtitle: 'সোডিয়াম কমিয়ে রক্তচাপ স্বাভাবিক মাত্রায় রাখার প্রাকৃতিক ডায়েট চার্ট',
            table: [
                {
                    element: 'লবণ ও খনিজ',
                    avoid: 'পাতে কাঁচা লবণ, চানাচুর, লবণাক্ত বাদাম, সয়া সস, ক্যানড স্যুপ।',
                    allow: 'বিট লবণ (পরিমিত), সাধারণ পরিমিত আয়োডিনযুক্ত রান্না করা লবণ।'
                },
                {
                    element: 'পটাশিয়াম ও ম্যাগনেসিয়াম',
                    avoid: 'লবণযুক্ত প্রসেসড চিজ ও বাটার।',
                    allow: 'ডাব, পালং শাক, কলা, মিষ্টি আলু, টক দই, তরমুজ।'
                }
            ],
            tips: [
                'কাঁচা রসুন রক্তনালী প্রসারিত করে রক্তচাপ কমাতে কার্যকর।',
                'প্রতিদিন অন্তত ২৫-৩০ মিনিট ঘাম ঝরিয়ে হাঁটুন এবং পর্যাপ্ত নিরবচ্ছিন্ন ঘুম নিশ্চিত করুন।'
            ]
        },
        {
            id: 'thyroid',
            title: '০৮. হাইপোথাইরয়েডিজম ও থাইরয়েড হরমোন সমস্যা (Hypothyroidism Diet)',
            subtitle: 'টিএসএইচ (TSH) নিয়ন্ত্রণ ও বিপাক ক্রিয়া বাড়ানোর পুষ্টি গাইডলাইন',
            table: [
                {
                    element: 'গয়ট্রোজেনিক খাবার',
                    avoid: 'কাঁচা অবস্থায় বাঁধাকপি, ফুলকপি, ব্রকলি, শালগম, সয়াবিন ও সয়া দুধ।',
                    allow: 'ভালোভাবে সেদ্ধ বা রান্না করা বাঁধাকপি/ফুলকপি পরিমিত খাওয়া যাবে।'
                },
                {
                    element: 'মিনারেলস ও ট্রেস উপাদান',
                    avoid: 'গ্লুটেন সমৃদ্ধ প্রক্রিয়াজাত স্ন্যাক্স।',
                    allow: 'আয়োডিনযুক্ত লবণ, সামুদ্রিক মাছ, সেলেনিয়াম সমৃদ্ধ কুমড়ার বীজ ও মাশরুম।'
                }
            ],
            tips: [
                'সকালে থাইরয়েডের ওষুধ খাওয়ার অন্তত ১ ঘণ্টার মধ্যে কোনো খাবার বা চা-কফি খাবেন না।',
                'কালোজিরা ও খাঁটি মধু থাইরয়েডের প্রদাহ কমাতে সহায়ক।'
            ]
        },
        {
            id: 'uric-acid',
            title: '০৯. ইউরিক এসিড ও গেঁটেবাত (High Uric Acid & Gout Diet)',
            subtitle: 'অঙ্গ-প্রত্যঙ্গের জয়েন্টে ইউরিক এসিডের ক্রিস্টাল জমা হওয়া ও ব্যথা রোধে পিউরিন-মুক্ত পথ্য',
            table: [
                {
                    element: 'উচ্চ পিউরিনযুক্ত খাবার',
                    avoid: 'গরু ও খাসির লাল মাংস, খাসির পায়া, কলিজা, চিংড়ি, ইলিশের মাথা, মসুর ডাল, মাশরুম, পালং শাক, পুঁইশাক।',
                    allow: 'লাউ, পেঁপে, চালকুমড়া, ঝিঙে, চিচিঙ্গা, গাজর, শসা, পটল।'
                },
                {
                    element: 'ফল ও তরল',
                    avoid: 'অ্যালকোহল, অতিরিক্ত মিষ্টি কোমল পানীয়, ফ্রুকটোজ কর্ন সিরাপ।',
                    allow: 'লেবু পানি, আপেল সিডার ভিনেগার (পরিমিত), চেরি ফল, দৈনিক ৩-৩.৫ লিটার বিশুদ্ধ পানি।'
                }
            ],
            tips: [
                'প্রতিদিন সকালে ১ গ্লাস হালকা গরম পানিতে অর্ধেকটা লেবুর রস মিশিয়ে পান করলে রক্ত ক্ষারীয় হয় এবং ইউরিক এসিড প্রস্রাবের সাথে বের হয়ে যায়।',
                'উচ্চ প্রোটিন ডায়েট সাময়িকভাবে সীমিত রাখুন।'
            ]
        },
        {
            id: 'anemia',
            title: '১০. রক্তশূন্যতা বা অ্যানিমিয়ার পথ্য (Iron Deficiency Anemia)',
            subtitle: 'হিমোগ্লোবিন বৃদ্ধি ও লোহিত রক্তকণিকা তৈরিতে সহায়ক খাদ্য তালিকা',
            table: [
                {
                    element: 'আয়রন সমৃদ্ধ খাবার',
                    avoid: 'খাবারের সাথে বা পরপরই কড়া চা অথবা কফি পান করা (যা আয়রন শোষণ বাধাগ্রস্ত করে)।',
                    allow: 'বিটরুট, বেদানা/ডালিম, খেজুর, কিশমিশ, কলিজা (পরিমিত), ডিমের কুসুম, কাঁচকলা।'
                },
                {
                    element: 'ভিটামিন সি ও ফলিক এসিড',
                    avoid: 'ফাস্টফুড ও খালি ক্যালরি।',
                    allow: 'আমলকী, লেবু, পেয়ারা, কমলা, পালং শাক ও কাঁচা ছোলা।'
                }
            ],
            tips: [
                'আয়রন সমৃদ্ধ খাবারের সাথে ভিটামিন সি যুক্ত খাবার (যেমন: লেবুর রস) গ্রহণ করলে শরীরে আয়রন শোষণ বহুগুণ বাড়ে।',
                'চা বা কফি খাওয়ার অভ্যাস থাকলে মূল খাবার গ্রহণের অন্তত ১ ঘণ্টা আগে বা পরে পান করুন।'
            ]
        },
        {
            id: 'weight',
            title: '১১. স্থূলতা ও ওজন কমানোর সঠিক ডায়েট (Weight Management)',
            subtitle: 'ক্ষতিকর ক্রাশ ডায়েট না করে বিজ্ঞানসম্মত উপায়ে মেদ ও চর্বি কমানোর কৌশল',
            table: [
                {
                    element: 'শর্করা ও ক্যালরি',
                    avoid: 'সাদা ভাত বেশি খাওয়া, চিনি, মিষ্টি, কোমল পানীয়, আলুর চিপস, চর্বিযুক্ত খাবার।',
                    allow: 'চিয়া সিড, শসা, সালাদ, লাল আটা, ব্রাউন রাইস, সেদ্ধ ডিম।'
                },
                {
                    element: 'ফ্যাট বার্নিং ফুড',
                    avoid: 'রাতে ঘুমানোর ঠিক আগে ভারী খাবার খাওয়া।',
                    allow: 'গ্রিন টি, অ্যাপল সিডার ভিনেগার, লেবু-মধুর পানি, কাঁচা রসুন ও দারুচিনি চা।'
                }
            ],
            tips: [
                'খাবার খাওয়ার ২০ মিনিট আগে ১ গ্লাস পানি পান করলে তৃপ্তি তাড়াতাড়ি আসে এবং অতিরিক্ত খাওয়া বন্ধ হয়।',
                'সকালে চিয়া সিড ও লেবুর পানি দিয়ে দিন শুরু করুন।'
            ]
        },
        {
            id: 'constipation',
            title: '১২. কোষ্ঠকাঠিন্য ও পাইলসের পথ্য (Constipation & Piles Relief)',
            subtitle: 'অন্ত্রের স্বাভাবিক গতি বৃদ্ধি ও মল নরম করার উচ্চ-আঁশযুক্ত খাদ্য তালিকা',
            table: [
                {
                    element: 'ফাইবার ও আঁশ',
                    avoid: 'ময়দার পরাটা, নানরুটি, নুডলস, ফাস্টফুড, কাঁচকলা, চকোলেট।',
                    allow: 'ইসবগুলের ভুসি, পাকা পেঁপে, মিষ্টি বেল, ডুমুর, শাকসবজি, ওটস, চিয়া সিড।'
                },
                {
                    element: 'পানি ও তেল',
                    avoid: 'অতিরিক্ত শুকনা মরিচ, শুকনা খাবার ও অপর্যাপ্ত পানি পান।',
                    allow: 'দৈনিক ১০-১২ গ্লাস পানি, রাতে ঘুমানোর আগে ১ চামচ খাঁটি অলিভ অয়েল বা ঘি উষ্ণ দুধের সাথে।'
                }
            ],
            tips: [
                'ইসবগুলের ভুসি পানিতে মিশিয়ে সাথে সাথেই পান করবেন, বেশিক্ষণ ভিজিয়ে রেখে জেলির মতো করে খাবেন না।',
                'প্রতিদিনের খাদ্যতালিকায় অন্তত এক বাটি সালাদ বা শাকসবজি অন্তর্ভুক্ত রাখুন।'
            ]
        },
        {
            id: 'vitality',
            title: '১৩. যৌন দুর্বলতা ও পুরুষদের ভাইটালিটি (Men\'s Vitality & Hormonal Health)',
            subtitle: 'শারীরিক দুর্বলতা দূরীকরণ ও প্রাকৃতিক টেস্টোস্টেরন বৃদ্ধির খাদ্য তালিকা',
            table: [
                {
                    element: 'মিনারেল ও ভেষজ উপাদান',
                    avoid: 'ধূমপান, অ্যালকোহল, প্রসেসড মাংস, অতিরিক্ত চিনি ও ট্রান্স ফ্যাটযুক্ত জাঙ্ক ফুড।',
                    allow: 'কুমড়ার বীজ (Pumpkin Seeds), খাঁটি কাঁচা মধু, কালোজিরা, রসুন, খাঁটি ঘি, বাদাম।'
                },
                {
                    element: 'পুষ্টিকর খাদ্য',
                    avoid: 'অতিরিক্ত ক্যাফেইন ও এনার্জি ড্রিংকস।',
                    allow: 'দেশি ডিম, কাঁচা দুধ, বেদানা, ডার্ক চকলেট, তরমুজ ও কলা।'
                }
            ],
            tips: [
                'কুমড়ার বীজে প্রচুর পরিমাণে প্রাকৃতিক জিংক থাকে, যা টেস্টোস্টেরন হরমোন উৎপাদনে প্রধান ভূমিকা রাখে।',
                'প্রতিদিন সকালে ১ চা চামচ খাঁটি মধু ও ৭টি কালোজিরার দানা সেবন শারীরিক শক্তির জন্য অত্যন্ত উপকারী।'
            ]
        }
    ];

    const filteredItems = guideItems.filter((item) => {
        const matchesCategory = activeFilter === 'all' || item.id === activeFilter;
        const matchesSearch = searchQuery === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.table.some(row =>
                row.element.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.avoid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.allow.toLowerCase().includes(searchQuery.toLowerCase())
            );
        return matchesCategory && matchesSearch;
    });

    return (
        <StorefrontLayout>
            <Head>
                <title>{meta.title || 'পুষ্টি চিকিৎসা ও পথ্যের নির্দেশিকা — পুষ্টি কুঞ্জ'}</title>
                <meta name="description" content={meta.description || 'বিভিন্ন রোগের বিজ্ঞানসম্মত পথ্য ও বর্জনীয়-গ্রহণীয় খাবারের সম্পূর্ণ নির্দেশিকা।'} />
            </Head>

            <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
                    {/* Header Banner */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-900/10 shadow-sm text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span>CLINICAL NUTRITION & DIET THERAPY GUIDELINES</span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 tracking-tight leading-tight">
                            পুষ্টি চিকিৎসা ও পথ্যের নির্দেশিকা
                        </h1>
                        <p className="text-sm sm:text-lg text-emerald-800 font-semibold max-w-2xl mx-auto">
                            বিভিন্ন রোগের পথ্য ও রোগ নিয়ন্ত্রণ তালিকা — বিজ্ঞানসম্মত বর্জনীয় ও গ্রহণীয় খাদ্য
                        </p>

                        {/* Medical Disclaimer Banner */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-left max-w-4xl mx-auto text-xs sm:text-sm text-amber-950 space-y-1.5 shadow-2xs">
                            <div className="flex items-center gap-2 font-black text-amber-900">
                                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                                <span>গুরুত্বপূর্ণ স্বাস্থ্য ও চিকিৎসা সতর্কবার্তা:</span>
                            </div>
                            <p className="leading-relaxed">
                                এই নির্দেশিকায় প্রদত্ত তথ্যাবলী সাধারণ পুষ্টি পরামর্শ ও খাদ্যাভ্যাস উন্নয়নের জন্য প্রস্তুতকৃত। কোনো ক্রনিক বা জটিল রোগে আক্রান্ত রোগীরা নিয়মিত ওষুধ সেবনের পাশাপাশি একজন অভিজ্ঞ রেজিস্টার্ড পুষ্টিবিদ বা চিকিৎসকের পরামর্শ অনুযায়ী চূড়ান্ত খাদ্যতালিকা নির্ধারণ করবেন।
                            </p>
                        </div>

                        {/* Action Buttons: Print & Direct Consultation */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                <Printer className="w-4 h-4 text-gray-600" />
                                <span>গাইড প্রিন্ট / PDF সংরক্ষণ করুন</span>
                            </button>

                            <Link
                                href="/consultation"
                                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                <span>পুষ্টিবিদের বিনামূল্যে পরামর্শ নিন</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Search & Disease Category Filter Chips */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                        <div className="relative max-w-xl mx-auto">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="রোগের নাম বা খাদ্য উপাদান দিয়ে খুঁজুন (যেমন: ডায়াবেটিস, কিডনি, ফ্যাটি লিভার, লবণ, রসুন)..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
                            />
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                            <button
                                type="button"
                                onClick={() => setActiveFilter('all')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                    activeFilter === 'all'
                                        ? 'bg-emerald-700 text-white shadow-2xs'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                সকল রোগ ও পথ্য ({guideItems.length})
                            </button>

                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setActiveFilter(cat.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                        activeFilter === cat.id
                                            ? 'bg-emerald-700 text-white shadow-2xs'
                                            : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-900'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Guidelines Cards & Tables */}
                    <div className="space-y-8">
                        {filteredItems.length === 0 ? (
                            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
                                <HelpCircle className="w-10 h-10 text-gray-400 mx-auto" />
                                <h3 className="text-base font-bold text-gray-800">কোনো নির্দেশিকা খুঁজে পাওয়া যায়নি</h3>
                                <p className="text-xs text-gray-500">অন্য কোনো নাম দিয়ে সার্চ করুন অথবা 'সকল রোগ ও পথ্য' সিলেক্ট করুন।</p>
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    id={item.id}
                                    className="bg-white rounded-3xl border border-emerald-950/10 shadow-xs overflow-hidden scroll-mt-24 transition-all"
                                >
                                    {/* Card Header matching screenshot's deep green bar */}
                                    <div className="bg-emerald-900 text-white p-5 sm:p-6 border-b border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                                                <Activity className="w-5 h-5 text-emerald-300 shrink-0" />
                                                <span>{item.title}</span>
                                            </h2>
                                            <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">
                                                {item.subtitle}
                                            </p>
                                        </div>

                                        <Link
                                            href="/consultation"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shrink-0 transition-colors shadow-2xs"
                                        >
                                            <span>পরামর্শ নিন</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    {/* Dietary Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs sm:text-sm">
                                            <thead className="bg-[#EBF5EE] text-emerald-950 font-bold uppercase text-[11px] sm:text-xs border-b border-emerald-200">
                                                <tr>
                                                    <th className="py-3 px-4 sm:px-6 w-1/4">খাদ্য উপাদান</th>
                                                    <th className="py-3 px-4 sm:px-6 w-3/8 text-rose-900 bg-rose-50/50">
                                                        <span className="flex items-center gap-1">
                                                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                                            <span>বর্জনীয় খাবার (পরিহার করুন)</span>
                                                        </span>
                                                    </th>
                                                    <th className="py-3 px-4 sm:px-6 w-3/8 text-emerald-950 bg-emerald-50/50">
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span>গ্রহণযোগ্য / উপকারী খাবার</span>
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {item.table?.map((row, idx) => (
                                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                                                        <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-900 align-top">
                                                            {row.element}
                                                        </td>
                                                        <td className="py-3.5 px-4 sm:px-6 text-rose-900 bg-rose-50/20 align-top leading-relaxed text-xs sm:text-[13px]">
                                                            {row.avoid}
                                                        </td>
                                                        <td className="py-3.5 px-4 sm:px-6 text-emerald-950 bg-emerald-50/20 align-top leading-relaxed text-xs sm:text-[13px]">
                                                            {row.allow}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Key Clinical Tips */}
                                    {item.tips && item.tips.length > 0 && (
                                        <div className="p-5 sm:p-6 bg-[#FAF9F5] border-t border-gray-100 space-y-2">
                                            <span className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                                                <Info className="w-4 h-4 text-emerald-700" />
                                                <span>বিশেষ পুষ্টি পরামর্শ ও নির্দেশিকা:</span>
                                            </span>
                                            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                                                {item.tips.map((tip, tIdx) => (
                                                    <li key={tIdx} className="flex items-start gap-2">
                                                        <span className="text-emerald-700 font-bold">✓</span>
                                                        <span className="leading-relaxed">{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Bottom CTA Banner */}
                    <div className="rounded-3xl bg-emerald-950 text-white p-8 sm:p-10 text-center space-y-5 shadow-xl relative overflow-hidden">
                        <div className="max-w-2xl mx-auto space-y-2">
                            <span className="px-3.5 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase tracking-wider inline-block">
                                EXPERT CONSULTATION
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-white">
                                আপনার কি কোনো জটিল রোগ বা শারীরিক সমস্যা রয়েছে?
                            </h2>
                            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                                ইন্টারনেট থেকে সাধারণ পরামর্শ না নিয়ে আপনার শারীরিক টেস্ট রিপোর্ট অনুযায়ী একজন সার্টিফাইড পুষ্টিবিদ ও অভিজ্ঞ হাকিমের কাছ থেকে বিনামূল্যে কাস্টমাইজড ডায়েট চার্ট গ্রহণ করুন।
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <Link
                                href="/consultation"
                                className="px-8 py-3 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                            >
                                <span>পুষ্টিবিদের পরামর্শের ফরম পূরণ করুন</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <a
                                href={`https://wa.me/88${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('পুষ্টি কুঞ্জ: আমি পুষ্টি চিকিৎসা ও পথ্যের ব্যাপারে পরামর্শ নিতে চাই।')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border border-emerald-700"
                            >
                                <MessageCircle className="w-4 h-4 text-emerald-300" />
                                <span>হোয়াটসঅ্যাপে কথা বলুন</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
