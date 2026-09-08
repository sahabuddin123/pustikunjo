<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BkashService
{
    /**
     * Validate manual bKash TrxID
     */
    public function validateTrxId(string $trxId): bool
    {
        return (bool) preg_match('/^[A-Za-z0-9]{8,12}$/', trim($trxId));
    }

    /**
     * Get bKash payment settings from DB
     */
    public function getSettings(): array
    {
        return SiteSetting::get('payment_bkash', [
            'manual_enabled' => true,
            'manual_type' => 'merchant', // merchant or personal
            'manual_number' => '01700000000',
            'manual_instructions' => 'অর্ডার কনফার্ম করতে {amount} টাকা {number} নম্বরে সেন্ড মানি করুন। সেন্ড মানি করার পর নিচে ট্রানজেকশন আইডি (TrxID) লিখুন।',
            'pgw_enabled' => false,
            'pgw_mode' => 'sandbox',
            'pgw_app_key' => '',
            'pgw_app_secret' => '',
            'pgw_username' => '',
            'pgw_password' => '',
        ]);
    }

    /**
     * Grant token for Tokenized bKash PGW
     */
    public function grantToken(): ?string
    {
        $settings = $this->getSettings();
        $isLive = ($settings['pgw_mode'] ?? 'sandbox') === 'live';
        $baseUrl = $isLive 
            ? 'https://tokenized.pay.bka.sh/v1.2.0-beta' 
            : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'username' => $settings['pgw_username'] ?? '',
                'password' => $settings['pgw_password'] ?? '',
            ])->post($baseUrl . '/tokenized/checkout/token/grant', [
                'app_key' => $settings['pgw_app_key'] ?? '',
                'app_secret' => $settings['pgw_app_secret'] ?? '',
            ]);

            $data = $response->json();
            return $data['id_token'] ?? null;
        } catch (\Exception $e) {
            Log::error('bKash Grant Token Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Create payment request with Tokenized bKash PGW
     */
    public function createPayment(Order $order, string $idToken): ?array
    {
        $settings = $this->getSettings();
        $isLive = ($settings['pgw_mode'] ?? 'sandbox') === 'live';
        $baseUrl = $isLive 
            ? 'https://tokenized.pay.bka.sh/v1.2.0-beta' 
            : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => $idToken,
                'X-APP-Key' => $settings['pgw_app_key'] ?? '',
            ])->post($baseUrl . '/tokenized/checkout/create', [
                'mode' => '0011',
                'payerReference' => $order->customer_phone,
                'callbackURL' => route('payment.bkash.callback'),
                'amount' => (string) number_format($order->grand_total, 2, '.', ''),
                'currency' => 'BDT',
                'intent' => 'sale',
                'merchantInvoiceNumber' => $order->order_number,
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('bKash Create Payment Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Execute payment with Tokenized bKash PGW
     */
    public function executePayment(string $paymentId, string $idToken): ?array
    {
        $settings = $this->getSettings();
        $isLive = ($settings['pgw_mode'] ?? 'sandbox') === 'live';
        $baseUrl = $isLive 
            ? 'https://tokenized.pay.bka.sh/v1.2.0-beta' 
            : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => $idToken,
                'X-APP-Key' => $settings['pgw_app_key'] ?? '',
            ])->post($baseUrl . '/tokenized/checkout/execute', [
                'paymentID' => $paymentId,
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('bKash Execute Payment Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Query payment status with Tokenized bKash PGW
     */
    public function queryPayment(string $paymentId, string $idToken): ?array
    {
        $settings = $this->getSettings();
        $isLive = ($settings['pgw_mode'] ?? 'sandbox') === 'live';
        $baseUrl = $isLive 
            ? 'https://tokenized.pay.bka.sh/v1.2.0-beta' 
            : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => $idToken,
                'X-APP-Key' => $settings['pgw_app_key'] ?? '',
            ])->post($baseUrl . '/tokenized/checkout/payment/status', [
                'paymentID' => $paymentId,
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('bKash Query Payment Error: ' . $e->getMessage());
            return null;
        }
    }
}
