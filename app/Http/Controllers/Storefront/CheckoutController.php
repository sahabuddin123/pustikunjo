<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Services\Payment\BkashService;
use App\Services\Sms\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected BkashService $bkashService;
    protected SmsService $smsService;

    public function __construct(BkashService $bkashService, SmsService $smsService)
    {
        $this->bkashService = $bkashService;
        $this->smsService = $smsService;
    }

    public function index()
    {
        $shippingZones = SiteSetting::get('shipping_zones', [
            ['name' => 'ঢাকার ভিতরে', 'fee' => 60],
            ['name' => 'ঢাকার বাইরে', 'fee' => 120],
        ]);

        $bkashSettings = $this->bkashService->getSettings();

        return Inertia::render('Storefront/Checkout', [
            'shippingZones' => $shippingZones,
            'bkashSettings' => [
                'manual_enabled' => $bkashSettings['manual_enabled'] ?? true,
                'manual_type' => $bkashSettings['manual_type'] ?? 'merchant',
                'manual_number' => $bkashSettings['manual_number'] ?? '01700000000',
                'manual_instructions' => $bkashSettings['manual_instructions'] ?? 'অর্ডার কনফার্ম করতে {amount} টাকা {number} নম্বরে সেন্ড মানি করুন। সেন্ড মানি করার পর নিচে ট্রানজেকশন আইডি (TrxID) লিখুন।',
                'pgw_enabled' => $bkashSettings['pgw_enabled'] ?? false,
            ],
            'meta' => [
                'title' => 'সহজ চেকআউট — পুষ্টি কুঞ্জ',
                'description' => 'দ্রুত ও নিরাপদে আপনার অর্ডার সম্পন্ন করুন। ক্যাশ অন ডেলিভারি অথবা বিকাশ পেমেন্ট সুবিধা।',
            ]
        ]);
    }

    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric|min:1',
        ]);

        $coupon = Coupon::where('code', strtoupper(trim($request->code)))->first();
        if (!$coupon) {
            return response()->json(['valid' => false, 'message' => 'কুপন কোডটি সঠিক নয়।'], 422);
        }

        [$valid, $message] = $coupon->isValidFor($request->amount);
        if (!$valid) {
            return response()->json(['valid' => false, 'message' => $message], 422);
        }

        $discount = $coupon->calculateDiscount($request->amount);

        return response()->json([
            'valid' => true,
            'code' => $coupon->code,
            'discount' => $discount,
            'message' => 'কুপন সফলভাবে যুক্ত হয়েছে! আপনি ৳' . $discount . ' ছাড় পেয়েছেন।',
        ]);
    }

    public function process(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'customer_alt_phone' => 'nullable|string|max:20',
            'customer_email' => 'nullable|email|max:100',
            'shipping_address' => 'required|string|max:500',
            'shipping_area' => 'required|string',
            'order_notes' => 'nullable|string|max:500',
            'payment_method' => 'required|in:cod,bkash_manual,bkash_pgw',
            'bkash_sender_number' => 'nullable|string',
            'bkash_trx_id' => 'nullable|string',
            'coupon_code' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.variant_name' => 'nullable|string',
        ]);

        // Validate bKash manual fields
        if ($validated['payment_method'] === 'bkash_manual') {
            if (empty($validated['bkash_trx_id'])) {
                return back()->withErrors(['bkash_trx_id' => 'বিকাশ ট্রানজেকশন আইডি (TrxID) দেওয়া আবশ্যক।']);
            }
            if (!$this->bkashService->validateTrxId($validated['bkash_trx_id'])) {
                return back()->withErrors(['bkash_trx_id' => 'সঠিক ৮-১২ সংখ্যার ট্রানজেকশন আইডি (TrxID) লিখুন।']);
            }
        }

        return DB::transaction(function () use ($validated, $request) {
            // Determine Shipping Fee
            $shippingZones = SiteSetting::get('shipping_zones', [
                ['name' => 'ঢাকার ভিতরে', 'fee' => 60],
                ['name' => 'ঢাকার বাইরে', 'fee' => 120],
            ]);
            $shippingFee = 60;
            foreach ($shippingZones as $zone) {
                if ($zone['name'] === $validated['shipping_area']) {
                    $shippingFee = (float) $zone['fee'];
                    break;
                }
            }

            // Calculate Subtotal & Validate stock
            $subtotal = 0;
            $itemsData = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['id']);
                $unitPrice = $product->effective_price;
                $variantName = $item['variant_name'] ?? null;

                // Dynamic variant price lookup
                if (!empty($variantName) && !empty($product->variants)) {
                    foreach ($product->variants as $v) {
                        if (($v['name'] ?? '') === $variantName) {
                            $vSale = isset($v['sale_price']) && is_numeric($v['sale_price']) && $v['sale_price'] > 0 ? (float) $v['sale_price'] : null;
                            $vReg = isset($v['price']) && is_numeric($v['price']) ? (float) $v['price'] : null;
                            if ($vSale !== null && $vSale < ($vReg ?? 999999)) {
                                $unitPrice = $vSale;
                            } elseif ($vReg !== null) {
                                $unitPrice = $vReg;
                            }
                            break;
                        }
                    }
                }

                $lineTotal = $unitPrice * $item['quantity'];
                $subtotal += $lineTotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $variantName ? "{$product->name} ({$variantName})" : $product->name,
                    'product_sku' => $product->sku,
                    'variant_name' => $variantName,
                    'product_image' => $product->primary_image,
                    'unit_price' => $unitPrice,
                    'quantity' => $item['quantity'],
                    'subtotal' => $lineTotal,
                ];

                // Decrement stock if in stock
                if ($product->stock >= $item['quantity']) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            // Coupon Discount
            $discountAmount = 0;
            $couponCode = null;
            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', strtoupper(trim($validated['coupon_code'])))->first();
                if ($coupon) {
                    [$valid] = $coupon->isValidFor($subtotal);
                    if ($valid) {
                        $discountAmount = $coupon->calculateDiscount($subtotal);
                        $couponCode = $coupon->code;
                        $coupon->increment('used_count');
                    }
                }
            }

            $grandTotal = max(0, ($subtotal + $shippingFee - $discountAmount));

            // Generate Sequential Unique Order Number (PK-YYYYMMDD-XXXX)
            $orderCountToday = Order::whereDate('created_at', today())->count() + 1;
            $orderNumber = 'PK-' . date('ymd') . '-' . str_pad($orderCountToday, 4, '0', STR_PAD_LEFT);

            // Initial status based on payment method
            $initialStatus = match ($validated['payment_method']) {
                'bkash_manual' => 'payment_pending',
                'bkash_pgw' => 'payment_pending',
                default => 'pending',
            };

            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_alt_phone' => $validated['customer_alt_phone'] ?? null,
                'customer_email' => $validated['customer_email'] ?? null,
                'shipping_address' => $validated['shipping_address'],
                'shipping_area' => $validated['shipping_area'],
                'order_notes' => $validated['order_notes'] ?? null,
                'payment_method' => $validated['payment_method'],
                'payment_status' => ($validated['payment_method'] === 'cod') ? 'pending' : 'payment_pending',
                'status' => $initialStatus,
                'bkash_sender_number' => $validated['bkash_sender_number'] ?? null,
                'bkash_trx_id' => $validated['bkash_trx_id'] ?? null,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discountAmount,
                'coupon_code' => $couponCode,
                'grand_total' => $grandTotal,
            ]);

            // Insert Order Items
            foreach ($itemsData as $itemRow) {
                $order->items()->create($itemRow);
            }

            // Trigger SMS Notification
            $this->smsService->triggerEvent('order_placed', $order);

            // If tokenized bKash PGW is chosen
            if ($validated['payment_method'] === 'bkash_pgw') {
                $idToken = $this->bkashService->grantToken();
                if ($idToken) {
                    $paymentRes = $this->bkashService->createPayment($order, $idToken);
                    if (!empty($paymentRes['bkashURL'])) {
                        $order->update(['bkash_payment_id' => $paymentRes['paymentID'] ?? null]);
                        return Inertia::location($paymentRes['bkashURL']);
                    }
                }
            }

            return redirect()->route('order.success', ['order' => $order->order_number]);
        });
    }

    public function success(Request $request)
    {
        $orderNumber = $request->input('order');
        $order = Order::with('items')->where('order_number', $orderNumber)->firstOrFail();

        return Inertia::render('Storefront/OrderSuccess', [
            'order' => $order,
            'meta' => [
                'title' => 'অর্ডার সফল হয়েছে! — পুষ্টি কুঞ্জ',
                'description' => 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। অর্ডার নম্বর: ' . $order->order_number,
            ]
        ]);
    }
}
