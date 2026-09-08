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

        $triggerConfig = $triggers[$eventName] ?? null;
        if (!$triggerConfig || empty($triggerConfig['enabled'])) {
            return false;
        }

        $template = $triggerConfig['template'] ?? '';
        if (empty($template)) {
            return false;
        }

        // Replace placeholders
        $vars = [
            '{{customer_name}}' => $order->customer_name,
            '{{order_id}}' => $order->order_number,
            '{{total}}' => '৳' . number_format($order->grand_total, 2),
            '{{status}}' => $order->status_label,
            '{{track_url}}' => url('/track-order?order=' . $order->order_number . '&phone=' . $order->customer_phone),
            '{{reason}}' => $extraVars['reason'] ?? '',
        ];

        $message = str_replace(array_keys($vars), array_values($vars), $template);

        // Send to customer
        $this->sendSms($order->customer_phone, $message, $eventName);

        // Send to admin if requested
        if (!empty($triggerConfig['send_to_admin'])) {
            $adminPhone = SiteSetting::get('contact_phone', '');
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
    public function sendSms(string $phone, string $message, ?string $eventName = null): array
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

        $smsConfig = SiteSetting::get('sms_config', []);
        $provider = $smsConfig['provider'] ?? 'custom_http';
        $status = 'sent';
        $responseRaw = '';

        try {
            switch ($provider) {
                case 'ssl_wireless':
                    $response = Http::asForm()->post('https://smsplus.sslwireless.com/api/v3/send-sms', [
                        'api_token' => $smsConfig['ssl_api_token'] ?? '',
                        'sid' => $smsConfig['ssl_sid'] ?? '',
                        'msisdn' => $cleanPhone,
                        'sms' => $message,
                        'csms_id' => uniqid('PK_'),
                    ]);
                    $responseRaw = $response->body();
                    break;

                case 'bulksmsbd':
                    $response = Http::get('https://bulksmsbd.net/api/smsapi', [
                        'api_key' => $smsConfig['bulk_api_key'] ?? '',
                        'type' => 'text',
                        'number' => $cleanPhone,
                        'senderid' => $smsConfig['bulk_sender_id'] ?? '',
                        'message' => $message,
                    ]);
                    $responseRaw = $response->body();
                    break;

                case 'mdl':
                    $response = Http::get('http://sms.mimisms.com/smsapi', [
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
            'phone' => $cleanPhone,
            'response' => $responseRaw,
        ];
    }
}
