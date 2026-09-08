import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Leaf, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#07381e] flex flex-col justify-center items-center p-4">
            <Head title="এডমিন লগইন — পুষ্টি কুঞ্জ" />

            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
                        <Leaf className="w-8 h-8 fill-current" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        পুষ্টি কুঞ্জ এডমিন
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">
                        প্যানেলে প্রবেশ করতে আপনার ইমেইল ও পাসওয়ার্ড দিন
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                            ইমেইল এড্রেস
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                placeholder="আপনার ইমেইল লিখুন"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                            />
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                        {errors.email && (
                            <span className="text-xs text-rose-500 mt-1 block">{errors.email}</span>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                            পাসওয়ার্ড
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                placeholder="পাসওয়ার্ড লিখুন"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                        {errors.password && (
                            <span className="text-xs text-rose-500 mt-1 block">{errors.password}</span>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>মনে রাখুন</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                        <span>লগইন করুন</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
