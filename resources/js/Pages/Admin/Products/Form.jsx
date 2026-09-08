import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MediaPickerModal from '@/Components/Admin/MediaPickerModal';
import { ArrowLeft, Save, Plus, Trash2, Image, Sparkles, Layers, DollarSign, Upload } from 'lucide-react';

export default function Form({ product = null, categories = [] }) {
    const isEdit = Boolean(product);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    const form = useForm({
        name: product?.name || '',
        slug: product?.slug || '',
        sku: product?.sku || 'PK-',
        price: product?.price || '',
        sale_price: product?.sale_price || '',
        stock: product?.stock !== undefined ? product.stock : 50,
        weight: product?.weight || '২০০ গ্রাম',
        variants: (product?.variants && Array.isArray(product.variants) && product.variants.length > 0)
            ? product.variants
            : [
                { name: product?.weight || '২০০ গ্রাম', price: product?.price || 450, sale_price: product?.sale_price || 390, stock: product?.stock || 50 },
                { name: '৫০০ গ্রাম', price: product?.price ? Number(product.price) * 2 : 900, sale_price: product?.sale_price ? Number(product.sale_price) * 2 - 30 : 750, stock: 30 }
            ],
        category_id: product?.category_id || (categories[0]?.id || ''),
        badge: product?.badge || '',
        short_description: product?.short_description || '',
        description: product?.description || '',
        images: product?.images || ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'],
        benefits: product?.benefits || [
            { title: 'রক্তস্বল্পতা দূর করে', text: 'রক্তের হিমোগ্লোবিন বৃদ্ধিতে সাহায্য করে।', icon: 'HeartPulse' }
        ],
        usage_instructions: product?.usage_instructions || 'প্রতিদিন ১ চামচ কুসুম গরম পানিতে মিশিয়ে সেবন করুন।',
        is_featured: product?.is_featured || false,
        is_active: product?.is_active !== undefined ? product.is_active : true,
        meta_title: product?.meta_title || '',
        meta_description: product?.meta_description || '',
    });

    const [newImageUrl, setNewImageUrl] = useState('');

    const addVariant = () => {
        const nextVariants = [
            ...(form.data.variants || []),
            { name: '১ কেজি', price: '', sale_price: '', stock: 20 }
        ];
        form.setData('variants', nextVariants);
    };

    const updateVariant = (index, field, value) => {
        const updated = [...(form.data.variants || [])];
        updated[index] = { ...updated[index], [field]: value };
        form.setData('variants', updated);
    };

    const removeVariant = (index) => {
        form.setData('variants', form.data.variants.filter((_, i) => i !== index));
    };

    const addImage = () => {
        if (newImageUrl.trim()) {
            form.setData('images', [...form.data.images, newImageUrl.trim()]);
            setNewImageUrl('');
        }
    };

    const removeImage = (index) => {
        form.setData('images', form.data.images.filter((_, i) => i !== index));
    };

    const addBenefit = () => {
        form.setData('benefits', [
            ...form.data.benefits,
            { title: 'নতুন উপকারিতা', text: 'উপকারিতার বিস্তারিত বিবরণ লিখুন...', icon: 'Sparkles' }
        ]);
    };

    const updateBenefit = (index, field, value) => {
        const updated = [...form.data.benefits];
        updated[index][field] = value;
        form.setData('benefits', updated);
    };

    const removeBenefit = (index) => {
        form.setData('benefits', form.data.benefits.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            form.put(`/admin/products/${product.id}`);
        } else {
            form.post('/admin/products');
        }
    };

    return (
        <AdminLayout title={isEdit ? `পণ্য সম্পাদনা: ${product.name}` : 'নতুন পণ্য যোগ করুন'}>
            <form onSubmit={handleSubmit} className="space-y-8 w-full">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/products"
                        className="text-xs font-bold text-gray-600 hover:text-emerald-700 flex items-center gap-1.5"
                    >
                        <ArrowLeft className="w-4 h-4" /> পণ্যের তালিকায় ফিরে যান
                    </Link>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isEdit ? 'আপডেট সংরক্ষণ করুন' : 'পণ্য সংরক্ষণ করুন'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Cols: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
                                সাধারণ তথ্য (General Info)
                            </h2>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    পণ্যের নাম *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="যেমন: বিটরুট পাউডার (Beetroot Powder)"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                />
                                {form.errors.name && <span className="text-xs text-rose-500 mt-1 block">{form.errors.name}</span>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">
                                        ইউনিক SKU (Prefix: PK-) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="যেমন: PK-BT-001"
                                        value={form.data.sku}
                                        onChange={(e) => form.setData('sku', e.target.value.toUpperCase())}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono uppercase focus:border-emerald-600"
                                    />
                                    {form.errors.sku && <span className="text-xs text-rose-500 mt-1 block">{form.errors.sku}</span>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">
                                        ওজন / পরিমাণ (Weight)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="যেমন: ২০০ গ্রাম, ২৫০ গ্রাম, ১ কেজি"
                                        value={form.data.weight}
                                        onChange={(e) => form.setData('weight', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    সংক্ষিপ্ত বিবরণ (Short Description)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="পণ্য সম্পর্কিত ১-২ লাইনের মূল আকর্ষণ..."
                                    value={form.data.short_description}
                                    onChange={(e) => form.setData('short_description', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    বিস্তারিত বিবরণ (Long Description)
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="পণ্যের উপাদান, বৈশিষ্ট্য ও বিস্তারিত বিবরণ..."
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                />
                            </div>
                        </div>

                        {/* Variant Wise Pricing & Stock Card (ভ্যারিয়েন্ট ভিত্তিক মূল্য ও স্টক) */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div>
                                    <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-emerald-700" /> ভ্যারিয়েন্ট ও মূল্য ব্যবস্থাপনা (Variant Wise Pricing)
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        গ্রাহক ফ্রন্টএন্ডে যে ভ্যারিয়েন্ট (যেমন: ২০০ গ্রাম, ৫০০ গ্রাম) সিলেক্ট করবেন, সাথে সাথে এই অনুযায়ী মূল্য পরিবর্তন হবে।
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" /> ভ্যারিয়েন্ট যোগ করুন
                                </button>
                            </div>

                            <div className="space-y-3">
                                {form.data.variants?.map((v, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3 relative">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-mono">
                                                    {idx + 1}
                                                </span>
                                                ভ্যারিয়েন্ট #{idx + 1}
                                            </span>
                                            {form.data.variants.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(idx)}
                                                    className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                                                    title="মুছে ফেলুন"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                            <div className="sm:col-span-1">
                                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                                    ওজন / নাম *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="যেমন: ২০০ গ্রাম"
                                                    value={v.name}
                                                    onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white focus:border-emerald-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                                    নিয়মিত মূল্য (৳) *
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    placeholder="450"
                                                    value={v.price}
                                                    onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold bg-white focus:border-emerald-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                                    অফার মূল্য (৳)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="390"
                                                    value={v.sale_price}
                                                    onChange={(e) => updateVariant(idx, 'sale_price', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-red-600 bg-white focus:border-emerald-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                                    স্টক পরিমাণ
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="50"
                                                    value={v.stock !== undefined ? v.stock : ''}
                                                    onChange={(e) => updateVariant(idx, 'stock', Number(e.target.value))}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:border-emerald-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits Repeater Card (পণ্যের উপকারিতা) */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-700" /> পণ্যের উপকারিতা (Benefits Repeater)
                                </h2>
                                <button
                                    type="button"
                                    onClick={addBenefit}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100"
                                >
                                    <Plus className="w-3.5 h-3.5" /> উপকারিতা যোগ করুন
                                </button>
                            </div>

                            <div className="space-y-3">
                                {form.data.benefits?.map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2 relative">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-emerald-800">উপকারিতা #{idx + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeBenefit(idx)}
                                                className="text-gray-400 hover:text-rose-600 p-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <div className="sm:col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="উপকারিতার শিরোনাম (যেমন: রক্তস্বল্পতা দূর করে)"
                                                    value={item.title}
                                                    onChange={(e) => updateBenefit(idx, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold"
                                                />
                                            </div>
                                            <div>
                                                <select
                                                    value={item.icon || 'Sparkles'}
                                                    onChange={(e) => updateBenefit(idx, 'icon', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                                                >
                                                    <option value="HeartPulse">Heart / রক্ত</option>
                                                    <option value="Sparkles">Sparkles / উজ্জ্বলতা</option>
                                                    <option value="Activity">Activity / স্ট্যামিনা</option>
                                                    <option value="ShieldCheck">Shield / সুরক্ষা</option>
                                                    <option value="Scale">Scale / ওজন</option>
                                                </select>
                                            </div>
                                        </div>
                                        <textarea
                                            rows={2}
                                            placeholder="উপকারিতার বিস্তারিত ব্যাখ্যা..."
                                            value={item.text}
                                            onChange={(e) => updateBenefit(idx, 'text', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Usage Instructions (ব্যবহারবিধি) */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
                                ব্যবহারবিধি (Usage Instructions)
                            </h2>
                            <textarea
                                rows={3}
                                placeholder="সঠিক সেবনবিধি ও নির্দেশিকা লিখুন..."
                                value={form.data.usage_instructions}
                                onChange={(e) => form.setData('usage_instructions', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                            />
                        </div>
                    </div>

                    {/* Right Col: Pricing, Category, Images, Badges */}
                    <div className="space-y-6">
                        {/* Price & Stock Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
                                মূল্য ও স্টক (Pricing & Stock)
                            </h2>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    নিয়মিত মূল্য (৳) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="450"
                                    value={form.data.price}
                                    onChange={(e) => form.setData('price', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    অফার / ডিসকাউন্ট মূল্য (৳)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="390"
                                    value={form.data.sale_price}
                                    onChange={(e) => form.setData('sale_price', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    মজুদ পরিমাণ (Stock Quantity) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={form.data.stock}
                                    onChange={(e) => form.setData('stock', Number(e.target.value))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600"
                                />
                            </div>
                        </div>

                        {/* Category & Badge */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
                                ক্যাটাগরি ও ব্যাজ
                            </h2>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    ক্যাটাগরি
                                </label>
                                <select
                                    value={form.data.category_id}
                                    onChange={(e) => form.setData('category_id', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
                                >
                                    <option value="">নির্বাচন করুন</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    কাস্টম ব্যাজ (Custom Badge)
                                </label>
                                <input
                                    type="text"
                                    placeholder="যেমন: নতুন, বেস্ট সেলার, জনপ্রিয়"
                                    value={form.data.badge}
                                    onChange={(e) => form.setData('badge', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                                />
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_featured}
                                        onChange={(e) => form.setData('is_featured', e.target.checked)}
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span>হোমপেজে ফিচার্ড করুন (Featured)</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) => form.setData('is_active', e.target.checked)}
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span>পণ্য সক্রিয় রাখুন (Published)</span>
                                </label>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
                                পণ্যের ছবি (Image URLs)
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex flex-1 gap-2">
                                    <input
                                        type="url"
                                        placeholder="https://... ইমেজ লিংক"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={addImage}
                                        className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
                                    >
                                        যুক্ত
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsMediaModalOpen(true)}
                                    className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>মিডিয়া লাইব্রেরি</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-2">
                                {form.data.images?.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                        <img src={img} alt="Product" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Media Picker Modal */}
                            <MediaPickerModal
                                isOpen={isMediaModalOpen}
                                onClose={() => setIsMediaModalOpen(false)}
                                onSelect={(url) => {
                                    form.setData('images', [...(form.data.images || []), url]);
                                }}
                                title="পণ্যের ছবি নির্বাচন — মিডিয়া লাইব্রেরি"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
