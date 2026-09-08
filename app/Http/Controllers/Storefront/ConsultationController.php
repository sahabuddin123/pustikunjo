<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\ConsultationRequest;
use App\Models\SiteSetting;
use App\Services\Sms\SmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function index()
    {
        $categories = [
            [
                'id' => 'mens-health',
                'number' => '০১',
                'badge' => "MEN'S SEXUAL & GENERAL HEALTH",
                'title' => 'পুরুষদের স্বাস্থ্য ও ভাইটালিটি',
                'description' => 'শারীরিক দুর্বলতা, দ্রুত ক্লান্তিভাব, লো এনার্জি বা পুষ্টিহীনতার সমস্যায় — অভিজ্ঞ হাকিম ও অভিজ্ঞ পুষ্টিবিদের নির্ভরযোগ্য পরামর্শ নিন একদম ফ্রিতে।',
                'tags' => ['শারীরিক দুর্বলতা', "লো এনার্জি", 'পুষ্টিহীনতা", "ঘুমের সমস্যা'],
            ],
            [
                'id' => 'weight-management',
                'number' => '০২',
                'badge' => 'WEIGHT MANAGEMENT & FITNESS',
                'title' => 'ওজন নিয়ন্ত্রণ ও চর্বি কমানোর ডায়েট',
                'description' => 'পেটের অতিরিক্ত চর্বি, মেটাবলিজমের ধীরগতি কিংবা স্বাস্থ্যকর উপায়ে ওজন নিয়ন্ত্রণে রাখার সুষম অর্গানিক ডায়েট গাইডলাইন পান।',
                'tags' => ['পেটের মেদ', 'স্থূলতা', 'ডায়েট চার্ট', 'মেটাবলিজম'],
            ],
            [
                'id' => 'gut-health',
                'number' => '০৩',
                'badge' => 'GUT & DIGESTIVE HEALTH',
                'title' => 'গ্যাস, এসিডিটি ও হজম শক্তি বৃদ্ধি',
                'description' => 'দীর্ঘদিনের এসিডিটি, বুক জ্বালাপোড়া, পেট ফাঁপা ও কোষ্ঠকাঠিন্যের সমস্যা থেকে মুক্তি পেতে প্রাকৃতিক খাদ্যাভ্যাস ও ভেষজ সমাধান।',
                'tags' => ['গ্যাস/এসিডিটি', 'কোষ্ঠকাঠিন্য', 'আইবিএস (IBS)', 'বদহজম'],
            ],
            [
                'id' => 'womens-health',
                'number' => '০৪',
                'badge' => "WOMEN'S HEALTH & WELLNESS",
                'title' => 'মহিলাদের পুষ্টি ও হরমোনাল ব্যালেন্স',
                'description' => 'রক্তস্বল্পতা, ক্যালসিয়ামের ঘাটতি, হরমোনাল ভারসাম্য ও ত্বকের প্রাকৃতিক লাবণ্য বজায় রাখার বিজ্ঞানসম্মত পুষ্টি পরামর্শ।',
                'tags' => ['রক্তস্বল্পতা', 'হরমোনাল ব্যালেন্স', 'ক্লান্তিভাব', 'ত্বক ও চুলের যত্ন'],
            ],
            [
                'id' => 'general-nutrition',
                'number' => '০৫',
                'badge' => 'HOLISTIC NUTRITION & DIABETES',
                'title' => 'ডায়াবেটিস নিয়ন্ত্রণ ও সাধারণ সুস্বাস্থ্য',
                'description' => 'প্রাকৃতিক অ্যান্টিঅক্সিডেন্ট ও সুপারফুড এর সাহায্যে ডায়াবেটিস নিয়ন্ত্রণ, উচ্চ রক্তচাপ প্রতিরোধ ও রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করুন।',
                'tags' => ['ব্লাড সুগার', 'রোগ প্রতিরোধ ক্ষমতা', 'অর্গানিক খাবার', 'লিভার কেয়ার'],
            ],
        ];

        return Inertia::render('Storefront/NutritionistConsultation', [
            'categories' => $categories,
            'hotline' => SiteSetting::get('contact_phone', '09678812525'),
            'whatsapp' => SiteSetting::get('contact_whatsapp', '01700000000'),
            'meta' => [
                'title' => 'পুষ্টিবিদের পরামর্শ — পুষ্টি কুঞ্জ',
                'description' => 'অভিজ্ঞ পুষ্টিবিদ ও হাকিম এর কাছ থেকে আপনার স্বাস্থ্য সমস্যা অনুযায়ী বিনামূল্যে সঠিক ডায়েট ও পুষ্টি পরামর্শ নিন।',
            ]
        ]);
    }

    /**
     * Nutrition & Dietary Therapy Guidelines (পুষ্টি চিকিৎসা ও পথ্যের নির্দেশিকা)
     */
    public function dietaryGuide()
    {
        return Inertia::render('Storefront/DietaryGuide', [
            'hotline' => SiteSetting::get('contact_phone', '01700-000000'),
            'whatsapp' => SiteSetting::get('contact_whatsapp', '01700000000'),
            'meta' => [
                'title' => 'পুষ্টি চিকিৎসা ও পথ্যের নির্দেশিকা — বিভিন্ন রোগের পথ্য ও রোগ নিয়ন্ত্রণ তালিকা | পুষ্টি কুঞ্জ',
                'description' => 'ডায়াবেটিস, ফ্যাটি লিভার, কিডনি, হৃদরোগ, গ্যাস্ট্রিক, উচ্চ রক্তচাপ ও অন্যান্য শারীরিক সমস্যার সঠিক পথ্য ও বর্জনীয়-গ্রহণীয় খাবারের বিজ্ঞানসম্মত নির্দেশিকা।',
            ]
        ]);
    }

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'phone' => 'required|string|max:20',
            'category' => 'required|string|max:100',
            'age' => 'nullable|numeric|min:1|max:120',
            'gender' => 'nullable|string|in:male,female,other',
            'height' => 'nullable|string|max:50',
            'weight' => 'nullable|string|max:50',
            'problem_details' => 'required|string|min:5|max:2000',
            'contact_method' => 'nullable|string|in:whatsapp,phone_call',
        ], [
            'name.required' => 'আপনার নাম প্রদান করুন।',
            'phone.required' => 'মোবাইল নম্বর প্রদান করুন।',
            'category.required' => 'সমস্যার ক্যাটাগরি নির্বাচন করুন।',
            'problem_details.required' => 'আপনার সমস্যার বিবরণ লিখুন।',
            'problem_details.min' => 'সমস্যার বিবরণ বিস্তারিতভাবে লিখুন।',
        ]);

        $consultation = ConsultationRequest::create([
            'name' => trim($validated['name']),
            'phone' => trim($validated['phone']),
            'category' => $validated['category'],
            'age' => !empty($validated['age']) ? (int) $validated['age'] : null,
            'gender' => $validated['gender'] ?? null,
            'height' => $validated['height'] ?? null,
            'weight' => $validated['weight'] ?? null,
            'problem_details' => trim($validated['problem_details']),
            'contact_method' => $validated['contact_method'] ?? 'whatsapp',
            'status' => 'pending',
        ]);

        // Send confirmation SMS if SMS service is active
        try {
            $this->smsService->sendSms(
                $consultation->phone,
                "পুষ্টি কুঞ্জ: সম্মানিত {$consultation->name}, আপনার পুষ্টিবিদের পরামর্শের আবেদনটি গৃহীত হয়েছে। শীঘ্রই আমাদের অভিজ্ঞ পুষ্টিবিদ আপনার সাথে যোগাযোগ করবেন।",
                'consultation_received'
            );
        } catch (\Exception $e) {
            // Ignore SMS failures gracefully
        }

        return back()->with('success', 'আপনার পরামর্শের আবেদনটি সফলভাবে গৃহীত হয়েছে! আমাদের বিশেষজ্ঞ পুষ্টিবিদ খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।');
    }
}
