import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('pk_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem('pk_cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart to storage', e);
        }
    }, [cart]);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const addToCart = (product, quantity = 1, openDrawer = true, variant = null) => {
        const variantName = variant ? (variant.name || variant) : (product.weight || '');
        const itemKey = `${product.id}-${variantName}`;

        let itemPrice = product.sale_price && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price)
            ? Number(product.sale_price)
            : Number(product.price);

        let itemOrigPrice = Number(product.price);

        if (variant && typeof variant === 'object') {
            const vSale = variant.sale_price ? Number(variant.sale_price) : null;
            const vReg = variant.price ? Number(variant.price) : null;
            if (vSale && vSale > 0 && vReg && vSale < vReg) {
                itemPrice = vSale;
                itemOrigPrice = vReg;
            } else if (vReg && vReg > 0) {
                itemPrice = vReg;
                itemOrigPrice = vReg;
            }
        }

        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => (item.key === itemKey) || (item.id === product.id && item.weight === variantName));
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            } else {
                return [
                    ...prev,
                    {
                        key: itemKey,
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        sku: product.sku,
                        price: itemPrice,
                        originalPrice: itemOrigPrice,
                        image: (product.images && product.images.length > 0) ? product.images[0] : (product.primary_image || '/images/placeholder.jpg'),
                        weight: variantName,
                        variant_name: variantName,
                        quantity: quantity,
                    }
                ];
            }
        });

        showToast(`${product.name} (${variantName}) কার্টে যোগ করা হয়েছে!`);
        if (openDrawer) {
            setIsCartOpen(true);
        }
    };

    const removeFromCart = (identifier) => {
        setCart((prev) => prev.filter((item) => item.key !== identifier && item.id !== identifier));
    };

    const updateQuantity = (identifier, delta) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.key === identifier || item.id === identifier) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                cartSubtotal,
                isCartOpen,
                setIsCartOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                toastMessage,
                showToast,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
