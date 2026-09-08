import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { CartProvider } from './Context/CartContext';

const appName = import.meta.env.VITE_APP_NAME || 'Pusti Kunjo';

createInertiaApp({
    title: (title) => title ? `${title} — ${appName}` : `${appName} — খাঁটি ও প্রাকৃতিক স্বাস্থ্য পণ্য`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <CartProvider>
                <App {...props} />
            </CartProvider>
        );
    },
    progress: {
        color: '#0d6838',
        showSpinner: true,
    },
});
