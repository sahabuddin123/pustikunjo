import React from 'react';
import { Link } from '@inertiajs/react';
import ProductCard from '../Storefront/ProductCard';

export default function ProductGridBlock({ data = {}, products = [] }) {
    const heading = data.heading || 'BEST SELLER';
    const subheading = data.subheading || '';
    const limit = data.limit || 8;
    const categorySlug = data.category_slug || '';
    const viewAllUrl = categorySlug ? `/shop?category=${categorySlug}` : (data.view_all_url || '/shop');
    const showBottomButton = data.show_bottom_button || false;

    // Filter products if category specified
    let displayProducts = products;
    if (categorySlug) {
        const filtered = products.filter(p => p.category?.slug === categorySlug || String(p.category_id) === String(data.category_id));
        if (filtered.length > 0) {
            displayProducts = filtered;
        }
    }
    displayProducts = displayProducts.slice(0, limit);

    if (displayProducts.length === 0) return null;

    // Dynamic Product Count logic matching reference
    let containerClass = 'max-w-5xl mx-auto';
    let gridColClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8';

    if (displayProducts.length <= 3) {
        // Balanced 3-column presentation with generous whitespace
        containerClass = 'max-w-5xl mx-auto';
        gridColClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8';
    } else if (displayProducts.length === 4) {
        // 4-column presentation
        containerClass = 'max-w-6xl mx-auto';
        gridColClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';
    } else {
        // 5+ products: standard catalog grid
        containerClass = 'max-w-7xl mx-auto';
        gridColClass = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6';
    }

    return (
        <section className="w-full bg-white py-8 sm:py-12 border-b border-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header matching home_dektop.jpg */}
                <div className="relative flex items-center justify-between mb-8 sm:mb-10">
                    {/* Centered Heading with green accent underline */}
                    <div className="w-full text-center">
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-wider uppercase inline-block relative">
                            {heading}
                            <span className="block w-10 sm:w-12 h-1 bg-[#0B3E25] mx-auto mt-2 rounded-full" />
                        </h2>
                        {subheading && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {subheading}
                            </p>
                        )}
                    </div>

                    {/* Right-aligned "View All" */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <Link
                            href={viewAllUrl}
                            className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-emerald-800 transition-colors"
                        >
                            View All
                        </Link>
                    </div>
                </div>

                {/* Product Grid Container */}
                <div className={containerClass}>
                    <div className={`grid ${gridColClass}`}>
                        {displayProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Centered "সব পণ্য দেখুন" / "View All" button if enabled (Section 5) */}
                {showBottomButton && (
                    <div className="text-center mt-10 sm:mt-12">
                        <Link
                            href={viewAllUrl}
                            className="inline-flex items-center justify-center px-8 py-2.5 rounded-md bg-[#0B3E25] hover:bg-[#072F1C] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all"
                        >
                            সব পণ্য দেখুন
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
