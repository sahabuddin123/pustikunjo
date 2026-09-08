<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $query = Order::select(
            'customer_phone',
            DB::raw('MAX(customer_name) as customer_name'),
            DB::raw('MAX(customer_email) as customer_email'),
            DB::raw('MAX(customer_alt_phone) as customer_alt_phone'),
            DB::raw('MAX(shipping_address) as shipping_address'),
            DB::raw('COUNT(id) as total_orders'),
            DB::raw('SUM(grand_total) as total_spent'),
            DB::raw('MAX(created_at) as last_order_at')
        )->groupBy('customer_phone');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('customer_phone', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        $customers = $query->orderByDesc('last_order_at')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => ['search' => $search],
        ]);
    }

    public function show(string $phone)
    {
        $orders = Order::with('items')
            ->where('customer_phone', $phone)
            ->orderByDesc('created_at')
            ->get();

        if ($orders->isEmpty()) {
            abort(404, 'Customer not found.');
        }

        $customer = [
            'name' => $orders->first()->customer_name,
            'phone' => $phone,
            'email' => $orders->first()->customer_email,
            'alt_phone' => $orders->first()->customer_alt_phone,
            'address' => $orders->first()->shipping_address,
            'total_orders' => $orders->count(),
            'total_spent' => $orders->sum('grand_total'),
            'orders' => $orders,
        ];

        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
        ]);
    }
}
