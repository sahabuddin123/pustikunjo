<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FraudRecord;
use App\Models\SiteSetting;
use App\Services\Courier\SteadfastService;
use App\Services\Sms\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $general = SiteSetting::get('general_settings', [
            'site_name' => 'Pusti Kunjo',
            'tagline' => 'Purity Begins here',
            'email' => 'info@pustikunjo.com.bd',
            'logo' => '',
            'favicon' => '',
            'currency' => 'BDT',
            'currency_symbol' => '৳',
            'timezone' => 'Asia/Dhaka',
        ]);

        $appearance = SiteSetting::get('appearance_settings', [
            'primary_color' => '#0d6838',
            'primary_hover' => '#0a522c',
            'accent_color' => '#f59e0b',
            'light_bg' => '#f0fdf4',
        ]);

        $seo = array_merge([
            'indexing_directive' => 'index, follow',
            'meta_title' => 'পুষ্টি কুঞ্জ | ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য',
            'meta_description' => '১০০% প্রাকৃতিক ও অর্গানিক পুষ্টি পণ্যের বিশ্বস্ত প্রতিষ্ঠান। বিটরুট পাউডার, চিয়া সিড, খাঁটি ঘি ও হার্বাল পণ্য।',
            'meta_keywords' => 'পুষ্টি কুঞ্জ, অর্গানিক ফুড, চিয়া সিড, বিটরুট পাউডার, ঘি, Pusti Kunjo',
            'og_image' => '',
            'google_site_verification' => '',
            'bing_site_verification' => '',
            'ga4_measurement_id' => '',
            'google_tag_manager_id' => '',
            'facebook_pixel_id' => '',
        ], SiteSetting::get('seo_settings', []));

        $contact = SiteSetting::get('contact_settings', [
            'phone' => '01700-000000',
            'whatsapp' => '01700000000',
            'email' => 'info@pustikunjo.com.bd',
            'address' => 'ঢাকা, বাংলাদেশ',
            'hotline_hours' => 'সকাল ৯টা - রাত ১০টা',
            'messenger' => 'https://m.me/pustikunjobd',
        ]);

        $shippingZones = SiteSetting::get('shipping_zones', [
            ['name' => 'ঢাকার ভিতরে', 'fee' => 60],
            ['name' => 'ঢাকার বাইরে', 'fee' => 120],
        ]);

        $courierSteadfast = SiteSetting::get('courier_steadfast', [
            'enabled' => true,
            'api_key' => env('STEADFAST_API_KEY', ''),
            'secret_key' => env('STEADFAST_SECRET_KEY', ''),
            'base_url' => 'https://portal.packzy.com/api/v1',
            'auto_sync' => true,
            'default_note' => 'পুষ্টি কুঞ্জ অর্গানিক পণ্য — হ্যান্ডেল উইথ কেয়ার',
            'pickup_warehouse' => 'Fakirapool 1st Lane, Dhaka-1000',
            'webhook_token' => '',
        ]);

        $fraudSettings = SiteSetting::get('fraud_settings', [
            'auto_check_enabled' => true,
            'high_risk_threshold_cancels' => 2,
            'medium_risk_threshold_cancels' => 1,
        ]);

        $smsSettings = SiteSetting::get('sms_settings', []);
        $smsConfig = SiteSetting::get('sms_config', []);
        $sms = array_merge([
            'provider' => $smsConfig['provider'] ?? ($smsSettings['provider'] ?? 'mram'),
            'api_key' => $smsConfig['mram_api_key'] ?? ($smsSettings['api_key'] ?? ''),
            'sender_id' => $smsConfig['mram_sender_id'] ?? ($smsSettings['sender_id'] ?? '8809601017199'),
            'base_url' => $smsConfig['mram_base_url'] ?? ($smsSettings['base_url'] ?? 'https://msg.mram.com.bd/smsapi'),
            'client_id' => $smsSettings['client_id'] ?? '',
        ], $smsSettings);

        $paymentBkash = SiteSetting::get('payment_bkash', [
            'cod_enabled' => true,
            'manual_enabled' => true,
            'manual_type' => 'merchant',
            'manual_number' => '01700000000',
            'manual_instructions' => 'অর্ডার কনফার্ম করতে {amount} টাকা {number} নম্বরে সেন্ড মানি করুন। সেন্ড মানি করার পর নিচে ট্রানজেকশন আইডি (TrxID) লিখুন।',
            'pgw_enabled' => false,
            'pgw_mode' => 'sandbox',
            'pgw_app_key' => '',
            'pgw_app_secret' => '',
            'pgw_username' => '',
            'pgw_password' => '',
        ]);

        $emailSmtp = SiteSetting::get('email_smtp', [
            'mailer' => 'smtp',
            'host' => 'smtp.gmail.com',
            'port' => '587',
            'username' => '',
            'password' => '',
            'encryption' => 'tls',
            'from_address' => 'info@pustikunjo.com.bd',
            'from_name' => 'পুষ্টি কুঞ্জ (Pusti Kunjo)',
        ]);

        $blacklistCount = FraudRecord::where('risk_level', 'fraud')->count();

        return Inertia::render('Admin/Settings/Index', [
            'general' => $general,
            'appearance' => $appearance,
            'seo' => $seo,
            'contact' => $contact,
            'shippingZones' => $shippingZones,
            'courierSteadfast' => $courierSteadfast,
            'fraudSettings' => $fraudSettings,
            'sms' => $sms,
            'paymentBkash' => $paymentBkash,
            'emailSmtp' => $emailSmtp,
            'blacklistCount' => $blacklistCount,
            'courierWebhookUrl' => url('/api/v1/courier/webhook/steadfast'),
            'isCourierSecretConfigured' => !empty($courierSteadfast['secret_key']),
        ]);
    }

    public function update(Request $request)
    {
        if ($request->has('general')) {
            SiteSetting::set('general_settings', $request->input('general'), 'general');
        }
        if ($request->has('appearance')) {
            SiteSetting::set('appearance_settings', $request->input('appearance'), 'appearance');
        }
        if ($request->has('seo')) {
            SiteSetting::set('seo_settings', $request->input('seo'), 'seo');
        }
        if ($request->has('contact')) {
            SiteSetting::set('contact_settings', $request->input('contact'), 'contact');
        }
        if ($request->has('shippingZones')) {
            SiteSetting::set('shipping_zones', $request->input('shippingZones'), 'shipping');
        }
        if ($request->has('courierSteadfast')) {
            $existingCourier = SiteSetting::get('courier_steadfast', []);
            $courierData = $request->input('courierSteadfast');
            if (empty($courierData['secret_key']) && !empty($existingCourier['secret_key'])) {
                $courierData['secret_key'] = $existingCourier['secret_key'];
            }
            SiteSetting::set('courier_steadfast', $courierData, 'courier');
        }
        if ($request->has('fraudSettings')) {
            SiteSetting::set('fraud_settings', $request->input('fraudSettings'), 'fraud');
        }
        if ($request->has('sms')) {
            $smsData = $request->input('sms');
            SiteSetting::set('sms_settings', $smsData, 'sms');

            $smsConfig = SiteSetting::get('sms_config', []);
            if (($smsData['provider'] ?? '') === 'mram' || !empty($smsData['api_key'])) {
                $smsConfig['provider'] = $smsData['provider'] ?? 'mram';
                $smsConfig['mram_active'] = true;
                $smsConfig['mram_is_default'] = ($smsData['provider'] ?? '') === 'mram';
                if (!empty($smsData['api_key'])) {
                    $smsConfig['mram_api_key'] = $smsData['api_key'];
                }
                if (!empty($smsData['sender_id'])) {
                    $smsConfig['mram_sender_id'] = $smsData['sender_id'];
                }
                if (!empty($smsData['base_url'])) {
                    $smsConfig['mram_base_url'] = $smsData['base_url'];
                }
                SiteSetting::set('sms_config', $smsConfig, 'sms');
            }
        }
        if ($request->has('paymentBkash')) {
            SiteSetting::set('payment_bkash', $request->input('paymentBkash'), 'payment');
        }
        if ($request->has('emailSmtp')) {
            SiteSetting::set('email_smtp', $request->input('emailSmtp'), 'email');
        }

        return back()->with('success', 'গ্লোবাল সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    }

    /**
     * Test connection to Steadfast API
     */
    public function testCourier(Request $request, SteadfastService $steadfast)
    {
        $result = $steadfast->testConnection();
        if ($result['success']) {
            return back()->with('success', $result['message']);
        }
        return back()->with('error', $result['message']);
    }

    /**
     * Send test email via SMTP
     */
    public function testSmtp(Request $request)
    {
        $request->validate(['test_email' => 'required|email']);
        $recipient = $request->input('test_email');

        try {
            $reqSmtp = $request->input('smtp');
            $smtp = (!empty($reqSmtp) && !empty($reqSmtp['host'])) ? $reqSmtp : SiteSetting::get('email_smtp', []);
            $host = trim($smtp['host'] ?? '');
            if (empty($host)) {
                return back()->with('error', 'SMTP Host কনফিগার করা হয়নি। অনুগ্রহ করে আগে সেটিংস সংরক্ষণ করুন।');
            }

            $encryption = strtolower($smtp['encryption'] ?? 'tls');
            if ($encryption === 'none' || empty($encryption)) {
                $encryption = null;
            }

            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.transport' => 'smtp',
                'mail.mailers.smtp.host' => $host,
                'mail.mailers.smtp.port' => (int) ($smtp['port'] ?? 587),
                'mail.mailers.smtp.encryption' => $encryption,
                'mail.mailers.smtp.username' => $smtp['username'] ?? '',
                'mail.mailers.smtp.password' => $smtp['password'] ?? '',
                'mail.mailers.smtp.verify_peer' => false,
                'mail.mailers.smtp.timeout' => 10,
                'mail.mailers.smtp.local_domain' => 'pustikunjo.com.bd',
                'mail.from.address' => $smtp['from_address'] ?? 'info@pustikunjo.com.bd',
                'mail.from.name' => $smtp['from_name'] ?? 'Pusti Kunjo',
                'mail.mailers.smtp.stream' => [
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true,
                    ],
                ],
            ]);

            app('mail.manager')->purge('smtp');

            Mail::mailer('smtp')->raw('এটি পুষ্টি কুঞ্জ এডমিন প্যানেল থেকে সফল SMTP টেস্ট ইমেইল।', function ($msg) use ($recipient, $smtp) {
                $msg->to($recipient)
                    ->from($smtp['from_address'] ?? 'info@pustikunjo.com.bd', $smtp['from_name'] ?? 'Pusti Kunjo')
                    ->subject('পুষ্টি কুঞ্জ: টেস্ট ইমেইল ভেরিফিকেশন');
            });

            return back()->with('success', "টেস্ট ইমেইল সফলভাবে {$recipient} ঠিকানায় পাঠানো হয়েছে!");
        } catch (\Exception $e) {
            return back()->with('error', 'ইমেইল পাঠানো ব্যর্থ হয়েছে: ' . $e->getMessage());
        }
    }

    /**
     * Send test SMS
     */
    public function testSms(Request $request, SmsService $smsService)
    {
        $request->validate(['test_phone' => 'required|string']);
        $phone = $request->input('test_phone');

        $smsOverride = $request->input('sms', []);
        $result = $smsService->sendSms($phone, 'এটি পুষ্টি কুঞ্জ এডমিন প্যানেল থেকে পাঠানো টেস্ট এসএমএস।', null, $smsOverride);
        if (!empty($result['success'])) {
            return back()->with('success', "টেস্ট এসএমএস সফলভাবে {$phone} নম্বরে পাঠানো হয়েছে!");
        }
        $errorMsg = $result['response'] ?? ($result['error'] ?? 'এসএমএস গেটওয়ে সেটিংস চেক করুন।');
        return back()->with('error', 'এসএমএস পাঠানো ব্যর্থ হয়েছে: ' . $errorMsg);
    }
}
