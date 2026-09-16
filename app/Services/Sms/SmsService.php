<?php

namespace App\Services\Sms;

use App\Models\Order;
use App\Models\SiteSetting;
use App\Models\SmsLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * Send triggered SMS based on event
     */
    public function triggerEvent(string $eventName, Order $order, array $extraVars = [])
    {
        $smsConfig = SiteSetting::get('sms_config', []);
        $triggers = SiteSetting::get('sms_triggers', []);

        if (empty($smsConfig['enabled'])) {
            return false;
        }

        // Check if dynamic NotificationTemplate exists
        $dbTemplate = \App\Models\NotificationTemplate::where('channel', 'sms')
            ->where('event_key', $eventName)
            ->first();

        $triggerConfig = $triggers[$eventName] ?? null;

        $isActive = $dbTemplate ? $dbTemplate->is_active : (!empty($triggerConfig['enabled']));
        if (!$isActive) {
            return false;
        }

        $template = $dbTemplate ? $dbTemplate->body : ($triggerConfig['template'] ?? '');
        if (empty($template)) {
            return false;
        }

        $contact = SiteSetting::get('contact', []);
        $general = SiteSetting::get('general', []);

        // Replace all available placeholders
        $vars = [
            '{{customer_name}}' => $order->customer_name ?? 'সম্মানিত গ্রাহক',
            '{{customer_phone}}' => $order->customer_phone ?? '',
            '{{customer_email}}' => $order->customer_email ?? '',
            '{{order_id}}' => $order->order_number ?? '',
            '{{order_number}}' => $order->order_number ?? '',
            '{{total}}' => '৳' . number_format((float) ($order->grand_total ?? 0), 2),
            '{{grand_total}}' => '৳' . number_format((float) ($order->grand_total ?? 0), 2),
            '{{status}}' => $order->status_label ?? $order->status ?? 'গৃহীত',
            '{{courier_name}}' => $order->courier_name ?? 'Steadfast Courier',
            '{{tracking_code}}' => $order->tracking_code ?? 'Pending',
            '{{track_url}}' => url('/track-order?order=' . $order->order_number . '&phone=' . $order->customer_phone),
            '{{site_name}}' => $general['site_name'] ?? 'পুষ্টি কুঞ্জ',
            '{{support_phone}}' => $contact['phone'] ?? '01700-000000',
            '{{payment_method}}' => strtoupper($order->payment_method ?? 'COD'),
            '{{shipping_address}}' => $order->shipping_address ?? '',
            '{{reason}}' => $extraVars['reason'] ?? '',
        ];

        $message = str_replace(array_keys($vars), array_values($vars), $template);

        // Send to customer
        $this->sendSms($order->customer_phone, $message, $eventName);

        // Send to admin if requested
        $sendToAdmin = $dbTemplate ? $dbTemplate->send_to_admin : (!empty($triggerConfig['send_to_admin']));
        if ($sendToAdmin) {
            $adminPhone = ($dbTemplate && $dbTemplate->admin_recipient) ? $dbTemplate->admin_recipient : ($contact['phone'] ?? '');
            if (!empty($adminPhone)) {
                $adminMsg = "[নতুন অর্ডার] {$order->order_number} — ৳{$order->grand_total} ({$order->customer_name})";
                $this->sendSms($adminPhone, $adminMsg, $eventName . '_admin');
            }
        }

        return true;
    }

    /**
     * Core SMS Dispatcher across multiple BD gateways
     */
    public function sendSms(string $phone, string $message, ?string $eventName = null, array $overrideConfig = []): array
    {
        // Standardize Bangladeshi phone number
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($cleanPhone, '880')) {
            $cleanPhone = substr($cleanPhone, 2);
        } elseif (str_starts_with($cleanPhone, '+880')) {
            $cleanPhone = substr($cleanPhone, 3);
        }

        if (strlen($cleanPhone) === 10 && str_starts_with($cleanPhone, '1')) {
            $cleanPhone = '0' . $cleanPhone;
        }

        $smsConfig = !empty($overrideConfig) ? $overrideConfig : SiteSetting::get('sms_config', []);
        $smsSettings = !empty($overrideConfig) ? $overrideConfig : SiteSetting::get('sms_settings', []);
        $provider = $smsConfig['provider'] ?? ($smsSettings['provider'] ?? 'mram');
        if (!empty($smsConfig['mram_is_default']) || !empty($smsSettings['mram_is_default'])) {
            $provider = 'mram';
        }

        $status = 'sent';
        $responseRaw = '';

        try {
            switch ($provider) {
                case 'mram':
                    $mramApiKey = $smsConfig['mram_api_key'] ?? ($smsSettings['mram_api_key'] ?? ($smsSettings['api_key'] ?? ''));
                    $mramSenderId = $smsConfig['mram_sender_id'] ?? ($smsSettings['mram_sender_id'] ?? ($smsSettings['sender_id'] ?? '8809601017199'));
                    $mramBaseUrl = $smsConfig['mram_base_url'] ?? ($smsSettings['mram_base_url'] ?? 'https://msg.mram.com.bd/smsapi');

                    // Auto-detect Unicode (Bangla) or Text (English)
                    $hasUnicode = (bool) preg_match('/[^\x20-\x7E]/', $message);
                    $contentType = $hasUnicode ? 'unicode' : 'text';

                    // Bangladeshi phone format for contacts (must start with 88)
                    $mramPhone = str_starts_with($cleanPhone, '88') ? $cleanPhone : '88' . $cleanPhone;

                    $payload = [
                        'api_key' => $mramApiKey,
                        'type' => $contentType,
                        'contacts' => $mramPhone,
                        'senderid' => $mramSenderId,
                        'msg' => $message,
                        'label' => 'transactional',
                    ];

                    $response = Http::asForm()
                        ->timeout(15)
                        ->withoutVerifying()
                        ->post($mramBaseUrl, $payload);

                    $responseRaw = $response->body();

                    // Check M-RAM Error codes (from documentation)
                    $errorMap = [
                        '1002' => 'Sender Id/Masking Not Found',
                        '1003' => 'API Not Found',
                        '1004' => 'SPAM Detected',
                        '1005' => 'Internal Error',
                        '1006' => 'Internal Error',
                        '1007' => 'Balance Insufficient',
                        '1008' => 'Message is empty',
                        '1009' => 'Message Type Not Set (text/unicode)',
                        '1010' => 'Invalid User & Password',
                        '1011' => 'Invalid User Id',
                        '1012' => 'Invalid Number',
                        '1013' => 'API limit error',
                        '1014' => 'No matching template',
                        '1015' => 'SMS Content Validation Fails',
                        '1016' => 'IP address not allowed!!',
                        '1019' => 'Sms Purpose Missing',
                    ];

                    $trimmedResp = trim($responseRaw);
                    if (isset($errorMap[$trimmedResp])) {
                        $status = 'failed';
                        $responseRaw = "M-RAM Error [{$trimmedResp}]: " . $errorMap[$trimmedResp];
                    } elseif ($response->successful()) {
                        $status = 'sent';
                    } else {
                        $status = 'failed';
                    }
                    break;

                case 'ssl_wireless':
                    $response = Http::asForm()
                        ->timeout(8)
                        ->withoutVerifying()
                        ->post('https://smsplus.sslwireless.com/api/v3/send-sms', [
                            'api_token' => $smsConfig['ssl_api_token'] ?? '',
                            'sid' => $smsConfig['ssl_sid'] ?? '',
                            'msisdn' => $cleanPhone,
                            'sms' => $message,
                            'csms_id' => uniqid('PK_'),
                        ]);
                    $responseRaw = $response->body();
                    break;

                case 'bulksmsbd':
                    $response = Http::timeout(8)
                        ->withoutVerifying()
                        ->get('https://bulksmsbd.net/api/smsapi', [
                            'api_key' => $smsConfig['bulk_api_key'] ?? '',
                            'type' => 'text',
                            'number' => $cleanPhone,
                            'senderid' => $smsConfig['bulk_sender_id'] ?? '',
                            'message' => $message,
                        ]);
                    $responseRaw = $response->body();
                    break;

                case 'mdl':
                    $response = Http::timeout(8)
                        ->withoutVerifying()
                        ->get('http://sms.mimisms.com/smsapi', [
                            'api_key' => $smsConfig['mdl_api_key'] ?? '',
                            'type' => 'text',
                            'contacts' => $cleanPhone,
                            'senderid' => $smsConfig['mdl_sender_id'] ?? '',
                            'msg' => $message,
                        ]);
                    $responseRaw = $response->body();
                    break;

                case 'custom_http':
                default:
                    // Simulated or webhook endpoint
                    $status = 'sent';
                    $responseRaw = json_encode(['status' => 'success', 'gateway' => $provider, 'mock' => true]);
                    break;
            }
        } catch (\Exception $e) {
            $status = 'failed';
            $responseRaw = $e->getMessage();
            Log::error('SMS Dispatch Error: ' . $e->getMessage());
        }

        // Log SMS in database
        SmsLog::create([
            'recipient_phone' => $cleanPhone,
            'message' => $message,
            'event_name' => $eventName,
            'provider' => $provider,
            'status' => $status,
            'response_raw' => $responseRaw,
        ]);

        return [
            'success' => $status === 'sent',
            'provider' => $provider,
            'phone' => $cleanPhone,
            'response' => $responseRaw,
        ];
    }

    /**
     * Fetch M-RAM Account Credit Balance
     */
    public function getMramBalance(): array
    {
        $smsConfig = SiteSetting::get('sms_config', []);
        $smsSettings = SiteSetting::get('sms_settings', []);
        $apiKey = $smsConfig['mram_api_key'] ?? ($smsSettings['mram_api_key'] ?? ($smsSettings['api_key'] ?? ''));

        if (empty($apiKey)) {
            return [
                'success' => false,
                'balance' => '0.00',
                'message' => 'M-RAM API Key কনফিগার করা হয়নি।',
            ];
        }

        try {
            $url = "https://msg.mram.com.bd/miscapi/{$apiKey}/getBalance";
            $response = Http::timeout(10)->withoutVerifying()->get($url);

            if ($response->successful()) {
                $raw = trim($response->body());
                return [
                    'success' => true,
                    'balance' => $raw,
                    'message' => "ব্যালেন্স: {$raw}",
                ];
            }
        } catch (\Exception $e) {
            Log::error('M-RAM Balance exception: ' . $e->getMessage());
        }

        return [
            'success' => false,
            'balance' => '0.00',
            'message' => 'ব্যালেন্স তথ্য পাওয়া যায়নি।',
        ];
    }
}
