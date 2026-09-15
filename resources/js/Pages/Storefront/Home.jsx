import React from 'react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import BlockRenderer from '@/Components/Blocks/BlockRenderer';

export default function Home({ page, products, featuredProducts, latestProducts, categories, latestBlogs, meta }) {
    const blocks = page?.blocks || [];
    const mainHeading = meta?.title || 'পুষ্টি কুঞ্জ (Pusti Kunjo) — ১০০% খাঁটি অর্গানিক ও প্রাকৃতিক ভেষজ পুষ্টি পণ্য';

    return (
        <StorefrontLayout meta={meta}>
            {/* Semantic H1 for SEO, Bing & Search Engine Crawlers */}
            <h1 className="sr-only">
                {mainHeading}
            </h1>

            <BlockRenderer
                blocks={blocks}
                products={products || featuredProducts || []}
                categories={categories}
                latestBlogs={latestBlogs}
            />
        </StorefrontLayout>
    );
}
