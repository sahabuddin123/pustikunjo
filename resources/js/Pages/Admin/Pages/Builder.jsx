import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ImagePickerField from '@/Components/Admin/ImagePickerField';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import {
    Plus,
    FileText,
    ArrowUp,
    ArrowDown,
    Copy,
    Eye,
    EyeOff,
    Trash2,
    Save,
    ArrowLeft,
    Sliders,
    Layers,
    Layout,
    HelpCircle,
    Star,
    Sparkles,
    Check,
    X,
    Smartphone,
    Monitor,
    BookOpen,
    Video,
    Clock,
    Code,
    Images,
    ExternalLink,
    Image,
    Shield,
    PhoneCall
} from 'lucide-react';

const AVAILABLE_BLOCKS = [
    {
        type: 'hero',
        label: 'ফুল-উইডথ হিরো ক্যারোসেল (Hero Carousel)',
        description: '১০০% ফুল-উইডথ স্লাইডার, ইমেজ ও লিঙ্কস',
        icon: Sparkles,
        defaultData: {
            slides: [
                {
                    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&auto=format&fit=crop&q=85',
                    url: '/shop',
                    alt: 'পুষ্টি কুঞ্জ — ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য'
                },
                {
                    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&auto=format&fit=crop&q=85',
                    url: '/product/chia-seeds',
                    alt: 'প্রিমিয়াম অর্গানিক চিয়া সিড'
                },
                {
                    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1920&auto=format&fit=crop&q=85',
                    url: '/product/beetroot-powder',
                    alt: 'খাঁটি বিটরুট পাউডার'
                }
            ]
        }
    },
    {
        type: 'product_grid',
        label: 'পণ্য গ্রিড শোকেস (Product Showcase)',
        description: 'বেস্ট সেলার বা সমস্ত পণ্য তালিকা',
        icon: Layout,
        defaultData: {
            heading: 'BEST SELLER',
            subheading: '',
            limit: 3,
            columns: 3,
            source: 'featured',
            view_all_url: '/shop',
            show_bottom_button: false
        }
    },
    {
        type: 'product_videos',
        label: 'প্রোডাক্ট ভিডিও ও প্রমো কার্ড (Product Videos)',
        description: '৩টি ভার্টিক্যাল রিল ভিডিও এবং প্রোডাক্ট প্রমো কার্ড গ্রিড',
        icon: Video,
        defaultData: {
            heading: 'Product Videos',
            items: [
                {
                    poster: '/images/product_videos/video_poster_1.jpg',
                    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-in-a-park-41315-large.mp4',
                    promoBanner: '/images/product_videos/promo_banner_1.jpg',
                    thumb: '/images/product_videos/thumb_1.png',
                    title: 'Spray Dried Beetr...',
                    fullTitle: 'Spray Dried Beetroot Powder',
                    price: 'Tk 1,150.00',
                    productUrl: '/product/beetroot-powder'
                },
                {
                    poster: '/images/product_videos/video_poster_2.jpg',
                    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-41712-large.mp4',
                    promoBanner: '/images/product_videos/promo_banner_2.jpg',
                    thumb: '/images/product_videos/thumb_2.png',
                    title: 'Desi Ghee',
                    fullTitle: 'Desi Ghee / Pure Herbal Methimix',
                    price: 'Tk 680.00',
                    productUrl: '/product/methimix'
                },
                {
                    poster: '/images/product_videos/video_poster_3.jpg',
                    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-recording-a-vlog-with-her-phone-41314-large.mp4',
                    promoBanner: '/images/product_videos/promo_banner_3.jpg',
                    thumb: '/images/product_videos/thumb_3.png',
                    title: 'Spray Dried Beetr...',
                    fullTitle: 'Premium Organic Superfood',
                    price: 'Tk 1,150.00',
                    productUrl: '/product/chia-seeds'
                }
            ]
        }
    },
    {
        type: 'certifications',
        label: 'অ্যাওয়ার্ড ও সার্টিফিকেশন (Award-winning & Certified)',
        description: 'BSTI, BCSIR ল্যাব টেস্ট ও কোয়ালিটি সিল',
        icon: Shield,
        defaultData: {
            heading: 'Award-winning & Certified',
            subheading: 'BSTI, BCSIR & Kuet Lab test',
            items: [
                { image: '/images/certifications/bsti_logo_1.png', alt: 'BSTI Certified' },
                { image: '/images/certifications/bcsir_logo_2.png', alt: 'BCSIR Tested' },
                { image: '/images/certifications/bcsir_logo_3.png', alt: 'Science Lab Certified' },
                { image: '/images/certifications/bsti_logo_4.png', alt: 'BSTI Quality Tested' }
            ]
        }
    },
    {
        type: 'why_pustikunjo',
        label: 'Why PUSTI KUNJO (০১, ০২, ০৩ স্টেপস)',
        description: 'খাঁটি রাখার প্রতিটি ধাপ — উৎস থেকে আপনার ঘর পর্যন্ত',
        icon: Star,
        defaultData: {
            heading: 'Why PUSTI KUNJO',
            subheading: 'খাঁটি রাখার প্রতিটি ধাপ — উৎস থেকে আপনার ঘর পর্যন্ত',
            steps: [
                {
                    number: '01',
                    title: 'সরাসরি উৎস থেকে',
                    text: 'বিশ্বস্ত কৃষক ও প্রাকৃতিক বনজ উৎস থেকে সংগৃহীত শতভাগ নির্ভেজাল উপাদান।'
                },
                {
                    number: '02',
                    title: 'প্রতিটি ব্যাচ পরীক্ষিত',
                    text: 'বিএসটিআই ও ল্যাব টেস্টের মাধ্যমে শতভাগ গুণগত মান ও বিশুদ্ধতা নিশ্চিতকরণ।'
                },
                {
                    number: '03',
                    title: 'হালাল প্রক্রিয়া',
                    text: 'সম্পূর্ণ স্বাস্থ্যসম্মত ও হালাল উপায়ে আধুনিক প্রসেসিং এবং প্যাকেজিং।'
                }
            ]
        }
    },
    {
        type: 'consultation_cta',
        label: 'হাকিম কনসাল্টেশন ব্যানার (Hakim Consultation)',
        description: 'ডিপ গ্রিন স্পেশাল কনসাল্টেশন ব্যানার ও গেট অ্যাডভাইস বাটন',
        icon: Sparkles,
        defaultData: {
            enabled: true,
            label: 'FREE CONSULTATION',
            heading: 'Hakim Consultation',
            description: 'অভিজ্ঞ হাকিমের কাছ থেকে বিনামূল্যে ইউনানি পরামর্শ নিন',
            cta_label: 'Get Advice',
            cta_url: '/contact'
        }
    },
    {
        type: 'contact_strip',
        label: 'যোগাযোগ স্ট্রিপ (Contact Strip)',
        description: 'ফুটারের উপরে হেল্প ও হটলাইন স্ট্রিপ',
        icon: PhoneCall,
        defaultData: {
            title: 'কিছু জানার আছে?',
            text: 'পণ্য বা অর্ডার সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি কল করুন অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন।'
        }
    },
    {
        type: 'banner_slider',
        label: 'ব্যানার স্লাইডার (Slider)',
        description: 'একাধিক স্লাইডযুক্ত স্লাইডার',
        icon: Sliders,
        defaultData: {
            slides: [
                {
                    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&auto=format&fit=crop&q=85',
                    url: '/shop',
                    alt: 'পুষ্টি কুঞ্জ অর্গানিক ফুড'
                }
            ]
        }
    },
    {
        type: 'faq',
        label: 'সাধারণ জিজ্ঞাসা (FAQ Accordion)',
        description: 'প্রশ্নোত্তর সেকশন',
        icon: HelpCircle,
        defaultData: {
            heading: 'সাধারণ জিজ্ঞাসা (FAQ)',
            items: [
                {
                    question: 'কীভাবে পুষ্টি কুঞ্জ থেকে অর্ডার করব?',
                    answer: 'পছন্দের পণ্য নির্বাচন করে সরাসরি অর্ডার করুন বাটনে ক্লিক করে চেকআউট সম্পন্ন করুন।'
                }
            ]
        }
    },
    {
        type: 'custom_html',
        label: 'কাস্টম HTML কোড',
        description: 'যেকোনো কাস্টম কোড বা উইজেট',
        icon: Code,
        defaultData: {
            html: '<div class="p-6 bg-emerald-50 rounded-2xl text-center font-bold text-emerald-900">কাস্টম HTML কন্টেন্ট</div>'
        }
    },
    {
        type: 'spacer',
        label: 'স্পেসার (Spacer Gap)',
        description: 'সেকশনগুলোর মধ্যে গ্যাপ',
        icon: Sliders,
        defaultData: { height: 40 }
    }
];

export default function Builder({ page = null, products = [], categories = [] }) {
    const isEdit = Boolean(page);

    const form = useForm({
        title: page?.title || '',
        slug: page?.slug || '',
        type: page?.type || 'builder',
        blocks: page?.blocks || [],
        content: page?.content || '',
        meta_title: page?.meta_title || '',
        meta_description: page?.meta_description || '',
        is_published: page?.is_published !== undefined ? page.is_published : true,
    });

    const [activeBlockIndex, setActiveBlockIndex] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState(
        page?.slug === 'home' || page?.slug === '/' ? 'blocks' : (page?.blocks?.length > 0 && !page?.content ? 'blocks' : 'editor')
    );

    const addBlock = (blockDef) => {
        const newBlock = {
            id: `b_${blockDef.type}_${Date.now()}`,
            type: blockDef.type,
            is_hidden: false,
            hide_mobile: false,
            hide_desktop: false,
            data: JSON.parse(JSON.stringify(blockDef.defaultData)),
        };
        const updated = [...form.data.blocks, newBlock];
        form.setData('blocks', updated);
        setActiveBlockIndex(updated.length - 1);
        setShowAddModal(false);
    };

    const moveBlock = (index, delta) => {
        const target = index + delta;
        if (target < 0 || target >= form.data.blocks.length) return;
        const updated = [...form.data.blocks];
        const temp = updated[index];
        updated[index] = updated[target];
        updated[target] = temp;
        form.setData('blocks', updated);
        setActiveBlockIndex(target);
    };

    const duplicateBlock = (index) => {
        const original = form.data.blocks[index];
        const copy = {
            ...JSON.parse(JSON.stringify(original)),
            id: `b_${original.type}_${Date.now()}`,
        };
        const updated = [...form.data.blocks];
        updated.splice(index + 1, 0, copy);
        form.setData('blocks', updated);
        setActiveBlockIndex(index + 1);
    };

    const toggleHideBlock = (index) => {
        const updated = [...form.data.blocks];
        updated[index].is_hidden = !updated[index].is_hidden;
        form.setData('blocks', updated);
    };

    const toggleMobile = (index) => {
        const updated = [...form.data.blocks];
        updated[index].hide_mobile = !updated[index].hide_mobile;
        form.setData('blocks', updated);
    };

    const toggleDesktop = (index) => {
        const updated = [...form.data.blocks];
        updated[index].hide_desktop = !updated[index].hide_desktop;
        form.setData('blocks', updated);
    };

    const deleteBlock = (index) => {
        if (confirm('আপনি কি এই ব্লকটি মুছে ফেলতে চান?')) {
            const updated = form.data.blocks.filter((_, i) => i !== index);
            form.setData('blocks', updated);
            setActiveBlockIndex(Math.max(0, index - 1));
        }
    };

    const updateBlockData = (field, value) => {
        if (activeBlockIndex < 0 || activeBlockIndex >= form.data.blocks.length) return;
        const updated = [...form.data.blocks];
        if (!updated[activeBlockIndex].data) {
            updated[activeBlockIndex].data = {};
        }
        updated[activeBlockIndex].data[field] = value;
        form.setData('blocks', updated);
    };

    // Hero / Slider Slides Helper
    const updateSlide = (slideIdx, field, val) => {
        const slides = [...(activeBlock?.data?.slides || [])];
        if (!slides[slideIdx]) return;
        slides[slideIdx][field] = val;
        updateBlockData('slides', slides);
    };

    const addSlide = () => {
        const slides = [...(activeBlock?.data?.slides || [])];
        slides.push({
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&auto=format&fit=crop&q=85',
            url: '/shop',
            alt: 'নতুন ব্যানার স্লাইড'
        });
        updateBlockData('slides', slides);
    };

    const removeSlide = (slideIdx) => {
        const slides = (activeBlock?.data?.slides || []).filter((_, i) => i !== slideIdx);
        updateBlockData('slides', slides);
    };

    // Product Videos Items Helper
    const updateVideoItem = (itemIdx, field, val) => {
        const items = [...(activeBlock?.data?.items || [
            { poster: '/images/product_videos/video_poster_1.jpg', videoUrl: '', promoBanner: '/images/product_videos/promo_banner_1.jpg', thumb: '/images/product_videos/thumb_1.png', title: 'Spray Dried Beetr...', price: 'Tk 1,150.00', productUrl: '/product/beetroot-powder' },
            { poster: '/images/product_videos/video_poster_2.jpg', videoUrl: '', promoBanner: '/images/product_videos/promo_banner_2.jpg', thumb: '/images/product_videos/thumb_2.png', title: 'Desi Ghee', price: 'Tk 680.00', productUrl: '/product/methimix' },
            { poster: '/images/product_videos/video_poster_3.jpg', videoUrl: '', promoBanner: '/images/product_videos/promo_banner_3.jpg', thumb: '/images/product_videos/thumb_3.png', title: 'Spray Dried Beetr...', price: 'Tk 1,150.00', productUrl: '/product/chia-seeds' },
        ])];
        if (!items[itemIdx]) return;
        items[itemIdx][field] = val;
        updateBlockData('items', items);
    };

    const addVideoItem = () => {
        const items = [...(activeBlock?.data?.items || [])];
        items.push({
            poster: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=85',
            videoUrl: '',
            promoBanner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=85',
            thumb: '',
            title: 'নতুন পণ্য',
            price: 'Tk 1,000.00',
            productUrl: '/shop'
        });
        updateBlockData('items', items);
    };

    const removeVideoItem = (itemIdx) => {
        const items = (activeBlock?.data?.items || []).filter((_, i) => i !== itemIdx);
        updateBlockData('items', items);
    };

    // Certification Logos Helper
    const updateCertLogo = (logoIdx, field, val) => {
        const logos = [...(activeBlock?.data?.items || [
            { image: '/images/certifications/bsti_logo_1.png', alt: 'BSTI Certified' },
            { image: '/images/certifications/bcsir_logo_2.png', alt: 'BCSIR Tested' },
            { image: '/images/certifications/bcsir_logo_3.png', alt: 'Science Lab Certified' },
            { image: '/images/certifications/bsti_logo_4.png', alt: 'BSTI Quality Tested' }
        ])];
        if (!logos[logoIdx]) return;
        logos[logoIdx][field] = val;
        updateBlockData('items', logos);
    };

    const addCertLogo = () => {
        const logos = [...(activeBlock?.data?.items || [])];
        logos.push({ image: '/images/certifications/bsti_logo_1.png', alt: 'নতুন সার্টিফিকেশন' });
        updateBlockData('items', logos);
    };

    const removeCertLogo = (logoIdx) => {
        const logos = (activeBlock?.data?.items || []).filter((_, i) => i !== logoIdx);
        updateBlockData('items', logos);
    };

    // Why Pusti Kunjo Steps Helper
    const updateStep = (stepIdx, field, val) => {
        const steps = [...(activeBlock?.data?.steps || [
            { number: '01', title: 'সরাসরি উৎস থেকে', text: 'বিশ্বস্ত কৃষক ও প্রাকৃতিক বনজ উৎস থেকে সংগৃহীত শতভাগ নির্ভেজাল উপাদান।' },
            { number: '02', title: 'প্রতিটি ব্যাচ পরীক্ষিত', text: 'বিএসটিআই ও ল্যাব টেস্টের মাধ্যমে শতভাগ গুণগত মান ও বিশুদ্ধতা নিশ্চিতকরণ।' },
            { number: '03', title: 'হালাল প্রক্রিয়া', text: 'সম্পূর্ণ স্বাস্থ্যসম্মত ও হালাল উপায়ে আধুনিক প্রসেসিং এবং প্যাকেজিং।' }
        ])];
        if (!steps[stepIdx]) return;
        steps[stepIdx][field] = val;
        updateBlockData('steps', steps);
    };

    const addStep = () => {
        const steps = [...(activeBlock?.data?.steps || [])];
        const nextNum = String(steps.length + 1).padStart(2, '0');
        steps.push({ number: nextNum, title: 'নতুন ধাপ', text: 'ধাপের বিস্তারিত বিবরণ এখানে লিখুন।' });
        updateBlockData('steps', steps);
    };

    const removeStep = (stepIdx) => {
        const steps = (activeBlock?.data?.steps || []).filter((_, i) => i !== stepIdx);
        updateBlockData('steps', steps);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            form.put(`/admin/pages/${page.id}`);
        } else {
            form.post('/admin/pages');
        }
    };

    const activeBlock = form.data.blocks[activeBlockIndex];

    const getBlockLabel = (type) => {
        const found = AVAILABLE_BLOCKS.find((b) => b.type === type);
        return found ? found.label : type;
    };

    return (
        <AdminLayout title={isEdit ? `হোমপেজ ও পেজ বিল্ডার: ${page.title}` : 'নতুন পেজ তৈরি'}>
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                {/* Header Actions */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Link
                            href="/admin/pages"
                            className="text-sm font-bold text-gray-700 hover:text-emerald-700 flex items-center gap-2 shrink-0 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" /> <span>পেজ তালিকা</span>
                        </Link>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                            <input
                                type="text"
                                required
                                placeholder="পেজের শিরোনাম (Title)"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                className="px-4 py-2 rounded-xl border border-gray-300 text-base font-bold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                            />
                            <input
                                type="text"
                                placeholder="slug (e.g. home)"
                                value={form.data.slug}
                                onChange={(e) => form.setData('slug', e.target.value)}
                                className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-mono focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <Link
                            href={form.data.slug === 'home' || form.data.slug === '/' ? '/' : `/${form.data.slug}`}
                            target="_blank"
                            className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold flex items-center gap-2 transition-colors shadow-2xs"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>লাইভ দেখুন</span>
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm sm:text-base font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                        >
                            <Save className="w-5 h-5" />
                            <span>{form.processing ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
                        </button>
                    </div>
                </div>

                {/* Page Builder Mode Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-gray-200/80 shadow-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('editor')}
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                                activeTab === 'editor'
                                    ? 'bg-emerald-700 text-white shadow-sm'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span>CKEditor রিচ টেক্সট এডিটর</span>
                            {form.data.content && form.data.content.trim().length > 0 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'editor' ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'}`}>সক্রিয়</span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('blocks')}
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                                activeTab === 'blocks'
                                    ? 'bg-emerald-700 text-white shadow-sm'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            <Layers className="w-4 h-4" />
                            <span>ব্লক ও সেকশন বিল্ডার</span>
                            {form.data.blocks?.length > 0 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'blocks' ? 'bg-emerald-800 text-emerald-100' : 'bg-gray-200 text-gray-700'}`}>
                                    {form.data.blocks.length}টি ব্লক
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('settings')}
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                                activeTab === 'settings'
                                    ? 'bg-emerald-700 text-white shadow-sm'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            <Sliders className="w-4 h-4" />
                            <span>এসইও ও পেজ সেটিংস</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 pr-2 text-xs font-semibold text-gray-500">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.data.is_published}
                                onChange={(e) => form.setData('is_published', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                            />
                            <span className="text-gray-700 font-bold">ওয়েবসাইটে লাইভ (Published)</span>
                        </label>
                    </div>
                </div>

                {/* Tab 1: CKEditor Rich Text Content */}
                {activeTab === 'editor' && (
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-emerald-700" />
                                    <span>রিচ টেক্সট কনটেন্ট এডিটর (CKEditor Style)</span>
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    হেডিং, বোল্ড, ইটালিক, কালার, মিডিয়া লাইব্রেরি থেকে ছবি, টেবিল ও লিংক ইত্যাদি দিয়ে পেজটি সাজান।
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {form.data.slug === 'home' || form.data.slug === '/' ? 'হোমপেজ' : `/${form.data.slug} পেজ`}
                                </span>
                            </div>
                        </div>

                        <RichTextEditor
                            value={form.data.content || ''}
                            onChange={(html) => form.setData('content', html)}
                            placeholder="এখানে পেজের বিস্তারিত কনটেন্ট লিখুন..."
                            minHeight="580px"
                        />
                    </div>
                )}

                {/* Tab 2: 2-Column Blocks Builder Layout */}
                {activeTab === 'blocks' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Col (5): Blocks Hierarchy & Reordering */}
                    <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2.5">
                                <Layers className="w-5 h-5 text-emerald-700" />
                                <span>পেজের সেকশন ও ব্লকসমূহ ({form.data.blocks.length})</span>
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>ব্লক যোগ করুন</span>
                            </button>
                        </div>

                        {/* Blocks Stack List */}
                        <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
                            {form.data.blocks.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm">
                                    কোনো ব্লক যোগ করা হয়নি। উপরের বাটনে ক্লিক করে ব্লক যোগ করুন।
                                </div>
                            ) : (
                                form.data.blocks.map((block, idx) => {
                                    const isSelected = idx === activeBlockIndex;
                                    return (
                                        <div
                                            key={block.id || idx}
                                            onClick={() => setActiveBlockIndex(idx)}
                                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                                                isSelected
                                                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            } ${block.is_hidden ? 'opacity-50' : ''}`}
                                        >
                                            <div className="flex items-center gap-3 truncate">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <div className="truncate">
                                                    <div className="font-bold text-sm sm:text-base text-gray-900 truncate">
                                                        {getBlockLabel(block.type)}
                                                    </div>
                                                    <span className="text-xs sm:text-sm text-gray-500 truncate block mt-0.5">
                                                        {block.data?.heading || block.data?.title || block.type}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action icons */}
                                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    type="button"
                                                    onClick={() => moveBlock(idx, -1)}
                                                    disabled={idx === 0}
                                                    className="p-1.5 text-gray-400 hover:text-emerald-700 disabled:opacity-30 cursor-pointer rounded hover:bg-gray-100"
                                                    title="উপরে নিন"
                                                >
                                                    <ArrowUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveBlock(idx, 1)}
                                                    disabled={idx === form.data.blocks.length - 1}
                                                    className="p-1.5 text-gray-400 hover:text-emerald-700 disabled:opacity-30 cursor-pointer rounded hover:bg-gray-100"
                                                    title="নিচে নিন"
                                                >
                                                    <ArrowDown className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleMobile(idx)}
                                                    className={`p-1.5 cursor-pointer rounded ${block.hide_mobile ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-emerald-700 hover:bg-gray-100'}`}
                                                    title={block.hide_mobile ? 'মোবাইলে লুকানো (Hidden on Mobile)' : 'মোবাইলে দৃশ্যমান'}
                                                >
                                                    <Smartphone className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDesktop(idx)}
                                                    className={`p-1.5 cursor-pointer rounded ${block.hide_desktop ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-emerald-700 hover:bg-gray-100'}`}
                                                    title={block.hide_desktop ? 'ডেস্কটপে লুকানো (Hidden on Desktop)' : 'ডেস্কটপে দৃশ্যমান'}
                                                >
                                                    <Monitor className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => duplicateBlock(idx)}
                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 cursor-pointer rounded hover:bg-gray-100"
                                                    title="ডুপ্লিকেট করুন"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleHideBlock(idx)}
                                                    className="p-1.5 text-gray-400 hover:text-amber-600 cursor-pointer rounded hover:bg-gray-100"
                                                    title={block.is_hidden ? 'শো করুন' : 'হাইড করুন'}
                                                >
                                                    {block.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteBlock(idx)}
                                                    className="p-1.5 text-gray-400 hover:text-rose-600 cursor-pointer rounded hover:bg-gray-100"
                                                    title="মুছে ফেলুন"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Col (7): Active Block Settings Editor */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 space-y-5">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 flex items-center gap-2.5">
                                <Sliders className="w-5 h-5 text-emerald-700" />
                                <span>{activeBlock ? getBlockLabel(activeBlock.type) : 'ব্লক সেটিংস'}</span>
                            </h2>
                            {activeBlock && (
                                <div className="flex items-center gap-2 text-xs font-bold">
                                    {activeBlock.hide_mobile && <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 font-bold">মোবাইল হাইড</span>}
                                    {activeBlock.hide_desktop && <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 font-bold">ডেস্কটপ হাইড</span>}
                                    {activeBlock.is_hidden && <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 font-bold">সম্পূর্ণ লুকানো</span>}
                                </div>
                            )}
                        </div>

                        {!activeBlock ? (
                            <div className="text-center py-16 text-gray-400 text-xs">
                                সম্পাদনা করতে বাম পাশের তালিকা থেকে একটি ব্লক নির্বাচন করুন।
                            </div>
                        ) : (
                            <div className="space-y-5 text-xs sm:text-sm">
                                {/* ========================================== */}
                                {/* 1. HERO / BANNER SLIDER (Full Width Slides) */}
                                {/* ========================================== */}
                                {(activeBlock.type === 'hero' || activeBlock.type === 'banner_slider') && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900 text-sm">
                                                ক্যারোসেল স্লাইডসমূহ (Full Width Carousel Slides)
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={addSlide}
                                                className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>স্লাইড যোগ করুন</span>
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {(activeBlock.data.slides || []).map((slide, sIdx) => (
                                                <div key={sIdx} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-xs text-gray-700">স্লাইড #{sIdx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSlide(sIdx)}
                                                            className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
                                                        </button>
                                                    </div>

                                                    <ImagePickerField
                                                        label="ইমেজ URL (Banner Image)"
                                                        value={slide.image || ''}
                                                        onChange={(val) => updateSlide(sIdx, 'image', val)}
                                                        placeholder="https://images.unsplash.com/... বা মিডিয়া লাইব্রেরি থেকে ইমেজ নির্বাচন করুন"
                                                    />

                                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-700 block mb-1">ক্লিক লিঙ্ক URL</label>
                                                            <input
                                                                type="text"
                                                                value={slide.url || ''}
                                                                onChange={(e) => updateSlide(sIdx, 'url', e.target.value)}
                                                                placeholder="/shop বা /product/chia-seeds"
                                                                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-700 block mb-1">Alt টেক্সট / বিবরণ</label>
                                                            <input
                                                                type="text"
                                                                value={slide.alt || ''}
                                                                onChange={(e) => updateSlide(sIdx, 'alt', e.target.value)}
                                                                placeholder="ব্যানারের বিবরণ"
                                                                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ========================================== */}
                                {/* 2. PRODUCT GRID (Best Seller / All Products) */}
                                {/* ========================================== */}
                                {activeBlock.type === 'product_grid' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                                সেকশনের শিরোনাম (Heading)
                                            </label>
                                            <input
                                                type="text"
                                                value={activeBlock.data.heading || ''}
                                                onChange={(e) => updateBlockData('heading', e.target.value)}
                                                placeholder="BEST SELLER বা ALL PRODUCTS"
                                                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">প্রোডাক্ট সোর্স</label>
                                                <select
                                                    value={activeBlock.data.source || 'featured'}
                                                    onChange={(e) => updateBlockData('source', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                                                >
                                                    <option value="featured">ফিচার্ড প্রোডাক্টস (Featured)</option>
                                                    <option value="latest">লেটেস্ট প্রোডাক্টস (Latest)</option>
                                                    <option value="all">সমস্ত প্রোডাক্টস (All)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">প্রদর্শন সীমা (Limit)</label>
                                                <input
                                                    type="number"
                                                    value={activeBlock.data.limit || 3}
                                                    onChange={(e) => updateBlockData('limit', Number(e.target.value))}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">কলাম সংখ্যা</label>
                                                <select
                                                    value={activeBlock.data.columns || 3}
                                                    onChange={(e) => updateBlockData('columns', Number(e.target.value))}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                                                >
                                                    <option value={3}>৩ কলাম (রেফারেন্স ডিজাইন)</option>
                                                    <option value={4}>৪ কলাম</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">View All লিংক URL</label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.view_all_url || '/shop'}
                                                    onChange={(e) => updateBlockData('view_all_url', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                                                />
                                            </div>

                                            <div className="flex items-center pt-5">
                                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(activeBlock.data.show_bottom_button)}
                                                        onChange={(e) => updateBlockData('show_bottom_button', e.target.checked)}
                                                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                                    />
                                                    <span className="text-xs font-bold text-gray-700">নিচে বড় "View All" বাটন দেখান</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ========================================== */}
                                {/* 3. PRODUCT VIDEOS & PROMO CARDS */}
                                {/* ========================================== */}
                                {activeBlock.type === 'product_videos' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                                সেকশনের শিরোনাম
                                            </label>
                                            <input
                                                type="text"
                                                value={activeBlock.data.heading || 'Product Videos'}
                                                onChange={(e) => updateBlockData('heading', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <h3 className="font-bold text-gray-900 text-sm">
                                                ভিডিও ও প্রমো কার্ডসমূহ (Video Reels & Promo Cards)
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={addVideoItem}
                                                className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>নতুন কলাম যোগ করুন</span>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {(activeBlock.data.items || []).map((item, vIdx) => (
                                                <div key={vIdx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                                                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                                        <span className="font-bold text-xs text-emerald-800">
                                                            কলাম #{vIdx + 1}: {item.title || item.fullTitle || 'পণ্য'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVideoItem(vIdx)}
                                                            className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <ImagePickerField
                                                            label="ভার্টিক্যাল ভিডিও পোস্টার URL"
                                                            value={item.poster || ''}
                                                            onChange={(val) => updateVideoItem(vIdx, 'poster', val)}
                                                            placeholder="পোস্টার ইমেজ URL"
                                                        />
                                                        <div>
                                                            <label className="text-xs sm:text-sm font-bold text-gray-800 block mb-1">ভিডিও MP4 / স্ট্রিম URL</label>
                                                            <input
                                                                type="text"
                                                                value={item.videoUrl || ''}
                                                                onChange={(e) => updateVideoItem(vIdx, 'videoUrl', e.target.value)}
                                                                placeholder="https://assets.mixkit.co/...mp4"
                                                                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white font-mono"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <ImagePickerField
                                                            label="স্কয়ার প্রমো ব্যানার ইমেজ URL"
                                                            value={item.promoBanner || ''}
                                                            onChange={(val) => updateVideoItem(vIdx, 'promoBanner', val)}
                                                            placeholder="প্রমো ব্যানার URL"
                                                        />
                                                        <ImagePickerField
                                                            label="ছোট জার থাম্বনেইল URL"
                                                            value={item.thumb || ''}
                                                            onChange={(val) => updateVideoItem(vIdx, 'thumb', val)}
                                                            placeholder="থাম্বনেইল URL"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-700 block mb-0.5">প্রদর্শিত নাম</label>
                                                            <input
                                                                type="text"
                                                                value={item.title || ''}
                                                                onChange={(e) => updateVideoItem(vIdx, 'title', e.target.value)}
                                                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-700 block mb-0.5">মূল্য (Price Text)</label>
                                                            <input
                                                                type="text"
                                                                value={item.price || ''}
                                                                onChange={(e) => updateVideoItem(vIdx, 'price', e.target.value)}
                                                                placeholder="Tk 1,150.00"
                                                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-700 block mb-0.5">টার্গেট লিঙ্ক URL</label>
                                                            <input
                                                                type="text"
                                                                value={item.productUrl || ''}
                                                                onChange={(e) => updateVideoItem(vIdx, 'productUrl', e.target.value)}
                                                                placeholder="/product/beetroot-powder"
                                                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ========================================== */}
                                {/* 4. CERTIFICATIONS (Award-winning & Certified) */}
                                {/* ========================================== */}
                                {activeBlock.type === 'certifications' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                                    শিরোনাম (Heading)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.heading || 'Award-winning & Certified'}
                                                    onChange={(e) => updateBlockData('heading', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                                    সাবটাইটেল (Italic Subtitle)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.subheading || 'BSTI, BCSIR & Kuet Lab test'}
                                                    onChange={(e) => updateBlockData('subheading', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <h3 className="font-bold text-gray-900 text-sm">
                                                সার্টিফিকেশন লোগোসমূহ (Logos)
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={addCertLogo}
                                                className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>লোগো যোগ করুন</span>
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {(activeBlock.data.items || []).map((logo, lIdx) => (
                                                <div key={lIdx} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <ImagePickerField
                                                            label="লোগো ইমেজ URL"
                                                            value={logo.image || ''}
                                                            onChange={(val) => updateCertLogo(lIdx, 'image', val)}
                                                            placeholder="লোগো ইমেজ URL"
                                                        />
                                                        <div>
                                                            <label className="text-xs sm:text-sm font-bold text-gray-800 block mb-1">Alt টেক্সট / বিবরণ</label>
                                                            <input
                                                                type="text"
                                                                value={logo.alt || ''}
                                                                onChange={(e) => updateCertLogo(lIdx, 'alt', e.target.value)}
                                                                placeholder="যেমন: BSTI Certified"
                                                                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCertLogo(lIdx)}
                                                        className="text-rose-500 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 cursor-pointer self-end sm:self-center shrink-0"
                                                        title="মুছে ফেলুন"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ========================================== */}
                                {/* 5. WHY PUSTI KUNJO / STEP CARDS */}
                                {/* ========================================== */}
                                {(activeBlock.type === 'why_pustikunjo' || activeBlock.type === 'step_cards') && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                                    শিরোনাম (Heading)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.heading || 'Why PUSTI KUNJO'}
                                                    onChange={(e) => updateBlockData('heading', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                                    সাব-শিরোনাম (Subheading)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.subheading || 'খাঁটি রাখার প্রতিটি ধাপ — উৎস থেকে আপনার ঘর পর্যন্ত'}
                                                    onChange={(e) => updateBlockData('subheading', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <h3 className="font-bold text-gray-900 text-sm">
                                                স্টেপ কার্ডসমূহ (Step Cards)
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={addStep}
                                                className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>স্টেপ যোগ করুন</span>
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {(activeBlock.data.steps || []).map((step, stIdx) => (
                                                <div key={stIdx} className="p-3.5 rounded-xl border border-gray-200 bg-[#FAF7F0] space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={step.number || `0${stIdx + 1}`}
                                                                onChange={(e) => updateStep(stIdx, 'number', e.target.value)}
                                                                className="w-12 px-2 py-1 rounded border border-gray-300 font-black text-amber-700 text-center text-xs bg-white"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={step.title || ''}
                                                                onChange={(e) => updateStep(stIdx, 'title', e.target.value)}
                                                                placeholder="ধাপের শিরোনাম"
                                                                className="px-2.5 py-1 rounded border border-gray-300 font-bold text-xs bg-white flex-1"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeStep(stIdx)}
                                                            className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        rows={2}
                                                        value={step.text || ''}
                                                        onChange={(e) => updateStep(stIdx, 'text', e.target.value)}
                                                        placeholder="ধাপের বিস্তারিত বিবরণ"
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ========================================== */}
                                {/* 6. HAKIM CONSULTATION CTA BANNER */}
                                {/* ========================================== */}
                                {activeBlock.type === 'consultation_cta' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                            <h3 className="font-bold text-gray-900 text-sm">
                                                হাকিম কনসাল্টেশন ব্যানার কনফিগারেশন
                                            </h3>
                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={activeBlock.data.enabled !== false}
                                                    onChange={(e) => updateBlockData('enabled', e.target.checked)}
                                                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                                />
                                                <span className="text-xs font-bold text-gray-700">ব্যানার সক্রিয় রাখুন</span>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">টপ ব্যাজ লেবেল</label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.label || 'FREE CONSULTATION'}
                                                    onChange={(e) => updateBlockData('label', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">প্রধান শিরোনাম</label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.heading || 'Hakim Consultation'}
                                                    onChange={(e) => updateBlockData('heading', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-700 block mb-1">সাবটাইটেল / বর্ণনা</label>
                                            <input
                                                type="text"
                                                value={activeBlock.data.description || 'অভিজ্ঞ হাকিমের কাছ থেকে বিনামূল্যে ইউনানি পরামর্শ নিন'}
                                                onChange={(e) => updateBlockData('description', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">বাটন টেক্সট</label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.cta_label || 'Get Advice'}
                                                    onChange={(e) => updateBlockData('cta_label', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">বাটন লিঙ্ক URL</label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.cta_url || '/contact'}
                                                    onChange={(e) => updateBlockData('cta_url', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ========================================== */}
                                {/* 7. CONTACT STRIP */}
                                {/* ========================================== */}
                                {activeBlock.type === 'contact_strip' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                                শিরোনাম (Title)
                                            </label>
                                            <input
                                                type="text"
                                                value={activeBlock.data.title || 'কিছু জানার আছে?'}
                                                onChange={(e) => updateBlockData('title', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 block mb-1">
                                                বর্ণনা টেক্সট (Text)
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={activeBlock.data.text || 'পণ্য বা অর্ডার সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি কল করুন অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন।'}
                                                onChange={(e) => updateBlockData('text', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ========================================== */}
                                {/* 8. GENERIC FALLBACK FOR OTHER BLOCKS */}
                                {/* ========================================== */}
                                {['hero', 'banner_slider', 'product_grid', 'product_videos', 'certifications', 'why_pustikunjo', 'step_cards', 'consultation_cta', 'contact_strip'].indexOf(activeBlock.type) === -1 && (
                                    <div className="space-y-4">
                                        {activeBlock.data.heading !== undefined && (
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">শিরোনাম</label>
                                                <input
                                                    type="text"
                                                    value={activeBlock.data.heading || ''}
                                                    onChange={(e) => updateBlockData('heading', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                                                />
                                            </div>
                                        )}
                                        {activeBlock.data.subheading !== undefined && (
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">সাব-শিরোনাম</label>
                                                <textarea
                                                    rows={2}
                                                    value={activeBlock.data.subheading || ''}
                                                    onChange={(e) => updateBlockData('subheading', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                                                />
                                            </div>
                                        )}
                                        {activeBlock.data.content !== undefined && (
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 block mb-1">HTML কন্টেন্ট</label>
                                                <textarea
                                                    rows={6}
                                                    value={activeBlock.data.content || ''}
                                                    onChange={(e) => updateBlockData('content', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                )}

                {/* Tab 3: SEO & Page Settings */}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 max-w-3xl space-y-6">
                        <div className="border-b border-gray-100 pb-3">
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-emerald-700" />
                                <span>এসইও (SEO) ও পেজ মেটা সেটিংস</span>
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                সার্চ ইঞ্জিন ও সোশ্যাল শেয়ারের জন্য মেটা টাইটেল ও বিবরণ নির্ধারণ করুন।
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">মেটা টাইটেল (Meta Title)</label>
                                <input
                                    type="text"
                                    value={form.data.meta_title || ''}
                                    onChange={(e) => form.setData('meta_title', e.target.value)}
                                    placeholder="গুগল সার্চে প্রদর্শিত টাইটেল (যেমন: পুষ্টি কুঞ্জ | অর্ডার নিয়মাবলী)..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">মেটা বিবরণ (Meta Description)</label>
                                <textarea
                                    rows={4}
                                    value={form.data.meta_description || ''}
                                    onChange={(e) => form.setData('meta_description', e.target.value)}
                                    placeholder="গুগল সার্চ ও সোশ্যাল মিডিয়ায় প্রদর্শিত বিবরণ..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_published}
                                        onChange={(e) => form.setData('is_published', e.target.checked)}
                                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                                    />
                                    <div>
                                        <span className="font-bold text-sm text-gray-800 block">পেজটি ওয়েবসাইটে সক্রিয় রাখুন</span>
                                        <span className="text-xs text-gray-500">আনচেক করলে সাধারণ গ্রাহকরা এই পেজটি দেখতে পাবেন না</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {/* Block Selection Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto animate-fade-in">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="font-black text-lg text-gray-900">
                                পেজে নতুন সেকশন / ব্লক যোগ করুন
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {AVAILABLE_BLOCKS.map((blk, idx) => {
                                const IconComp = blk.icon;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => addBlock(blk)}
                                        className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all space-y-1.5 group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <IconComp className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-sm text-gray-900 group-hover:text-emerald-800">
                                                {blk.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {blk.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
