import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { trackEvent } from '@/Services/Analytics';
import {
    CheckCircle,
    Package,
    PhoneCall,
    ArrowRight,
    Truck,
    Clock,
    FileText,
    Copy,
    Check
} from 'lucide-react';

export default function OrderSuccess({ order, meta = {} }) {
    // Track Meta Pixel Purchase event
    useEffect(() => {
        if (order) {
            const skus = (order.items || []).map((it) => it.product_sku || `SKU-${it.product_id}`);
            trackEvent('purchase', {
                transaction_id: order.order_number,
                value: Number(order.grand_total),
                num_items: (order.items || []).length,
                content_ids: skus,
            });
        }
    }, [order?.id]);

    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(order.order_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <StorefrontLayout meta={meta}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
                {/* Success Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle className="w-12 h-12" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wider">
                            অর্ডার নিশ্চিতকরণ
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-black text-gray-900">
                            ধন্যবাদ! আপনার অর্ডারটি সফল হয়েছে
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                            আপনার মোবাইলে একটি নিশ্চিতকরণ এসএমএস পাঠানো হয়েছে। খুব শীঘ্রই আমাদের প্রতিনিধি ডেলিভারির জন্য যোগাযোগ করবেন।
                        </p>
                    </div>

                    {/* Order Number Box */}
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 inline-flex flex-col sm:flex-row items-center gap-3 mx-auto">
                        <span className="text-xs text-gray-600 font-medium">অর্ডার ট্র্যাকিং আইডি:</span>
                        <span className="text-lg font-black text-emerald-900 font-mono">{order.order_number}</span>
                        <button
                            onClick={handleCopy}
                            className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                        </button>
                    </div>

                    {/* Order Details Breakdown */}
                    <div className="border-t border-gray-100 pt-6 text-left space-y-4">
                        <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                            <Package className="w-4 h-4 text-emerald-700" /> পণ্যের তালিকা
                        </h3>
                        <div className="divide-y divide-gray-100 bg-gray-50/60 rounded-2xl p-4 border border-gray-100">
                            {order.items?.map((item) => (
                                <div key={item.id} className="py-2.5 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.product_image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&auto=format&fit=crop&q=80'}
                                            alt={item.product_name}
                                            className="w-10 h-10 rounded-lg object-cover bg-white"
                                        />
                                        <div>
                                            <div className="font-bold text-gray-900">{item.product_name}</div>
                                            <div className="text-xs text-gray-500">পরিমাণ: {item.quantity} × ৳{item.unit_price}</div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-emerald-800">৳{item.subtotal}</span>
                                </div>
                            ))}
                            <div className="pt-3 space-y-1.5 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>ডেলিভারি চার্জ:</span>
                                    <span className="font-semibold text-gray-900">৳{order.shipping_fee}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-emerald-700">
                                        <span>কুপন ছাড়:</span>
                                        <span>-৳{order.discount_amount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                                    <span>সর্বমোট:</span>
                                    <span className="text-emerald-800">৳{order.grand_total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs sm:text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                            <span className="text-gray-500 block">গ্রাহকের নাম:</span>
                            <span className="font-bold text-gray-900">{order.customer_name}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">মোবাইল নম্বর:</span>
                            <span className="font-bold text-gray-900">{order.customer_phone}</span>
                        </div>
                        <div className="sm:col-span-2">
                            <span className="text-gray-500 block">ডেলিভারি ঠিকানা:</span>
                            <span className="font-semibold text-gray-800">{order.shipping_address} ({order.shipping_area})</span>
                        </div>
                    </div>

                    {/* Next Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
                        <Link
                            href={`/track-order?order=${order.order_number}&phone=${order.customer_phone}`}
                            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                        >
                            <Truck className="w-4 h-4" />
                            <span>অর্ডার ট্র্যাক করুন</span>
                        </Link>
                        <Link
                            href="/shop"
                            className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            <span>আরও কেনাকাটা করুন</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
