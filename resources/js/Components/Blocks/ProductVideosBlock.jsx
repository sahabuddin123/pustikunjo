import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
    Eye,
    Play,
    Pause,
    X,
    Volume2,
    VolumeX,
    Maximize,
    Tv,
    Smartphone,
    Leaf,
    ShoppingBag,
} from 'lucide-react';

const sanitizeImageUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    return url.replace(/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?/i, '');
};

export default function ProductVideosBlock({ data = {} }) {
    const heading = data.heading || 'Product Videos';
    const [activeVideoModal, setActiveVideoModal] = useState(null);

    // Default 3 video reels + 3 promotional cards matching home_dektop.jpg reference
    const defaultItems = [
        {
            id: 1,
            poster: '/uploads/1789723597_ChatGPT_Image_Sep_11__2026__08_04_06_PM.webp',
            videoUrl: data.video_1_url || 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-in-a-park-41315-large.mp4',
            promoBanner: '/uploads/1789579454_ChatGPTImageSep11202608_15_15PM.webp',
            thumb: '/uploads/1789579454_ChatGPTImageSep11202608_15_15PM.webp',
            title: 'Spray Dried Beetroot',
            fullTitle: 'Spray Dried Beetroot Powder',
            price: '৳ ৩৯০.০০',
            productUrl: '/product/beetroot-powder',
            alt: 'Spray Dried Beetroot Powder Video Review & Promo',
        },
        {
            id: 2,
            poster: '/uploads/1789723623_ChatGPT_Image_Sep_11__2026__08_04_13_PM.webp',
            videoUrl: data.video_2_url || 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-41712-large.mp4',
            promoBanner: '/uploads/1789579439_ChatGPTImageSep11202608_15_50PM.webp',
            thumb: '/uploads/1789579439_ChatGPTImageSep11202608_15_50PM.webp',
            title: 'Pure Herbal Methi Mix',
            fullTitle: 'Pure Herbal Methi Mix',
            price: '৳ ৭৮০.০০',
            productUrl: '/product/methi-mix',
            alt: 'Pure Herbal Methi Mix Video Review & Promo',
        },
        {
            id: 3,
            poster: '/uploads/1789723673_ChatGPT_Image_Sep_11__2026__08_04_20_PM.webp',
            videoUrl: data.video_3_url || 'https://assets.mixkit.co/videos/preview/mixkit-woman-recording-a-vlog-with-her-phone-41314-large.mp4',
            promoBanner: '/uploads/1789579366_rosella-tea.webp',
            thumb: '/uploads/1789579366_rosella-tea.webp',
            title: 'Organic Rosella Tea',
            fullTitle: 'Organic Rosella Herbal Tea',
            price: '৳ ৮৫০.০০',
            productUrl: '/product/rosella-tea',
            alt: 'Organic Rosella Tea Video Review & Promo',
        },
    ];

    const rawItems = (data.items && Array.isArray(data.items) && data.items.length > 0)
        ? data.items
        : defaultItems;

    const items = rawItems.map((item, idx) => {
        const defaultItem = defaultItems[idx] || defaultItems[0];
        const fallbackPoster = defaultItem.poster;
        const fallbackPromo = defaultItem.promoBanner;

        const poster = sanitizeImageUrl(item.poster) || fallbackPoster;
        const promoBanner = sanitizeImageUrl(item.promoBanner) || fallbackPromo;
        const thumb = sanitizeImageUrl(item.thumb) || promoBanner;

        return {
            ...defaultItem,
            ...item,
            poster,
            promoBanner,
            thumb,
            fallbackPoster,
            fallbackPromo,
        };
    });

    return (
        <section className="w-full bg-white py-10 sm:py-14 select-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Section Title with green accent underline matching Best Seller */}
                <div className="text-center mb-7 sm:mb-9">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-sans inline-block relative">
                        {heading}
                        <span className="block w-10 sm:w-12 h-1 bg-[#0B3E25] mx-auto mt-2 rounded-full" />
                    </h2>
                </div>

                {/* Grid of 3 Columns: Video on top, Promotional Card on bottom */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
                    {items.map((item, idx) => (
                        <div key={item.id} className="flex flex-col gap-4 sm:gap-7">
                            {/* TOP: Vertical Reel Video Card */}
                            <div
                                onClick={() => setActiveVideoModal(item)}
                                className="relative aspect-[9/13] sm:aspect-[212/368] w-full rounded-2xl overflow-hidden bg-black shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-100"
                            >
                                <img
                                    src={item.poster}
                                    alt={item.alt}
                                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                                    loading="lazy"
                                    onError={(e) => {
                                        if (item.fallbackPoster && e.currentTarget.src !== item.fallbackPoster && !e.currentTarget.src.endsWith(item.fallbackPoster)) {
                                            e.currentTarget.src = item.fallbackPoster;
                                        }
                                    }}
                                />

                                {/* Play Icon Overlay (visible on mobile so users know it's a video) */}
                                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-black/40 sm:bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                                        <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM: Promotional Banner Card with Product Strip */}
                            <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 bg-white flex flex-col group">
                                {/* Square Promotional Banner Graphic */}
                                <Link
                                    href={item.productUrl}
                                    className="block aspect-square w-full overflow-hidden bg-gray-50"
                                >
                                    <img
                                        src={item.promoBanner}
                                        alt={item.fullTitle}
                                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                                        loading="lazy"
                                        onError={(e) => {
                                            if (item.fallbackPromo && e.currentTarget.src !== item.fallbackPromo && !e.currentTarget.src.endsWith(item.fallbackPromo)) {
                                                e.currentTarget.src = item.fallbackPromo;
                                            }
                                        }}
                                    />
                                </Link>

                                {/* Product Info Strip */}
                                <div className="p-3 sm:p-3.5 bg-white flex items-center justify-between gap-3 border-t border-gray-100">
                                    <Link
                                        href={item.productUrl}
                                        className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity"
                                    >
                                        {/* Product Thumbnail */}
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 p-0.5">
                                            <img
                                                src={item.thumb}
                                                alt={item.title}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Name and Price */}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 truncate leading-tight">
                                                {item.title}
                                            </p>
                                            <p className="text-xs sm:text-sm font-bold text-[#0B3E25] mt-0.5">
                                                {item.price}
                                            </p>
                                        </div>
                                    </Link>

                                    {/* View Product (Eye Icon) Action Button */}
                                    <Link
                                        href={item.productUrl}
                                        aria-label={`${item.fullTitle} দেখুন`}
                                        className="w-8 h-8 rounded-full bg-black hover:bg-[#0B3E25] text-white flex items-center justify-center transition-colors duration-200 shrink-0 shadow-xs"
                                        title="পণ্যটি দেখুন"
                                    >
                                        <Eye className="w-4 h-4 text-white" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Player Modal */}
            {activeVideoModal && (
                <BrandVideoModal
                    item={activeVideoModal}
                    onClose={() => setActiveVideoModal(null)}
                />
            )}
        </section>
    );
}

function BrandVideoModal({ item, onClose }) {
    const videoUrl = (item.videoUrl || '').trim();

    // Check if YouTube
    const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/i);
    const ytId = ytMatch ? ytMatch[1] : null;
    const isShortByDefault = videoUrl.includes('/shorts/');

    // Default to widescreen 16:9 for regular YouTube/MP4, and 9:16 for Shorts
    const [isVertical, setIsVertical] = useState(isShortByDefault);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showCenterIcon, setShowCenterIcon] = useState(null);
    const [showControls, setShowControls] = useState(true);

    const iframeRef = useRef(null);
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // Send command to YouTube iframe via postMessage
    const sendYtCommand = (func, args = []) => {
        try {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func, args }),
                    '*'
                );
            }
        } catch (e) {
            // ignore
        }
    };

    // Toggle Play/Pause
    const togglePlay = () => {
        if (ytId) {
            if (isPlaying) {
                sendYtCommand('pauseVideo');
                setIsPlaying(false);
                triggerCenterAnimation('pause');
            } else {
                sendYtCommand('playVideo');
                setIsPlaying(true);
                triggerCenterAnimation('play');
            }
        } else if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
                triggerCenterAnimation('play');
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
                triggerCenterAnimation('pause');
            }
        }
    };

    // Toggle Mute/Unmute
    const toggleMute = () => {
        if (ytId) {
            if (isMuted) {
                sendYtCommand('unMute');
                setIsMuted(false);
            } else {
                sendYtCommand('mute');
                setIsMuted(true);
            }
        } else if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    // Center icon pulse feedback
    const triggerCenterAnimation = (type) => {
        setShowCenterIcon(type);
        setTimeout(() => setShowCenterIcon(null), 650);
    };

    // Fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    };

    // Handle user seeking on progress track
    const handleSeek = (e) => {
        if (!duration || duration <= 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = pct * duration;
        setCurrentTime(newTime);

        if (ytId) {
            sendYtCommand('seekTo', [newTime, true]);
        } else if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    // Fade controls on idle
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3200);
    };

    // Keyboard shortcuts: Space for play/pause, M for mute, Esc for close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === ' ') {
                e.preventDefault();
                togglePlay();
            }
            if (e.key === 'm' || e.key === 'M') {
                toggleMute();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, isMuted]);

    // Listen to YouTube API infoDelivery messages
    useEffect(() => {
        const handleMessage = (e) => {
            try {
                const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
                if (data?.event === 'infoDelivery' && data?.info) {
                    if (typeof data.info.currentTime === 'number') {
                        setCurrentTime(data.info.currentTime);
                    }
                    if (typeof data.info.duration === 'number' && data.info.duration > 0) {
                        setDuration(data.info.duration);
                    }
                    if (typeof data.info.playerState === 'number') {
                        // 1: PLAYING, 2: PAUSED, 0: ENDED
                        if (data.info.playerState === 1) setIsPlaying(true);
                        if (data.info.playerState === 2) setIsPlaying(false);
                        if (data.info.playerState === 0) {
                            setIsPlaying(false);
                            setCurrentTime(0);
                        }
                    }
                }
            } catch (err) {
                // non-json message, ignore
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Local ticker when playing YouTube to keep progress bar moving smoothly
    useEffect(() => {
        if (!ytId || !isPlaying) return;
        const interval = setInterval(() => {
            setCurrentTime((prev) => {
                if (duration > 0 && prev >= duration) return duration;
                return prev + 0.5;
            });
        }, 500);
        return () => clearInterval(interval);
    }, [ytId, isPlaying, duration]);

    // HTML5 Video events
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onTimeUpdate = () => setCurrentTime(v.currentTime);
        const onLoadedMetadata = () => setDuration(v.duration);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);

        v.addEventListener('timeupdate', onTimeUpdate);
        v.addEventListener('loadedmetadata', onLoadedMetadata);
        v.addEventListener('play', onPlay);
        v.addEventListener('pause', onPause);
        v.addEventListener('ended', onEnded);

        return () => {
            v.removeEventListener('timeupdate', onTimeUpdate);
            v.removeEventListener('loadedmetadata', onLoadedMetadata);
            v.removeEventListener('play', onPlay);
            v.removeEventListener('pause', onPause);
            v.removeEventListener('ended', onEnded);
        };
    }, [videoRef.current]);

    // Format seconds to mm:ss
    const formatTime = (secs) => {
        if (!secs || isNaN(secs) || secs <= 0) return '0:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

    // Zero YouTube Branding Embed URL with enablejsapi
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const embedUrl = ytId
        ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`
        : null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
            onClick={onClose}
        >
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full ${
                    isVertical
                        ? 'max-w-sm sm:max-w-md aspect-[9/16] max-h-[88vh]'
                        : 'max-w-3xl sm:max-w-4xl aspect-video max-h-[85vh]'
                } bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 flex items-center justify-center group`}
            >
                {/* 1. TOP BRANDED MASK HEADER (Overlaps and hides YouTube top title & channel bar) */}
                <div
                    className={`absolute top-0 inset-x-0 z-30 px-4 py-3 bg-gradient-to-b from-black/95 via-black/80 to-transparent flex items-center justify-between transition-opacity duration-300 ${
                        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <div className="flex items-center gap-2.5 min-w-0 pr-4">
                        <div className="w-7 h-7 rounded-full bg-[#0B3E25] flex items-center justify-center shrink-0 border border-emerald-400/30">
                            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 block leading-tight">
                                পুষ্টি কুঞ্জ • PUSTI KUNJO
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow-sm">
                                {item.fullTitle || item.title}
                            </h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Aspect Ratio Switcher (Reel 9:16 vs Landscape 16:9) */}
                        <button
                            type="button"
                            onClick={() => setIsVertical(!isVertical)}
                            title={isVertical ? 'ওয়াইডস্ক্রিন মোড (16:9)' : 'ভার্টিক্যাল রিল মোড (9:16)'}
                            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                        >
                            {isVertical ? <Tv className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                        </button>

                        {/* Close Modal Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            aria-label="বন্ধ করুন"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 2. THE VIDEO / IFRAME PLAYER (Scales out YouTube header & footer watermarks) */}
                <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
                    {embedUrl ? (
                        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                            {/* scale-[1.28] expands the YouTube iframe inside overflow-hidden, clipping off YouTube's top title bar and bottom related videos */}
                            <iframe
                                ref={iframeRef}
                                src={embedUrl}
                                title={item.fullTitle || item.title}
                                className={`w-full h-full border-0 pointer-events-none transform origin-center transition-transform duration-300 ${
                                    isVertical ? 'scale-[1.32]' : 'scale-[1.25]'
                                }`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            poster={item.poster}
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    )}

                    {/* 3. CLICK-TO-PLAY/PAUSE TRANSPARENT OVERLAY (Intercepts clicks so user cannot click YouTube watermark/links) */}
                    <div
                        onClick={togglePlay}
                        onDoubleClick={toggleFullscreen}
                        className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center"
                    >
                        {/* Center Animated Play/Pause Feedback Icon */}
                        {showCenterIcon && (
                            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition-all animate-pulse">
                                {showCenterIcon === 'play' ? (
                                    <Play className="w-8 h-8 fill-current ml-1 text-emerald-400" />
                                ) : (
                                    <Pause className="w-8 h-8 fill-current text-white" />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. BOTTOM BRANDED CONTROLS BAR (Zero YouTube Branding, Full Pusti Kunjo Experience) */}
                <div
                    className={`absolute bottom-0 inset-x-0 z-30 px-4 py-3 bg-gradient-to-t from-black/95 via-black/85 to-transparent flex flex-col gap-2.5 transition-opacity duration-300 ${
                        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    {/* Scrubbable Timeline Track */}
                    <div
                        className="w-full flex items-center gap-2 group/scrub cursor-pointer py-1"
                        onClick={handleSeek}
                    >
                        <div className="relative flex-1 h-1.5 group-hover/scrub:h-2 bg-white/20 rounded-full overflow-hidden transition-all">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-100"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-mono text-gray-300 tabular-nums shrink-0">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    {/* Button Row */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {/* Play/Pause Button */}
                            <button
                                type="button"
                                onClick={togglePlay}
                                className="w-8 h-8 rounded-full bg-[#0B3E25] hover:bg-emerald-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                                aria-label={isPlaying ? 'পজ করুন' : 'প্লে করুন'}
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4 fill-current" />
                                ) : (
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                )}
                            </button>

                            {/* Mute/Unmute Button */}
                            <button
                                type="button"
                                onClick={toggleMute}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                                aria-label={isMuted ? 'আনমিউট' : 'মিউট'}
                            >
                                {isMuted ? (
                                    <VolumeX className="w-4 h-4 text-red-400" />
                                ) : (
                                    <Volume2 className="w-4 h-4 text-white" />
                                )}
                            </button>

                            {/* Trust Badge */}
                            <span className="text-[11px] font-medium text-emerald-300 tracking-wide hidden sm:inline-block">
                                🌿 ১০০% প্রাকৃতিক ও স্বাস্থ্যকর
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                            {/* Target Product CTA Link */}
                            {item.productUrl && (
                                <Link
                                    href={item.productUrl}
                                    className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>অর্ডার করুন</span>
                                </Link>
                            )}

                            {/* Fullscreen Button */}
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                aria-label="ফুলস্ক্রিন"
                            >
                                <Maximize className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

