<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $startOfMonth = Carbon::now()->startOfMonth();

        // Financial & Order KPIs
        $todayOrdersCount = Order::whereDate('created_at', $today)->count();
        $yesterdayOrdersCount = Order::whereDate('created_at', $yesterday)->count();

        $todayRevenue = Order::whereDate('created_at', $today)
            ->whereNotIn('status', ['cancelled', 'payment_rejected'])
            ->sum('grand_total');

        $yesterdayRevenue = Order::whereDate('created_at', $yesterday)
            ->whereNotIn('status', ['cancelled', 'payment_rejected'])
            ->sum('grand_total');

        $thisMonthRevenue = Order::where('created_at', '>=', $startOfMonth)
            ->whereNotIn('status', ['cancelled', 'payment_rejected'])
            ->sum('grand_total');

        $thisMonthOrders = Order::where('created_at', '>=', $startOfMonth)->count();

        $totalRevenue = Order::whereNotIn('status', ['cancelled', 'payment_rejected'])->sum('grand_total');
        $totalOrders = Order::count();
        $averageOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        // Pending Actions
        $pendingPayments = Order::where('status', 'payment_pending')->count();
        $courierPending = Order::whereIn('status', ['confirmed', 'processing'])
            ->whereNull('courier_tracking_code')
            ->count();
        $lowStockProducts = Product::where('stock', '<=', 5)->count();

        // Customer & Support Metrics
        $totalCustomers = User::where('role', 'customer')->count();
        $pendingComplaints = class_exists(\App\Models\Complaint::class)
            ? \App\Models\Complaint::where('status', 'pending')->count()
            : 0;
        $pendingConsultations = class_exists(\App\Models\ConsultationRequest::class)
            ? \App\Models\ConsultationRequest::where('status', 'pending')->count()
            : 0;

        // Order Pipeline Status Counts
        $statusCounts = [
            'pending' => Order::where('status', 'pending')->count(),
            'payment_pending' => $pendingPayments,
            'confirmed' => Order::where('status', 'confirmed')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        // 7-Day Performance Trend Chart Data
        $sevenDaysTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayOrders = Order::whereDate('created_at', $date)->count();
            $dayRevenue = Order::whereDate('created_at', $date)
                ->whereNotIn('status', ['cancelled', 'payment_rejected'])
                ->sum('grand_total');

            $sevenDaysTrend[] = [
                'day' => $date->locale('bn')->isoFormat('ddd'),
                'date' => $date->format('d M'),
                'orders' => $dayOrders,
                'revenue' => (float) $dayRevenue,
            ];
        }

        // Recent Orders with full details
        $recentOrders = Order::with('items.product')
            ->latest()
            ->take(8)
            ->get();

        // Low stock items list
        $lowStockList = Product::where('stock', '<=', 5)
            ->orderBy('stock', 'asc')
            ->take(5)
            ->get(['id', 'name', 'sku', 'stock', 'price', 'thumbnail']);

        // Top Selling / Featured Products
        $topProducts = Product::where('is_active', true)
            ->orderBy('stock', 'desc')
            ->take(4)
            ->get(['id', 'name', 'sku', 'price', 'stock', 'thumbnail', 'is_featured']);

        // System integrations status
        $steadfastConfig = \App\Models\SiteSetting::get('courier_steadfast', []);
        $hasSteadfast = !empty($steadfastConfig['api_key']);
        $bkashConfig = \App\Models\SiteSetting::get('payment_bkash', []);
        $hasBkash = !empty($bkashConfig['manual_number']) || !empty($bkashConfig['pgw_app_key']);

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'todayOrders' => $todayOrdersCount,
                'yesterdayOrders' => $yesterdayOrdersCount,
                'todayRevenue' => (float) $todayRevenue,
                'yesterdayRevenue' => (float) $yesterdayRevenue,
                'thisMonthRevenue' => (float) $thisMonthRevenue,
                'thisMonthOrders' => $thisMonthOrders,
                'totalRevenue' => (float) $totalRevenue,
                'totalOrders' => $totalOrders,
                'averageOrderValue' => (float) $averageOrderValue,
                'pendingPayments' => $pendingPayments,
                'courierPending' => $courierPending,
                'lowStockCount' => $lowStockProducts,
                'totalCustomers' => $totalCustomers,
                'pendingComplaints' => $pendingComplaints,
                'pendingConsultations' => $pendingConsultations,
            ],
            'statusCounts' => $statusCounts,
            'sevenDaysTrend' => $sevenDaysTrend,
            'recentOrders' => $recentOrders,
            'lowStockList' => $lowStockList,
            'topProducts' => $topProducts,
            'systemStatus' => [
                'steadfastConnected' => $hasSteadfast,
                'bkashActive' => $hasBkash,
                'fraudProtectionActive' => true,
            ],
        ]);
    }
}
