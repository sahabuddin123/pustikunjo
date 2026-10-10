import React from 'react';
import { Link, router } from '@inertiajs/react';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/Context/CartContext';
import { trackEvent } from '@/Services/Analytics';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const price = product.sale_price && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price)
        ? Number(product.sale_price)
        : Number(product.price);
    
    const originalPrice = Number(product.price);
    const hasDiscount = product.sale_price && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price);

    const fallbackImage = '/images/placeholder-product.jpg';
    const image = (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0])
        ? product.images[0]
        : (product.primary_image || fallbackImage);

    const handleInstantBuy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1, false);
        trackEvent('add_to_cart', {
            name: product.name,
            sku: product.sku,
            value: price,
        });
        router.visit('/checkout');
    };

    return (
        <div className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100/90 hover:border-[#D4AF37]/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-2.5 sm:p-5 text-center relative">
            {/* Optional Gold Discount Badge */}
            {hasDiscount && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-gradient-to-r from-[#D99A26] to-[#E5A93B] text-white text-[9px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs">
                    ছাড় ৳{(originalPrice - price).toLocaleString()}
                </div>
            )}

            {/* Product Image on clean subtle background */}
            <Link
                href={`/product/${product.slug}`}
                className="block relative aspect-square w-full overflow-hidden bg-gray-50/50 rounded-lg sm:rounded-xl mb-2 sm:mb-3 flex items-center justify-center p-2 sm:p-4 group/img"
            >
                <img
                    src={image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover/img:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="300"
                    onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.endsWith('.webp')) {
                            target.src = target.src.replace(/\.webp$/i, '.jpg');
                        } else if (target.src !== fallbackImage && !target.src.endsWith(fallbackImage)) {
                            target.src = fallbackImage;
                        }
                    }}
                />
            </Link>

            {/* Product Title & Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <Link
                        href={`/product/${product.slug}`}
                        className="block font-bold text-gray-900 hover:text-[#0B3E25] transition-colors text-xs sm:text-base leading-tight sm:leading-snug line-clamp-2 h-7 sm:h-10 mb-1.5 sm:mb-2"
                        title={product.name}
                    >
                        {product.name}
                    </Link>
                </div>

                <div>
                    {/* Price with optional discount */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span className="text-sm sm:text-lg font-black text-[#0B3E25]">
                            ৳ {price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <span className="text-[11px] sm:text-sm text-gray-400 line-through">
                                ৳ {originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Green Pill CTA Button with Gold Accent matching reference */}
                    <button
                        onClick={handleInstantBuy}
                        type="button"
                        className="w-full px-2 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-full bg-[#0B3E25] hover:bg-[#D99A26] active:scale-95 border border-[#D4AF37]/50 hover:border-[#D99A26] text-white text-xs sm:text-base font-bold transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer inline-flex items-center justify-center gap-1 sm:gap-1.5 mx-auto"
                        title="অর্ডার করুন"
                    >
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5A93B] shrink-0" />
                        <span>অর্ডার করুন</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
