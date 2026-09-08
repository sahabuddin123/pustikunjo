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

        $footer = SiteSetting::get('footer_config', [
            'about_text' => 'পুষ্টি কুঞ্জ একটি নির্ভরযোগ্য স্বাস্থ্য ও অর্গানিক ফুড ব্র্যান্ড। আমাদের লক্ষ্য প্রতিটি পরিবারে খাঁটি পুষ্টি পৌঁছে দেওয়া।',
            'copyright_text' => '© ২০২৬ পুষ্টি কুঞ্জ। সর্বস্বত্ব সংরক্ষিত।',
            'social_links' => [
                'facebook' => 'https://facebook.com',
                'youtube' => 'https://youtube.com',
                'instagram' => 'https://instagram.com',
                'whatsapp' => 'https://wa.me/8801700000000',
            ],
            'payment_icons' => ['bkash', 'cod'],
        ]);

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
            SiteSetting::set('footer_config', $request->input('footer'), 'appearance');
        }

        return back()->with('success', 'হেডার ও ফুটার কনফিগারেশন আপডেট হয়েছে!');
    }
}
