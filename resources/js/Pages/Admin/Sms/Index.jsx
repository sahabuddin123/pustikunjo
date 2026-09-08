import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { MessageSquare, Save, Send, ShieldCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function Index({ smsConfig = {}, triggers = {}, logs = { data: [] } }) {
    const [activeTab, setActiveTab] = useState('triggers'); // triggers, config, test, logs

    const configForm = useForm({
        config: smsConfig,
    });

    const triggerForm = useForm({
        triggers: triggers,
    });

    const testForm = useForm({
        phone: '01700000000',
        message: 'পুষ্টি কুঞ্জ থেকে টেস্ট এসএমএস। আপনার সুস্বাস্থ্যই আমাদের অঙ্গীকার।',
    });

    const submitConfig = (e) => {
        e.preventDefault();
        configForm.post('/admin/sms/config');
    };

    const submitTriggers = (e) => {
        e.preventDefault();
        triggerForm.post('/admin/sms/triggers');
    };

    const submitTestSms = (e) => {
        e.preventDefault();
        testForm.post('/admin/sms/test');
    };

    const logList = logs?.data || [];

    return (
        <AdminLayout title="এসএমএস গেটওয়ে ও অটোমেশন (SMS Module)">
            <div className="space-y-6 max-w-5xl">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-3">
                    <button
                        onClick={() => setActiveTab('triggers')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'triggers' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        📩 অটোমেটিক এসএমএস টেমপ্লেট
                    </button>
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'config' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        ⚙️ গেটওয়ে কনফিগারেশন
                    </button>
                    <button
                        onClick={() => setActiveTab('test')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'test' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        🚀 টেস্ট এসএমএস পাঠান
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'logs' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        📋 এসএমএস লগ
                    </button>
                </div>

                {/* Tab 1: Event Triggers & Templates */}
                {activeTab === 'triggers' && (
                    <form onSubmit={submitTriggers} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6 animate-fade-in">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-base text-gray-900">অর্ডার ইভেন্ট এসএমএস ট্রিগার ও মেসেজ</h2>
                                <p className="text-xs text-gray-500">
                                    ব্যবহারযোগ্য ভ্যারিয়েবলসমূহ: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">{'{{customer_name}}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">{'{{order_id}}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">{'{{total}}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">{'{{track_url}}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">{'{{reason}}'}</code>
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={triggerForm.processing}
                                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                                <Save className="w-4 h-4" /> টেমপ্লেট সংরক্ষণ
                            </button>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(triggerForm.data.triggers || {}).map(([key, trig]) => (
                                <div key={key} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-900 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={trig.enabled}
                                                onChange={(e) => {
                                                    const updated = { ...triggerForm.data.triggers };
                                                    updated[key].enabled = e.target.checked;
                                                    triggerForm.setData('triggers', updated);
                                                }}
                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span>{trig.label || key}</span>
                                        </label>

                                        {key === 'order_placed' && (
                                            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={trig.send_to_admin}
                                                    onChange={(e) => {
                                                        const updated = { ...triggerForm.data.triggers };
                                                        updated[key].send_to_admin = e.target.checked;
                                                        triggerForm.setData('triggers', updated);
                                                    }}
                                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span>এডমিন নম্বরেও অ্যালার্ট যাবে</span>
                                            </label>
                                        )}
                                    </div>

                                    <textarea
                                        rows={2}
                                        value={trig.template || ''}
                                        onChange={(e) => {
                                            const updated = { ...triggerForm.data.triggers };
                                            updated[key].template = e.target.value;
                                            triggerForm.setData('triggers', updated);
                                        }}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-emerald-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </form>
                )}

                {/* Tab 2: Provider Configuration */}
                {activeTab === 'config' && (
                    <form onSubmit={submitConfig} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6 animate-fade-in">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <h2 className="font-bold text-base text-gray-900">বাংলাদেশি এসএমএস গেটওয়ে সেটিংস</h2>
                            <button
                                type="submit"
                                disabled={configForm.processing}
                                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                                <Save className="w-4 h-4" /> গেটওয়ে সংরক্ষণ
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-900 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={configForm.data.config?.enabled}
                                    onChange={(e) => {
                                        const updated = { ...configForm.data.config, enabled: e.target.checked };
                                        configForm.setData('config', updated);
                                    }}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>অটোমেটিক এসএমএস সার্ভিস চালু রাখুন (Master SMS Toggle)</span>
                            </label>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    এসএমএস প্রোভাইডার নির্বাচন করুন
                                </label>
                                <select
                                    value={configForm.data.config?.provider || 'custom_http'}
                                    onChange={(e) => {
                                        const updated = { ...configForm.data.config, provider: e.target.value };
                                        configForm.setData('config', updated);
                                    }}
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
                                >
                                    <option value="ssl_wireless">SSL Wireless SMS Plus</option>
                                    <option value="bulksmsbd">BulkSMSBD</option>
                                    <option value="mdl">MDL / MiMi SMS</option>
                                    <option value="custom_http">Custom HTTP Gateway / Simulated</option>
                                </select>
                            </div>

                            {/* SSL Wireless Credentials */}
                            {configForm.data.config?.provider === 'ssl_wireless' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1">SSL API Token</label>
                                        <input
                                            type="text"
                                            value={configForm.data.config?.ssl_api_token || ''}
                                            onChange={(e) => {
                                                const updated = { ...configForm.data.config, ssl_api_token: e.target.value };
                                                configForm.setData('config', updated);
                                            }}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1">SSL SID / Masking</label>
                                        <input
                                            type="text"
                                            value={configForm.data.config?.ssl_sid || ''}
                                            onChange={(e) => {
                                                const updated = { ...configForm.data.config, ssl_sid: e.target.value };
                                                configForm.setData('config', updated);
                                            }}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* BulkSMSBD Credentials */}
                            {configForm.data.config?.provider === 'bulksmsbd' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1">BulkSMSBD API Key</label>
                                        <input
                                            type="text"
                                            value={configForm.data.config?.bulk_api_key || ''}
                                            onChange={(e) => {
                                                const updated = { ...configForm.data.config, bulk_api_key: e.target.value };
                                                configForm.setData('config', updated);
                                            }}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-1">Sender ID</label>
                                        <input
                                            type="text"
                                            value={configForm.data.config?.bulk_sender_id || ''}
                                            onChange={(e) => {
                                                const updated = { ...configForm.data.config, bulk_sender_id: e.target.value };
                                                configForm.setData('config', updated);
                                            }}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                )}

                {/* Tab 3: Test SMS Sender */}
                {activeTab === 'test' && (
                    <form onSubmit={submitTestSms} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4 max-w-lg animate-fade-in">
                        <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <Send className="w-4 h-4 text-emerald-700" /> টেস্ট মেসেজ পাঠান
                        </h2>

                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">মোবাইল নম্বর *</label>
                            <input
                                type="tel"
                                required
                                value={testForm.data.phone}
                                onChange={(e) => testForm.setData('phone', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:border-emerald-600"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">বার্তা (Message) *</label>
                            <textarea
                                required
                                rows={3}
                                value={testForm.data.message}
                                onChange={(e) => testForm.setData('message', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:border-emerald-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={testForm.processing}
                            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            <span>টেস্ট এসএমএস পাঠান</span>
                        </button>
                    </form>
                )}

                {/* Tab 4: Logs */}
                {activeTab === 'logs' && (
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden animate-fade-in">
                        <div className="p-5 border-b border-gray-100 font-bold text-base text-gray-900">
                            এসএমএস প্রেরণের ইতিহাস ({logList.length})
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-[11px]">
                                    <tr>
                                        <th className="py-3 px-4">প্রাপকের নম্বর</th>
                                        <th className="py-3 px-4">মেসেজ</th>
                                        <th className="py-3 px-4">ইভেন্ট</th>
                                        <th className="py-3 px-4">স্ট্যাটাস</th>
                                        <th className="py-3 px-4">সময়</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {logList.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                এখনো কোনো এসএমএস লগ তৈরি হয়নি।
                                            </td>
                                        </tr>
                                    ) : (
                                        logList.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50/50">
                                                <td className="py-3 px-4 font-mono font-bold text-emerald-900">
                                                    {log.recipient_phone}
                                                </td>
                                                <td className="py-3 px-4 text-gray-700 max-w-xs truncate">
                                                    {log.message}
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-xs text-gray-600">
                                                    {log.event_name || 'manual'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                        log.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                    }`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-400 text-xs">
                                                    {new Date(log.created_at).toLocaleDateString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
