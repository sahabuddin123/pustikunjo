<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppearanceController extends Controller
{
    public function index()
    {
        $theme = SiteSetting::get('theme_customizer', [
            'primary_color' => '#0d6838',
            'secondary_color' => '#f59e0b',
            'accent_color' => '#e11d48',
            'font' => 'Hind Siliguri',
            'button_radius' => '0.5rem',
            'container_width' => '1280px',
            'logo_url' => '',
            'favicon_url' => '',
            'custom_css' => '',
        ]);

        $header = SiteSetting::get('header_config', [
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
                ['label' => 'আমাদের সম্পর্কে', 'url' => '/about-us'],
                ['label' => 'ব্লগ', 'url' => '/blog'],
                ['label' => 'অর্ডার ট্র্যাক', 'url' => '/track-order'],
                ['label' => 'যোগাযোগ', 'url' => '/contact'],
            ],
        ]);

        $defaultSocial = [
            'facebook' => 'https://facebook.com',
            'youtube' => 'https://youtube.com',
            'instagram' => 'https://instagram.com',
            'whatsapp' => '01700000000',
        ];

        $rawFooter = SiteSetting::get('footer_config', []);
        $footer = array_merge([
            'about_text' => 'পুষ্টি কুঞ্জ একটি নির্ভরযোগ্য স্বাস্থ্য ও অর্গানিক ফুড ব্র্যান্ড। আমাদের লক্ষ্য প্রতিটি পরিবারে খাঁটি পুষ্টি পৌঁছে দেওয়া।',
            'copyright_text' => '© ২০২৬ পুষ্টি কুঞ্জ। সর্বস্বত্ব সংরক্ষিত।',
            'social_links' => $defaultSocial,
            'payment_icons' => ['bkash', 'cod'],
        ], $rawFooter);
        $footer['social_links'] = array_merge($defaultSocial, $rawFooter['social_links'] ?? []);

        return Inertia::render('Admin/Appearance/Index', [
            'theme' => $theme,
            'header' => $header,
            'footer' => $footer,
        ]);
    }

    public function updateTheme(Request $request)
    {
        $validated = $request->validate([
            'primary_color' => 'required|string',
            'secondary_color' => 'required|string',
            'accent_color' => 'required|string',
            'font' => 'required|string',
            'button_radius' => 'required|string',
            'container_width' => 'required|string',
            'logo_url' => 'nullable|string',
            'favicon_url' => 'nullable|string',
            'custom_css' => 'nullable|string',
        ]);

        SiteSetting::set('theme_customizer', $validated, 'appearance');

        return back()->with('success', 'থিম সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    }

    public function updateHeaderFooter(Request $request)
    {
        if ($request->has('header')) {
            SiteSetting::set('header_config', $request->input('header'), 'appearance');
        }
        if ($request->has('footer')) {
            $footerData = $request->input('footer');
            SiteSetting::set('footer_config', $footerData, 'appearance');

            // Sync social links to contact_settings as well
            if (!empty($footerData['social_links']) && is_array($footerData['social_links'])) {
                $contactSettings = SiteSetting::get('contact_settings', []);
                $social = $footerData['social_links'];
                if (!empty($social['whatsapp'])) {
                    $contactSettings['whatsapp'] = $social['whatsapp'];
                }
                if (isset($social['facebook'])) {
                    $contactSettings['facebook'] = $social['facebook'];
                }
                if (isset($social['youtube'])) {
                    $contactSettings['youtube'] = $social['youtube'];
                }
                if (isset($social['instagram'])) {
                    $contactSettings['instagram'] = $social['instagram'];
                }
                SiteSetting::set('contact_settings', $contactSettings, 'contact');
            }
        }

        return back()->with('success', 'হেডার ও ফুটার কনফিগারেশন আপডেট হয়েছে!');
    }
}
