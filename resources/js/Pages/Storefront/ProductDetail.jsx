import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductCard from '@/Components/Storefront/ProductCard';
import { useCart } from '@/Context/CartContext';
import { trackEvent } from '@/Services/Analytics';
import {
    ShoppingBag,
    ShoppingCart,
    PhoneCall,
    Phone,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    CheckCircle2,
    ShieldCheck,
    Truck,
    RotateCcw,
    Sparkles,
    HeartPulse,
    Activity,
    Scale,
    Heart,
    Smile,
    SmilePlus,
    ZoomIn,
    ZoomOut,
    Maximize2,
    X,
    RotateCw,
    User,
    MapPin,
    CreditCard,
    Check,
    Copy,
    Tag,
    AlertCircle,
    Lock
} from 'lucide-react';

const iconMap = {
    HeartPulse,
    Sparkles,
    Activity,
    ShieldCheck,
    CheckCircle2,
    Scale,
    Heart,
    Smile,
    SmilePlus,
};

export default function ProductDetail({ product, relatedProducts = [], shippingZones = [], bkashSettings = {}, schemaJsonLd, meta = {} }) {
    const { siteConfig, header } = usePage().props;
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('benefits'); // benefits, usage, description, reviews

    // Dynamic Product Variants from Database/Admin
    const variants = (product.variants && Array.isArray(product.variants) && product.variants.length > 0)
        ? product.variants
        : [
            {
                name: product.weight || '২৫০ গ্রাম',
                price: Number(product.price),
                sale_price: (product.sale_price && Number(product.sale_price) > 0) ? Number(product.sale_price) : null,
                stock: product.stock,
            }
        ];

    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const currentVariant = variants[selectedVariantIndex] || variants[0];
    const selectedWeight = currentVariant?.name || product.weight || '২৫০ গ্রাম';

    // Dynamic Price calculation based on active variant
    const variantRegPrice = Number(currentVariant?.price ?? product.price ?? 0);
    const variantSalePrice = (currentVariant?.sale_price !== null && currentVariant?.sale_price !== undefined && currentVariant?.sale_price !== '' && Number(currentVariant.sale_price) > 0)
        ? Number(currentVariant.sale_price)
        : ((product.sale_price && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price)) ? Number(product.sale_price) : null);

    const hasDiscount = variantSalePrice !== null && variantSalePrice > 0 && variantSalePrice < variantRegPrice;
    const basePrice = hasDiscount ? variantSalePrice : variantRegPrice;
    const originalPrice = variantRegPrice;

    // Image Zoom States
    const [isHoverZooming, setIsHoverZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [modalZoomScale, setModalZoomScale] = useState(1);

    // Instant Checkout Popup States
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [checkoutQty, setCheckoutQty] = useState(1);
    const [copiedNumber, setCopiedNumber] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const defaultShippingZones = shippingZones && shippingZones.length > 0 ? shippingZones : [
        { name: 'ঢাকার ভিতরে', fee: 60 },
        { name: 'ঢাকার বাইরে', fee: 120 }
    ];
    const defaultZone = defaultShippingZones[0]?.name || 'ঢাকার ভিতরে';

    const checkoutForm = useForm({
        customer_name: '',
        customer_phone: '',
        customer_alt_phone: '',
        customer_email: '',
        shipping_address: '',
        shipping_area: defaultZone,
        order_notes: '',
        payment_method: 'cod', // cod, bkash_manual
        bkash_sender_number: '',
        bkash_trx_id: '',
        coupon_code: '',
        items: [{
            id: product.id,
            quantity: 1,
            variant_name: selectedWeight,
            unit_price: basePrice,
        }],
    });

    const phone = siteConfig?.phone || header?.hotline_phone || '01700-000000';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const whatsapp = siteConfig?.whatsapp || '01700000000';
    const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

    // Product Images: Only use actual product images from admin / database
    const rawImages = (product.images && Array.isArray(product.images) && product.images.length > 0)
        ? product.images.filter(Boolean)
        : (product.primary_image ? [product.primary_image] : []);

    const galleryImages = rawImages.length > 0
        ? rawImages
        : ['/images/placeholder.png'];

    // Track Meta Pixel ViewContent
    useEffect(() => {
        trackEvent('view_item', {
            name: `${product.name} (${selectedWeight})`,
            sku: product.sku,
            value: basePrice,
        });
    }, [product.id, selectedWeight]);

    // Lock body scroll when any modal is open
    useEffect(() => {
        if (isCheckoutModalOpen || isLightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCheckoutModalOpen, isLightboxOpen]);

    // Keyboard navigation for Lightbox and Checkout Modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isCheckoutModalOpen) {
                    setIsCheckoutModalOpen(false);
                }
                if (isLightboxOpen) {
                    setIsLightboxOpen(false);
                    setModalZoomScale(1);
                }
            } else if (isLightboxOpen && e.key === 'ArrowLeft') {
                setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
            } else if (isLightboxOpen && e.key === 'ArrowRight') {
                setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCheckoutModalOpen, isLightboxOpen, galleryImages.length]);

    // Mouse-follow zoom calculation
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        setZoomPosition({ x, y });
    };

    // Variant change handler
    const handleVariantChange = (idx) => {
        setSelectedVariantIndex(idx);
        const v = variants[idx];
        const vReg = Number(v?.price ?? product.price ?? 0);
        const vSale = (v?.sale_price !== null && v?.sale_price !== undefined && v?.sale_price !== '' && Number(v.sale_price) > 0)
            ? Number(v.sale_price)
            : ((product.sale_price && Number(product.sale_price) > 0) ? Number(product.sale_price) : null);
        const vPrice = (vSale && vSale < vReg) ? vSale : vReg;

        checkoutForm.setData((data) => ({
            ...data,
            items: [{
                id: product.id,
                quantity: checkoutQty,
                variant_name: v?.name || selectedWeight,
                unit_price: vPrice,
            }],
        }));
    };

    const handleAddToCart = () => {
        addToCart(product, quantity, true, currentVariant);
        trackEvent('add_to_cart', {
            name: `${product.name} (${selectedWeight})`,
            sku: product.sku,
            value: basePrice * quantity,
        });
    };

    // Instant On-Page Checkout Trigger
    const handleInstantBuy = () => {
        setCheckoutQty(quantity);
        checkoutForm.setData((data) => ({
            ...data,
            items: [{
                id: product.id,
                quantity: quantity,
                variant_name: selectedWeight,
                unit_price: basePrice,
            }],
        }));
        setIsCheckoutModalOpen(true);
        trackEvent('begin_checkout', {
            name: `${product.name} (${selectedWeight})`,
            sku: product.sku,
            value: basePrice * quantity,
        });
    };

    const handleModalQtyChange = (newQty) => {
        const validQty = Math.max(1, newQty);
        setCheckoutQty(validQty);
        setQuantity(validQty);
        checkoutForm.setData((data) => ({
            ...data,
            items: [{
                id: product.id,
                quantity: validQty,
                variant_name: selectedWeight,
                unit_price: basePrice,
            }],
        }));
    };

    const handleCopyNumber = () => {
        const num = bkashSettings?.manual_number || '01700000000';
        navigator.clipboard.writeText(num);
        setCopiedNumber(true);
        setTimeout(() => setCopiedNumber(false), 2500);
    };

    const handleModalCheckoutSubmit = (e) => {
        e.preventDefault();
        checkoutForm.setData('items', [{
            id: product.id,
            quantity: checkoutQty,
            variant_name: selectedWeight,
            unit_price: basePrice,
        }]);
        checkoutForm.post('/checkout/process', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCheckoutModalOpen(false);
            },
        });
    };

    const activeZone = defaultShippingZones.find((z) => z.name === checkoutForm.data.shipping_area) || defaultShippingZones[0] || { fee: 60 };
    const shippingFee = Number(activeZone.fee || 60);
    const modalSubtotal = basePrice * checkoutQty;
    const modalGrandTotal = Math.max(0, modalSubtotal + shippingFee - couponDiscount);

    // Image Carousel Nav
    const prevImage = (e) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    const nextImage = (e) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
    };

    // Review Form
    const reviewForm = useForm({
        customer_name: '',
        customer_phone: '',
        rating: 5,
        comment: '',
    });

    const submitReview = (e) => {
        e.preventDefault();
        reviewForm.post(`/product/${product.id}/review`, {
            preserveScroll: true,
            onSuccess: () => reviewForm.reset(),
        });
    };

    const benefits = product.benefits || [];

    return (
        <StorefrontLayout meta={meta}>
            <Head>
                {schemaJsonLd && (
                    <script type="application/ld+json">
                        {JSON.stringify(schemaJsonLd)}
                    </script>
                )}
            </Head>

            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b border-gray-100 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                    <Link href="/" className="hover:text-emerald-700 font-medium">হোম</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-emerald-700 font-medium">শপ</Link>
                    {product.category && (
                        <>
                            <span>/</span>
                            <Link href={`/category/${product.category.slug}`} className="hover:text-emerald-700 font-medium">
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-gray-900 font-bold truncate">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
                {/* Main Product Card matching reference screenshot */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                        {/* Left Column: Image Gallery with Interactive Zoom */}
                        <div className={`lg:col-span-6 flex ${galleryImages.length > 1 ? 'flex-col-reverse sm:flex-row' : 'flex-col'} gap-4 items-start`}>
                            {/* Vertical Thumbnails (only when multiple images exist) */}
                            {galleryImages.length > 1 && (
                                <div className="flex sm:flex-col gap-3 w-full sm:w-20 shrink-0 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer shrink-0 ${
                                                activeImageIndex === idx
                                                    ? 'border-emerald-600 shadow-xs scale-102 ring-2 ring-emerald-600/20'
                                                    : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300'
                                            }`}
                                            title={`ছবি ${idx + 1}`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image Container with Interactive Mouse Zoom & Click-to-Expand */}
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-gray-200/90 flex items-center justify-center select-none shadow-2xs group">
                                {/* Interactive Image with Mouse Coordinate Zoom */}
                                <div
                                    className="w-full h-full overflow-hidden flex items-center justify-center cursor-zoom-in relative"
                                    onMouseEnter={() => setIsHoverZooming(true)}
                                    onMouseLeave={() => setIsHoverZooming(false)}
                                    onMouseMove={handleMouseMove}
                                    onClick={() => {
                                        setModalZoomScale(1);
                                        setIsLightboxOpen(true);
                                    }}
                                    title="বড় করে দেখতে ক্লিক করুন"
                                >
                                    <img
                                        src={galleryImages[activeImageIndex]}
                                        alt={product.name}
                                        className="max-h-full max-w-full object-contain p-3 transition-transform will-change-transform duration-150 ease-out pointer-events-none"
                                        style={{
                                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                            transform: isHoverZooming ? 'scale(2.3)' : 'scale(1)',
                                        }}
                                    />
                                </div>

                                {/* Floating Zoom Hint Badge */}
                                <div className={`absolute top-3 right-3 z-10 pointer-events-none transition-opacity duration-200 ${
                                    isHoverZooming ? 'opacity-0' : 'opacity-80 group-hover:opacity-100'
                                }`}>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 border border-gray-200 text-gray-700 text-[11px] font-semibold shadow-xs backdrop-blur-xs">
                                        <ZoomIn className="w-3.5 h-3.5 text-emerald-700" />
                                        <span>জুম করুন</span>
                                    </div>
                                </div>

                                {/* Prev & Next Arrows for Main Gallery Image */}
                                {galleryImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            type="button"
                                            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/25 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm"
                                            aria-label="Previous image"
                                            title="পূর্ববর্তী ছবি"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            type="button"
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/25 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm"
                                            aria-label="Next image"
                                            title="পরবর্তী ছবি"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Buy Box Details matching reference */}
                        <div className="lg:col-span-6 space-y-5">
                            {/* Product Title */}
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                    {product.name}
                                </h1>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-baseline gap-3">
                                {hasDiscount && (
                                    <span className="text-base sm:text-lg text-gray-400 line-through">
                                        ৳{originalPrice.toLocaleString()}
                                    </span>
                                )}
                                <span className="text-2xl sm:text-3xl font-black text-[#dc2626]">
                                    ৳{basePrice.toLocaleString()}
                                </span>
                            </div>

                            {/* Variation / Weight Selector (বাছাই করুন:) */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block">
                                        বাছাই করুন: <span className="text-emerald-700 font-bold ml-1">({selectedWeight})</span>
                                    </label>
                                    {currentVariant?.stock !== undefined && (
                                        <span className="text-[11px] text-gray-500">
                                            স্টক: <span className="font-semibold text-emerald-800">{currentVariant.stock} টি</span>
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    {variants.map((v, i) => {
                                        const isSelected = selectedVariantIndex === i;
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleVariantChange(i)}
                                                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                                    isSelected
                                                        ? 'border-2 border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-2xs font-bold ring-2 ring-emerald-600/20'
                                                        : 'border border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <span>{v.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="pt-1">
                                <div className="inline-flex items-center border border-gray-200 rounded-md bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer border-r border-gray-200"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-12 text-center text-sm font-bold text-gray-800">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer border-l border-gray-200"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons Row 1: Add to Cart + Order Now */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {/* Add to Cart */}
                                <button
                                    onClick={handleAddToCart}
                                    type="button"
                                    className="w-full py-3 px-6 rounded-md border-2 border-gray-900 hover:bg-gray-50 text-gray-900 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>কার্টে যোগ করুন</span>
                                </button>

                                {/* Order Now (Direct Checkout) */}
                                <button
                                    onClick={handleInstantBuy}
                                    type="button"
                                    className="w-full py-3 px-6 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>অর্ডার করুন</span>
                                </button>
                            </div>

                            {/* Action Buttons Row 2: WhatsApp Order + Phone Call Order */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* WhatsApp Order Button */}
                                <a
                                    href={`https://wa.me/880${cleanWhatsapp}?text=${encodeURIComponent(`হ্যালো পুষ্টি কুঞ্জ! আমি ${product.name} (${selectedWeight}, দাম: ৳${basePrice}, পরিমাণ: ${quantity} টি) অর্ডার করতে চাচ্ছি।`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-2.5 px-4 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
                                >
                                    <MessageCircle className="w-4 h-4 fill-current" />
                                    <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
                                </a>

                                {/* Call Order Button */}
                                <a
                                    href={`tel:${cleanPhone}`}
                                    className="w-full py-2.5 px-4 rounded-md border-2 border-gray-900 hover:bg-gray-50 text-gray-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                                >
                                    <span>কল অর্ডার: {phone}</span>
                                </a>
                            </div>

                            {/* Category Meta */}
                            <div className="pt-3 border-t border-gray-100 text-xs sm:text-sm text-gray-500">
                                <span>ক্যাটাগরি: </span>
                                {product.category ? (
                                    <Link
                                        href={`/category/${product.category.slug}`}
                                        className="text-gray-800 hover:text-emerald-700 font-medium"
                                    >
                                        {product.category.name}
                                    </Link>
                                ) : (
                                    <span className="text-gray-700 font-medium">ভেষজ ও পুষ্টিকর খাদ্য</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Structured Tabs: Benefits, Usage, Description, Reviews */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
                        <button
                            onClick={() => setActiveTab('benefits')}
                            className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                                activeTab === 'benefits'
                                    ? 'bg-[#0B3E25] text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'
                            }`}
                        >
                            🌿 পণ্যের উপকারিতা
                        </button>
                        <button
                            onClick={() => setActiveTab('usage')}
                            className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                                activeTab === 'usage'
                                    ? 'bg-[#0B3E25] text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'
                            }`}
                        >
                            🥄 ব্যবহারবিধি
                        </button>
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                                activeTab === 'description'
                                    ? 'bg-[#0B3E25] text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'
                            }`}
                        >
                            📝 বিস্তারিত বিবরণ
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                                activeTab === 'reviews'
                                    ? 'bg-[#0B3E25] text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'
                            }`}
                        >
                            ⭐ রিভিউ ({product.reviews ? product.reviews.length : 0})
                        </button>
                    </div>

                    {/* Tab 1: Benefits */}
                    {activeTab === 'benefits' && (
                        <div className="space-y-6">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                {product.name} এর প্রধান স্বাস্থ্য উপকারিতা সমূহ:
                            </h3>
                            {benefits && benefits.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {benefits.map((b, idx) => {
                                        const IconComp = iconMap[b.icon] || Sparkles;
                                        return (
                                            <div
                                                key={idx}
                                                className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-[#0B3E25] text-white flex items-center justify-center shadow-xs">
                                                    <IconComp className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                                                    {b.title}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                    {b.text}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    {product.description || '১০০% প্রাকৃতিক ও খাঁটি উপাদানে তৈরি।'}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Usage */}
                    {activeTab === 'usage' && (
                        <div className="space-y-4 max-w-3xl">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                সঠিক সেবন ও ব্যবহারের নিয়ম:
                            </h3>
                            <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {product.usage_instructions || 'প্রতিদিন ১ চামচ হালকা গরম পানি বা দুধের সাথে মিশিয়ে সেবন করুন।'}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Full Description */}
                    {activeTab === 'description' && (
                        <div className="space-y-4 max-w-3xl text-sm sm:text-base text-gray-700 leading-relaxed">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                পণ্য পরিচিতি ও বিস্তারিত:
                            </h3>
                            <p>{product.description || product.short_description}</p>
                        </div>
                    )}

                    {/* Tab 4: Reviews */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-8 max-w-3xl">
                            {/* Existing Reviews */}
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {product.reviews.map((rev) => (
                                        <div key={rev.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-gray-900 text-sm">{rev.customer_name}</span>
                                                <span className="text-amber-500 text-xs">★ {rev.rating}/5</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600">{rev.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">এখনও কোনো রিভিউ যুক্ত হয়নি। আপনার মতামত দিয়ে প্রথম রিভিউ করুন!</p>
                            )}

                            {/* Review Form */}
                            <form onSubmit={submitReview} className="p-5 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-3">
                                <h4 className="font-bold text-gray-900 text-sm">আপনার রিভিউ লিখুন</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="আপনার নাম"
                                        value={reviewForm.data.customer_name}
                                        onChange={(e) => reviewForm.setData('customer_name', e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-white"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="ফোন নম্বর"
                                        value={reviewForm.data.customer_phone}
                                        onChange={(e) => reviewForm.setData('customer_phone', e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-white"
                                        required
                                    />
                                </div>
                                <textarea
                                    placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
                                    value={reviewForm.data.comment}
                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                    rows="3"
                                    className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-white"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={reviewForm.processing}
                                    className="px-5 py-2 rounded-lg bg-[#0B3E25] hover:bg-[#072F1C] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
                                >
                                    {reviewForm.processing ? 'সাবমিট হচ্ছে...' : 'রিভিউ সাবমিট করুন'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Related Products Section */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="space-y-6 pt-4">
                        <div className="text-center">
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-wider inline-block relative">
                                সম্পর্কিত পণ্য
                                <span className="block w-10 sm:w-12 h-1 bg-[#0B3E25] mx-auto mt-2 rounded-full" />
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {relatedProducts.map((relProduct) => (
                                <ProductCard key={relProduct.id} product={relProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox / Fullscreen Gallery Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-sm animate-fade-in"
                    onClick={() => {
                        setIsLightboxOpen(false);
                        setModalZoomScale(1);
                    }}
                >
                    {/* Lightbox Top Header */}
                    <div className="flex items-center justify-between text-white z-20" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white/90">
                                {product.name}
                            </span>
                            <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-md">
                                {activeImageIndex + 1} / {galleryImages.length}
                            </span>
                        </div>

                        {/* Zoom Controls & Close Button */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setModalZoomScale((s) => Math.max(1, s - 0.5))}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                                title="জুম আউট (-)"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-mono font-bold text-white/80 w-10 text-center">
                                {modalZoomScale.toFixed(1)}x
                            </span>
                            <button
                                type="button"
                                onClick={() => setModalZoomScale((s) => Math.min(3, s + 0.5))}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                                title="জুম ইন (+)"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalZoomScale(1)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                                title="রিসেট"
                            >
                                <RotateCw className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLightboxOpen(false);
                                    setModalZoomScale(1);
                                }}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer ml-2"
                                title="বন্ধ করুন (Esc)"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Lightbox Center: Image with Zoom Navigation */}
                    <div
                        className="flex-1 flex items-center justify-center relative overflow-hidden py-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Prev Button */}
                        {galleryImages.length > 1 && (
                            <button
                                type="button"
                                onClick={prevImage}
                                className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
                                title="পূর্ববর্তী ছবি (←)"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* Image Display */}
                        <div className="max-w-4xl max-h-[75vh] overflow-hidden flex items-center justify-center">
                            <img
                                src={galleryImages[activeImageIndex]}
                                alt={product.name}
                                className="max-h-[70vh] max-w-full object-contain rounded-lg transition-transform duration-200"
                                style={{ transform: `scale(${modalZoomScale})` }}
                            />
                        </div>

                        {/* Next Button */}
                        {galleryImages.length > 1 && (
                            <button
                                type="button"
                                onClick={nextImage}
                                className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
                                title="পরবর্তী ছবি (→)"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Lightbox Bottom: Thumbnail Selector */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 z-20 py-2" onClick={(e) => e.stopPropagation()}>
                        {galleryImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setActiveImageIndex(idx);
                                    setModalZoomScale(1);
                                }}
                                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all p-0.5 bg-black/40 cursor-pointer ${
                                    activeImageIndex === idx
                                        ? 'border-emerald-400 scale-105 shadow-md'
                                        : 'border-white/20 opacity-50 hover:opacity-90'
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`Thumb ${idx + 1}`}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Instant On-Page Checkout Popup Modal */}
            {isCheckoutModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
                    onClick={() => setIsCheckoutModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-[#0B3E25] text-white p-4 sm:px-6 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg leading-tight">
                                        সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)
                                    </h3>
                                    <p className="text-[11px] text-emerald-200/90 mt-0.5">
                                        পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন। অগ্রিম কোনো টাকা দেওয়া লাগবে না।
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                title="বন্ধ করুন (Esc)"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Modal Body */}
                        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-gray-800">
                            {/* 1. Selected Product Card */}
                            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex flex-col gap-2.5">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={galleryImages[activeImageIndex] || product.primary_image}
                                        alt={product.name}
                                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-emerald-200/60 shrink-0 bg-white"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-gray-900 truncate">
                                            {product.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                                            <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 text-emerald-800 font-medium">
                                                {selectedWeight}
                                            </span>
                                            <span className="font-bold text-red-600">
                                                ৳{basePrice.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Stepper inside modal */}
                                    <div className="flex items-center border border-gray-200 rounded-lg bg-white shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleModalQtyChange(checkoutQty - 1)}
                                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 border-r border-gray-200 cursor-pointer"
                                            aria-label="Decrease"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                                            {checkoutQty}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleModalQtyChange(checkoutQty + 1)}
                                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 border-l border-gray-200 cursor-pointer"
                                            aria-label="Increase"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Variant Switcher Buttons inside Checkout Modal */}
                                {variants.length > 1 && (
                                    <div className="pt-2 border-t border-emerald-200/50 flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[11px] text-gray-500 font-medium">সাইজ পরিবর্তন:</span>
                                        {variants.map((v, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleVariantChange(i)}
                                                className={`px-2.5 py-0.5 rounded-md text-xs transition-all cursor-pointer ${
                                                    selectedVariantIndex === i
                                                        ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {v.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 2. Customer Form */}
                            <form onSubmit={handleModalCheckoutSubmit} id="instant-checkout-form" className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">
                                        আপনার নাম *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                                            value={checkoutForm.data.customer_name}
                                            onChange={(e) => checkoutForm.setData('customer_name', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                        />
                                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {checkoutForm.errors.customer_name && (
                                        <p className="text-xs text-rose-500 mt-1">{checkoutForm.errors.customer_name}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">
                                        মোবাইল নম্বর * (১১ ডিজিট)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            required
                                            placeholder="০১XXXXXXXXX"
                                            value={checkoutForm.data.customer_phone}
                                            onChange={(e) => checkoutForm.setData('customer_phone', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                                        />
                                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {checkoutForm.errors.customer_phone && (
                                        <p className="text-xs text-rose-500 mt-1">{checkoutForm.errors.customer_phone}</p>
                                    )}
                                </div>

                                {/* Delivery Address */}
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">
                                        সম্পূর্ণ ডেলিভারি ঠিকানা *
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            required
                                            rows={2}
                                            placeholder="বাসা/রোড নম্বর, এলাকা, থানা ও জেলার নাম..."
                                            value={checkoutForm.data.shipping_address}
                                            onChange={(e) => checkoutForm.setData('shipping_address', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                        />
                                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                    </div>
                                    {checkoutForm.errors.shipping_address && (
                                        <p className="text-xs text-rose-500 mt-1">{checkoutForm.errors.shipping_address}</p>
                                    )}
                                </div>

                                {/* Delivery Area Selection */}
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                                        ডেলিভারি এলাকা নির্বাচন করুন:
                                    </label>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {defaultShippingZones.map((zone, i) => {
                                            const isSelected = checkoutForm.data.shipping_area === zone.name;
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => checkoutForm.setData('shipping_area', zone.name)}
                                                    className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                        isSelected
                                                            ? 'border-emerald-600 bg-emerald-50/60 shadow-2xs ring-1 ring-emerald-600/30'
                                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>
                                                            {zone.name}
                                                        </span>
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                            isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'
                                                        }`}>
                                                            {isSelected && <Check className="w-2.5 h-2.5" />}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-900 mt-1">
                                                        ৳{Number(zone.fee).toLocaleString()}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                                        পেমেন্ট মেথড:
                                    </label>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {/* COD */}
                                        <button
                                            type="button"
                                            onClick={() => checkoutForm.setData('payment_method', 'cod')}
                                            className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                                checkoutForm.data.payment_method === 'cod'
                                                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/30'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                                                    ক্যাশ অন ডেলিভারি
                                                </span>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                    checkoutForm.data.payment_method === 'cod' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'
                                                }`}>
                                                    {checkoutForm.data.payment_method === 'cod' && <Check className="w-2.5 h-2.5" />}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">পণ্য হাতে পেয়ে মূল্য দিন</p>
                                        </button>

                                        {/* bKash Manual */}
                                        <button
                                            type="button"
                                            onClick={() => checkoutForm.setData('payment_method', 'bkash_manual')}
                                            className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                                checkoutForm.data.payment_method === 'bkash_manual'
                                                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/30'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                                                    <CreditCard className="w-3.5 h-3.5" />
                                                    বিকাশ পেমেন্ট
                                                </span>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                    checkoutForm.data.payment_method === 'bkash_manual' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'
                                                }`}>
                                                    {checkoutForm.data.payment_method === 'bkash_manual' && <Check className="w-2.5 h-2.5" />}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">সেন্ড মানি / মার্চেন্ট</p>
                                        </button>
                                    </div>

                                    {/* bKash instructions if selected */}
                                    {checkoutForm.data.payment_method === 'bkash_manual' && (
                                        <div className="mt-3 p-3 rounded-xl bg-pink-50/80 border border-pink-200 text-xs space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-pink-900">
                                                    বিকাশ নম্বর: <span className="font-mono text-sm">{bkashSettings?.manual_number || '01700000000'}</span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleCopyNumber}
                                                    className="px-2 py-1 rounded bg-white text-pink-700 font-bold text-[11px] border border-pink-200 hover:bg-pink-100 transition-colors flex items-center gap-1 cursor-pointer"
                                                >
                                                    {copiedNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                    <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-pink-800 leading-relaxed">
                                                {bkashSettings?.manual_instructions?.replace('{amount}', `৳${modalGrandTotal.toLocaleString()}`).replace('{number}', bkashSettings.manual_number || '01700000000') || 'উপরে উল্লিখিত নম্বরে টাকা সেন্ড করে নিচে TrxID দিন।'}
                                            </p>
                                            <div className="grid grid-cols-2 gap-2 pt-1">
                                                <input
                                                    type="tel"
                                                    placeholder="আপনার বিকাশ নম্বর"
                                                    value={checkoutForm.data.bkash_sender_number}
                                                    onChange={(e) => checkoutForm.setData('bkash_sender_number', e.target.value)}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-pink-200 text-xs bg-white"
                                                />
                                                <input
                                                    type="text"
                                                    required={checkoutForm.data.payment_method === 'bkash_manual'}
                                                    placeholder="TrxID (ট্রানজেকশন আইডি) *"
                                                    value={checkoutForm.data.bkash_trx_id}
                                                    onChange={(e) => checkoutForm.setData('bkash_trx_id', e.target.value.toUpperCase())}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-pink-200 text-xs font-mono uppercase bg-white"
                                                />
                                            </div>
                                            {checkoutForm.errors.bkash_trx_id && (
                                                <p className="text-[11px] text-rose-600 font-medium">{checkoutForm.errors.bkash_trx_id}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Bill Breakdown */}
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-xs">
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>পণ্যের মূল্য ({checkoutQty} টি):</span>
                                        <span className="font-semibold text-gray-900">৳{modalSubtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>ডেলিভারি চার্জ ({checkoutForm.data.shipping_area}):</span>
                                        <span className="font-semibold text-gray-900">৳{shippingFee.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-1.5 flex items-center justify-between font-bold text-sm text-gray-900">
                                        <span>সর্বমোট প্রদেয় টাকা:</span>
                                        <span className="text-base text-[#dc2626] font-black">
                                            ৳{modalGrandTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Trust guarantee badge */}
                                <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 py-1">
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ১০০% খাঁটি পণ্য
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Truck className="w-3.5 h-3.5 text-emerald-600" /> দ্রুত ডেলিভারি
                                    </span>
                                </div>

                                {/* Big Red Order Submit Button */}
                                <button
                                    type="submit"
                                    disabled={checkoutForm.processing}
                                    className="w-full py-3.5 px-6 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] active:scale-[0.99] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                                >
                                    {checkoutForm.processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            অর্ডার প্রসেস হচ্ছে...
                                        </span>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5" />
                                            <span>অর্ডার কনফার্ম করুন — ৳{modalGrandTotal.toLocaleString()}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </StorefrontLayout>
    );
}
