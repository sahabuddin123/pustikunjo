/**
 * Client Analytics Event Dispatcher (GA4 & Meta Pixel)
 */
export function trackEvent(eventName, params = {}) {
    if (typeof window === 'undefined') return;

    // Google Tag Manager / GA4
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
            event: eventName,
            ...params,
        });
    }

    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    }

    // Meta Pixel
    if (typeof window.fbq === 'function') {
        switch (eventName) {
            case 'view_item':
                window.fbq('track', 'ViewContent', {
                    content_name: params.name,
                    content_ids: [params.sku],
                    content_type: 'product',
                    value: params.value,
                    currency: 'BDT',
                });
                break;

            case 'add_to_cart':
                window.fbq('track', 'AddToCart', {
                    content_name: params.name,
                    content_ids: [params.sku],
                    content_type: 'product',
                    value: params.value,
                    currency: 'BDT',
                });
                break;

            case 'begin_checkout':
                window.fbq('track', 'InitiateCheckout', {
                    value: params.value,
                    currency: 'BDT',
                    num_items: params.num_items,
                });
                break;

            case 'purchase':
                window.fbq('track', 'Purchase', {
                    value: params.value,
                    currency: 'BDT',
                    content_ids: params.content_ids || [],
                    content_type: 'product',
                    num_items: params.num_items,
                });
                break;

            case 'search':
                window.fbq('track', 'Search', {
                    search_string: params.search_term,
                });
                break;

            case 'contact_click':
                window.fbq('trackCustom', 'ContactClick', {
                    channel: params.channel,
                });
                break;

            default:
                break;
        }
    }
}
