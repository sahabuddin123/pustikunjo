<?php

namespace App\Services\Notification;

use App\Models\NotificationTemplate;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Services\Email\EmailService;
use App\Services\Sms\SmsService;

class NotificationService
{
    public function __construct(
        protected SmsService $smsService,
        protected EmailService $emailService
    ) {}

    /**
     * Build placeholder replacements array for an order
     */
    public function buildOrderReplacements(Order $order, array $extraVars = []): array
    {
        $contact = SiteSetting::get('contact', []);
        $general = SiteSetting::get('general', []);

        $siteName = $general['site_name'] ?? 'পুষ্টি কুঞ্জ';
        $siteUrl = url('/');
        $supportPhone = $contact['phone'] ?? '01700-000000';

        // Format items summary: "বিটরুট পাউডার (১০০ গ্রাম) x ২"
        $itemsList = [];
        if ($order->relationLoaded('items')) {
            foreach ($order->items as $item) {
                $var = $item->variant_name ? " ({$item->variant_name})" : '';
                $itemsList[] = "{$item->product_name}{$var} x {$item->quantity}";
            }
        } elseif ($order->items()->exists()) {
            foreach ($order->items as $item) {
                $var = $item->variant_name ? " ({$item->variant_name})" : '';
                $itemsList[] = "{$item->product_name}{$var} x {$item->quantity}";
            }
        }
        $itemsSummary = !empty($itemsList) ? implode(', ', $itemsList) : 'পুষ্টি কুঞ্জ অর্গানিক পণ্য';

        $trackingUrl = url('/track-order?order=' . $order->order_number . '&phone=' . $order->customer_phone);

        return array_merge([
            '{{customer_name}}' => $order->customer_name ?? 'সম্মানিত গ্রাহক',
            '{{customer_phone}}' => $order->customer_phone ?? '',
            '{{customer_email}}' => $order->customer_email ?? '',
            '{{order_number}}' => $order->order_number ?? '',
            '{{grand_total}}' => '৳' . number_format((float) ($order->grand_total ?? 0), 2),
            '{{subtotal}}' => '৳' . number_format((float) ($order->subtotal ?? 0), 2),
            '{{shipping_fee}}' => '৳' . number_format((float) ($order->shipping_cost ?? 0), 2),
            '{{items_summary}}' => $itemsSummary,
            '{{payment_method}}' => strtoupper($order->payment_method ?? 'COD'),
            '{{shipping_address}}' => $order->shipping_address ?? '',
            '{{status}}' => $order->status_label ?? $order->status ?? 'গৃহীত',
            '{{courier_name}}' => $order->courier_name ?? 'Steadfast Courier',
            '{{tracking_code}}' => $order->tracking_code ?? 'Pending',
            '{{track_url}}' => $trackingUrl,
            '{{site_name}}' => $siteName,
            '{{site_url}}' => $siteUrl,
            '{{support_phone}}' => $supportPhone,
            '{{date}}' => now()->format('d M, Y h:i A'),
            '{{reason}}' => $extraVars['reason'] ?? '',
            '{{otp_code}}' => $extraVars['otp_code'] ?? '123456',
        ], $extraVars);
    }

    /**
     * Get mock sample replacements for live preview in Admin
     */
    public function getSampleReplacements(): array
    {
        $contact = SiteSetting::get('contact', []);
        $general = SiteSetting::get('general', []);

        return [
            '{{customer_name}}' => 'রাকিবুল হাসান',
            '{{customer_phone}}' => '01712345678',
            '{{customer_email}}' => 'rakib@example.com',
            '{{order_number}}' => 'PK-10025',
            '{{grand_total}}' => '৳১,৫০০.০০',
            '{{subtotal}}' => '৳১,৩৮০.০০',
            '{{shipping_fee}}' => '৳১২০.০০',
            '{{items_summary}}' => 'বিটরুট পাউডার (২০০ গ্রাম) x ১, প্রিমিয়াম চিয়া সিড x ১',
            '{{payment_method}}' => 'ক্যাশ অন ডেলিভারি (COD)',
            '{{shipping_address}}' => 'বাড়ি #১২, রোড #৫, ধানমন্ডি, ঢাকা',
            '{{status}}' => 'প্রসেসিং হচ্ছে',
            '{{courier_name}}' => 'Steadfast Courier',
            '{{tracking_code}}' => 'STDF-8920194',
            '{{track_url}}' => url('/track-order?order=PK-10025&phone=01712345678'),
            '{{site_name}}' => $general['site_name'] ?? 'পুষ্টি কুঞ্জ',
            '{{site_url}}' => url('/'),
            '{{support_phone}}' => $contact['phone'] ?? '01700-000000',
            '{{date}}' => now()->format('d M, Y h:i A'),
            '{{reason}}' => 'গ্রাহক অনুরোধে বাতিল',
            '{{otp_code}}' => '849201',
        ];
    }

    /**
     * Trigger both SMS and Email for an Order event
     */
    public function triggerOrderEvent(string $eventKey, Order $order, array $extraVars = []): array
    {
        $replacements = $this->buildOrderReplacements($order, $extraVars);
        $results = ['sms' => null, 'email' => null];

        // 1. Trigger SMS
        $smsTemplate = NotificationTemplate::where('channel', 'sms')
            ->where('event_key', $eventKey)
            ->first();

        if ($smsTemplate && $smsTemplate->is_active && !empty($order->customer_phone)) {
            $smsBody = str_replace(array_keys($replacements), array_values($replacements), $smsTemplate->body);
            $results['sms'] = $this->smsService->sendSms($order->customer_phone, $smsBody, $eventKey);

            // Send to admin if enabled
            if ($smsTemplate->send_to_admin) {
                $contact = SiteSetting::get('contact', []);
                $adminPhone = $smsTemplate->admin_recipient ?: ($contact['phone'] ?? '');
                if (!empty($adminPhone)) {
                    $adminSmsTemplate = NotificationTemplate::where('channel', 'sms')
                        ->where('event_key', 'admin_order_alert')
                        ->first();
                    $adminMsg = $adminSmsTemplate && $adminSmsTemplate->is_active
                        ? str_replace(array_keys($replacements), array_values($replacements), $adminSmsTemplate->body)
                        : "[নতুন অর্ডার] {$order->order_number} — ৳{$order->grand_total} ({$order->customer_name})";

                    $this->smsService->sendSms($adminPhone, $adminMsg, $eventKey . '_admin');
                }
            }
        }

        // 2. Trigger Email
        $emailTemplate = NotificationTemplate::where('channel', 'email')
            ->where('event_key', $eventKey)
            ->first();

        if ($emailTemplate && $emailTemplate->is_active && !empty($order->customer_email)) {
            $emailSubject = str_replace(array_keys($replacements), array_values($replacements), $emailTemplate->subject ?? 'অর্ডার আপডেট');
            $emailBody = str_replace(array_keys($replacements), array_values($replacements), $emailTemplate->body);

            $results['email'] = $this->emailService->sendEmail($order->customer_email, $emailSubject, $emailBody, $eventKey);

            // Send to admin if enabled
            if ($emailTemplate->send_to_admin) {
                $general = SiteSetting::get('general', []);
                $adminEmail = $emailTemplate->admin_recipient ?: ($general['email'] ?? 'info@pustikunjo.com.bd');
                if (!empty($adminEmail)) {
                    $adminTpl = NotificationTemplate::where('channel', 'email')
                        ->where('event_key', 'admin_order_alert')
                        ->first();
                    $adminSubj = $adminTpl ? str_replace(array_keys($replacements), array_values($replacements), $adminTpl->subject) : "[নতুন অর্ডার] {$order->order_number}";
                    $adminBody = $adminTpl ? str_replace(array_keys($replacements), array_values($replacements), $adminTpl->body) : "নতুন অর্ডার গৃহীত হয়েছে: {$order->order_number}";

                    $this->emailService->sendEmail($adminEmail, $adminSubj, $adminBody, $eventKey . '_admin');
                }
            }
        }

        return $results;
    }

    /**
     * Dispatch live test SMS or Email from admin template manager
     */
    public function sendTestNotification(string $channel, string $eventKey, string $recipient, ?string $customSubject = null, ?string $customBody = null): array
    {
        $replacements = $this->getSampleReplacements();

        $template = NotificationTemplate::where('channel', $channel)
            ->where('event_key', $eventKey)
            ->first();

        $body = $customBody ?: ($template?->body ?? 'টেস্ট নোটিফিকেশন');
        $body = str_replace(array_keys($replacements), array_values($replacements), $body);

        if ($channel === 'sms') {
            return $this->smsService->sendSms($recipient, $body, 'test_' . $eventKey);
        } else {
            $subject = $customSubject ?: ($template?->subject ?? 'টেস্ট নোটিফিকেশন ইমেইল');
            $subject = str_replace(array_keys($replacements), array_values($replacements), $subject);
            return $this->emailService->sendEmail($recipient, $subject, $body, 'test_' . $eventKey);
        }
    }
}
