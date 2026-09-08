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

        $seo = SiteSetting::get('seo_settings', [
            'meta_title' => 'পুষ্টি কুঞ্জ | ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য',
            'meta_description' => '১০০% প্রাকৃতিক ও অর্গানিক পুষ্টি পণ্যের বিশ্বস্ত প্রতিষ্ঠান। বিটরুট পাউডার, চিয়া সিড, খাঁটি ঘি ও হার্বাল পণ্য।',
            'meta_keywords' => 'পুষ্টি কুঞ্জ, অর্গানিক ফুড, চিয়া সিড, বিটরুট পাউডার, ঘি, Pusti Kunjo',
            'og_image' => '',
            'facebook_pixel_id' => '',
            'google_tag_manager_id' => '',
        ]);

        $contact = SiteSetting::get('contact_settings', [
            'phone' => '01700-000000',
            'whatsapp' => '01700000000',
            'email' => 'info@pustikunjo.com.bd',
            'address' => 'ঢাকা, বাংলাদেশ',
            'hotline_hours' => 'সকাল ৯টা - রাত ১০টা',
        ]);

        $shippingZones = SiteSetting::get('shipping_zones', [
            ['name' => 'ঢাকার ভিতরে', 'fee' => 60],
            ['name' => 'ঢাকার বাইরে', 'fee' => 120],
        ]);

        $courierSteadfast = SiteSetting::get('courier_steadfast', [
            'enabled' => true,
            'api_key' => env('STEADFAST_API_KEY', ''),
            'secret_key' => env('STEADFAST_SECRET_KEY', ''),
            'base_url' => 'https://portal.steadfast.com.bd/api/v1',
            'auto_sync' => true,
            'default_note' => 'পুষ্টি কুঞ্জ অর্গানিক পণ্য — হ্যান্ডেল উইথ কেয়ার',
        ]);

        $fraudSettings = SiteSetting::get('fraud_settings', [
            'auto_check_enabled' => true,
            'high_risk_threshold_cancels' => 2,
            'medium_risk_threshold_cancels' => 1,
        ]);

        $sms = SiteSetting::get('sms_settings', [
            'provider' => 'ssl_wireless',
            'api_key' => '',
            'sender_id' => '',
            'client_id' => '',
        ]);

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
            SiteSetting::set('courier_steadfast', $request->input('courierSteadfast'), 'courier');
        }
        if ($request->has('fraudSettings')) {
            SiteSetting::set('fraud_settings', $request->input('fraudSettings'), 'fraud');
        }
        if ($request->has('sms')) {
            SiteSetting::set('sms_settings', $request->input('sms'), 'sms');
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
            $smtp = SiteSetting::get('email_smtp', []);
            config([
                'mail.mailers.smtp.host' => $smtp['host'] ?? 'smtp.gmail.com',
                'mail.mailers.smtp.port' => $smtp['port'] ?? 587,
                'mail.mailers.smtp.encryption' => $smtp['encryption'] ?? 'tls',
                'mail.mailers.smtp.username' => $smtp['username'] ?? '',
                'mail.mailers.smtp.password' => $smtp['password'] ?? '',
                'mail.from.address' => $smtp['from_address'] ?? 'info@pustikunjo.com.bd',
                'mail.from.name' => $smtp['from_name'] ?? 'Pusti Kunjo',
            ]);

            Mail::raw('এটি পুষ্টি কুঞ্জ এডমিন প্যানেল থেকে সফল SMTP টেস্ট ইমেইল।', function ($msg) use ($recipient) {
                $msg->to($recipient)->subject('পুষ্টি কুঞ্জ: টেস্ট ইমেইল ভেরিফিকেশন');
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

        $sent = $smsService->sendSms($phone, 'এটি পুষ্টি কুঞ্জ এডমিন প্যানেল থেকে পাঠানো টেস্ট এসএমএস।');
        if ($sent) {
            return back()->with('success', "টেস্ট এসএমএস সফলভাবে {$phone} নম্বরে পাঠানো হয়েছে!");
        }
        return back()->with('error', 'এসএমএস পাঠানো সম্ভব হয়নি। এসএমএস গেটওয়ে সেটিংস চেক করুন।');
    }
}
