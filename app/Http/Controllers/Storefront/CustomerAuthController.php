<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Models\User;
use App\Services\Sms\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CustomerAuthController extends Controller
{
    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('customer.account');
        }

        return Inertia::render('Storefront/CustomerLogin', [
            'meta' => [
                'title' => 'কাস্টমার লগইন — পুষ্টি কুঞ্জ',
                'description' => 'আপনার পুষ্টি কুঞ্জ অ্যাকাউন্টে লগইন করে পূর্বের অর্ডার ও ডেলিভারি স্ট্যাটাস দেখুন।',
            ]
        ]);
    }

    public function showRegister()
    {
        if (Auth::check()) {
            return redirect()->route('customer.account');
        }

        return Inertia::render('Storefront/CustomerRegister', [
            'meta' => [
                'title' => 'নতুন অ্যাকাউন্ট তৈরি — পুষ্টি কুঞ্জ',
                'description' => 'সহজে পুষ্টি কুঞ্জে অ্যাকাউন্ট তৈরি করে দ্রুত অর্ডার ও স্পেশাল ডিসকাউন্ট উপভোগ করুন।',
            ]
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'password' => 'required|string|min:6|confirmed',
            'address' => 'nullable|string|max:500',
        ], [
            'name.required' => 'আপনার নাম প্রদান করুন।',
            'phone.required' => 'মোবাইল নম্বর প্রদান করুন।',
            'password.required' => 'একটি পাসওয়ার্ড প্রদান করুন।',
            'password.min' => 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।',
            'password.confirmed' => 'পাসওয়ার্ড নিশ্চিতকরণ মেলেনি।',
        ]);

        $phone = trim($validated['phone']);

        // Check if phone already registered
        if (User::where('phone', $phone)->exists()) {
            return back()->withErrors(['phone' => 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।']);
        }

        $email = !empty($validated['email']) ? trim($validated['email']) : ($phone . '@customer.pustikunjo.com');

        if (User::where('email', $email)->exists()) {
            return back()->withErrors(['email' => 'এই ইমেইলটি দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে।']);
        }

        $user = User::create([
            'name' => trim($validated['name']),
            'phone' => $phone,
            'email' => $email,
            'address' => $validated['address'] ? trim($validated['address']) : null,
            'role' => 'customer',
            'password' => Hash::make($validated['password']),
        ]);

        // Automatically connect past orders made with this phone or email
        Order::whereNull('user_id')
            ->where(function ($query) use ($phone, $email) {
                $query->where('customer_phone', $phone);
                if (!str_ends_with($email, '@customer.pustikunjo.com')) {
                    $query->orWhere('customer_email', $email);
                }
            })
            ->update(['user_id' => $user->id]);

        Auth::login($user, true);
        session(['customer_identifier' => $user->phone ?: $user->email]);

        return redirect()->route('customer.account')->with('success', 'স্বাগতম ' . $user->name . '! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।');
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'phone_or_email' => 'required|string',
            'password' => 'nullable|string',
        ], [
            'phone_or_email.required' => 'মোবাইল নম্বর অথবা ইমেইল প্রদান করুন।',
        ]);

        $input = trim($validated['phone_or_email']);
        $password = $request->input('password');

        if (!empty($password)) {
            // Find user by phone or email
            $user = User::where('phone', $input)
                ->orWhere('email', $input)
                ->first();

            if ($user && Hash::check($password, $user->password)) {
                Auth::login($user, $request->boolean('remember', true));
                session(['customer_identifier' => $user->phone ?: $user->email]);

                // Connect past unassigned orders
                Order::whereNull('user_id')
                    ->where(function ($query) use ($user) {
                        if ($user->phone) {
                            $query->where('customer_phone', $user->phone);
                        }
                        if ($user->email && !str_ends_with($user->email, '@customer.pustikunjo.com')) {
                            $query->orWhere('customer_email', $user->email);
                        }
                    })
                    ->update(['user_id' => $user->id]);

                return redirect()->intended(route('customer.account'))->with('success', 'সফলভাবে লগইন হয়েছে। স্বাগতম, ' . $user->name . '!');
            }

            return back()->withErrors([
                'phone_or_email' => 'প্রদত্ত তথ্য অথবা পাসওয়ার্ড সঠিক নয়। পুনরায় চেষ্টা করুন।',
            ]);
        }

        // Quick phone / email order lookup session fallback
        $ordersCount = Order::where('customer_phone', $input)
            ->orWhere('customer_email', $input)
            ->count();

        // If user already registered with password, notify them or log into session
        $existingUser = User::where('phone', $input)->orWhere('email', $input)->first();
        if ($existingUser) {
            // Prompt to enter password if they have one
            return back()->withErrors([
                'password' => 'এই অ্যাকাউন্টের একটি পাসওয়ার্ড রয়েছে। অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন।',
            ]);
        }

        session(['customer_identifier' => $input]);
        return redirect()->route('customer.account')->with('info', 'আপনার অর্ডারের বিবরণ প্রদর্শিত হচ্ছে।');
    }

    public function myAccount()
    {
        $user = Auth::user();
        $identifier = session('customer_identifier') ?? ($user ? ($user->phone ?: $user->email) : null);

        if (!$user && !$identifier) {
            return redirect()->route('customer.login');
        }

        // Query orders: if authenticated user, get all orders by user_id or matching phone/email
        $ordersQuery = Order::with('items')->orderByDesc('created_at');

        if ($user) {
            $ordersQuery->where(function ($query) use ($user) {
                $query->where('user_id', $user->id);
                if ($user->phone) {
                    $query->orWhere('customer_phone', $user->phone);
                }
                if ($user->email && !str_ends_with($user->email, '@customer.pustikunjo.com')) {
                    $query->orWhere('customer_email', $user->email);
                }
            });
        } else {
            $ordersQuery->where(function ($query) use ($identifier) {
                $query->where('customer_phone', $identifier)
                    ->orWhere('customer_email', $identifier);
            });
        }

        $orders = $ordersQuery->get();
        $latestOrder = $orders->first();

        // Calculate Customer Metrics
        $stats = [
            'total_orders' => $orders->count(),
            'pending_orders' => $orders->whereIn('status', ['pending', 'processing'])->count(),
            'completed_orders' => $orders->where('status', 'delivered')->count(),
            'total_spent' => (float) $orders->where('status', '!=', 'cancelled')->sum('total_amount'),
        ];

        $cleanEmail = $user?->email;
        if ($cleanEmail && str_ends_with($cleanEmail, '@customer.pustikunjo.com')) {
            $cleanEmail = null;
        }

        return Inertia::render('Storefront/MyAccount', [
            'identifier' => $identifier,
            'orders' => $orders,
            'stats' => $stats,
            'isAuthenticated' => Auth::check(),
            'customer' => [
                'name' => $user?->name ?? $latestOrder?->customer_name ?? 'সম্মানিত গ্রাহক',
                'phone' => $user?->phone ?? $latestOrder?->customer_phone ?? $identifier,
                'email' => $cleanEmail ?? $latestOrder?->customer_email,
                'address' => $user?->address ?? $latestOrder?->shipping_address,
            ],
            'meta' => [
                'title' => 'আমার ড্যাশবোর্ড — পুষ্টি কুঞ্জ',
                'description' => 'আপনার পূর্বের অর্ডার সমূহ, ট্র্যাকিং ও প্রোফাইল বিবরণ।',
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('customer.login')->with('error', 'প্রোফাইল আপডেট করতে অনুগ্রহ করে লগইন করুন।');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
        ], [
            'name.required' => 'আপনার নাম প্রদান করুন।',
            'phone.required' => 'মোবাইল নম্বর প্রদান করুন।',
        ]);

        $phone = trim($validated['phone']);
        // Check uniqueness of phone excluding current user
        if (User::where('phone', $phone)->where('id', '!=', $user->id)->exists()) {
            return back()->withErrors(['phone' => 'এই মোবাইল নম্বরটি অন্য একজন ব্যবহারকারী ইতিমধ্যে ব্যবহার করছেন।']);
        }

        if (!empty($validated['email'])) {
            $email = trim($validated['email']);
            if (User::where('email', $email)->where('id', '!=', $user->id)->exists()) {
                return back()->withErrors(['email' => 'এই ইমেইলটি অন্য একজন ব্যবহারকারী ইতিমধ্যে ব্যবহার করছেন।']);
            }
            $user->email = $email;
        }

        $user->name = trim($validated['name']);
        $user->phone = $phone;
        $user->address = $validated['address'] ? trim($validated['address']) : null;
        $user->save();

        return back()->with('success', 'আপনার প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে।');
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('customer.login')->with('error', 'অনুগ্রহ করে লগইন করুন।');
        }

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'current_password.required' => 'বর্তমান পাসওয়ার্ড প্রদান করুন।',
            'password.required' => 'নতুন পাসওয়ার্ড প্রদান করুন।',
            'password.min' => 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।',
            'password.confirmed' => 'নতুন পাসওয়ার্ড নিশ্চিতকরণ মেলেনি।',
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'আপনার বর্তমান পাসওয়ার্ড সঠিক নয়।']);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return back()->with('success', 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        session()->forget('customer_identifier');

        return redirect()->route('home')->with('success', 'সফলভাবে লগআউট হয়েছে।');
    }

    public function showForgotPassword(Request $request)
    {
        if (Auth::check()) {
            return redirect()->route('customer.account');
        }

        $step = session('pwd_reset_step', 'request');
        $phone = session('pwd_reset_phone');
        $demoOtp = session('pwd_reset_otp');

        return Inertia::render('Storefront/ForgotPassword', [
            'step' => $step,
            'phone' => $phone,
            'demoOtp' => config('app.env') !== 'production' ? $demoOtp : null,
            'meta' => [
                'title' => 'পাসওয়ার্ড রিসেট — পুষ্টি কুঞ্জ',
                'description' => 'আপনার অ্যাকাউন্টের পাসওয়ার্ড রিসেট করুন।',
            ]
        ]);
    }

    public function sendResetOtp(Request $request)
    {
        $validated = $request->validate([
            'phone_or_email' => 'required|string',
        ], [
            'phone_or_email.required' => 'মোবাইল নম্বর অথবা ইমেইল প্রদান করুন।',
        ]);

        $input = trim($validated['phone_or_email']);

        $user = User::where('phone', $input)
            ->orWhere('email', $input)
            ->first();

        if (!$user) {
            return back()->withErrors([
                'phone_or_email' => 'এই মোবাইল নম্বর বা ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।',
            ]);
        }

        // Generate 6 digit numeric OTP
        $otp = (string) rand(100000, 999999);

        session([
            'pwd_reset_user_id' => $user->id,
            'pwd_reset_otp' => $otp,
            'pwd_reset_expires' => now()->addMinutes(15),
            'pwd_reset_phone' => $user->phone ?: $user->email,
            'pwd_reset_step' => 'verify',
        ]);

        // If user has a mobile phone, send SMS
        if ($user->phone) {
            $this->smsService->sendSms(
                $user->phone,
                "পুষ্টি কুঞ্জ: আপনার পাসওয়ার্ড রিসেটের ভেরিফিকেশন কোড (OTP) হলো: {$otp}। কোডটি ১৫ মিনিট কার্যকর থাকবে।",
                'password_reset'
            );
        }

        return redirect()->route('customer.forgot-password')->with('success', 'আপনার নম্বরে ৬-ডিজিটের ভেরিফিকেশন কোড (OTP) পাঠানো হয়েছে।');
    }

    public function verifyAndResetPassword(Request $request)
    {
        $validated = $request->validate([
            'otp' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'otp.required' => 'ওটিপি কোড প্রদান করুন।',
            'password.required' => 'নতুন পাসওয়ার্ড প্রদান করুন।',
            'password.min' => 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।',
            'password.confirmed' => 'পাসওয়ার্ড নিশ্চিতকরণ মেলেনি।',
        ]);

        $userId = session('pwd_reset_user_id');
        $sessionOtp = session('pwd_reset_otp');
        $expires = session('pwd_reset_expires');

        if (!$userId || !$sessionOtp || ($expires && now()->gt($expires))) {
            session()->forget(['pwd_reset_user_id', 'pwd_reset_otp', 'pwd_reset_expires', 'pwd_reset_phone', 'pwd_reset_step']);
            return redirect()->route('customer.forgot-password')->withErrors([
                'otp' => 'ওটিপি ভেরিফিকেশন সেশনের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
            ]);
        }

        if (trim($validated['otp']) !== trim($sessionOtp)) {
            return back()->withErrors([
                'otp' => 'প্রদত্ত ওটিপি (OTP) কোডটি সঠিক নয়। অনুগ্রহ করে পুনরায় চেক করুন।',
            ]);
        }

        $user = User::find($userId);
        if (!$user) {
            return redirect()->route('customer.forgot-password')->withErrors([
                'otp' => 'ব্যবহারকারী পাওয়া যায়নি।',
            ]);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        session()->forget(['pwd_reset_user_id', 'pwd_reset_otp', 'pwd_reset_expires', 'pwd_reset_phone', 'pwd_reset_step']);

        Auth::login($user, true);
        session(['customer_identifier' => $user->phone ?: $user->email]);

        return redirect()->route('customer.account')->with('success', 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে এবং লগইন সম্পন্ন হয়েছে!');
    }

    public function resetForgotPasswordSession()
    {
        session()->forget(['pwd_reset_user_id', 'pwd_reset_otp', 'pwd_reset_expires', 'pwd_reset_phone', 'pwd_reset_step']);
        return redirect()->route('customer.forgot-password');
    }

    public function showForgotPhone()
    {
        return Inertia::render('Storefront/ForgotPhone', [
            'hotline' => SiteSetting::get('contact_phone', '01700-000000'),
            'meta' => [
                'title' => 'ফোন নম্বর ও অ্যাকাউন্ট উদ্ধার — পুষ্টি কুঞ্জ',
                'description' => 'আপনার ব্যবহৃত ফোন নম্বর ভুলে গেছেন? ইমেইল অথবা পূর্বের অর্ডার নম্বর দিয়ে অ্যাকাউন্ট উদ্ধার করুন।',
            ]
        ]);
    }

    public function recoverPhone(Request $request)
    {
        $searchType = $request->input('search_type', 'email'); // 'email' or 'order'

        if ($searchType === 'email') {
            $validated = $request->validate([
                'email' => 'required|email',
            ], [
                'email.required' => 'আপনার ইমেইল ঠিকানা প্রদান করুন।',
                'email.email' => 'সঠিক ইমেইল ফরম্যাট প্রদান করুন।',
            ]);

            $email = trim($validated['email']);
            $user = User::where('email', $email)->first();
            $order = Order::where('customer_email', $email)->orderByDesc('id')->first();

            $phone = $user?->phone ?? $order?->customer_phone;
            $name = $user?->name ?? $order?->customer_name ?? 'সম্মানিত গ্রাহক';

            if (!$phone) {
                return back()->withErrors([
                    'email' => 'এই ইমেইল ঠিকানার সাথে কোনো মোবাইল নম্বর বা অর্ডারের রেকর্ড পাওয়া যায়নি।',
                ]);
            }

            return back()->with('recovered_account', [
                'name' => $name,
                'email' => $email,
                'masked_phone' => $this->maskPhone($phone),
                'raw_phone' => $phone,
                'order_count' => Order::where('customer_phone', $phone)->orWhere('customer_email', $email)->count(),
            ]);
        } else {
            $validated = $request->validate([
                'order_number' => 'required|string',
            ], [
                'order_number.required' => 'অর্ডার নম্বর প্রদান করুন (যেমন: PK-XXXXX)।',
            ]);

            $orderNumber = trim($validated['order_number']);
            $order = Order::where('order_number', $orderNumber)->first();

            if (!$order) {
                return back()->withErrors([
                    'order_number' => 'প্রদত্ত অর্ডার নম্বরের কোনো রেকর্ড পাওয়া যায়নি।',
                ]);
            }

            return back()->with('recovered_account', [
                'name' => $order->customer_name,
                'order_number' => $order->order_number,
                'masked_phone' => $this->maskPhone($order->customer_phone),
                'raw_phone' => $order->customer_phone,
                'order_date' => $order->created_at->format('d M, Y'),
                'order_status' => $order->status,
                'order_total' => $order->grand_total,
            ]);
        }
    }

    protected function maskPhone(?string $phone): string
    {
        if (!$phone || strlen($phone) < 7) {
            return $phone ?: '';
        }
        return substr($phone, 0, 5) . '***' . substr($phone, -3);
    }
}
