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

    const image = (product.images && product.images.length > 0)
        ? product.images[0]
        : (product.primary_image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80');

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
        <div className="group bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 sm:p-5 text-center">
            {/* Product Image on clean white background */}
            <Link
                href={`/product/${product.slug}`}
                className="block relative aspect-square w-full overflow-hidden bg-white mb-3 flex items-center justify-center"
            >
                <img
                    src={image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
            </Link>

            {/* Product Title & Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <Link
                        href={`/product/${product.slug}`}
                        className="block font-medium text-gray-800 hover:text-emerald-800 transition-colors text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem] mb-2"
                        title={product.name}
                    >
                        {product.name}
                    </Link>
                </div>

                <div>
                    {/* Price with optional discount */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                            ৳ {price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                                ৳ {originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Green Pill CTA Button matching reference */}
                    <button
                        onClick={handleInstantBuy}
                        type="button"
                        className="w-full sm:w-auto min-w-[140px] px-6 py-2.5 rounded-md sm:rounded-full bg-[#0B3E25] hover:bg-[#072F1C] text-white text-sm sm:text-base font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer inline-flex items-center justify-center gap-1.5 mx-auto"
                        title="অর্ডার করুন"
                    >
                        <span>অর্ডার করুন</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
