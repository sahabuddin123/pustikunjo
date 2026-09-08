import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Leaf, Printer } from 'lucide-react';

export default function Invoice({ order }) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="bg-white min-h-screen text-gray-900 p-8 sm:p-12 max-w-4xl mx-auto font-sans">
            <Head title={`Invoice-${order.order_number}`} />

            {/* Print trigger button */}
            <div className="print:hidden mb-6 flex justify-end">
                <button
                    onClick={() => window.print()}
                    className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                    <Printer className="w-4 h-4" /> প্রিন্ট করুন
                </button>
            </div>

            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b-2 border-emerald-800 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-emerald-900">
                        <Leaf className="w-8 h-8 fill-current" />
                        <span className="text-3xl font-black">পুষ্টি কুঞ্জ</span>
                    </div>
                    <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block mt-1">
                        Purity Begins here
                    </span>
                    <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                        <div>ফোন: 01700-000000</div>
                        <div>ইমেইল: info@pustikunjo.com.bd</div>
                        <div>ওয়েবসাইট: https://pustikunjo.com.bd</div>
                    </div>
                </div>

                <div className="text-right">
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
                        ক্যাশ মেমো / ইনভয়েস
                    </h1>
                    <div className="text-sm font-mono font-bold text-emerald-800 mt-1">
                        #{order.order_number}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        তারিখ: {new Date(order.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="mt-2 text-xs font-bold px-2.5 py-1 rounded bg-gray-100 uppercase inline-block">
                        পেমেন্ট: {order.payment_method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'বিকাশ'}
                    </div>
                </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-8 py-6 text-xs sm:text-sm">
                <div>
                    <h3 className="font-bold text-gray-500 uppercase text-[11px] mb-1">বিল ও ডেলিভারি প্রাপক:</h3>
                    <div className="font-bold text-gray-900 text-base">{order.customer_name}</div>
                    <div className="text-gray-700">{order.customer_phone}</div>
                    <div className="text-gray-600 mt-1 leading-relaxed">{order.shipping_address} ({order.shipping_area})</div>
                </div>
                <div className="text-right">
                    <h3 className="font-bold text-gray-500 uppercase text-[11px] mb-1">অর্ডার স্ট্যাটাস:</h3>
                    <span className="font-bold text-emerald-800 text-base">{order.status_label || order.status}</span>
                    {order.bkash_trx_id && (
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                            bKash TrxID: {order.bkash_trx_id}
                        </div>
                    )}
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-xs sm:text-sm border-collapse my-4">
                <thead>
                    <tr className="bg-emerald-800 text-white font-bold uppercase text-[11px]">
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">পণ্যের বিবরণ</th>
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4 text-center">পরিমাণ</th>
                        <th className="py-3 px-4 text-right">একক মূল্য</th>
                        <th className="py-3 px-4 text-right">মোট</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {order.items?.map((item, idx) => (
                        <tr key={item.id} className="py-2.5">
                            <td className="py-3 px-4">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-gray-900">{item.product_name}</td>
                            <td className="py-3 px-4 font-mono text-gray-500">{item.product_sku}</td>
                            <td className="py-3 px-4 text-center font-bold">{item.quantity}</td>
                            <td className="py-3 px-4 text-right">৳{item.unit_price}</td>
                            <td className="py-3 px-4 text-right font-bold">৳{item.subtotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals Calculation */}
            <div className="flex justify-end pt-4">
                <div className="w-64 space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>সাবটোটাল:</span>
                        <span className="font-semibold text-gray-900">৳{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>ডেলিভারি চার্জ:</span>
                        <span className="font-semibold text-gray-900">৳{order.shipping_fee}</span>
                    </div>
                    {order.discount_amount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>কুপন ছাড়:</span>
                            <span>-৳{order.discount_amount}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-base font-black text-emerald-950 pt-2 border-t-2 border-gray-900">
                        <span>সর্বমোট প্রদেয় বিল:</span>
                        <span className="text-emerald-800">৳{order.grand_total}</span>
                    </div>
                </div>
            </div>

            {/* Invoice Footer / Signatures */}
            <div className="pt-16 mt-16 border-t border-gray-200 grid grid-cols-2 text-center text-xs text-gray-500">
                <div>
                    <div className="border-t border-gray-400 w-40 mx-auto pt-1 font-semibold">গ্রাহকের স্বাক্ষর</div>
                </div>
                <div>
                    <div className="border-t border-gray-400 w-40 mx-auto pt-1 font-semibold">কর্তৃপক্ষের স্বাক্ষর</div>
                </div>
            </div>
        </div>
    );
}
