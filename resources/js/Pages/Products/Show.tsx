import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PageProps, Product } from '@/types';

interface CompatibleDevice {
    nickname: string;
    model_identifier: string;
    needs_product: boolean;
}

interface Props extends PageProps {
    product: Product;
    relatedProducts: Product[];
    compatibleDevices: CompatibleDevice[];
}

function FeatureIcon({ index }: { index: number }) {
    const icons = [
        // Lightning bolt
        <svg key="bolt" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>,
        // Shield check
        <svg key="shield" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>,
        // Cog
        <svg key="cog" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>,
        // Sparkles
        <svg key="sparkles" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>,
        // Cube
        <svg key="cube" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>,
        // Chart
        <svg key="chart" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>,
        // Globe
        <svg key="globe" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>,
        // Clock
        <svg key="clock" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>,
    ];

    return icons[index % icons.length];
}

function getHeroGradient(type: string) {
    if (type === 'software') {
        return 'from-slate-50 via-blue-50 to-indigo-50';
    }
    return 'from-slate-50 via-emerald-50 to-teal-50';
}

function getAccentColor(type: string) {
    if (type === 'software') {
        return 'from-blue-400 via-blue-500 to-indigo-600';
    }
    return 'from-emerald-400 via-green-500 to-teal-600';
}

function getCardGradient(type: string) {
    if (type === 'software') {
        return 'from-blue-400 via-blue-500 to-indigo-600';
    }
    return 'from-emerald-400 via-green-500 to-teal-600';
}

export default function ProductShow({ product, relatedProducts, compatibleDevices }: Props) {
    const formatPrice = (price: string) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const handleAddToCart = () => {
        router.post(route('cart.add'), { product_id: product.id });
    };

    return (
        <MainLayout>
            <Head title={product.name} />

            {/* ============================== */}
            {/* HERO SECTION - Full screen     */}
            {/* ============================== */}
            <section className={`relative min-h-screen flex items-center justify-center bg-gradient-to-b ${getHeroGradient(product.type)} overflow-hidden`}>
                {/* Subtle background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br ${getAccentColor(product.type)} opacity-[0.03] blur-3xl`} />
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${getAccentColor(product.type)} opacity-[0.05] blur-3xl`} />
                </div>

                <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center lg:px-8">
                    {/* Type Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${getAccentColor(product.type)} px-4 py-1.5 text-xs font-semibold text-white uppercase tracking-wider`}>
                            {product.type}
                        </span>
                    </motion.div>

                    {/* Device Compatibility Badge */}
                    {compatibleDevices && compatibleDevices.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="mt-4"
                        >
                            {compatibleDevices.some(d => d.needs_product) ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-medium text-red-700">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    Recommended for your {compatibleDevices.find(d => d.needs_product)?.nickname}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-1.5 text-xs font-medium text-green-700">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Compatible with your {compatibleDevices[0].nickname}
                                </span>
                            )}
                        </motion.div>
                    )}

                    {/* Product Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-8 text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl"
                    >
                        {product.name}
                    </motion.h1>

                    {/* Short Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35 }}
                        className="mx-auto mt-6 max-w-2xl text-xl text-gray-500 sm:text-2xl leading-relaxed"
                    >
                        {product.short_description || product.description}
                    </motion.p>

                    {/* Price Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-10"
                    >
                        {product.is_free ? (
                            <span className="text-2xl font-semibold text-emerald-600">Free</span>
                        ) : (
                            <span className="text-2xl font-semibold text-gray-900">
                                Starting at {formatPrice(product.price)}
                            </span>
                        )}
                    </motion.div>

                    {/* Hero CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-8 flex items-center justify-center gap-4"
                    >
                        {product.is_free ? (
                            <a
                                href={product.download_url || '#'}
                                className="inline-flex items-center rounded-full bg-[#0071e3] px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                            >
                                Download Free
                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </a>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="inline-flex items-center rounded-full bg-[#0071e3] px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                            >
                                Add to Cart
                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </button>
                        )}
                        <a
                            href="#details"
                            className="inline-flex items-center rounded-full px-8 py-3.5 text-sm font-semibold text-[#0071e3] hover:bg-blue-50 transition-colors"
                        >
                            Learn more
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                            </svg>
                        </a>
                    </motion.div>

                    {/* Product Screenshot */}
                    {product.thumbnail && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="mt-16"
                        >
                            <div className="mx-auto max-w-sm overflow-hidden rounded-2xl shadow-2xl shadow-gray-900/20 ring-1 ring-gray-900/10">
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="w-full h-auto"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center pt-2"
                    >
                        <div className="w-1 h-2 rounded-full bg-gray-400" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ============================== */}
            {/* FEATURES SECTION               */}
            {/* ============================== */}
            {product.features && product.features.length > 0 && (
                <section className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="mx-auto max-w-2xl text-center"
                        >
                            <p className="text-sm font-semibold text-[#0071e3] uppercase tracking-wider">
                                Capabilities
                            </p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                Packed with features
                            </h2>
                            <p className="mt-4 text-lg text-gray-500">
                                Everything you need, thoughtfully designed and expertly crafted.
                            </p>
                        </motion.div>

                        <div className="mx-auto mt-16 max-w-5xl">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {product.features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                            ease: [0.25, 0.1, 0.25, 1],
                                        }}
                                        className="group relative rounded-2xl bg-gray-50 p-8 transition-all duration-300 hover:bg-gray-100 hover:shadow-sm"
                                    >
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${getAccentColor(product.type)} text-white mb-5`}>
                                            <FeatureIcon index={index} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {feature}
                                        </h3>
                                        <div className="mt-3 h-0.5 w-8 rounded-full bg-gradient-to-r from-gray-200 to-transparent group-hover:w-12 transition-all duration-300" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ============================== */}
            {/* DETAILS SECTION                */}
            {/* ============================== */}
            <section id="details" className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Left: Description */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <p className="text-sm font-semibold text-[#0071e3] uppercase tracking-wider">
                                About
                            </p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Product Details
                            </h2>
                            <div className="mt-6 text-base text-gray-600 leading-7 space-y-4">
                                {product.description.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            {/* Additional Info */}
                            <div className="mt-10 grid grid-cols-2 gap-6">
                                {product.version && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Version</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{product.version}</p>
                                    </div>
                                )}
                                {product.category && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Category</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{product.category.name}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Type</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">{product.type}</p>
                                </div>
                                {product.type === 'hardware' && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">In Stock</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">
                                            {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Right: System Requirements */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            {product.system_requirements && Object.keys(product.system_requirements).length > 0 ? (
                                <>
                                    <p className="text-sm font-semibold text-[#0071e3] uppercase tracking-wider">
                                        Specifications
                                    </p>
                                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                        {product.type === 'software' ? 'System Requirements' : 'Technical Specs'}
                                    </h2>
                                    <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                                        <table className="w-full">
                                            <tbody>
                                                {Object.entries(product.system_requirements).map(([key, value], index) => (
                                                    <tr key={key} className={index !== 0 ? 'border-t border-gray-100' : ''}>
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-500 whitespace-nowrap align-top w-1/3">
                                                            {key}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-semibold text-[#0071e3] uppercase tracking-wider">
                                        Overview
                                    </p>
                                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                        At a Glance
                                    </h2>
                                    {/* Visual Placeholder */}
                                    <div className={`mt-8 aspect-square rounded-3xl bg-gradient-to-br ${getAccentColor(product.type)} p-1`}>
                                        <div className="flex h-full w-full items-center justify-center rounded-[calc(1.5rem-4px)] bg-white/90 backdrop-blur">
                                            <div className="text-center">
                                                {product.type === 'software' ? (
                                                    <svg className="mx-auto w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="mx-auto w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                    </svg>
                                                )}
                                                <p className="mt-4 text-sm text-gray-400">{product.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================== */}
            {/* PURCHASE SECTION               */}
            {/* ============================== */}
            <section className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            {product.is_free ? 'Get started for free' : 'Ready to get started?'}
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            {product.is_free
                                ? 'Download now and experience the difference.'
                                : 'Add to your cart and take the next step.'}
                        </p>

                        {/* Price Display */}
                        <div className="mt-10">
                            {product.is_free ? (
                                <div className="inline-flex items-baseline gap-2">
                                    <span className="text-6xl font-bold tracking-tight text-gray-900">Free</span>
                                </div>
                            ) : (
                                <div className="inline-flex items-baseline gap-1">
                                    <span className="text-2xl font-semibold text-gray-500">$</span>
                                    <span className="text-6xl font-bold tracking-tight text-gray-900">
                                        {parseFloat(product.price).toFixed(2).split('.')[0]}
                                    </span>
                                    <span className="text-2xl font-semibold text-gray-500">
                                        .{parseFloat(product.price).toFixed(2).split('.')[1]}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            {product.is_free ? (
                                <a
                                    href={product.download_url || '#'}
                                    className="inline-flex items-center rounded-full bg-[#0071e3] px-10 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                                >
                                    Download Free
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </a>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.type === 'hardware' && product.stock <= 0}
                                    className="inline-flex items-center rounded-full bg-[#0071e3] px-10 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0071e3] disabled:hover:shadow-none"
                                >
                                    {product.type === 'hardware' && product.stock <= 0
                                        ? 'Out of Stock'
                                        : 'Add to Cart'}
                                    {(product.type !== 'hardware' || product.stock > 0) && (
                                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    )}
                                </button>
                            )}
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center rounded-full px-10 py-4 text-base font-semibold text-[#0071e3] hover:bg-blue-50 transition-colors"
                            >
                                Browse all products
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============================== */}
            {/* RELATED PRODUCTS SECTION       */}
            {/* ============================== */}
            {relatedProducts.length > 0 && (
                <section className="bg-gray-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                You might also like
                            </h2>
                            <p className="mt-4 text-lg text-gray-500">
                                Explore more products in our collection.
                            </p>
                        </motion.div>

                        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {relatedProducts.map((related, index) => (
                                <motion.div
                                    key={related.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                >
                                    <Link
                                        href={route('products.show', related.slug)}
                                        className="group block"
                                    >
                                        <div className="overflow-hidden rounded-2xl bg-white transition-all duration-500 group-hover:shadow-lg group-hover:shadow-gray-200/50">
                                            {/* Gradient Thumbnail */}
                                            <div className={`relative aspect-[4/3] bg-gradient-to-br ${getCardGradient(related.type)} overflow-hidden`}>
                                                {related.thumbnail ? (
                                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                                        <img
                                                            src={related.thumbnail}
                                                            alt={related.name}
                                                            className="max-h-full max-w-full rounded-lg object-contain drop-shadow-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        {related.type === 'software' ? (
                                                            <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Type Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-xs font-medium text-white capitalize">
                                                        {related.type}
                                                    </span>
                                                </div>

                                                {related.is_free && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-900">
                                                            Free
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/10" />
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-5">
                                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#0071e3] transition-colors">
                                                    {related.name}
                                                </h3>
                                                {related.short_description && (
                                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                        {related.short_description}
                                                    </p>
                                                )}
                                                <div className="mt-3 flex items-center justify-between">
                                                    {related.is_free ? (
                                                        <span className="text-sm font-semibold text-emerald-600">Free</span>
                                                    ) : (
                                                        <span className="text-base font-semibold text-gray-900">
                                                            ${parseFloat(related.price).toFixed(2)}
                                                        </span>
                                                    )}
                                                    <span className="text-sm font-medium text-[#0071e3] group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center">
                                                        View
                                                        <svg className="ml-1 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
