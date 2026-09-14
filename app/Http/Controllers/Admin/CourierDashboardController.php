<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourierWebhookLog;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Services\Courier\SteadfastService;
use App\Services\Fraud\FraudCheckerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierDashboardController extends Controller
{
    protected SteadfastService $steadfastService;
    protected FraudCheckerService $fraudChecker;

    public function __construct(SteadfastService $steadfastService, FraudCheckerService $fraudChecker)
    {
        $this->steadfastService = $steadfastService;
        $this->fraudChecker = $fraudChecker;
    }

    /**
     * Dedicated Steadfast Courier Dashboard
     */
    public function index(Request $request)
    {
        $settings = SiteSetting::get('courier_steadfast', [
            'enabled' => true,
            'api_key' => env('STEADFAST_API_KEY', ''),
            'secret_key' => env('STEADFAST_SECRET_KEY', ''),
            'base_url' => 'https://portal.packzy.com/api/v1',
            'auto_sync' => true,
            'pickup_warehouse' => 'Fakirapool 1st Lane, Dhaka-1000',
            'webhook_token' => '',
        ]);

        // Live balance
        $balanceData = $this->steadfastService->getBalance();

        // Query all courier orders
        $query = Order::query()
            ->whereNotNull('courier_tracking_code')
            ->orWhereNotNull('courier_consignment_id')
            ->latest('courier_sent_at');

        // Apply search
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('courier_tracking_code', 'like', "%{$search}%")
                  ->orWhere('courier_consignment_id', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        // Apply courier status filter
        if ($request->filled('status')) {
            $query->where('courier_status', $request->input('status'));
        }

        $parcels = $query->paginate(15)->withQueryString();

        // Statistics
        $totalBooked = Order::whereNotNull('courier_tracking_code')->count();
        $inTransitCount = Order::whereNotNull('courier_tracking_code')
            ->whereIn('courier_status', ['in_transit', 'in_review', 'picked_up', 'out_for_delivery'])
            ->count();
        $deliveredCount = Order::whereNotNull('courier_tracking_code')
            ->whereIn('courier_status', ['delivered', 'delivered_approval_pending'])
            ->count();
        $cancelledCount = Order::whereNotNull('courier_tracking_code')
            ->whereIn('courier_status', ['cancelled', 'cancelled_approval_pending', 'return', 'returned'])
            ->count();

        // Unbooked confirmed orders ready for dispatch
        $unbookedOrders = Order::whereNull('courier_tracking_code')
            ->whereIn('status', ['confirmed', 'payment_verified', 'pending'])
            ->count();

        // Recent Webhook Logs
        $recentWebhookLogs = CourierWebhookLog::latest()->take(8)->get();

        return Inertia::render('Admin/Courier/Index', [
            'parcels' => $parcels,
            'stats' => [
                'balance' => $balanceData['balance'] ?? 0.0,
                'balance_success' => $balanceData['success'] ?? false,
                'balance_message' => $balanceData['message'] ?? '',
                'total_booked' => $totalBooked,
                'in_transit' => $inTransitCount,
                'delivered' => $deliveredCount,
                'cancelled' => $cancelledCount,
                'unbooked_orders' => $unbookedOrders,
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
            ],
            'config' => [
                'enabled' => (bool) ($settings['enabled'] ?? true),
                'is_configured' => $this->steadfastService->isConfigured(),
                'base_url' => $settings['base_url'] ?? 'https://portal.packzy.com/api/v1',
                'api_key_masked' => !empty($settings['api_key']) 
                    ? substr($settings['api_key'], 0, 6) . '••••' . substr($settings['api_key'], -4) 
                    : '',
                'pickup_warehouse' => $settings['pickup_warehouse'] ?? 'Fakirapool 1st Lane, Dhaka-1000',
                'webhook_url' => url('/api/v1/courier/webhook/steadfast'),
            ],
            'recentWebhookLogs' => $recentWebhookLogs,
        ]);
    }

    /**
     * Live Tracking API for Modal / Search
     */
    public function track(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $result = $this->steadfastService->trackParcel($request->input('code'));

        // Also check if local order exists for more rich details (rider note, customer note)
        $order = Order::where('courier_tracking_code', $request->input('code'))
            ->orWhere('courier_consignment_id', $request->input('code'))
            ->orWhere('order_number', $request->input('code'))
            ->first();

        if ($order) {
            $result['order'] = [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'shipping_address' => $order->shipping_address,
                'grand_total' => $order->grand_total,
                'payment_method' => $order->payment_method,
                'customer_note' => $order->order_notes,
                'rider_note' => $order->courier_rider_note,
                'pickup_note' => $order->courier_pickup_note,
                'courier_status' => $order->courier_status,
                'courier_sent_at' => $order->courier_sent_at?->format('d M, Y h:i A'),
            ];
        }

        return response()->json($result);
    }

    /**
     * Quick Instant Fraud Check API
     */
    public function fraudCheck(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $phone = $request->input('phone');
        $analysis = $this->fraudChecker->checkPhone($phone);

        return response()->json($analysis);
    }

    /**
     * Batch sync all active courier parcels
     */
    public function syncAll(Request $request)
    {
        $activeOrders = Order::whereNotNull('courier_tracking_code')
            ->whereNotIn('courier_status', ['delivered', 'cancelled'])
            ->limit(30)
            ->get();

        $syncedCount = 0;
        foreach ($activeOrders as $order) {
            $res = $this->steadfastService->syncOrderStatus($order);
            if ($res['success']) {
                $syncedCount++;
            }
        }

        return back()->with('success', "মোট {$syncedCount}টি অর্ডারের কুরিয়ার স্ট্যাটাস সফলভাবে সিঙ্ক করা হয়েছে!");
    }
}
