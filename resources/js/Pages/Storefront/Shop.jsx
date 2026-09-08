import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductCard from '@/Components/Storefront/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, X } from 'lucide-react';

export default function Shop({ products, categories = [], filters = {}, meta = {} }) {
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [searchTerm, setSearchTerm] = useState(filters.q || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const handleFilterChange = (newCat, newSort, newSearch) => {
        const cat = newCat !== undefined ? newCat : selectedCategory;
        const s = newSort !== undefined ? newSort : sort;
        const q = newSearch !== undefined ? newSearch : searchTerm;

        const params = {};
        if (cat) params.category = cat;
        if (s && s !== 'latest') params.sort = s;
        if (q) params.q = q;

        router.get('/shop', params, { preserveState: true });
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchTerm('');
        setSort('latest');
        router.get('/shop');
    };

    const productList = products.data || products || [];

    return (
        <StorefrontLayout meta={meta}>
            {/* Page Header */}
            <div className="bg-emerald-900 text-white py-10 sm:py-14 border-b border-emerald-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        সকল প্রাকৃতিক ও স্বাস্থ্য পণ্য
                    </h1>
                    <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl mx-auto">
                        পুষ্টি কুঞ্জের শতভাগ খাঁটি, পরীক্ষিত ও হাইজিনিক উপায়ে প্রস্তুত অর্গানিক পণ্যসম্ভার।
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar Filters */}
                    <div className="w-full lg:w-64 shrink-0 space-y-6">
                        {/* Search in Shop */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                <Search className="w-4 h-4 text-emerald-700" /> পণ্য খুঁজুন
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(undefined, undefined, searchTerm)}
                                    placeholder="পণ্য বা কীওয়ার্ড..."
                                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            handleFilterChange(undefined, undefined, '');
                                        }}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-emerald-700" /> ক্যাটাগরি
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => {
                                        setSelectedCategory('');
                                        handleFilterChange('', undefined, undefined);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                                        !selectedCategory ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-700 hover:bg-emerald-50'
                                    }`}
                                >
                                    <span>সকল পণ্য</span>
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategory(cat.slug);
                                            handleFilterChange(cat.slug, undefined, undefined);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                                            selectedCategory === cat.slug ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-700 hover:bg-emerald-50'
                                        }`}
                                    >
                                        <span className="truncate">{cat.name}</span>
                                        {cat.products_count !== undefined && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                selectedCategory === cat.slug ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {cat.products_count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Product Grid */}
                    <div className="flex-1 space-y-6">
                        {/* Top Toolbar */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm font-medium text-gray-600">
                                মোট <span className="font-bold text-emerald-800">{products.total || productList.length}</span> টি পণ্য পাওয়া গেছে
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <ArrowUpDown className="w-4 h-4 text-gray-500 shrink-0" />
                                    <select
                                        value={sort}
                                        onChange={(e) => {
                                            setSort(e.target.value);
                                            handleFilterChange(undefined, e.target.value, undefined);
                                        }}
                                        className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:border-emerald-600"
                                    >
                                        <option value="latest">নতুন পণ্য (Newest)</option>
                                        <option value="popular">সর্বাধিক জনপ্রিয় (Popular)</option>
                                        <option value="price_low">দাম: কম থেকে বেশি</option>
                                        <option value="price_high">দাম: বেশি থেকে কম</option>
                                    </select>
                                </div>

                                {(selectedCategory || searchTerm || sort !== 'latest') && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-rose-600 hover:underline font-semibold shrink-0"
                                    >
                                        রিসেট
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Products List */}
                        {productList.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    কোনো পণ্য পাওয়া যায়নি
                                </h3>
                                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                    আপনার খোঁজা ফিল্টারে কোনো পণ্য মেলেনি। অন্য ক্যাটাগরি বা কীওয়ার্ড দিয়ে চেষ্টা করুন।
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
                                >
                                    সকল পণ্য দেখুন
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                {productList.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {products.links && products.links.length > 3 && (
                            <div className="flex justify-center items-center gap-1 pt-6">
                                {products.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                            link.active
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : link.url
                                                ? 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                                                : 'text-gray-300 pointer-events-none'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
