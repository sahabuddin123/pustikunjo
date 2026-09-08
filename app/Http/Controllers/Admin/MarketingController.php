<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketingController extends Controller
{
    public function index()
    {
        $integrations = SiteSetting::get('marketing_integrations', [
            'gtm_enabled' => false,
            'gtm_container_id' => '',
            'ga4_enabled' => false,
            'ga4_measurement_id' => '',
            'fb_pixel_enabled' => false,
            'fb_pixel_id' => '',
            'fb_catalog_enabled' => true,
            'tiktok_pixel_enabled' => false,
            'tiktok_pixel_id' => '',
            'gsc_verification' => '',
            'bing_verification' => '',
        ]);

        $events = SiteSetting::get('marketing_events', [
            ['name' => 'page_view', 'label' => 'Page View', 'ga4' => true, 'pixel' => 'PageView'],
            ['name' => 'view_item_list', 'label' => 'View Catalog/List', 'ga4' => true, 'pixel' => 'ViewContent'],
            ['name' => 'view_item', 'label' => 'View Product (PDP)', 'ga4' => true, 'pixel' => 'ViewContent'],
            ['name' => 'add_to_cart', 'label' => 'Add to Cart', 'ga4' => true, 'pixel' => 'AddToCart'],
            ['name' => 'begin_checkout', 'label' => 'Begin Checkout', 'ga4' => true, 'pixel' => 'InitiateCheckout'],
            ['name' => 'purchase', 'label' => 'Purchase', 'ga4' => true, 'pixel' => 'Purchase'],
            ['name' => 'search', 'label' => 'Search Query', 'ga4' => true, 'pixel' => 'Search'],
            ['name' => 'contact_click', 'label' => 'Contact/WhatsApp Click', 'ga4' => true, 'pixel' => 'Contact'],
        ]);

        return Inertia::render('Admin/Marketing/Index', [
            'integrations' => $integrations,
            'events' => $events,
            'catalogFeedUrl' => url('/feeds/facebook.csv'),
        ]);
    }

    public function updateIntegrations(Request $request)
    {
        $data = $request->input('integrations', []);
        SiteSetting::set('marketing_integrations', $data, 'marketing');

        return back()->with('success', 'মার্কেটিং ইন্টিগ্রেশন সেটিংস সংরক্ষিত হয়েছে!');
    }

    public function updateEvents(Request $request)
    {
        $data = $request->input('events', []);
        SiteSetting::set('marketing_events', $data, 'marketing');

        return back()->with('success', 'ইভেন্ট ট্র্যাকিং সেটিংস আপডেট হয়েছে!');
    }
}
