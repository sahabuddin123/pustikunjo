import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Eye, Play, X } from 'lucide-react';

export default function ProductVideosBlock({ data = {} }) {
    const heading = data.heading || 'Product Videos';
    const [activeVideoModal, setActiveVideoModal] = useState(null);

    // Default 3 video reels + 3 promotional cards matching home_dektop.jpg reference
    const defaultItems = [
        {
            id: 1,
            poster: '/images/product_videos/video_poster_1.jpg',
            videoUrl: data.video_1_url || 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-in-a-park-41315-large.mp4',
            promoBanner: '/images/product_videos/promo_banner_1.jpg',
            thumb: '/images/product_videos/thumb_1.png',
            title: 'Spray Dried Beetr...',
            fullTitle: 'Spray Dried Beetroot Powder',
            price: 'Tk 1,150.00',
            productUrl: '/product/beetroot-powder',
            alt: 'Spray Dried Beetroot Powder Video Review & Promo',
        },
        {
            id: 2,
            poster: '/images/product_videos/video_poster_2.jpg',
            videoUrl: data.video_2_url || 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-41712-large.mp4',
            promoBanner: '/images/product_videos/promo_banner_2.jpg',
            thumb: '/images/product_videos/thumb_2.png',
            title: 'Desi Ghee',
            fullTitle: 'Desi Ghee / Pure Herbal Methimix',
            price: 'Tk 680.00',
            productUrl: '/product/methimix',
            alt: 'Pure Herbal Methimix & Desi Ghee Video Review & Promo',
        },
        {
            id: 3,
            poster: '/images/product_videos/video_poster_3.jpg',
            videoUrl: data.video_3_url || 'https://assets.mixkit.co/videos/preview/mixkit-woman-recording-a-vlog-with-her-phone-41314-large.mp4',
            promoBanner: '/images/product_videos/promo_banner_3.jpg',
            thumb: '/images/product_videos/thumb_3.png',
            title: 'Spray Dried Beetr...',
            fullTitle: 'Premium Organic Superfood',
            price: 'Tk 1,150.00',
            productUrl: '/product/chia-seeds',
            alt: 'Organic Chia Seeds Superfood Video Review & Promo',
        },
    ];

    const items = (data.items && Array.isArray(data.items) && data.items.length > 0)
        ? data.items
        : defaultItems;

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
                        <div key={item.id} className="flex flex-col gap-6 sm:gap-7">
                            {/* TOP: Vertical Reel Video Card */}
                            <div
                                onClick={() => setActiveVideoModal(item)}
                                className="relative aspect-[212/368] w-full rounded-2xl overflow-hidden bg-black shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-100"
                            >
                                <img
                                    src={item.poster}
                                    alt={item.alt}
                                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                                    loading="lazy"
                                />

                                {/* Subtle Play Icon Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                                        <Play className="w-5 h-5 fill-current ml-0.5" />
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
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setActiveVideoModal(null)}
                >
                    <div
                        className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setActiveVideoModal(null)}
                            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="বন্ধ করুন"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <video
                            src={activeVideoModal.videoUrl}
                            poster={activeVideoModal.poster}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
