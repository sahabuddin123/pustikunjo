import React from 'react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import BlockRenderer from '@/Components/Blocks/BlockRenderer';

export default function Home({ page, products, featuredProducts, latestProducts, categories, latestBlogs, meta }) {
    const blocks = page?.blocks || [];

    return (
        <StorefrontLayout meta={meta}>
            <BlockRenderer
                blocks={blocks}
                products={products || featuredProducts || []}
                categories={categories}
                latestBlogs={latestBlogs}
            />
        </StorefrontLayout>
    );
}
