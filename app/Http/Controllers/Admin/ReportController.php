<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $days = (int) $request->query('days', 30);

        // Overall Stats
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('grand_total');
        $totalOrders = Order::count();
        $deliveredOrders = Order::where('status', 'delivered')->count();
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        // Payment Method Breakdown
        $paymentMethods = Order::select('payment_method', DB::raw('count(*) as count'), DB::raw('sum(grand_total) as total'))
            ->groupBy('payment_method')
            ->get();

        // Order Status Distribution
        $statusBreakdown = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // Top Selling Products
        $topProducts = OrderItem::select('product_name', DB::raw('SUM(quantity) as total_qty'), DB::raw('SUM(subtotal) as total_revenue'))
            ->groupBy('product_name')
            ->orderByDesc('total_qty')
            ->limit(8)
            ->get();

        // Daily trend for the selected days
        $dailySales = Order::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(grand_total) as revenue'), DB::raw('COUNT(id) as orders_count'))
            ->where('created_at', '>=', now()->subDays($days))
            ->where('status', '!=', 'cancelled')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'delivered_orders' => $deliveredOrders,
                'avg_order_value' => $avgOrderValue,
            ],
            'paymentMethods' => $paymentMethods,
            'statusBreakdown' => $statusBreakdown,
            'topProducts' => $topProducts,
            'dailySales' => $dailySales,
            'days' => $days,
        ]);
    }
}
