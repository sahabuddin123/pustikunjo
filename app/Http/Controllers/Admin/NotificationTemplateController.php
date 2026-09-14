<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationTemplate;
use App\Models\SiteSetting;
use App\Services\Notification\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationTemplateController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Display SMS & Email Templates Management Hub
     */
    public function index(Request $request)
    {
        // Ensure defaults exist
        if (NotificationTemplate::count() === 0) {
            NotificationTemplate::seedDefaults();
        }

        $smsTemplates = NotificationTemplate::where('channel', 'sms')->get();
        $emailTemplates = NotificationTemplate::where('channel', 'email')->get();

        $sampleData = $this->notificationService->getSampleReplacements();
        $defaultTags = NotificationTemplate::defaultOrderTags();

        $smsConfig = SiteSetting::get('sms_config', []);
        $emailSmtp = SiteSetting::get('email_smtp', []);

        return Inertia::render('Admin/Templates/Index', [
            'smsTemplates' => $smsTemplates,
            'emailTemplates' => $emailTemplates,
            'sampleData' => $sampleData,
            'defaultTags' => $defaultTags,
            'smsConfig' => $smsConfig,
            'emailSmtp' => $emailSmtp,
        ]);
    }

    /**
     * Update a specific Notification Template
     */
    public function update(Request $request, $id)
    {
        $template = NotificationTemplate::findOrFail($id);

        $validated = $request->validate([
            'subject' => 'nullable|string|max:255',
            'body' => 'required|string',
            'is_active' => 'boolean',
            'send_to_admin' => 'boolean',
            'admin_recipient' => 'nullable|string|max:100',
        ]);

        $template->update($validated);

        // If it's an SMS template, also synchronize with legacy sms_triggers if present
        if ($template->channel === 'sms') {
            $triggers = SiteSetting::get('sms_triggers', []);
            $triggers[$template->event_key] = [
                'enabled' => (bool) $template->is_active,
                'send_to_admin' => (bool) $template->send_to_admin,
                'template' => $template->body,
                'label' => $template->name,
            ];
            SiteSetting::set('sms_triggers', $triggers, 'sms');
        }

        return back()->with('success', "'{$template->name}' সফলভাবে আপডেট করা হয়েছে!");
    }

    /**
     * Reset a template to system default
     */
    public function reset(Request $request, $id)
    {
        $template = NotificationTemplate::findOrFail($id);
        $defaults = NotificationTemplate::getDefaultTemplates();

        $matched = null;
        foreach ($defaults as $def) {
            if ($def['channel'] === $template->channel && $def['event_key'] === $template->event_key) {
                $matched = $def;
                break;
            }
        }

        if ($matched) {
            $template->update([
                'name' => $matched['name'],
                'description' => $matched['description'] ?? null,
                'subject' => $matched['subject'] ?? null,
                'body' => $matched['body'],
                'is_active' => $matched['is_active'] ?? true,
                'send_to_admin' => $matched['send_to_admin'] ?? false,
                'available_tags' => $matched['available_tags'] ?? [],
            ]);

            return back()->with('success', "'{$template->name}' সফলভাবে ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে!");
        }

        return back()->with('error', 'ডিফল্ট টেমপ্লেট খুঁজে পাওয়া যায়নি।');
    }

    /**
     * Dispatch live test SMS or Email
     */
    public function testSend(Request $request)
    {
        $request->validate([
            'channel' => 'required|in:sms,email',
            'event_key' => 'required|string',
            'recipient' => 'required|string',
            'subject' => 'nullable|string',
            'body' => 'nullable|string',
        ]);

        $result = $this->notificationService->sendTestNotification(
            $request->channel,
            $request->event_key,
            $request->recipient,
            $request->subject,
            $request->body
        );

        if ($request->channel === 'sms') {
            return back()->with(
                $result['success'] ? 'success' : 'error',
                $result['success'] 
                    ? "টেস্ট এসএমএস সফলভাবে {$request->recipient} নম্বরে পাঠানো হয়েছে!"
                    : "এসএমএস পাঠাতে ব্যর্থ হয়েছে: " . ($result['response'] ?? 'অজানা ত্রুটি')
            );
        } else {
            return back()->with(
                $result['success'] ? 'success' : 'error',
                $result['success']
                    ? "টেস্ট ইমেইল সফলভাবে {$request->recipient} ঠিকানায় পাঠানো হয়েছে!"
                    : "ইমেইল পাঠাতে ব্যর্থ হয়েছে: " . ($result['error'] ?? 'SMTP সেটিংস চেক করুন')
            );
        }
    }
}
