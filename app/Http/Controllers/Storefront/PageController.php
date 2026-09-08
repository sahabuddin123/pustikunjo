<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function contact()
    {
        $contactSettings = SiteSetting::get('contact_settings', [
            'phone' => SiteSetting::get('contact_phone', '09678812525'),
            'whatsapp' => SiteSetting::get('contact_whatsapp', '01700000000'),
            'email' => SiteSetting::get('contact_email', 'info@pustikunjo.com.bd'),
            'address' => 'Level-5, Noor Tower, 110/D/A Uttara C/A, Dhaka 1230',
            'messenger' => 'https://m.me/pustikunjobd',
            'hotline_hours' => '10:00 AM - 10:00 PM',
        ]);

        return Inertia::render('Storefront/Contact', [
            'contact' => $contactSettings,
            'meta' => [
                'title' => 'Contact Us — পুষ্টি কুঞ্জ',
                'description' => 'We value your feedback and are here to assist you. Reach out to our customer service team.',
            ]
        ]);
    }

    public function howToOrder()
    {
        $contactSettings = SiteSetting::get('contact_settings', [
            'phone' => SiteSetting::get('contact_phone', '09678812525'),
            'whatsapp' => SiteSetting::get('contact_whatsapp', '01700000000'),
            'email' => SiteSetting::get('contact_email', 'info@pustikunjo.com.bd'),
            'address' => 'লেভেল-৫, নূর টাওয়ার, ১১০ বীর উত্তম সি আর দত্ত রোড, ঢাকা ১২০৫',
        ]);

        $page = Page::where('slug', 'how-to-order')->first();

        return Inertia::render('Storefront/HowToOrder', [
            'page' => $page,
            'contact' => $contactSettings,
            'meta' => [
                'title' => ($page && $page->meta_title) ? $page->meta_title : 'কীভাবে অর্ডার করবেন — অর্ডার করার সহজ নিয়মাবলী',
                'description' => ($page && $page->meta_description) ? $page->meta_description : 'পুষ্টি কুঞ্জ থেকে পণ্য অর্ডার করার সহজ ৪টি ধাপ, ডেলিভারি চার্জ, ক্যাশ অন ডেলিভারি ও পার্সেল আনবক্সিং সহায়িকা।',
            ]
        ]);
    }

    public function terms()
    {
        $contactSettings = SiteSetting::get('contact_settings', [
            'phone' => SiteSetting::get('contact_phone', '09678812525'),
            'whatsapp' => SiteSetting::get('contact_whatsapp', '01700000000'),
            'email' => SiteSetting::get('contact_email', 'info@pustikunjo.com.bd'),
            'address' => 'লেভেল-৫, নূর টাওয়ার, ১১০ বীর উত্তম সি আর দত্ত রোড, ঢাকা ১২০৫',
        ]);

        $page = Page::where('slug', 'terms')->first();

        return Inertia::render('Storefront/Terms', [
            'page' => $page,
            'contact' => $contactSettings,
            'meta' => [
                'title' => ($page && $page->meta_title) ? $page->meta_title : 'শর্তাবলী ও পলিসিসমূহ (Terms & Conditions) — পুষ্টি কুঞ্জ',
                'description' => ($page && $page->meta_description) ? $page->meta_description : 'পুষ্টি কুঞ্জ ওয়েবসাইট ব্যবহারের সাধারণ শর্তাবলী, অর্ডার, ডেলিভারি, মূল্য ও রিফান্ড সংক্রান্ত বিস্তারিত বিক্রয় নির্দেশিকা।',
            ]
        ]);
    }

    public function show($slug)
    {
        $page = Page::where('slug', $slug)->orWhere('slug', '/' . $slug)->first();

        if (!$page) {
            // Default built-in standard page content fallback
            $titles = [
                'about-us' => 'আমাদের সম্পর্কে (About Us)',
                'contact' => 'যোগাযোগ (Contact Us)',
                'faq' => 'সাধারণ জিজ্ঞাসা (FAQ)',
                'privacy-policy' => 'গোপনীয়তা নীতি (Privacy Policy)',
                'refund-policy' => 'রিফান্ড ও রিটার্ন পলিসি (Refund Policy)',
                'terms' => 'শর্তাবলী (Terms & Conditions)',
            ];

            $page = new Page([
                'title' => $titles[$slug] ?? ucfirst(str_replace('-', ' ', $slug)),
                'slug' => $slug,
                'type' => 'builder',
                'blocks' => [],
            ]);
        }

        return Inertia::render('Storefront/BuilderPage', [
            'page' => $page,
            'meta' => [
                'title' => ($page->meta_title ?: $page->title) . ' — পুষ্টি কুঞ্জ',
                'description' => $page->meta_description ?: 'পুষ্টি কুঞ্জ এর ' . $page->title . ' সম্পর্কিত বিস্তারিত তথ্য।',
                'ogImage' => $page->og_image ?: '/images/og-default.jpg',
            ]
        ]);
    }

    public function handleContactForm(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:100',
            'message' => 'required|string|max:1000',
        ]);

        // In production, can dispatch email/SMS or save inquiry to database
        return back()->with('success', 'আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে! আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।');
    }
}
