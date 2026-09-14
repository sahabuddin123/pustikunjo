<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourierWebhookLog;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Services\Sms\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SteadfastWebhookController extends Controller
{
    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    /**
     * Handle incoming webhook updates from Steadfast Courier
     */
    public function handle(Request $request)
    {
        $settings = SiteSetting::get('courier_steadfast', []);
        $configuredToken = trim((string) ($settings['webhook_token'] ?? ''));

        // Validate Bearer Token if configured
        if (!empty($configuredToken)) {
            $bearerToken = $request->bearerToken() 
                ?: $request->header('X-Auth-Token') 
                ?: $request->input('token') 
                ?: $request->input('auth_token');

            if (!$bearerToken || !hash_equals($configuredToken, trim($bearerToken))) {
                Log::warning('Steadfast Webhook unauthorized token attempt', [
                    'ip' => $request->ip(),
                    'provided_token' => $bearerToken ? 'Bearer ***' : 'None',
                ]);
                return response()->json([
                    'status' => 401,
                    'message' => 'Unauthorized: Invalid webhook token.',
                ], 401);
            }
        }

        $payload = $request->all();
        Log::info('Steadfast Webhook received:', ['payload' => $payload, 'ip' => $request->ip()]);

        // Steadfast payload formats vary slightly between webhook types:
        // fields: consignment_id, tracking_code, invoice (order_number), status / delivery_status
        $trackingCode = $request->input('tracking_code') 
            ?: $request->input('tracking_id') 
            ?: ($payload['consignment']['tracking_code'] ?? null);

        $consignmentId = $request->input('consignment_id') 
            ?: ($payload['consignment']['consignment_id'] ?? null);

        $invoice = $request->input('invoice') 
            ?: $request->input('order_id') 
            ?: ($payload['consignment']['invoice'] ?? null);

        $status = strtolower((string) (
            $request->input('status') 
            ?: $request->input('delivery_status') 
            ?: ($payload['consignment']['status'] ?? 'unknown')
        ));

        // Save incoming ping to webhook logs
        CourierWebhookLog::create([
            'courier_name' => 'steadfast',
            'tracking_code' => $trackingCode,
            'consignment_id' => $consignmentId ? (string) $consignmentId : null,
            'status' => $status,
            'payload' => $payload,
            'ip_address' => $request->ip(),
        ]);

        // Locate order
        $order = null;
        if (!empty($trackingCode)) {
            $order = Order::where('courier_tracking_code', $trackingCode)->first();
        }
        if (!$order && !empty($consignmentId)) {
            $order = Order::where('courier_consignment_id', (string) $consignmentId)->first();
        }
        if (!$order && !empty($invoice)) {
            $order = Order::where('order_number', $invoice)->first();
        }

        if (!$order) {
            return response()->json([
                'status' => 200,
                'message' => 'Webhook logged, but no matching order found for consignment/invoice.',
            ]);
        }

        // Update order courier status
        $order->courier_status = $status;

        // Check if webhook supplied rider details / note
        $riderNote = $request->input('rider_note') 
            ?: $request->input('rider_comment') 
            ?: $request->input('comments');

        if (!empty($riderNote)) {
            $order->courier_rider_note = $riderNote;
        }

        // Status transition mapping
        if (in_array($status, ['delivered', 'delivered_approval_pending'])) {
            $order->status = 'delivered';
            $order->payment_status = 'paid';
            $this->smsService->triggerEvent('order_delivered', $order);
        } elseif (in_array($status, ['cancelled', 'cancelled_approval_pending', 'return', 'returned'])) {
            $order->status = 'cancelled';
        } elseif (in_array($status, ['in_transit', 'picked_up', 'out_for_delivery'])) {
            if ($order->status !== 'shipped' && $order->status !== 'delivered') {
                $order->status = 'shipped';
            }
        }

        $order->save();

        return response()->json([
            'status' => 200,
            'message' => 'Order status successfully synced via webhook.',
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'new_status' => $order->status,
            'courier_status' => $order->courier_status,
        ]);
    }
}
