<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderTrackingController extends Controller
{
    public function index(Request $request)
    {
        $orderNumber = $request->input('order');
        $phone = $request->input('phone');
        $order = null;
        $searched = false;

        if ($request->filled('order') && $request->filled('phone')) {
            $searched = true;
            $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
            
            $order = Order::with('items')
                ->where('order_number', trim($orderNumber))
                ->where(function ($q) use ($cleanPhone) {
                    $q->where('customer_phone', 'like', "%{$cleanPhone}%")
                      ->orWhere('customer_phone', $cleanPhone);
                })
                ->first();
        }

        return Inertia::render('Storefront/TrackOrder', [
            'order' => $order,
            'searched' => $searched,
            'initialOrder' => $orderNumber ?: '',
            'initialPhone' => $phone ?: '',
            'meta' => [
                'title' => 'অর্ডার ট্র্যাকিং — পুষ্টি কুঞ্জ',
                'description' => 'আপনার ফোন নম্বর ও অর্ডার আইডি দিয়ে সহজেই অর্ডারের বর্তমান অবস্থা জানুন।',
            ]
        ]);
    }
}
