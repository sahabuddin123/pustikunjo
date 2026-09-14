<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'পুষ্টি কুঞ্জ নোটিফিকেশন' }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f7f5;
            color: #2d3748;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            line-height: 1.6;
        }
        .wrapper {
            width: 100%;
            background-color: #f4f7f5;
            padding: 40px 15px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .header {
            background: linear-gradient(135deg, #0d6838 0%, #064e28 100%);
            padding: 30px 25px;
            text-align: center;
            color: #ffffff;
        }
        .logo-text {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: -0.5px;
            margin: 0;
            color: #ffffff;
        }
        .tagline {
            font-size: 12px;
            color: #a7f3d0;
            margin-top: 4px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .content {
            padding: 35px 30px;
            font-size: 15px;
            color: #374151;
            line-height: 1.7;
        }
        .content a {
            color: #0d6838;
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }
        .footer p {
            margin: 4px 0;
        }
        .badge {
            display: inline-block;
            background: #ecfdf5;
            color: #0d6838;
            padding: 4px 12px;
            border-radius: 9999px;
            font-weight: bold;
            font-size: 12px;
            border: 1px solid #a7f3d0;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1 class="logo-text">পুষ্টি কুঞ্জ</h1>
                <div class="tagline">১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য</div>
            </div>

            <!-- Content -->
            <div class="content">
                {!! $content !!}
            </div>

            <!-- Footer -->
            <div class="footer">
                <p><strong>পুষ্টি কুঞ্জ (Pusti Kunjo)</strong> — Purity Begins Here</p>
                <p>হেড অফিস: ফকিরাপুল ১ম লেন, ঢাকা-১০০০ | হেল্পলাইন: {{ $supportPhone ?? '01700-000000' }}</p>
                <p style="margin-top: 10px; font-size: 11px; color: #94a3b8;">
                    এই ইমেইলটি স্বয়ংক্রিয়ভাবে প্রেরিত। অনুগ্রহ করে সরাসরি এই ইমেইলে রিপ্লাই করবেন না।
                </p>
            </div>
        </div>
    </div>
</body>
</html>
