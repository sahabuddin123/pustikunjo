<?php

use App\Http\Controllers\Admin\AppearanceController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MarketingController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PageBuilderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SmsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\Storefront\BlogController;
use App\Http\Controllers\Storefront\CheckoutController;
use App\Http\Controllers\Storefront\CustomerAuthController;
use App\Http\Controllers\Storefront\ComplaintController;
use App\Http\Controllers\Storefront\ConsultationController;
use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\OrderTrackingController;
use App\Http\Controllers\Storefront\PageController;
use App\Http\Controllers\Storefront\ProductController;
use App\Http\Controllers\Storefront\ShopController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Storefront Public Routes (Pusti Kunjo)
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/category/{slug}', [ShopController::class, 'category'])->name('category.show');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');
Route::post('/product/{id}/review', [ProductController::class, 'submitReview'])->name('product.review');

// Cart & Checkout
Route::get('/cart', function () {
    return redirect()->route('checkout');
})->name('cart');
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('checkout.process');
Route::post('/api/validate-coupon', [CheckoutController::class, 'validateCoupon'])->name('coupon.validate');
Route::get('/order-success', [CheckoutController::class, 'success'])->name('order.success');

// Order Tracking
Route::get('/track-order', [OrderTrackingController::class, 'index'])->name('order.track');

// Blog
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

// Customer Account & Authentication
Route::get('/login', [CustomerAuthController::class, 'showLogin'])->name('customer.login');
Route::post('/login', [CustomerAuthController::class, 'login'])->name('customer.login.post');
Route::get('/register', [CustomerAuthController::class, 'showRegister'])->name('customer.register');
Route::post('/register', [CustomerAuthController::class, 'register'])->name('customer.register.post');
Route::get('/forgot-password', [CustomerAuthController::class, 'showForgotPassword'])->name('customer.forgot-password');
Route::post('/forgot-password/send-otp', [CustomerAuthController::class, 'sendResetOtp'])->name('customer.forgot-password.send');
Route::post('/forgot-password/reset', [CustomerAuthController::class, 'verifyAndResetPassword'])->name('customer.forgot-password.reset');
Route::get('/forgot-password/restart', [CustomerAuthController::class, 'resetForgotPasswordSession'])->name('customer.forgot-password.restart');
Route::get('/forgot-phone', [CustomerAuthController::class, 'showForgotPhone'])->name('customer.forgot-phone');
Route::post('/forgot-phone/search', [CustomerAuthController::class, 'recoverPhone'])->name('customer.forgot-phone.search');
Route::get('/my-account', [CustomerAuthController::class, 'myAccount'])->name('customer.account');
Route::post('/customer/profile', [CustomerAuthController::class, 'updateProfile'])->name('customer.profile.update');
Route::post('/customer/password', [CustomerAuthController::class, 'updatePassword'])->name('customer.password.update');
Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])->name('customer.logout');

// Marketing & Feeds
Route::get('/feeds/facebook.csv', [FeedController::class, 'facebookCatalog'])->name('feed.facebook');
Route::get('/sitemap.xml', [FeedController::class, 'sitemap'])->name('feed.sitemap');
Route::get('/robots.txt', [FeedController::class, 'robots'])->name('feed.robots');

// Contact Page & Form Handler
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::post('/contact/submit', [PageController::class, 'handleContactForm'])->name('contact.submit');

// How to Order (কীভাবে অর্ডার করবেন)
Route::get('/how-to-order', [PageController::class, 'howToOrder'])->name('how-to-order');
Route::get('/kivabe-order-korben', [PageController::class, 'howToOrder']);
Route::get('/order-process', [PageController::class, 'howToOrder']);

// Terms & Conditions (শর্তাবলী ও পলিসিসমূহ)
Route::get('/terms', [PageController::class, 'terms'])->name('terms');
Route::get('/terms-and-conditions', [PageController::class, 'terms']);
Route::get('/sortaboli', [PageController::class, 'terms']);

// Complaint Module (Customer Complaint Submission & Tracking)
Route::get('/complaint', [ComplaintController::class, 'index'])->name('complaint.index');
Route::post('/complaint', [ComplaintController::class, 'submit'])->name('complaint.submit');

// Nutritionist & Hakim Consultation
Route::get('/consultation', [ConsultationController::class, 'index'])->name('consultation');
Route::get('/nutritionist', [ConsultationController::class, 'index']);
Route::get('/hakim-paramorsho', [ConsultationController::class, 'index']);
Route::post('/consultation/submit', [ConsultationController::class, 'submit'])->name('consultation.submit');

// Clinical Nutrition & Dietary Guide (পুষ্টি চিকিৎসা ও পথ্যের নির্দেশিকা)
Route::get('/nutrition-guide', [ConsultationController::class, 'dietaryGuide'])->name('nutrition.guide');
Route::get('/dietary-guide', [ConsultationController::class, 'dietaryGuide']);
Route::get('/pathya-nirdeshika', [ConsultationController::class, 'dietaryGuide']);

// bKash Callback
Route::match(['get', 'post'], '/payment/bkash/callback', function () {
    return redirect()->route('home')->with('info', 'bKash Callback received.');
})->name('payment.bkash.callback');

/*
|--------------------------------------------------------------------------
| Admin Authentication
|--------------------------------------------------------------------------
*/
Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login'])->name('admin.login.post');
Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout');

/*
|--------------------------------------------------------------------------
| Admin Management Panel
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products & Categories
    Route::resource('products', AdminProductController::class);
    Route::resource('categories', CategoryController::class);

    // Orders
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{id}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
    Route::post('/orders/{id}/verify-payment', [AdminOrderController::class, 'verifyPayment'])->name('orders.verify-payment');
    Route::post('/orders/{id}/reject-payment', [AdminOrderController::class, 'rejectPayment'])->name('orders.reject-payment');
    Route::post('/orders/{id}/resend-sms', [AdminOrderController::class, 'resendSms'])->name('orders.resend-sms');
    Route::post('/orders/{id}/courier', [AdminOrderController::class, 'sendToCourier'])->name('orders.courier');
    Route::post('/orders/{id}/courier-sync', [AdminOrderController::class, 'syncCourier'])->name('orders.courier-sync');
    Route::post('/orders/{id}/blacklist', [AdminOrderController::class, 'toggleBlacklist'])->name('orders.blacklist');
    Route::get('/orders/{id}/invoice', [AdminOrderController::class, 'invoice'])->name('orders.invoice');

    // Customers
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{phone}', [CustomerController::class, 'show'])->name('customers.show');

    // Pages & Builder
    Route::get('/homepage-builder', function () {
        $homePage = \App\Models\Page::where('slug', 'home')->orWhere('slug', '/')->firstOrFail();
        return redirect()->route('admin.pages.edit', $homePage->id);
    })->name('homepage.builder');
    Route::resource('pages', PageBuilderController::class);

    // Appearance
    Route::get('/appearance', [AppearanceController::class, 'index'])->name('appearance.index');
    Route::post('/appearance/theme', [AppearanceController::class, 'updateTheme'])->name('appearance.theme');
    Route::post('/appearance/header-footer', [AppearanceController::class, 'updateHeaderFooter'])->name('appearance.header-footer');

    // Marketing
    Route::get('/marketing', [MarketingController::class, 'index'])->name('marketing.index');
    Route::post('/marketing/integrations', [MarketingController::class, 'updateIntegrations'])->name('marketing.integrations');
    Route::post('/marketing/events', [MarketingController::class, 'updateEvents'])->name('marketing.events');

    // Media Library
    Route::get('/media', [MediaController::class, 'index'])->name('media.index');
    Route::get('/media/api/list', [MediaController::class, 'apiList'])->name('media.api.list');
    Route::post('/media/upload', [MediaController::class, 'upload'])->name('media.upload');
    Route::post('/media/api/upload', [MediaController::class, 'apiUpload'])->name('media.api.upload');
    Route::post('/media/destroy', [MediaController::class, 'destroy'])->name('media.destroy');

    // Blog
    Route::resource('blog', AdminBlogController::class);

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    // SMS Module
    Route::get('/sms', [SmsController::class, 'index'])->name('sms.index');
    Route::post('/sms/config', [SmsController::class, 'updateConfig'])->name('sms.config');
    Route::post('/sms/triggers', [SmsController::class, 'updateTriggers'])->name('sms.triggers');
    Route::post('/sms/test', [SmsController::class, 'sendTestSms'])->name('sms.test');

    // Complaints Management
    Route::get('/complaints', [ComplaintController::class, 'adminIndex'])->name('complaints.index');
    Route::post('/complaints/{id}/status', [ComplaintController::class, 'adminUpdateStatus'])->name('complaints.status');

    // Coupons
    Route::resource('coupons', CouponController::class);

    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    Route::post('/settings/test-courier', [SettingController::class, 'testCourier'])->name('settings.test-courier');
    Route::post('/settings/test-smtp', [SettingController::class, 'testSmtp'])->name('settings.test-smtp');
    Route::post('/settings/test-sms', [SettingController::class, 'testSms'])->name('settings.test-sms');

    // Users & Roles
    Route::resource('users', UserController::class);
});

// Dynamic Storefront Pages (builder driven)
Route::get('/{slug}', [PageController::class, 'show'])->name('page.show')
    ->where('slug', '^[a-zA-Z0-9\-_]+$');
