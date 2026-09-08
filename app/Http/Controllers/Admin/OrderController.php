<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Courier\SteadfastService;
use App\Services\Fraud\FraudCheckerService;
use App\Services\Sms\SmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected SmsService $smsService;
    protected SteadfastService $steadfastService;
    protected FraudCheckerService $fraudChecker;

    public function __construct(
        SmsService $smsService,
        SteadfastService $steadfastService,
        FraudCheckerService $fraudChecker
    ) {
        $this->smsService = $smsService;
        $this->steadfastService = $steadfastService;
        $this->fraudChecker = $fraudChecker;
    }

    public function index(Request $request)
    {
        $query = Order::with('items');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->input('payment_method'));
        }

        if ($request->filled('q')) {
            $term = $request->input('q');
            $query->where(function ($q) use ($term) {
                $q->where('order_number', 'like', "%{$term}%")
                  ->orWhere('customer_name', 'like', "%{$term}%")
                  ->orWhere('customer_phone', 'like', "%{$term}%")
                  ->orWhere('bkash_trx_id', 'like', "%{$term}%")
                  ->orWhere('courier_tracking_code', 'like', "%{$term}%");
            });
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        // Attach lightweight fraud check and courier summaries for list view
        $orders->getCollection()->transform(function ($order) {
            $order->fraud_analysis = $this->fraudChecker->checkPhone($order->customer_phone);
            return $order;
        });

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'status' => $request->input('status', ''),
                'payment_method' => $request->input('payment_method', ''),
                'q' => $request->input('q', ''),
            ]
        ]);
    }

    public function show($id)
    {
        $order = Order::with('items.product')->findOrFail($id);
        $fraudAnalysis = $this->fraudChecker->checkPhone($order->customer_phone);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'fraudAnalysis' => $fraudAnalysis,
            'steadfastConfigured' => $this->steadfastService->isConfigured(),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $request->validate([
            'status' => 'required|in:pending,payment_pending,payment_verified,confirmed,shipped,delivered,cancelled,payment_rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $newStatus = $request->input('status');
        $order->status = $newStatus;
        if ($request->filled('admin_notes')) {
            $order->admin_notes = $request->input('admin_notes');
        }
        $order->save();

        // Trigger matching SMS event
        $eventMap = [
            'payment_verified' => 'payment_verified',
            'confirmed' => 'order_confirmed',
            'shipped' => 'order_shipped',
            'delivered' => 'order_delivered',
        ];

        if (isset($eventMap[$newStatus])) {
            $this->smsService->triggerEvent($eventMap[$newStatus], $order);
        }

        return back()->with('success', 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!');
    }

    /**
     * bKash Manual Payment: Verify Action
     */
    public function verifyPayment(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update([
            'status' => 'payment_verified',
            'payment_status' => 'payment_verified',
            'admin_notes' => ($order->admin_notes ? $order->admin_notes . "\n" : '') . 'বিকাশ পেমেন্ট যাচাইকৃত (' . date('Y-m-d H:i') . ')',
        ]);

        $this->smsService->triggerEvent('payment_verified', $order);

        return back()->with('success', 'বিকাশ ট্রানজেকশন সফলভাবে যাচাই করা হয়েছে!');
    }

    /**
     * bKash Manual Payment: Reject Action with Reason Modal
     */
    public function rejectPayment(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $order = Order::findOrFail($id);
        $order->update([
            'status' => 'payment_rejected',
            'payment_status' => 'payment_rejected',
            'bkash_reject_reason' => $request->reason,
            'admin_notes' => ($order->admin_notes ? $order->admin_notes . "\n" : '') . 'পেমেন্ট বাতিল কারণ: ' . $request->reason,
        ]);

        $this->smsService->triggerEvent('payment_rejected', $order, ['reason' => $request->reason]);

        return back()->with('success', 'পেমেন্ট বাতিল করা হয়েছে এবং গ্রাহককে অবহিত করা হয়েছে।');
    }

    /**
     * Re-send SMS to customer
     */
    public function resendSms(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $request->validate(['event' => 'required|string']);

        $sent = $this->smsService->triggerEvent($request->event, $order);

        if ($sent) {
            return back()->with('success', 'এসএমএস সফলভাবে পুনরায় পাঠানো হয়েছে!');
        }

        return back()->with('error', 'এসএমএস পাঠানো সম্ভব হয়নি (গেটওয়ে বা ট্রিগার চেক করুন)।');
    }

    /**
     * Clean Printable Invoice View
     */
    public function invoice($id)
    {
        $order = Order::with('items')->findOrFail($id);

        return Inertia::render('Admin/Orders/Invoice', [
            'order' => $order,
        ]);
    }

    /**
     * Dispatch parcel to Steadfast Courier
     */
    public function sendToCourier(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'recipient_name' => 'nullable|string|max:150',
            'recipient_phone' => 'nullable|string|max:30',
            'recipient_address' => 'nullable|string',
            'cod_amount' => 'nullable|numeric|min:0',
            'note' => 'nullable|string|max:255',
        ]);

        $result = $this->steadfastService->createOrder($order, $request->all());

        if ($result['success']) {
            // Trigger order shipped SMS to customer
            $this->smsService->triggerEvent('order_shipped', $order);

            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message'] ?? 'কুরিয়ার বুকিং ব্যর্থ হয়েছে।');
    }

    /**
     * Refresh / Sync courier tracking status
     */
    public function syncCourier(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $result = $this->steadfastService->syncOrderStatus($order);

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message'] ?? 'কুরিয়ার স্ট্যাটাস সিঙ্ক করা যায়নি।');
    }

    /**
     * Toggle Customer Blacklist / Fraud Flag
     */
    public function toggleBlacklist(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'action' => 'required|in:blacklist,whitelist',
            'reason' => 'nullable|string|max:255',
        ]);

        if ($request->input('action') === 'blacklist') {
            $reason = $request->input('reason') ?: 'অর্ডার গ্রহণের পর পার্সেল রিসিভ করে না / ভুয়া তথ্য';
            $this->fraudChecker->markFraud($order->customer_phone, $reason, 'fraud', auth()->id());
            return back()->with('success', 'গ্রাহককে সফলভাবে প্রতারক/ব্ল্যাকলিস্ট তালিকায় যুক্ত করা হয়েছে!');
        }

        $this->fraudChecker->removeFraud($order->customer_phone);
        return back()->with('success', 'গ্রাহককে ব্ল্যাকলিস্ট থেকে মুক্ত করা হয়েছে!');
    }
}

