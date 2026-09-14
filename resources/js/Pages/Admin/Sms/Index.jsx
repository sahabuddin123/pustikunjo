import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { MessageSquare, Save, Send, ShieldCheck, CheckCircle2, XCircle, Clock, Eye, EyeOff, Key, Radio, Wallet } from 'lucide-react';

export default function Index({ smsConfig = {}, triggers = {}, logs = { data: [] }, mramBalance = {} }) {
    const [activeTab, setActiveTab] = useState('config'); // default to config or triggers
    const [showMramKey, setShowMramKey] = useState(false);

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
            <div className="space-y-6 w-full">
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
                                    ডিফল্ট এসএমএস প্রোভাইডার নির্বাচন
                                </label>
                                <select
                                    value={configForm.data.config?.provider || 'mram'}
                                    onChange={(e) => {
                                        const updated = { ...configForm.data.config, provider: e.target.value };
                                        configForm.setData('config', updated);
                                    }}
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
                                >
                                    <option value="mram">M-RAM TECHNOLOGIES (Official API)</option>
                                    <option value="ssl_wireless">SSL Wireless SMS Plus</option>
                                    <option value="bulksmsbd">BulkSMSBD</option>
                                    <option value="mdl">MDL / MiMi SMS</option>
                                    <option value="custom_http">Custom HTTP Gateway / Simulated</option>
                                </select>
                            </div>

                            {/* M-RAM TECHNOLOGIES Official Gateway Card (User Reference Design) */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-base sm:text-lg text-gray-900 tracking-wide uppercase">
                                                M-RAM TECHNOLOGIES
                                            </h3>
                                            <span className="text-xs text-gray-400 font-semibold">(MRAM)</span>
                                            {mramBalance?.success && (
                                                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    ব্যালেন্স: ৳ {mramBalance.balance}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Official M-RAM Technologies SMS API (msg.mram.com.bd) with masking 8809601017199.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 self-start sm:self-auto">
                                        {/* Active Toggle Switch */}
                                        <div className="flex items-center gap-2.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const current = configForm.data.config?.mram_active !== false;
                                                    const updated = {
                                                        ...configForm.data.config,
                                                        mram_active: !current
                                                    };
                                                    configForm.setData('config', updated);
                                                }}
                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                                    configForm.data.config?.mram_active !== false ? 'bg-emerald-500' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                        configForm.data.config?.mram_active !== false ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                            <div>
                                                <span className={`text-xs font-bold block ${configForm.data.config?.mram_active !== false ? 'text-emerald-700' : 'text-gray-500'}`}>
                                                    {configForm.data.config?.mram_active !== false ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 block">
                                                    {configForm.data.config?.mram_active !== false ? 'Click to deactivate' : 'Click to activate'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Set Default Checkbox */}
                                        <label className="flex items-center gap-2 cursor-pointer select-none pl-3 border-l border-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={configForm.data.config?.mram_is_default !== false}
                                                onChange={(e) => {
                                                    const updated = {
                                                        ...configForm.data.config,
                                                        mram_is_default: e.target.checked,
                                                        provider: e.target.checked ? 'mram' : configForm.data.config?.provider
                                                    };
                                                    configForm.setData('config', updated);
                                                }}
                                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <div>
                                                <span className="text-xs font-bold text-indigo-900 block">Set Default</span>
                                                <span className="text-[10px] text-gray-400 block">Primary for Orders &amp; OTP</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* M-RAM API Key */}
                                <div>
                                    <label className="text-xs font-bold text-gray-800 mb-1.5 block">
                                        M-RAM API Key *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showMramKey ? 'text' : 'password'}
                                            value={configForm.data.config?.mram_api_key || ''}
                                            onChange={(e) => {
                                                const updated = { ...configForm.data.config, mram_api_key: e.target.value };
                                                configForm.setData('config', updated);
                                            }}
                                            placeholder="Enter your M-RAM API Key (e.g. C40002956aa1a646106c41.09766335)"
                                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono text-gray-800 bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowMramKey(!showMramKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            {showMramKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Row 2: Sender ID & Base Endpoint */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-bold text-gray-800 mb-1.5 block">
                                            Approved Sender ID / Number Masking *
                                        </label>
                                        <input
                                            type="text"
                                            value={configForm.data.config?.mram_sender_id || '8809601017199'}
                                            onChange={(e) => {
                                                const updated = { ...configForm.data.config, mram_sender_id: e.target.value };
                                                configForm.setData('config', updated);
                                            }}
                                            placeholder="8809601017199"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono text-gray-800 bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-800 mb-1.5 block">
                                            HTTP API Base Endpoint
                                        </label>
                                        <input
                                            type="text"
                                            value={configForm.data.config?.mram_base_url || 'https://msg.mram.com.bd/smsapi'}
                                            onChange={(e) => {
                                                const updated = { ...configForm.data.config, mram_base_url: e.target.value };
                                                configForm.setData('config', updated);
                                            }}
                                            placeholder="https://msg.mram.com.bd/smsapi"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono text-gray-800 bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                </div>

                                {/* Card Footer: Encryption Note & Save Button */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                                    <span className="text-[11px] text-gray-400">
                                        Credentials are encrypted at rest with AES-256-CBC.
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={configForm.processing}
                                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer self-end sm:self-auto disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save Credentials</span>
                                    </button>
                                </div>
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
