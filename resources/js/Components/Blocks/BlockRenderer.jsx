import React from 'react';
import HeroBlock from './HeroBlock';
import BannerSliderBlock from './BannerSliderBlock';
import UspBlock from './UspBlock';
import ProductGridBlock from './ProductGridBlock';
import ProductVideosBlock from './ProductVideosBlock';
import CertificationsBlock from './CertificationsBlock';
import StepCardsBlock from './StepCardsBlock';
import ConsultationCtaBlock from './ConsultationCtaBlock';
import ContactStripBlock from './ContactStripBlock';
import CategoryGridBlock from './CategoryGridBlock';
import PromoBannerBlock from './PromoBannerBlock';
import ImageWithTextBlock from './ImageWithTextBlock';
import StatsCounterBlock from './StatsCounterBlock';
import TestimonialsBlock from './TestimonialsBlock';
import FaqBlock from './FaqBlock';
import CountdownOfferBlock from './CountdownOfferBlock';
import ImageGalleryBlock from './ImageGalleryBlock';
import VideoEmbedBlock from './VideoEmbedBlock';
import BlogPostsBlock from './BlogPostsBlock';
import NewsletterBlock from './NewsletterBlock';
import ContactFormBlock from './ContactFormBlock';
import RichTextBlock from './RichTextBlock';
import CustomHtmlBlock from './CustomHtmlBlock';
import CtaBlock from './CtaBlock';
import BrandBannerBlock from './BrandBannerBlock';
import HealthRegimenBlock from './HealthRegimenBlock';

export default function BlockRenderer({ blocks = [], products = [], categories = [], latestBlogs = [] }) {
    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col">
            {blocks.map((block, index) => {
                if (block.is_hidden) return null;

                const data = block.data || {};
                const key = block.id || `block_${block.type}_${index}`;

                const visibilityClass = [
                    block.hide_mobile ? 'hidden md:block' : '',
                    block.hide_desktop ? 'md:hidden' : '',
                ].filter(Boolean).join(' ');

                const renderBlockContent = () => {
                    switch (block.type) {
                        case 'hero':
                        case 'hero_banner':
                            return <HeroBlock data={data} />;
                        case 'banner_slider':
                            return <BannerSliderBlock data={data} />;
                        case 'product_grid':
                            return <ProductGridBlock data={data} products={products} />;
                        case 'product_videos':
                            return <ProductVideosBlock data={data} />;
                        case 'certifications':
                        case 'award_certifications':
                            return <CertificationsBlock data={data} />;
                        case 'step_cards':
                        case 'why_brand':
                        case 'why_pustikunjo':
                            return <StepCardsBlock data={data} />;
                        case 'consultation_cta':
                        case 'hakim_consultation':
                            return <ConsultationCtaBlock data={data} />;
                        case 'contact_strip':
                            return <ContactStripBlock data={data} />;
                        case 'usp_highlights':
                            return <UspBlock data={data} />;
                        case 'category_grid':
                            return <CategoryGridBlock data={data} categories={categories} />;
                        case 'promo_banner':
                            return <PromoBannerBlock data={data} />;
                        case 'image_with_text':
                            return <ImageWithTextBlock data={data} />;
                        case 'stats_counter':
                            return <StatsCounterBlock data={data} />;
                        case 'testimonials':
                            return <TestimonialsBlock data={data} />;
                        case 'faq':
                            return <FaqBlock data={data} />;
                        case 'countdown_offer':
                            return <CountdownOfferBlock data={data} />;
                        case 'image_gallery':
                            return <ImageGalleryBlock data={data} />;
                        case 'video_embed':
                            return <VideoEmbedBlock data={data} />;
                        case 'blog_posts':
                            return <BlogPostsBlock data={data} latestBlogs={latestBlogs} />;
                        case 'newsletter_signup':
                            return <NewsletterBlock data={data} />;
                        case 'contact_form':
                            return <ContactFormBlock data={data} />;
                        case 'rich_text':
                            return <RichTextBlock data={data} />;
                        case 'custom_html':
                            return <CustomHtmlBlock data={data} />;
                        case 'brand_banner':
                        case 'lifestyle_banner':
                            return <BrandBannerBlock data={data} />;
                        case 'health_regimen':
                        case 'wellness_showcase':
                            return <HealthRegimenBlock data={data} products={products} />;
                        case 'cta':
                        case 'call_to_action':
                            return <CtaBlock data={data} />;
                        case 'spacer':
                            return <div style={{ height: `${data.height || 40}px` }} />;
                        default:
                            return null;
                    }
                };

                return (
                    <div key={key} className={visibilityClass}>
                        {renderBlockContent()}
                    </div>
                );
            })}
        </div>
    );
}
