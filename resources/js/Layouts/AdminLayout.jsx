import React from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import {
    LayoutDashboard,
    Layout,
    Package,
    FolderTree,
    ShoppingCart,
    Users,
    FileText,
    Palette,
    TrendingUp,
    Image,
    BookOpen,
    BarChart3,
    MessageSquareWarning,
    Settings,
    Shield,
    LogOut,
    ExternalLink,
    Leaf,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export default function AdminLayout({ children, title = 'Admin Panel' }) {
    const { url } = usePage();
    const { auth, flash, siteConfig } = usePage().props;

    const navItems = [
        { label: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'হোমপেজ বিল্ডার (Home)', url: '/admin/homepage-builder', icon: Layout },
        { label: 'Products', url: '/admin/products', icon: Package },
        { label: 'Orders', url: '/admin/orders', icon: ShoppingCart },
        { label: 'অভিযোগ (Complaints)', url: '/admin/complaints', icon: MessageSquareWarning },
        { label: 'Customers', url: '/admin/customers', icon: Users },
        { label: 'Pages (Builder)', url: '/admin/pages', icon: FileText },
        { label: 'Appearance', url: '/admin/appearance', icon: Palette },
        { label: 'Marketing', url: '/admin/marketing', icon: TrendingUp },
        { label: 'Media Library', url: '/admin/media', icon: Image },
        { label: 'Blog', url: '/admin/blog', icon: BookOpen },
        { label: 'Reports', url: '/admin/reports', icon: BarChart3 },
        { label: 'Settings', url: '/admin/settings', icon: Settings },
        { label: 'Users & Roles', url: '/admin/users', icon: Shield },
    ];

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <div className="admin-panel min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans">
            <Head title={`${title} — পুষ্টি কুঞ্জ এডমিন`} />

            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-emerald-950 text-white flex flex-col justify-between shrink-0 shadow-xl border-r border-emerald-900">
                <div>
                    {/* Brand */}
                    <div className="p-5 border-b border-emerald-900/80 flex items-center justify-between">
                        <Link href="/admin/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                                <Leaf className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">পুষ্টি কুঞ্জ</span>
                                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Admin v1.0</span>
                            </div>
                        </Link>
                        <Link
                            href="/"
                            target="_blank"
                            className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors"
                            title="লাইভ ওয়েবসাইট দেখুন"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <nav className="p-3.5 space-y-1.5">
                        {navItems.map((item, idx) => {
                            const IconComp = item.icon;
                            const isActive = url === item.url || (item.url !== '/admin/dashboard' && url.startsWith(item.url));
                            return (
                                <Link
                                    key={idx}
                                    href={item.url}
                                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
                                        isActive
                                            ? 'bg-emerald-700 text-white shadow-sm'
                                            : 'text-emerald-100/80 hover:bg-emerald-900 hover:text-white'
                                    }`}
                                >
                                    <IconComp className="w-5 h-5 shrink-0" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom User Info & Logout */}
                <div className="p-5 border-t border-emerald-900/80 bg-emerald-950">
                    <div className="flex items-center justify-between">
                        <div className="truncate pr-2">
                            <span className="text-sm font-extrabold text-white block truncate">{auth?.user?.name || 'Super Admin'}</span>
                            <span className="text-xs text-emerald-300 font-medium block truncate">{auth?.user?.email || 'admin@pustikunjo.com.bd'}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl bg-emerald-900 hover:bg-rose-900/80 text-emerald-300 hover:text-white transition-colors"
                            title="লগআউট"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="min-h-18 py-3 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900">{title}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 font-semibold hidden sm:inline">
                            সময়: {new Date().toLocaleDateString('bn-BD')}
                        </span>
                        <Link
                            href="/"
                            target="_blank"
                            className="text-sm font-bold px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-2 transition-colors shadow-2xs"
                        >
                            <span>ভিজিট শপ</span>
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="m-6 mb-0 p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="m-6 mb-0 p-4 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-sm font-semibold flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Content */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
