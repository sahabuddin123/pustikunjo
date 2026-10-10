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
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $generalSettings = SiteSetting::get('general_settings', []);
        $appearanceSettings = SiteSetting::get('appearance_settings', []);
        $contactSettings = SiteSetting::get('contact_settings', []);

        $siteLogo = !empty($generalSettings['logo'])
            ? $generalSettings['logo']
            : (!empty($appearanceSettings['logo_url']) ? $appearanceSettings['logo_url'] : '/images/logo-white.png');

        // Convert any absolute remote upload domain or broken placeholder to clean relative path
        if (empty($siteLogo) || str_contains($siteLogo, '1789327595_pusti-kunjo-logo.png') || str_contains($siteLogo, 'ChatGPTImage')) {
            $siteLogo = '/images/logo-white.png';
        }

        $siteFavicon = !empty($generalSettings['favicon'])
            ? $generalSettings['favicon']
            : (!empty($appearanceSettings['favicon_url']) ? $appearanceSettings['favicon_url'] : '/favicon.ico');

        $sanitizeUrl = function (?string $url): string {
            if (empty($url)) {
                return '';
            }
            return preg_replace('/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?/i', '', $url);
        };

        $siteLogo = $sanitizeUrl($siteLogo);
        $siteFavicon = $sanitizeUrl($siteFavicon);

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
                'name' => $generalSettings['site_name'] ?? SiteSetting::get('site_name', 'Pusti Kunjo'),
                'tagline' => $generalSettings['tagline'] ?? SiteSetting::get('site_tagline', 'Purity Begins here'),
                'logo' => $siteLogo,
                'favicon' => $siteFavicon,
                'phone' => $contactSettings['phone'] ?? SiteSetting::get('contact_phone', '01700-000000'),
                'whatsapp' => $contactSettings['whatsapp'] ?? SiteSetting::get('contact_whatsapp', '01700000000'),
                'email' => $contactSettings['email'] ?? ($generalSettings['email'] ?? SiteSetting::get('contact_email', 'info@pustikunjo.com.bd')),
                'address' => $contactSettings['address'] ?? 'ঢাকা, বাংলাদেশ',
                'messenger' => $contactSettings['messenger'] ?? 'https://m.me/pustikunjobd',
                'currency' => $generalSettings['currency'] ?? 'BDT',
                'currency_symbol' => $generalSettings['currency_symbol'] ?? '৳',
            ],
            'theme' => array_merge([
                'primary_color' => '#0d6838',
                'primary_hover' => '#0a522c',
                'secondary_color' => '#f59e0b',
                'accent_color' => '#e11d48',
                'light_bg' => '#f0fdf4',
                'font' => 'Li Ador Noirrit',
            ], SiteSetting::get('theme_customizer', []), SiteSetting::get('appearance_settings', [])),
            'seo' => array_merge([
                'indexing_directive' => 'index, follow',
                'meta_title' => 'পুষ্টি কুঞ্জ — খাঁটি অর্গানিক ফুড ও প্রাকৃতিক স্বাস্থ্য পণ্য | Pusti Kunjo',
                'meta_description' => 'পুষ্টি কুঞ্জ (Pusti Kunjo) — বাংলাদেশের বিশ্বস্ত অর্গানিক ফুড ব্র্যান্ড। ১০০% খাঁটি রোজেলা চা, বিটরুট পাউডার, মেথি মিক্স ও প্রাকৃতিক স্বাস্থ্য পণ্য। সারা দেশে ক্যাশ অন ডেলিভারি!',
                'meta_keywords' => 'পুষ্টি কুঞ্জ, Pusti Kunjo, pustikunjo, pustikunjo.com.bd, অর্গানিক ফুড বাংলাদেশ, খাঁটি ভেষজ পণ্য, রোজেলা চা, rosella tea, বিটরুট পাউডার, beetroot powder, মেথি মিক্স, methi mix, চিয়া সিড, chia seeds, প্রাকৃতিক স্বাস্থ্য পণ্য, সুপারফুড',
                'og_image' => '',
                'google_site_verification' => '',
                'bing_site_verification' => '',
                'ga4_measurement_id' => '',
                'google_tag_manager_id' => '',
                'facebook_pixel_id' => '',
            ], SiteSetting::get('seo_settings', [])),
            'navProducts' => fn () => \Illuminate\Support\Facades\Cache::remember('storefront_nav_products', 3600, fn () => Product::storefront()
                ->select('id', 'name', 'slug', 'price', 'sale_price', 'images')
                ->orderBy('id')
                ->get()),
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
            'footer' => array_merge([
                'about_text' => 'পুষ্টি কুঞ্জ একটি নির্ভরযোগ্য স্বাস্থ্য ও অর্গানিক ফুড ব্র্যান্ড। আমাদের লক্ষ্য প্রতিটি পরিবারে খাঁটি পুষ্টি পৌঁছে দেওয়া।',
                'copyright_text' => '© ২০২৬ পুষ্টি কুঞ্জ। সর্বস্বত্ব সংরক্ষিত।',
                'payment_icons' => ['bkash', 'cod'],
            ], ($rawFooter = SiteSetting::get('footer_config', [])), [
                'social_links' => array_merge([
                    'facebook' => $contactSettings['facebook'] ?? 'https://facebook.com',
                    'youtube' => $contactSettings['youtube'] ?? 'https://youtube.com',
                    'instagram' => $contactSettings['instagram'] ?? 'https://instagram.com',
                    'whatsapp' => $contactSettings['whatsapp'] ?? '01700000000',
                ], $rawFooter['social_links'] ?? []),
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
