import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Category, PageProps, PaginatedData, Product } from '@/types';

interface Props extends PageProps {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: {
        category?: string;
        type?: string;
        search?: string;
    };
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const applyFilters = useCallback(
        (newFilters: Partial<typeof filters>) => {
            const merged = { ...filters, ...newFilters };

            // Remove empty/undefined values
            const cleaned: Record<string, string> = {};
            Object.entries(merged).forEach(([key, value]) => {
                if (value) {
                    cleaned[key] = value;
                }
            });

            router.get(route('products.index'), cleaned, {
                preserveState: true,
                preserveScroll: false,
            });
        },
        [filters],
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchQuery || undefined });
    };

    const handleCategoryFilter = (slug?: string) => {
        applyFilters({ category: slug, search: filters.search });
    };

    const handleTypeFilter = (type?: string) => {
        applyFilters({ type, category: filters.category, search: filters.search });
    };

    const isActiveCategory = (slug?: string) => {
        if (!slug) return !filters.category;
        return filters.category === slug;
    };

    const isActiveType = (type?: string) => {
        if (!type) return !filters.type;
        return filters.type === type;
    };

    const getGradientForType = (type: string) => {
        if (type === 'software') {
            return 'from-blue-400 via-blue-500 to-indigo-600';
        }
        return 'from-emerald-400 via-green-500 to-teal-600';
    };

    const formatPrice = (product: Product) => {
        if (product.is_free) return null;
        return `$${parseFloat(product.price).toFixed(2)}`;
    };

    return (
        <MainLayout>
            <Head title="Products" />

            <div className="bg-white">
                {/* Hero / Search Section */}
                <section className="bg-gray-50">
                    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                Products
                            </h1>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
                                Discover our collection of premium software and hardware solutions.
                            </p>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            onSubmit={handleSearch}
                            className="mx-auto mt-10 max-w-xl"
                        >
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full rounded-full border-0 bg-white py-3.5 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0071e3] text-sm leading-6"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            applyFilters({ search: undefined });
                                        }}
                                        className="absolute inset-y-0 right-14 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#0071e3] transition-colors"
                                >
                                    <span className="text-sm font-medium">Search</span>
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="border-b border-gray-100">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-6">
                            {/* Type Filter Pills */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-2">Type</span>
                                <button
                                    onClick={() => handleTypeFilter(undefined)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        isActiveType()
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => handleTypeFilter('software')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        isActiveType('software')
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Software
                                </button>
                                <button
                                    onClick={() => handleTypeFilter('hardware')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        isActiveType('hardware')
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Hardware
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="hidden sm:block w-px h-6 bg-gray-200" />

                            {/* Category Filter Pills */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-2">Category</span>
                                <button
                                    onClick={() => handleCategoryFilter(undefined)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        isActiveCategory()
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    All
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryFilter(category.slug)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                            isActiveCategory(category.slug)
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category.name}
                                        {category.products_count !== undefined && (
                                            <span className="ml-1.5 text-xs opacity-60">{category.products_count}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Info */}
                <section>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                {products.total} {products.total === 1 ? 'product' : 'products'} found
                            </p>
                            {(filters.search || filters.category || filters.type) && (
                                <button
                                    onClick={() => router.get(route('products.index'), {}, { preserveState: true })}
                                    className="text-sm text-[#0071e3] hover:text-blue-700 font-medium transition-colors"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {products.data.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                >
                                    <Link
                                        href={route('products.show', product.slug)}
                                        className="group block"
                                    >
                                        <div className="overflow-hidden rounded-2xl bg-gray-50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-gray-200/50">
                                            {/* Image / Gradient Placeholder */}
                                            <div className={`relative aspect-[4/3] bg-gradient-to-br ${getGradientForType(product.type)} overflow-hidden`}>
                                                {product.thumbnail ? (
                                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            className="max-h-full max-w-full rounded-lg object-contain drop-shadow-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        {product.type === 'software' ? (
                                                            <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Type Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-xs font-medium text-white capitalize">
                                                        {product.type}
                                                    </span>
                                                </div>

                                                {/* Free Badge */}
                                                {product.is_free && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-900">
                                                            Free
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/10" />
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-5">
                                                {product.category && (
                                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                        {product.category.name}
                                                    </p>
                                                )}
                                                <h3 className="mt-1.5 text-lg font-semibold text-gray-900 group-hover:text-[#0071e3] transition-colors">
                                                    {product.name}
                                                </h3>
                                                {product.short_description && (
                                                    <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
                                                        {product.short_description}
                                                    </p>
                                                )}
                                                <div className="mt-4 flex items-center justify-between">
                                                    <div>
                                                        {product.is_free ? (
                                                            <span className="text-sm font-semibold text-emerald-600">
                                                                Free
                                                            </span>
                                                        ) : (
                                                            <span className="text-lg font-semibold text-gray-900">
                                                                {formatPrice(product)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="inline-flex items-center text-sm font-medium text-[#0071e3] group-hover:translate-x-1 transition-transform duration-300">
                                                        View Details
                                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Try adjusting your search or filter criteria.
                            </p>
                            <button
                                onClick={() => router.get(route('products.index'), {}, { preserveState: true })}
                                className="mt-6 inline-flex items-center rounded-full bg-[#0071e3] px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                View all products
                            </button>
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {products.last_page > 1 && (
                    <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
                        <div className="flex items-center justify-center gap-2">
                            {/* Previous Button */}
                            {products.prev_page_url ? (
                                <Link
                                    href={products.prev_page_url}
                                    preserveState
                                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    <svg className="mr-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </Link>
                            ) : (
                                <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 cursor-not-allowed">
                                    <svg className="mr-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </span>
                            )}

                            {/* Page Numbers */}
                            <div className="hidden sm:flex items-center gap-1">
                                {Array.from({ length: products.last_page }, (_, i) => i + 1).map(
                                    (page) => {
                                        // Show limited page numbers for large page counts
                                        const current = products.current_page;
                                        const last = products.last_page;
                                        const showPage =
                                            page === 1 ||
                                            page === last ||
                                            (page >= current - 1 && page <= current + 1);
                                        const showEllipsis =
                                            (page === current - 2 && current > 3) ||
                                            (page === current + 2 && current < last - 2);

                                        if (showEllipsis) {
                                            return (
                                                <span
                                                    key={page}
                                                    className="w-10 text-center text-sm text-gray-400"
                                                >
                                                    ...
                                                </span>
                                            );
                                        }

                                        if (!showPage) return null;

                                        const queryParams: Record<string, string> = { page: String(page) };
                                        if (filters.search) queryParams.search = filters.search;
                                        if (filters.category) queryParams.category = filters.category;
                                        if (filters.type) queryParams.type = filters.type;

                                        return (
                                            <Link
                                                key={page}
                                                href={route('products.index', queryParams)}
                                                preserveState
                                                className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                                    page === current
                                                        ? 'bg-gray-900 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        );
                                    },
                                )}
                            </div>

                            {/* Mobile Page Indicator */}
                            <div className="sm:hidden flex items-center px-4">
                                <span className="text-sm text-gray-500">
                                    Page {products.current_page} of {products.last_page}
                                </span>
                            </div>

                            {/* Next Button */}
                            {products.next_page_url ? (
                                <Link
                                    href={products.next_page_url}
                                    preserveState
                                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Next
                                    <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ) : (
                                <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 cursor-not-allowed">
                                    Next
                                    <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </MainLayout>
    );
}
