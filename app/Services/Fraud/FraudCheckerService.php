<?php

namespace App\Services\Fraud;

use App\Models\FraudRecord;
use App\Models\Order;
use App\Models\SiteSetting;

class FraudCheckerService
{
    /**
     * Normalize a phone number to standard Bangladeshi 11-digit format (01XXXXXXXXX)
     */
    public function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($digits, '8801')) {
            $digits = substr($digits, 2);
        }
        return $digits;
    }

    /**
     * Check phone number for fraud risk and customer delivery history
     */
    public function checkPhone(string $phone): array
    {
        $normalized = $this->normalizePhone($phone);

        // 1. Check blacklist database
        $blacklistRecord = FraudRecord::where('phone', $normalized)
            ->orWhere('phone', $phone)
            ->first();

        // 2. Query all orders with this phone (both formats)
        $orders = Order::where(function ($q) use ($normalized, $phone) {
            $q->where('customer_phone', $normalized)
              ->orWhere('customer_phone', $phone)
              ->orWhere('customer_phone', '88' . $normalized);
        })->get();

        $totalOrders = $orders->count();
        $deliveredOrders = $orders->where('status', 'delivered')->count();
        $cancelledOrders = $orders->whereIn('status', ['cancelled', 'payment_rejected'])->count();
        $pendingOrders = $orders->whereIn('status', ['pending', 'payment_pending', 'confirmed', 'shipped'])->count();

        $completedOrders = $deliveredOrders + $cancelledOrders;
        $successRate = $completedOrders > 0
            ? round(($deliveredOrders / $completedOrders) * 100)
            : ($totalOrders > 0 ? 100 : 100);

        // 3. Compute Risk Level and Score (0 - 100)
        $isBlacklisted = $blacklistRecord && $blacklistRecord->risk_level === 'fraud';
        $riskScore = 10; // baseline for clean/unknown customer
        $riskLevel = 'safe';
        $riskReason = 'স্বাভাবিক অর্ডার হিস্টোরি। কোনো ঝুঁকি পাওয়া যায়নি।';

        if ($isBlacklisted) {
            $riskLevel = 'high_risk';
            $riskScore = 95;
            $riskReason = 'কাস্টমারটি পূর্বে প্রতারক / ব্ল্যাকলিস্ট হিসেবে তালিকাভুক্ত: ' . ($blacklistRecord->reason ?: 'পার্সেল রিসিভ করে না');
        } elseif ($cancelledOrders >= 2 && $successRate < 60) {
            $riskLevel = 'high_risk';
            $riskScore = 85;
            $riskReason = "উচ্চ ঝুঁকি! গ্রাহকের {$cancelledOrders}টি অর্ডার বাতিল/রিটার্ন হয়েছে (সফলতার হার মাত্র {$successRate}%)।";
        } elseif ($cancelledOrders >= 1) {
            $riskLevel = 'medium_risk';
            $riskScore = 55;
            $riskReason = "সতর্কতা! পূর্বে {$cancelledOrders}টি অর্ডার বাতিল হয়েছিল। ডেলিভারি নিশ্চিত করার পূর্বে গ্রাহকের সাথে ফোনে কথা বলুন।";
        } elseif ($totalOrders <= 1) {
            $riskLevel = 'safe';
            $riskScore = 20;
            $riskReason = 'নতুন গ্রাহক। প্রথম অর্ডার।';
        } else {
            $riskLevel = 'safe';
            $riskScore = 5;
            $riskReason = "নির্ভরযোগ্য নিয়মিত গ্রাহক! পূর্ববর্তী {$deliveredOrders}টি অর্ডার সফলভাবে ডেলিভারি হয়েছে।";
        }

        // Badge metadata
        $badges = [
            'safe' => [
                'label' => 'নিরাপদ (Low Risk)',
                'badge_class' => 'bg-emerald-100 text-emerald-800 border-emerald-300',
                'dot_class' => 'bg-emerald-500',
                'color' => 'emerald',
            ],
            'medium_risk' => [
                'label' => 'সতর্কতা (Medium Risk)',
                'badge_class' => 'bg-amber-100 text-amber-800 border-amber-300',
                'dot_class' => 'bg-amber-500',
                'color' => 'amber',
            ],
            'high_risk' => [
                'label' => 'ঝুঁকিপূর্ণ / প্রতারক (High Risk)',
                'badge_class' => 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
                'dot_class' => 'bg-rose-600',
                'color' => 'rose',
            ],
        ];

        return [
            'phone' => $phone,
            'normalized_phone' => $normalized,
            'risk_level' => $riskLevel,
            'risk_score' => $riskScore,
            'risk_reason' => $riskReason,
            'is_blacklisted' => (bool) $isBlacklisted,
            'blacklist_reason' => $blacklistRecord?->reason,
            'metrics' => [
                'total_orders' => $totalOrders,
                'delivered_orders' => $deliveredOrders,
                'cancelled_orders' => $cancelledOrders,
                'pending_orders' => $pendingOrders,
                'success_rate' => $successRate,
            ],
            'badge' => $badges[$riskLevel] ?? $badges['safe'],
        ];
    }

    /**
     * Add phone to blacklist
     */
    public function markFraud(string $phone, string $reason, string $riskLevel = 'fraud', ?int $reportedBy = null): FraudRecord
    {
        $normalized = $this->normalizePhone($phone);

        $record = FraudRecord::updateOrCreate(
            ['phone' => $normalized],
            [
                'risk_level' => $riskLevel,
                'reason' => $reason,
                'reported_by' => $reportedBy,
            ]
        );

        // Update matching orders
        Order::where('customer_phone', $phone)
            ->orWhere('customer_phone', $normalized)
            ->update([
                'fraud_status' => 'high_risk',
                'fraud_score' => 95,
            ]);

        return $record;
    }

    /**
     * Remove phone from blacklist
     */
    public function removeFraud(string $phone): bool
    {
        $normalized = $this->normalizePhone($phone);
        FraudRecord::where('phone', $normalized)->orWhere('phone', $phone)->delete();

        // Re-evaluate and reset
        $analysis = $this->checkPhone($phone);
        Order::where('customer_phone', $phone)
            ->orWhere('customer_phone', $normalized)
            ->update([
                'fraud_status' => $analysis['risk_level'],
                'fraud_score' => $analysis['risk_score'],
            ]);

        return true;
    }
}
