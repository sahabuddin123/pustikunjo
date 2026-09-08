<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'phone' => $request->user()->phone,
                    'address' => $request->user()->address,
                    'role' => $request->user()->role,
                ] : null,
                'customer_identifier' => $request->session()->get('customer_identifier'),
            ],
            'siteConfig' => [
                'name' => SiteSetting::get('general_settings')['site_name'] ?? SiteSetting::get('site_name', 'Pusti Kunjo'),
                'tagline' => SiteSetting::get('general_settings')['tagline'] ?? SiteSetting::get('site_tagline', 'Purity Begins here'),
                'logo' => SiteSetting::get('general_settings')['logo'] ?? '',
                'favicon' => SiteSetting::get('general_settings')['favicon'] ?? '',
                'phone' => SiteSetting::get('contact_settings')['phone'] ?? SiteSetting::get('contact_phone', '01700-000000'),
                'whatsapp' => SiteSetting::get('contact_settings')['whatsapp'] ?? SiteSetting::get('contact_whatsapp', '01700000000'),
                'email' => SiteSetting::get('contact_settings')['email'] ?? SiteSetting::get('general_settings')['email'] ?? SiteSetting::get('contact_email', 'info@pustikunjo.com.bd'),
                'address' => SiteSetting::get('contact_settings')['address'] ?? 'ঢাকা, বাংলাদেশ',
                'currency' => SiteSetting::get('general_settings')['currency'] ?? 'BDT',
                'currency_symbol' => SiteSetting::get('general_settings')['currency_symbol'] ?? '৳',
            ],
            'theme' => array_merge([
                'primary_color' => '#0d6838',
                'primary_hover' => '#0a522c',
                'secondary_color' => '#f59e0b',
                'accent_color' => '#e11d48',
                'light_bg' => '#f0fdf4',
                'font' => 'Li Ador Noirrit',
            ], SiteSetting::get('theme_customizer', []), SiteSetting::get('appearance_settings', [])),
            'seo' => SiteSetting::get('seo_settings', [
                'meta_title' => 'পুষ্টি কুঞ্জ | ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য',
                'meta_description' => '১০০% প্রাকৃতিক ও অর্গানিক পুষ্টি পণ্যের বিশ্বস্ত প্রতিষ্ঠান।',
                'og_image' => '',
            ]),
            'navProducts' => fn () => Product::where('is_active', true)
                ->select('id', 'name', 'slug', 'price', 'sale_price', 'primary_image', 'images')
                ->orderBy('id')
                ->get(),
            'header' => SiteSetting::get('header_config', [
                'announcement_bar' => [
                    'enabled' => true,
                    'text' => '🌿 ১০০% প্রাকৃতিক ও স্বাস্থ্যসম্মত খাঁটি পণ্য — সারা দেশে ক্যাশ অন ডেলিভারি!',
                    'bg_color' => '#07381e',
                    'text_color' => '#ffffff',
                ],
                'sticky_header' => true,
                'hotline_phone' => '01700-000000',
                'menu_items' => [
                    ['label' => 'হোম', 'url' => '/'],
                    ['label' => 'শপ', 'url' => '/shop'],
                    ['label' => 'পুষ্টিবিদের পরামর্শ', 'url' => '/consultation'],
                    ['label' => 'পথ্য নির্দেশিকা', 'url' => '/nutrition-guide'],
                    ['label' => 'আমাদের সম্পর্কে', 'url' => '/about-us'],
                    ['label' => 'ব্লগ', 'url' => '/blog'],
                    ['label' => 'অর্ডার ট্র্যাক', 'url' => '/track-order'],
                    ['label' => 'যোগাযোগ', 'url' => '/contact'],
                ],
            ]),
            'footer' => SiteSetting::get('footer_config', [
                'about_text' => 'পুষ্টি কুঞ্জ একটি নির্ভরযোগ্য স্বাস্থ্য ও অর্গানিক ফুড ব্র্যান্ড। আমাদের লক্ষ্য প্রতিটি পরিবারে খাঁটি পুষ্টি পৌঁছে দেওয়া।',
                'copyright_text' => '© ২০২৬ পুষ্টি কুঞ্জ। সর্বস্বত্ব সংরক্ষিত।',
                'social_links' => [
                    'facebook' => 'https://facebook.com',
                    'youtube' => 'https://youtube.com',
                    'instagram' => 'https://instagram.com',
                    'whatsapp' => 'https://wa.me/8801700000000',
                ],
                'payment_icons' => ['bkash', 'cod'],
            ]),
            'marketing' => [
                'integrations' => SiteSetting::get('marketing_integrations', []),
                'events' => SiteSetting::get('marketing_events', []),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
