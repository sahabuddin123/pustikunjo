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
        
        // 4 Core KPI Cards
        $todayOrdersCount = Order::whereDate('created_at', $today)->count();
        $todayRevenue = Order::whereDate('created_at', $today)
            ->whereNotIn('status', ['cancelled', 'payment_rejected'])
            ->sum('grand_total');

        $totalRevenue = Order::whereNotIn('status', ['cancelled', 'payment_rejected'])->sum('grand_total');
        $totalOrders = Order::count();
        $pendingPayments = Order::where('status', 'payment_pending')->count();
        $lowStockProducts = Product::where('stock', '<=', 5)->count();

        // Recent Orders
        $recentOrders = Order::with('items')
            ->latest()
            ->take(8)
            ->get();

        // Low stock items list
        $lowStockList = Product::where('stock', '<=', 5)
            ->orderBy('stock', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'todayOrders' => $todayOrdersCount,
                'todayRevenue' => (float) $todayRevenue,
                'totalRevenue' => (float) $totalRevenue,
                'totalOrders' => $totalOrders,
                'pendingPayments' => $pendingPayments,
                'lowStockCount' => $lowStockProducts,
            ],
            'recentOrders' => $recentOrders,
            'lowStockList' => $lowStockList,
        ]);
    }
}
