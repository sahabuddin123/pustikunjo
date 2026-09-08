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
    @endphp

    @if($appFavicon)
        <link rel="icon" type="image/x-icon" href="{{ $appFavicon }}">
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
    @inertia
</body>
</html>
