<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'channel',
        'event_key',
        'name',
        'subject',
        'body',
        'is_active',
        'send_to_admin',
        'admin_recipient',
        'available_tags',
        'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'send_to_admin' => 'boolean',
        'available_tags' => 'array',
    ];

    /**
     * Common tags available across most templates
     */
    public static function defaultOrderTags(): array
    {
        return [
            '{{customer_name}}' => 'গ্রাহকের পুরো নাম (Customer Name)',
            '{{customer_phone}}' => 'গ্রাহকের মোবাইল নম্বর (Phone)',
            '{{customer_email}}' => 'গ্রাহকের ইমেইল (Email)',
            '{{order_number}}' => 'অর্ডার নম্বর যেমন PK-10023 (Order Number)',
            '{{grand_total}}' => 'সর্বমোট মূল্য যেমন ৳১,৫০০ (Grand Total)',
            '{{subtotal}}' => 'সাবটোটাল মূল্য (Subtotal)',
            '{{shipping_fee}}' => 'ডেলিভারি চার্জ (Shipping Fee)',
            '{{items_summary}}' => 'অর্ডারের পণ্য তালিকা (Items List)',
            '{{payment_method}}' => 'পেমেন্ট মেথড যেমন COD / bKash',
            '{{shipping_address}}' => 'ডেলিভারি ঠিকানা (Full Address)',
            '{{status}}' => 'অর্ডার স্ট্যাটাস (Current Status)',
            '{{courier_name}}' => 'কুরিয়ারের নাম (যেমন Steadfast Courier)',
            '{{tracking_code}}' => 'কুরিয়ার ট্র্যাকিং কোড (Tracking Code)',
            '{{track_url}}' => 'লাইভ ট্র্যাকিং লিংক (Track URL)',
            '{{site_name}}' => 'প্রতিষ্ঠানের নাম (পুষ্টি কুঞ্জ)',
            '{{site_url}}' => 'ওয়েবসাইট লিংক',
            '{{support_phone}}' => 'কাস্টমার কেয়ার নম্বর',
            '{{date}}' => 'তারিখ ও সময়',
            '{{reason}}' => 'বাতিল বা পরিবর্তনের কারণ (যদি থাকে)',
        ];
    }

    /**
     * Default Template definitions for initial seeding and reset
     */
    public static function getDefaultTemplates(): array
    {
        return [
            // ================= SMS TEMPLATES =================
            [
                'channel' => 'sms',
                'event_key' => 'order_placed',
                'name' => 'অর্ডার প্লেসড (Order Placed)',
                'description' => 'গ্রাহক ওয়েবসাইট থেকে সফলভাবে অর্ডার প্লেস করলে পাঠানো হবে।',
                'subject' => null,
                'body' => "প্রিয় {{customer_name}}, পুষ্টি কুঞ্জে আপনার অর্ডার {{order_number}} সফলভাবে গ্রহণ করা হয়েছে। মোট মূল্য: {{grand_total}}। ট্র্যাক লিংক: {{track_url}}। ধন্যবাদ!",
                'is_active' => true,
                'send_to_admin' => true,
                'available_tags' => [
                    '{{customer_name}}', '{{order_number}}', '{{grand_total}}', '{{payment_method}}', '{{track_url}}', '{{support_phone}}', '{{site_name}}'
                ],
            ],
            [
                'channel' => 'sms',
                'event_key' => 'order_confirmed',
                'name' => 'অর্ডার নিশ্চিতকরণ (Order Confirmed)',
                'description' => 'এডমিন বা সিস্টেম অর্ডার নিশ্চিত করলে গ্রাহককে এসএমএস যাবে।',
                'subject' => null,
                'body' => "অভিনন্দন {{customer_name}}! আপনার অর্ডার {{order_number}} নিশ্চিত করা হয়েছে। খুব শীঘ্রই পার্সেলটি পাঠানো হবে। পুষ্টি কুঞ্জ-এর সাথে থাকার জন্য ধন্যবাদ।",
                'is_active' => true,
                'send_to_admin' => false,
                'available_tags' => [
                    '{{customer_name}}', '{{order_number}}', '{{grand_total}}', '{{track_url}}', '{{site_name}}'
                ],
            ],
            [
                'channel' => 'sms',
                'event_key' => 'order_shipped',
                'name' => 'কুরিয়ারে হস্তান্তর ও ট্র্যাকিং (Order Shipped)',
                'description' => 'অর্ডার কুরিয়ারে (Steadfast) হস্তান্তর করার সাথে সাথে ট্র্যাকিং কোডসহ পাঠানো হবে।',
                'subject' => null,
                'body' => "প্রিয় {{customer_name}}, আপনার পার্সেল {{order_number}} কুরিয়ারে পাঠানো হয়েছে। কুরিয়ার: {{courier_name}}, ট্র্যাকিং কোড: {{tracking_code}}। লাইভ ট্র্যাক: {{track_url}}",
                'is_active' => true,
                'send_to_admin' => false,
                'available_tags' => [
                    '{{customer_name}}', '{{order_number}}', '{{courier_name}}', '{{tracking_code}}', '{{track_url}}', '{{site_name}}'
                ],
            ],
            [
                'channel' => 'sms',
                'event_key' => 'order_delivered',
                'name' => 'অর্ডার সফল ডেলিভারি (Order Delivered)',
                'description' => 'কুরিয়ার বা ডেলিভারিম্যান পার্সেল সফলভাবে ডেলিভারি করলে পাঠানো হবে।',
                'subject' => null,
                'body' => "প্রিয় {{customer_name}}, আপনার অর্ডার {{order_number}} সফলভাবে ডেলিভারি হয়েছে। পুষ্টি কুঞ্জের খাঁটি পণ্য আপনার ভালো লাগলে অবশ্যই রিভিউ দেবেন। ধন্যবাদ!",
                'is_active' => true,
                'send_to_admin' => false,
                'available_tags' => [
                    '{{customer_name}}', '{{order_number}}', '{{grand_total}}', '{{site_name}}'
                ],
            ],
            [
                'channel' => 'sms',
                'event_key' => 'order_cancelled',
                'name' => 'অর্ডার বাতিল (Order Cancelled)',
                'description' => 'অর্ডারটি কোনো কারণে বাতিল করা হলে গ্রাহককে জানানো হবে।',
                'subject' => null,
                'body' => "প্রিয় {{customer_name}}, আপনার অর্ডার {{order_number}} বাতিল করা হয়েছে। কারণ: {{reason}}। প্রয়োজনে কল করুন: {{support_phone}}। পুষ্টি কুঞ্জ।",
                'is_active' => true,
                'send_to_admin' => false,
                'available_tags' => [
                    '{{customer_name}}', '{{order_number}}', '{{reason}}', '{{support_phone}}', '{{site_name}}'
                ],
            ],
            [
                'channel' => 'sms',
                'event_key' => 'admin_order_alert',
                'name' => 'নতুন অর্ডার এডমিন অ্যালার্ট (Admin New Order Alert)',
                'description' => 'যেকোনো নতুন অর্ডার আসলে এডমিনের মোবাইলে সরাসরি এসএমএস সতর্কবার্তা যাবে।',
                'subject' => null,
                'body' => "[নতুন অর্ডার অ্যালার্ট] অর্ডার নং: {{order_number}}, পরিমাণ: {{grand_total}} ({{payment_method}})। গ্রাহক: {{customer_name}}, ফোন: {{customer_phone}}।",
                'is_active' => true,
                'send_to_admin' => true,
                'available_tags' => [
                    '{{order_number}}', '{{grand_total}}', '{{payment_method}}', '{{customer_name}}', '{{customer_phone}}', '{{shipping_address}}'
                ],
            ],
            [
                'channel' => 'sms',
                'event_key' => 'customer_otp',
                'name' => 'ওটিপি ভেরিফিকেশন কোড (OTP Verification)',
                'description' => 'লগইন বা পাসওয়ার্ড পরিবর্তনের জন্য ওটিপি কোড পাঠাতে ব্যবহৃত হয়।',
                'subject' => null,
                'body' => "পুষ্টি কুঞ্জ ভেরিফিকেশন কোড (OTP) হল: {{otp_code}}। এই কোডটি ৫ মিনিটের জন্য কার্যকর। গোপন রাখুন।",
                'is_active' => true,
                'send_to_admin' => false,
                'available_tags' => [
                    '{{otp_code}}', '{{customer_name}}', '{{site_name}}'
                ],
            ],

            // ================= EMAIL TEMPLATES =================
            [
                'channel' => 'email',
                'event_key' => 'order_placed',
                'name' => 'অর্ডার কনফার্মেশন ইমেইল (Order Confirmation)',
                'description' => 'অর্ডার সফল হলে গ্রাহকের ইমেইলে পূর্ণাঙ্গ অর্ডার সামারি ও রশিদ পাঠানো হবে।',
                'subject' => 'পুষ্টি কুঞ্জ: আপনার অর্ডার {{order_number}} সফলভাবে গৃহীত হয়েছে',
                'body' => "প্রিয় {{customer_name}},<br><br>পুষ্টি কুঞ্জ (Pusti Kunjo)-তে অর্ডার করার জন্য আন্তরিক ধন্যবাদ। আপনার অর্ডার <strong>{{order_number}}</strong> সফলভাবে প্লেস করা হয়েছে।<br><br><strong>অর্ডার বিবরণী:</strong><br>পণ্যসমূহ: {{items_summary}}<br>মোট মূল্য: <strong>{{grand_total}}</strong> (পেমেন্ট: {{payment_method}})<br>ডেলিভারি ঠিকানা: {{shipping_address}}<br><br>আপনি নিচের লিংকে ক্লিক করে যেকোনো সময় লাইভ পার্সেল ট্র্যাকিং দেখতে পারেন:<br><a href=\"{{track_url}}\" style=\"display:inline-block;padding:10px 20px;background:#0d6838;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:15px 0;\">অর্ডার ট্র্যাক করুন</a><br><br>কোনো সহযোগিতার প্রয়োজনে আমাদের হেল্পলাইন <strong>{{support_phone}}</strong> এ যোগাযোগ করুন।<br><br>ধন্যবাদান্তে,<br><strong>পুষ্টি কুঞ্জ পরিবার</strong>",
                'is_active' => true,
                'send_to_admin' => true,
                'available_tags' => [
                    '{{customer_name}}', '{{order_number}}', '{{grand_total}}', '{{subtotal}}', '{{shipping_fee}}', '{{items_summary}}', '{{payment_method}}', '{{shipping_address}}', '{{track_url}}', '{{support_phone}}', '{{site_name}}'
                ],
            ],
            [
                'channel' => 'email',
                'event_key' => 'order_shipped',
                'name' => 'শিপিং ও ট্র্যাকিং ইমেইল (Order Shipped & Dispatched)',
                'description' => 'অর্ডার কুরিয়ারে হ্যান্ডওভার করার পর ট্র্যাকিং কোডসহ গ্রাহককে বিস্তারিত ইমেইল।',
                'subject' => 'আপনার পার্সেল {{order_number}} কুরিয়ারে পাঠানো হয়েছে (Tracking Code: {{tracking_code}})',
                'body' => "প্রিয় {{customer_name}},<br><br>সুসংবাদ! আপনার পুষ্টি কুঞ্জ অর্ডার <strong>{{order_number}}</strong> কুরিয়ার সার্ভিসে হস্তান্তর করা হয়েছে।<br><br><strong>শিপিং তথ্য:</strong><br>কুরিয়ার পার্টনার: <strong>{{courier_name}}</strong><br>ট্র্যাকিং আইডি: <strong>{{tracking_code}}</strong><br><br>পার্সেলটি এখন ট্র্যাকিংয়ের জন্য প্রস্তুত। নিচের বাটনে ক্লিক করে রিয়েল-টাইম রাইডার আপডেট দেখতে পারেন:<br><a href=\"{{track_url}}\" style=\"display:inline-block;padding:10px 20px;background:#0d6838;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:15px 0;\">লাইভ পার্সেল ট্র্যাকিং</a><br><br>ডেলিভারির সময় অনুগ্রহ করে প্রস্তুত থাকুন।<br><br>পুষ্টি কুঞ্জ - ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য",
                'is_active' => true,
                'send_to_admin' => false,
                'available_tags' => [
                    '{{customer_name}}', '{{order_number}}', '{{courier_name}}', '{{tracking_code}}', '{{track_url}}', '{{site_name}}'
                ],
            ],
            [
                'channel' => 'email',
                'event_key' => 'order_delivered',
                'name' => 'ডেলিভারি সফল ইমেইল (Order Delivered)',
                'description' => 'পার্সেল সফলভাবে ডেলিভারি হওয়ার পর ধন্যবাদ বার্তা ও রিভিউ আহ্বান।',
                'subject' => 'আপনার পুষ্টি কুঞ্জ পার্সেল {{order_number}} সফলভাবে ডেলিভারি সম্পন্ন হয়েছে!',
                'body' => "প্রিয় {{customer_name}},<br><br>আপনার অর্ডার <strong>{{order_number}}</strong> সফলভাবে ডেলিভারি সম্পন্ন হয়েছে।<br><br>পুষ্টি কুঞ্জ পরিবারের খাঁটি ও প্রাকৃতিক পণ্য আপনার সুস্থতায় সহযোগী হবে বলে আমরা আশাবাদী। পণ্যটি আপনার কেমন লেগেছে তা জানিয়ে একটি রিভিউ দিতে পারেন।<br><br>পরবর্তী অর্ডারে যেকোনো সহযোগিতার জন্য আমাদের হেল্পলাইন <strong>{{support_phone}}</strong> এ যোগাযোগ করতে পারেন।<br><br>সুস্থ থাকুন, খাঁটি থাকুন।<br><strong>পুষ্টি কুঞ্জ</strong>",
                'is_active' => true,
                'send_to_admin' => false,
                'available_tags' => [
                    '{{customer_name}}', '{{order_number}}', '{{grand_total}}', '{{site_name}}', '{{support_phone}}'
                ],
            ],
            [
                'channel' => 'email',
                'event_key' => 'order_cancelled',
                'name' => 'অর্ডার বাতিল ইমেইল (Order Cancelled)',
                'description' => 'অর্ডার বাতিল হলে কারণ ও পরবর্তী করণীয়সহ বিস্তারিত ইমেইল।',
                'subject' => 'পুষ্টি কুঞ্জ: আপনার অর্ডার {{order_number}} বাতিল করা হয়েছে',
                'body' => "প্রিয় {{customer_name}},<br><br>আপনার অবগতির জন্য জানানো যাচ্ছে যে, পুষ্টি কুঞ্জে আপনার অর্ডার <strong>{{order_number}}</strong> বাতিল করা হয়েছে।<br><br><strong>বাতিল হওয়ার কারণ:</strong> {{reason}}<br><br>যদি আপনি ভুলবশত অর্ডার বাতিল হয়েছে মনে করেন অথবা পুনরায় অর্ডার করতে চান, তবে দয়া করে আমাদের ওয়েবসাইটে ভিজিট করুন অথবা হেল্পলাইন <strong>{{support_phone}}</strong> নম্বরে কল করুন।<br><br>ধন্যবাদ,<br><strong>পুষ্টি কুঞ্জ সাপোর্ট টিম</strong>",
                'is_active' => true,
                'send_to_admin' => false,
                'available_tags' => [
                    '{{customer_name}}', '{{order_number}}', '{{reason}}', '{{support_phone}}', '{{site_name}}'
                ],
            ],
            [
                'channel' => 'email',
                'event_key' => 'admin_order_alert',
                'name' => 'নতুন অর্ডার এডমিন ইমেইল অ্যালার্ট (Admin Order Notification)',
                'description' => 'নতুন অর্ডার প্লেস হলে এডমিন প্যানেল ইমেইলে পূর্ণ বিবরণী পৌঁছাবে।',
                'subject' => '[New Order] {{order_number}} — ৳{{grand_total}} from {{customer_name}}',
                'body' => "<strong>ওয়েবসাইটে নতুন অর্ডার প্লেস হয়েছে!</strong><br><br><strong>অর্ডার আইডি:</strong> {{order_number}}<br><strong>গ্রাহকের নাম:</strong> {{customer_name}}<br><strong>মোবাইল নম্বর:</strong> {{customer_phone}}<br><strong>ইমেইল:</strong> {{customer_email}}<br><strong>ডেলিভারি ঠিকানা:</strong> {{shipping_address}}<br><br><strong>পণ্যসমূহ:</strong><br>{{items_summary}}<br><br><strong>মোট মূল্য:</strong> {{grand_total}} ({{payment_method}})<br><br><a href=\"{{site_url}}/admin/orders\" style=\"display:inline-block;padding:10px 20px;background:#0d6838;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;\">এডমিন প্যানেলে অর্ডার দেখুন</a>",
                'is_active' => true,
                'send_to_admin' => true,
                'available_tags' => [
                    '{{order_number}}', '{{customer_name}}', '{{customer_phone}}', '{{customer_email}}', '{{grand_total}}', '{{items_summary}}', '{{payment_method}}', '{{shipping_address}}', '{{site_url}}'
                ],
            ],
            [
                'channel' => 'email',
                'event_key' => 'customer_welcome',
                'name' => 'গ্রাহক স্বাগতম ইমেইল (Welcome New Customer)',
                'description' => 'নতুন গ্রাহক অ্যাকাউন্ট তৈরি করলে স্বাগতম ইমেইল।',
                'subject' => 'পুষ্টি কুঞ্জে আপনাকে স্বাগতম! সুস্থ থাকুন ১০০% প্রাকৃতিক পুষ্টি পণ্যে',
                'body' => "প্রিয় {{customer_name}},<br><br>পুষ্টি কুঞ্জ (Pusti Kunjo) পরিবারে আপনাকে উষ্ণ স্বাগতম!<br><br>আমরা শতভাগ খাঁটি, প্রাকৃতিক ও ক্যামিক্যালমুক্ত পুষ্টিকর পণ্য গ্রাহকের দোরগোড়ায় পৌঁছে দিতে অঙ্গীকারবদ্ধ। আমাদের ওয়েবসাইট থেকে আপনি সহজেই প্রিমিয়াম বিটরুট পাউডার, প্রিমিয়াম চিয়া সিড ও খাঁটি ঘি অর্ডার করতে পারবেন।<br><br><a href=\"{{site_url}}\" style=\"display:inline-block;padding:10px 20px;background:#0d6838;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;\">শপিং শুরু করুন</a><br><br>আপনার সুস্থতার অভিযাত্রায় আমরা সবসময় আপনার পাশে আছি।<br><br>ধন্যবাদান্তে,<br><strong>পুষ্টি কুঞ্জ পরিবার</strong>",
                'is_active' => true,
                'send_to_admin' => false,
                'available_tags' => [
                    '{{customer_name}}', '{{customer_email}}', '{{site_name}}', '{{site_url}}'
                ],
            ],
        ];
    }

    public static function seedDefaults(): void
    {
        foreach (self::getDefaultTemplates() as $tpl) {
            self::firstOrCreate(
                [
                    'channel' => $tpl['channel'],
                    'event_key' => $tpl['event_key'],
                ],
                $tpl
            );
        }
    }
}

