import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '@/Layouts/MainLayout';
import { Product, Category } from '@/types';

const GRADIENT_PALETTES = [
    'from-blue-400 to-indigo-600',
    'from-purple-400 to-pink-500',
    'from-emerald-400 to-cyan-500',
    'from-orange-400 to-rose-500',
    'from-sky-400 to-blue-600',
    'from-violet-400 to-purple-600',
    'from-teal-400 to-emerald-500',
    'from-amber-400 to-orange-500',
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

interface Recommendation {
    product_id: number;
    product: {
        id: number;
        name: string;
        slug: string;
        short_description: string | null;
        price: string;
        is_free: boolean;
        type: string;
        thumbnail: string | null;
        features: string[] | null;
    };
    device_id: string;
    device_nickname: string | null;
    reason: string;
    severity: 'critical' | 'warning' | 'info';
    priority: number;
}

interface HomeProps {
    featuredProducts: Product[];
    categories: Category[];
    recommendations?: Recommendation[];
}

export default function Home({ featuredProducts, categories, recommendations = [] }: HomeProps) {
    return (
        <MainLayout>
            <Head title="Home" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                                Tools Built for{' '}
                                <span className="bg-gradient-to-r from-[#0071e3] to-[#40a0ff] bg-clip-text text-transparent">
                                    Tomorrow
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            Pardia creates innovative software and hardware solutions
                            that empower creators, developers, and businesses to do
                            their best work.
                        </motion.p>

                        <motion.div
                            className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center rounded-full bg-[#0071e3] px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-[#0077ED] hover:shadow-lg hover:shadow-blue-500/25"
                            >
                                Browse Products
                                <svg
                                    className="ml-2 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href={route('products.index', { is_free: '1' })}
                                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-8 py-3.5 text-base font-medium text-gray-900 transition-all hover:border-gray-300 hover:shadow-md"
                            >
                                Free Downloads
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Subtle gradient orb background decoration */}
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-r from-blue-100/40 to-purple-100/40 blur-3xl" />
                </div>
            </section>

            {/* Personalized Recommendations */}
            {recommendations.length > 0 && (
                <section className="bg-white py-20 sm:py-24 border-b border-gray-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                </svg>
                            </div>
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0071e3]">
                                Recommended for You
                            </h2>
                            <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Based on Your Device
                            </p>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
                                Personalized suggestions from your Pardia Battery Management data.
                            </p>
                        </motion.div>

                        <motion.div
                            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={staggerContainer}
                        >
                            {recommendations.map((rec) => (
                                <RecommendationCard key={rec.product_id} rec={rec} />
                            ))}
                        </motion.div>

                        <motion.div
                            className="mt-10 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                        >
                            <Link
                                href={route('devices.index')}
                                className="inline-flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
                            >
                                Manage linked devices
                                <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <section className="bg-[#f5f5f7] py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0071e3]">
                                Featured
                            </h2>
                            <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Our Best Products
                            </p>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
                                Handpicked tools and solutions that our users love
                                most.
                            </p>
                        </motion.div>

                        <motion.div
                            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={staggerContainer}
                        >
                            {featuredProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    gradientIndex={index}
                                />
                            ))}
                        </motion.div>

                        <motion.div
                            className="mt-16 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                        >
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center text-base font-medium text-[#0071e3] transition-colors hover:text-[#0077ED]"
                            >
                                View all products
                                <svg
                                    className="ml-1.5 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0071e3]">
                                Categories
                            </h2>
                            <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Explore by Category
                            </p>
                        </motion.div>

                        <motion.div
                            className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={staggerContainer}
                        >
                            {categories.map((category, index) => (
                                <motion.div key={category.id} variants={fadeInUp} transition={{ duration: 0.5 }}>
                                    <Link
                                        href={route('products.index', {
                                            category: category.slug,
                                        })}
                                        className="group block rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:border-gray-200 hover:shadow-lg"
                                    >
                                        <div
                                            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                                                GRADIENT_PALETTES[
                                                    index % GRADIENT_PALETTES.length
                                                ]
                                            }`}
                                        >
                                            <svg
                                                className="h-6 w-6 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mt-5 text-lg font-semibold text-gray-900 transition-colors group-hover:text-[#0071e3]">
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                                {category.description}
                                            </p>
                                        )}
                                        {category.products_count !== undefined && (
                                            <p className="mt-3 text-xs font-medium text-gray-400">
                                                {category.products_count}{' '}
                                                {category.products_count === 1
                                                    ? 'product'
                                                    : 'products'}
                                            </p>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            <section className="bg-gray-900 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Trusted by Creators Worldwide
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
                            Our tools power the workflows of thousands of
                            professionals and teams around the globe.
                        </p>
                    </motion.div>

                    <motion.div
                        className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={staggerContainer}
                    >
                        <StatCard label="Products" value="50+" />
                        <StatCard label="Users" value="10K+" />
                        <StatCard label="Downloads" value="100K+" />
                        <StatCard label="Countries" value="120+" />
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0071e3] to-[#40a0ff] px-8 py-20 text-center sm:px-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to build something amazing?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100">
                            Get started with our free tools or explore our premium
                            solutions to take your projects further.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center rounded-full bg-white px-8 py-3.5 text-base font-medium text-[#0071e3] transition-all hover:bg-gray-50 hover:shadow-lg"
                            >
                                Get Started
                                <svg
                                    className="ml-2 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href={route('products.index', { is_free: '1' })}
                                className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-white/10"
                            >
                                Try Free Tools
                            </Link>
                        </div>

                        {/* Decorative circles */}
                        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10" />
                    </motion.div>
                </div>
            </section>
        </MainLayout>
    );
}

function ProductCard({
    product,
    gradientIndex,
}: {
    product: Product;
    gradientIndex: number;
}) {
    const gradient =
        GRADIENT_PALETTES[gradientIndex % GRADIENT_PALETTES.length];

    return (
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <Link
                href={route('products.show', product.slug)}
                className="group block overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-xl"
            >
                {/* Gradient Thumbnail Placeholder */}
                <div
                    className={`relative aspect-[4/3] w-full bg-gradient-to-br ${gradient} overflow-hidden`}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        {product.type === 'software' ? (
                            <svg
                                className="h-16 w-16 text-white/30"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-16 w-16 text-white/30"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z"
                                />
                            </svg>
                        )}
                    </div>

                    {/* Category Badge */}
                    {product.category && (
                        <span className="absolute top-4 left-4 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {product.category.name}
                        </span>
                    )}

                    {/* Free Badge */}
                    {product.is_free && (
                        <span className="absolute top-4 right-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-600">
                            Free
                        </span>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-[#0071e3]">
                                {product.name}
                            </h3>
                            {product.short_description && (
                                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                    {product.short_description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                        <div>
                            {product.is_free ? (
                                <span className="text-lg font-bold text-green-600">
                                    Free
                                </span>
                            ) : (
                                <span className="text-lg font-bold text-gray-900">
                                    ${parseFloat(product.price).toFixed(2)}
                                </span>
                            )}
                        </div>
                        <span className="inline-flex items-center text-sm font-medium text-[#0071e3] transition-transform group-hover:translate-x-0.5">
                            View Product
                            <svg
                                className="ml-1 h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
    const severityStyles = {
        critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', dot: 'bg-red-500' },
        warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500' },
        info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-500' },
    };
    const style = severityStyles[rec.severity];

    return (
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <Link
                href={route('products.show', rec.product.slug)}
                className="group block h-full rounded-2xl bg-white p-5 ring-1 ring-gray-100 transition-all duration-300 hover:shadow-lg hover:ring-gray-200"
            >
                {/* Severity reason badge */}
                <div className={`inline-flex items-center gap-1.5 rounded-full ${style.bg} ${style.border} border px-3 py-1 mb-4`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    <span className={`text-[11px] font-medium ${style.text} line-clamp-1`}>
                        {rec.reason}
                    </span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-[#0071e3] line-clamp-2">
                    {rec.product.name}
                </h3>

                {rec.product.short_description && (
                    <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
                        {rec.product.short_description}
                    </p>
                )}

                {/* Features preview */}
                {rec.product.features && rec.product.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {rec.product.features.slice(0, 3).map((feat, i) => (
                            <span key={i} className="rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                {feat}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                    {rec.product.is_free ? (
                        <span className="text-base font-bold text-green-600">Free</span>
                    ) : (
                        <span className="text-base font-bold text-gray-900">
                            ${parseFloat(rec.product.price).toFixed(2)}
                        </span>
                    )}
                    <span className="text-xs font-medium text-[#0071e3] opacity-0 transition-opacity group-hover:opacity-100">
                        View Details
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <motion.div
            className="text-center"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
        >
            <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {value}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-400">{label}</p>
        </motion.div>
    );
}
