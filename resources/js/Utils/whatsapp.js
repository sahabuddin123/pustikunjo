/**
 * Safely formats any phone number or URL into a valid WhatsApp link (wa.me/...)
 * Automatically handles Bangladesh (+880, 880, 01...) and international numbers,
 * preventing duplicate country codes (e.g. 880880...) completely.
 *
 * @param {string} rawNumberOrUrl
 * @param {string} [defaultMessage]
 * @returns {string}
 */
export function formatWhatsAppUrl(rawNumberOrUrl, defaultMessage = '') {
    if (!rawNumberOrUrl) return '';

    let str = String(rawNumberOrUrl).trim();
    let existingText = '';

    // If it's a wa.me or api.whatsapp.com link, extract phone number and existing text
    if (str.includes('wa.me/') || str.includes('api.whatsapp.com/')) {
        try {
            const urlObj = new URL(str.startsWith('http') ? str : `https://${str}`);
            if (urlObj.searchParams.get('text')) {
                existingText = urlObj.searchParams.get('text');
            }
            if (urlObj.searchParams.get('phone')) {
                str = urlObj.searchParams.get('phone');
            } else {
                str = urlObj.pathname.replace(/^\//, '');
            }
        } catch {
            const match = str.match(/wa\.me\/([^?]+)/);
            if (match) str = match[1];
        }
    } else if (str.startsWith('http://') || str.startsWith('https://')) {
        // Other external URL
        if (defaultMessage && !str.includes('text=')) {
            const separator = str.includes('?') ? '&' : '?';
            return `${str}${separator}text=${encodeURIComponent(defaultMessage)}`;
        }
        return str;
    }

    // Extract digits only
    let digits = str.replace(/[^0-9]/g, '');
    if (!digits) return '';

    // Fix accidental repeated country code (e.g. 8808801762281356 or 888801762281356)
    while (digits.startsWith('880880')) {
        digits = digits.substring(3);
    }
    while (digits.startsWith('88880')) {
        digits = digits.substring(2);
    }

    // Format to standard WhatsApp wa.me phone number:
    // Bangladesh numbers: 8801XXXXXXXXX (13 digits)
    let formattedNumber = digits;
    if (digits.startsWith('880')) {
        formattedNumber = digits;
    } else if (digits.startsWith('0')) {
        // e.g. 01762281356 -> 8801762281356
        formattedNumber = '88' + digits;
    } else if (digits.startsWith('1')) {
        // e.g. 1762281356 -> 8801762281356
        formattedNumber = '880' + digits;
    }

    const message = existingText || defaultMessage;
    const base = `https://wa.me/${formattedNumber}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

