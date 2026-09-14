<!DOCTYPE html>
<html lang="bn" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Font Preloads & Optimized Asynchronous Google Fonts -->
    <link rel="preload" href="/fonts/LiAdorNoirrit.ttf" as="font" type="font/ttf" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap">
    </noscript>

    @php
        $appGeneral = \App\Models\SiteSetting::get('general_settings', []);
        $appAppearance = \App\Models\SiteSetting::get('appearance_settings', []);
        $appFavicon = $appGeneral['favicon'] ?? '';
        $primaryColor = $appAppearance['primary_color'] ?? '#0d6838';
        $primaryHover = $appAppearance['primary_hover'] ?? '#0a522c';
        $accentColor = $appAppearance['accent_color'] ?? '#f59e0b';
        $lightBg = $appAppearance['light_bg'] ?? '#f0fdf4';

        $appSeo = \App\Models\SiteSetting::get('seo_settings', []);
        $robotsDirective = $appSeo['indexing_directive'] ?? 'index, follow';
        $googleVerification = trim($appSeo['google_site_verification'] ?? '');
        $bingVerification = trim($appSeo['bing_site_verification'] ?? '');
        $ga4Id = trim($appSeo['ga4_measurement_id'] ?? ($appSeo['google_analytics_id'] ?? ''));
        $gtmId = trim($appSeo['google_tag_manager_id'] ?? '');
        $pixelId = trim($appSeo['facebook_pixel_id'] ?? '');
        $defaultMetaKeywords = $appSeo['meta_keywords'] ?? '';

        // Extract Dynamic Page Context from Inertia
        $pageProps = isset($page) && is_array($page) ? ($page['props'] ?? []) : [];
        $pageMeta = $pageProps['meta'] ?? [];
        $rawProduct = $pageProps['product'] ?? null;
        $pageProduct = is_object($rawProduct) ? $rawProduct->toArray() : (is_array($rawProduct) ? $rawProduct : null);
        $rawPost = $pageProps['post'] ?? null;
        $pagePost = is_object($rawPost) ? $rawPost->toArray() : (is_array($rawPost) ? $rawPost : null);
        $siteConfig = $pageProps['siteConfig'] ?? [];
        $siteName = $siteConfig['name'] ?? ($appGeneral['site_name'] ?? 'পুষ্টি কুঞ্জ');

        // Dynamic Title
        $resolvedTitle = null;
        if (!empty($pageMeta['title'])) {
            $resolvedTitle = $pageMeta['title'];
        } elseif (!empty($pageProduct['meta_title'])) {
            $resolvedTitle = $pageProduct['meta_title'];
        } elseif (!empty($pageProduct['name'])) {
            $resolvedTitle = $pageProduct['name'] . ' — ' . $siteName;
        } elseif (!empty($pagePost['title'])) {
            $resolvedTitle = $pagePost['title'] . ' — ' . $siteName;
        } elseif (!empty($appSeo['meta_title'])) {
            $resolvedTitle = $appSeo['meta_title'];
        } else {
            $resolvedTitle = $siteName . ' | ১০০% খাঁটি ও প্রাকৃতিক পুষ্টি পণ্য';
        }

        // Dynamic Description
        $resolvedDescription = null;
        if (!empty($pageMeta['description'])) {
            $resolvedDescription = $pageMeta['description'];
        } elseif (!empty($pageProduct['meta_description'])) {
            $resolvedDescription = $pageProduct['meta_description'];
        } elseif (!empty($pageProduct['short_description'])) {
            $resolvedDescription = strip_tags($pageProduct['short_description']);
        } elseif (!empty($pageProduct['description'])) {
            $resolvedDescription = \Illuminate\Support\Str::limit(strip_tags($pageProduct['description']), 160);
        } elseif (!empty($pagePost['summary'])) {
            $resolvedDescription = $pagePost['summary'];
        } elseif (!empty($appSeo['meta_description'])) {
            $resolvedDescription = $appSeo['meta_description'];
        } else {
            $resolvedDescription = '১০০% প্রাকৃতিক ও অর্গানিক পুষ্টি পণ্যের বিশ্বস্ত প্রতিষ্ঠান।';
        }
        $resolvedDescription = trim(preg_replace('/\s+/', ' ', strip_tags($resolvedDescription)));

        // Dynamic Keywords
        $resolvedKeywords = null;
        if (!empty($pageMeta['keywords'])) {
            $resolvedKeywords = $pageMeta['keywords'];
        } elseif (!empty($pageProduct['meta_keywords'])) {
            $resolvedKeywords = $pageProduct['meta_keywords'];
        } elseif (!empty($pageProduct['name'])) {
            $resolvedKeywords = $siteName . ', ' . $pageProduct['name'] . ', অর্গানিক ফুড বাংলাদেশ, ভেষজ পুষ্টি পণ্য, natural food bd';
        } elseif (!empty($appSeo['meta_keywords'])) {
            $resolvedKeywords = $appSeo['meta_keywords'];
        }

        // Dynamic Image for WhatsApp, Facebook, Social Preview
        $rawOgImage = null;
        if (!empty($pageMeta['ogImage'])) {
            $rawOgImage = $pageMeta['ogImage'];
        } elseif (!empty($pageProduct['og_image'])) {
            $rawOgImage = $pageProduct['og_image'];
        } elseif (!empty($pageProduct['primary_image'])) {
            $rawOgImage = $pageProduct['primary_image'];
        } elseif (!empty($pageProduct['images']) && is_array($pageProduct['images']) && count($pageProduct['images']) > 0) {
            $rawOgImage = $pageProduct['images'][0];
        } elseif (!empty($pagePost['featured_image'])) {
            $rawOgImage = $pagePost['featured_image'];
        } elseif (!empty($appSeo['og_image'])) {
            $rawOgImage = $appSeo['og_image'];
        } elseif (!empty($appGeneral['logo'])) {
            $rawOgImage = $appGeneral['logo'];
        }

        $resolvedOgImage = null;
        if (!empty($rawOgImage)) {
            $resolvedOgImage = (str_starts_with($rawOgImage, 'http://') || str_starts_with($rawOgImage, 'https://'))
                ? $rawOgImage
                : url($rawOgImage);
        }

        $canonicalUrl = url()->current();
        $isProduct = !empty($pageProduct);
    @endphp

    <title>{{ $resolvedTitle }}</title>
    <meta name="title" content="{{ $resolvedTitle }}">
    <meta name="description" content="{{ $resolvedDescription }}">
    @if(!empty($robotsDirective))
        <meta name="robots" content="{{ $robotsDirective }}">
    @endif
    @if(!empty($resolvedKeywords))
        <meta name="keywords" content="{{ $resolvedKeywords }}">
    @endif
    <link rel="canonical" href="{{ $canonicalUrl }}">

    <!-- Open Graph / WhatsApp / Facebook Preview Tags -->
    <meta property="og:site_name" content="{{ $siteName }}">
    <meta property="og:type" content="{{ $isProduct ? 'product' : 'website' }}">
    <meta property="og:title" content="{{ $resolvedTitle }}">
    <meta property="og:description" content="{{ $resolvedDescription }}">
    <meta property="og:url" content="{{ $canonicalUrl }}">
    @if($resolvedOgImage)
        <meta property="og:image" content="{{ $resolvedOgImage }}">
        <meta property="og:image:secure_url" content="{{ $resolvedOgImage }}">
        <meta property="og:image:alt" content="{{ $resolvedTitle }}">
    @endif

    @if($isProduct)
        @php
            $prodPrice = $pageProduct['sale_price'] ?? ($pageProduct['price'] ?? null);
        @endphp
        @if(!empty($prodPrice))
            <meta property="product:price:amount" content="{{ $prodPrice }}">
            <meta property="product:price:currency" content="BDT">
        @endif
        @if(isset($pageProduct['stock']))
            <meta property="product:availability" content="{{ $pageProduct['stock'] > 0 ? 'in stock' : 'out of stock' }}">
        @endif
    @endif

    <!-- Twitter / X Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $resolvedTitle }}">
    <meta name="twitter:description" content="{{ $resolvedDescription }}">
    @if($resolvedOgImage)
        <meta name="twitter:image" content="{{ $resolvedOgImage }}">
    @endif

    <!-- Preload Critical LCP Hero Image for Fast Mobile Paint -->
    @if($isProduct && !empty($resolvedOgImage))
        <link rel="preload" as="image" href="{{ $resolvedOgImage }}" fetchpriority="high">
    @else
        <link rel="preload" as="image" href="/images/banners/rosella-tea-banner.webp" type="image/webp" fetchpriority="high">
    @endif

    @if(!empty($googleVerification))
        @if(str_contains($googleVerification, '<meta'))
            {!! $googleVerification !!}
        @else
            <meta name="google-site-verification" content="{{ $googleVerification }}">
        @endif
    @endif

    @if(!empty($bingVerification))
        @if(str_contains($bingVerification, '<meta'))
            {!! $bingVerification !!}
        @else
            <meta name="msvalidate.01" content="{{ $bingVerification }}">
        @endif
    @endif

    <script>
        window.dataLayer = window.dataLayer || [];
    </script>

    @if(!empty($gtmId))
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{ $gtmId }}');</script>
    <!-- End Google Tag Manager -->
    @endif

    @if(!empty($ga4Id))
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ $ga4Id }}"></script>
    <script>
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '{{ $ga4Id }}');
    </script>
    @endif

    @if(!empty($pixelId))
    <!-- Meta Pixel Code (Deferred for mobile performance) -->
    <script>
    window.addEventListener('DOMContentLoaded', function() {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '{{ $pixelId }}');
        fbq('track', 'PageView');
    });
    </script>
    <!-- End Meta Pixel Code -->
    @endif

    @if($appFavicon)
        <link rel="icon" href="{{ $appFavicon }}">
        <link rel="shortcut icon" href="{{ $appFavicon }}">
        <link rel="apple-touch-icon" href="{{ $appFavicon }}">
    @else
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    @endif

    <!-- Dynamic Theme CSS Variables & Local Font -->
    <style>
        @font-face {
            font-family: 'Li Ador Noirrit';
            src: url('/fonts/LiAdorNoirrit.ttf') format('truetype');
            font-weight: 100 900;
            font-style: normal;
            font-display: swap;
        }
        :root {
            --primary-color: {{ $primaryColor }};
            --primary-hover: {{ $primaryHover }};
            --primary-light: {{ $lightBg }};
            --secondary-color: {{ $accentColor }};
            --accent-color: {{ $accentColor }};
            --font-family: 'Li Ador Noirrit', 'Hind Siliguri', 'Plus Jakarta Sans', sans-serif;
            --container-width: 1280px;
            --radius-btn: 0.5rem;
        }
        body, button, input, select, textarea {
            font-family: var(--font-family);
            -webkit-font-smoothing: antialiased;
        }
    </style>

    @inertiaHead
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="bg-[#F8FAF8] text-gray-800 antialiased selection:bg-[#0d6838] selection:text-white">
    @if(!empty($gtmId))
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmId }}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    @endif

    @if(!empty($pixelId))
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id={{ $pixelId }}&ev=PageView&noscript=1"
    /></noscript>
    @endif

    @inertia
</body>
</html>
