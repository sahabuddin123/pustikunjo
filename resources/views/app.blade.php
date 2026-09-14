<!DOCTYPE html>
<html lang="bn" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Google Fonts: Hind Siliguri & Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

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
    @endphp

    @if(!empty($robotsDirective))
        <meta name="robots" content="{{ $robotsDirective }}">
    @endif

    @if(!empty($appSeo['meta_description']))
        <meta name="description" content="{{ $appSeo['meta_description'] }}">
    @endif

    @if(!empty($defaultMetaKeywords))
        <meta name="keywords" content="{{ $defaultMetaKeywords }}">
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
    <!-- Meta Pixel Code -->
    <script>
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
        @font-face {
            font-family: 'Li Ador';
            src: url('/fonts/LiAdorNoirrit.ttf') format('truetype');
            font-weight: 100 900;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'Le Ador';
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
            --font-family: 'Li Ador Noirrit', 'Li Ador', 'Le Ador', 'Hind Siliguri', 'Plus Jakarta Sans', sans-serif;
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
