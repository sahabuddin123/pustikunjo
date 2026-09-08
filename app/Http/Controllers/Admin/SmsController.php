<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\SmsLog;
use App\Services\Sms\SmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SmsController extends Controller
{
    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function index()
    {
        $smsConfig = SiteSetting::get('sms_config', [
            'enabled' => false,
            'provider' => 'ssl_wireless', // ssl_wireless, bulksmsbd, mdl, custom_http
            'ssl_api_token' => '',
            'ssl_sid' => '',
            'bulk_api_key' => '',
            'bulk_sender_id' => '',
            'mdl_api_key' => '',
            'mdl_sender_id' => '',
        ]);

        $triggers = SiteSetting::get('sms_triggers', [
            'order_placed' => [
                'enabled' => true,
                'label' => 'নতুন অর্ডার গ্রহণ (Order Placed)',
                'send_to_admin' => true,
                'template' => 'প্রিয় {{customer_name}}, পুষ্টি কুঞ্জে আপনার অর্ডার {{order_id}} গ্রহণ করা হয়েছে। মোট বিল: {{total}}। ট্র্যাক করুন: {{track_url}}',
            ],
            'payment_verified' => [
                'enabled' => true,
                'label' => 'পেমেন্ট নিশ্চিতকরণ (Payment Verified)',
                'send_to_admin' => false,
                'template' => 'প্রিয় {{customer_name}}, আপনার অর্ডার {{order_id}} এর বিকাশ পেমেন্ট সফলভাবে যাচাই করা হয়েছে। ধন্যবাদ!',
            ],
            'payment_rejected' => [
                'enabled' => true,
                'label' => 'পেমেন্ট বাতিলকরণ (Payment Rejected)',
                'send_to_admin' => false,
                'template' => 'প্রিয় {{customer_name}}, আপনার অর্ডার {{order_id}} এর পেমেন্ট বাতিল করা হয়েছে। কারণ: {{reason}}। যোগাযোগের জন্য কল করুন: 01700-000000',
            ],
            'order_confirmed' => [
                'enabled' => true,
                'label' => 'অর্ডার নিশ্চিতকরণ (Order Confirmed)',
                'send_to_admin' => false,
                'template' => 'প্রিয় {{customer_name}}, আপনার অর্ডার {{order_id}} কনফার্ম করা হয়েছে। শীঘ্রই এটি ডেলিভারির জন্য পাঠানো হবে।',
            ],
            'order_shipped' => [
                'enabled' => true,
                'label' => 'ডেলিভারিতে প্রেরণ (Order Shipped)',
                'send_to_admin' => false,
                'template' => 'প্রিয় {{customer_name}}, আপনার অর্ডার {{order_id}} ডেলিভারি রাইডারের কাছে হস্তান্তর করা হয়েছে। খুব দ্রুত আপনার কাছে পৌঁছে যাবে।',
            ],
            'order_delivered' => [
                'enabled' => true,
                'label' => 'ডেলিভারি সম্পন্ন (Order Delivered)',
                'send_to_admin' => false,
                'template' => 'প্রিয় {{customer_name}}, আপনার পুষ্টি কুঞ্জের পণ্য সফলভাবে ডেলিভারি করা হয়েছে। আমাদের সাথে থাকার জন্য ধন্যবাদ!',
            ],
        ]);

        $logs = SmsLog::latest()->paginate(20);

        return Inertia::render('Admin/Sms/Index', [
            'smsConfig' => $smsConfig,
            'triggers' => $triggers,
            'logs' => $logs,
        ]);
    }

    public function updateConfig(Request $request)
    {
        $config = $request->input('config', []);
        SiteSetting::set('sms_config', $config, 'sms');

        return back()->with('success', 'এসএমএস গেটওয়ে কনফিগারেশন আপডেট হয়েছে!');
    }

    public function updateTriggers(Request $request)
    {
        $triggers = $request->input('triggers', []);
        SiteSetting::set('sms_triggers', $triggers, 'sms');

        return back()->with('success', 'এসএমএস ট্রিগার ও টেমপ্লেট সংরক্ষিত হয়েছে!');
    }

    public function sendTestSms(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'message' => 'required|string',
        ]);

        $result = $this->smsService->sendSms($request->phone, $request->message, 'test_sms');

        return back()->with(
            $result['success'] ? 'success' : 'error',
            $result['success'] ? 'টেস্ট এসএমএস সফলভাবে পাঠানো হয়েছে!' : 'এসএমএস পাঠাতে ব্যর্থ হয়েছে: ' . $result['response']
        );
    }
}
