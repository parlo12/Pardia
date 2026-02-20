import MainLayout from '@/Layouts/MainLayout';
import { PageProps, CartItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Cart() {
    const { cart, flash } = usePage<PageProps>().props;
    const [processing, setProcessing] = useState<number | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);

    const cartItems = Object.values(cart || {}) as CartItem[];
    const isEmpty = cartItems.length === 0;

    const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0,
    );

    const formatPrice = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handleQuantityUpdate = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setProcessing(productId);
        router.patch(
            route('cart.update'),
            { product_id: productId, quantity: newQuantity },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(null),
            },
        );
    };

    const handleRemove = (productId: number) => {
        setProcessing(productId);
        router.delete(route('cart.remove'), {
            data: { product_id: productId },
            preserveScroll: true,
            onFinish: () => setProcessing(null),
        });
    };

    const handleCheckout = () => {
        setCheckingOut(true);
        router.post(route('checkout'), {}, {
            onFinish: () => setCheckingOut(false),
        });
    };

    return (
        <MainLayout>
            <Head title="Cart" />

            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        Your Cart
                    </h1>
                    {!isEmpty && (
                        <p className="mt-3 text-lg text-gray-500">
                            {cartItems.length}{' '}
                            {cartItems.length === 1 ? 'item' : 'items'} in your
                            cart
                        </p>
                    )}
                </motion.div>

                {/* Flash Messages */}
                <AnimatePresence>
                    {flash.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-6 rounded-xl bg-green-50 border border-green-200 px-5 py-4"
                        >
                            <p className="text-sm font-medium text-green-800">
                                {flash.success}
                            </p>
                        </motion.div>
                    )}
                    {flash.error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-6 rounded-xl bg-red-50 border border-red-200 px-5 py-4"
                        >
                            <p className="text-sm font-medium text-red-800">
                                {flash.error}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isEmpty ? (
                    /* Empty Cart State */
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-20 flex flex-col items-center text-center"
                    >
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                            <svg
                                className="h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.2}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                            Your cart is empty
                        </h2>
                        <p className="mt-2 text-base text-gray-500 max-w-md">
                            Looks like you haven't added anything to your cart
                            yet. Explore our products and find something you
                            love.
                        </p>
                        <Link
                            href={route('products.index')}
                            className="mt-8 inline-flex items-center rounded-full bg-[#0071e3] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#0077ED] active:scale-[0.98]"
                        >
                            Continue Shopping
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
                    </motion.div>
                ) : (
                    /* Cart Content */
                    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-7 xl:col-span-8">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item, index) => (
                                    <motion.div
                                        key={item.product_id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{
                                            opacity: 0,
                                            x: -100,
                                            transition: { duration: 0.3 },
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.05,
                                        }}
                                        className={`flex gap-6 py-8 ${
                                            index > 0
                                                ? 'border-t border-gray-200'
                                                : ''
                                        }`}
                                    >
                                        {/* Product Image */}
                                        <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                                            {item.thumbnail ? (
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <svg
                                                        className="h-10 w-10 text-gray-300"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1}
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="text-base font-medium text-gray-900">
                                                        {item.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500 capitalize">
                                                        {item.type}
                                                    </p>
                                                </div>
                                                <p className="text-base font-medium text-gray-900">
                                                    {formatPrice(
                                                        parseFloat(item.price) *
                                                            item.quantity,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center rounded-full border border-gray-300 bg-white">
                                                    <button
                                                        type="button"
                                                        aria-label={`Decrease quantity of ${item.name}`}
                                                        onClick={() =>
                                                            handleQuantityUpdate(
                                                                item.product_id,
                                                                item.quantity -
                                                                    1,
                                                            )
                                                        }
                                                        disabled={
                                                            processing ===
                                                                item.product_id ||
                                                            item.quantity <= 1
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <svg
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={2.5}
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M5 12h14"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-medium text-gray-900">
                                                        {processing ===
                                                        item.product_id ? (
                                                            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        aria-label={`Increase quantity of ${item.name}`}
                                                        onClick={() =>
                                                            handleQuantityUpdate(
                                                                item.product_id,
                                                                item.quantity +
                                                                    1,
                                                            )
                                                        }
                                                        disabled={
                                                            processing ===
                                                            item.product_id
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <svg
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={2.5}
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 4.5v15m7.5-7.5h-15"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemove(
                                                            item.product_id,
                                                        )
                                                    }
                                                    disabled={
                                                        processing ===
                                                        item.product_id
                                                    }
                                                    className="text-sm font-medium text-[#0071e3] transition-colors hover:text-[#0077ED] disabled:opacity-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Continue Shopping Link */}
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center text-sm font-medium text-[#0071e3] transition-colors hover:text-[#0077ED]"
                                >
                                    <svg
                                        className="mr-2 h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                        />
                                    </svg>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-12 lg:col-span-5 xl:col-span-4 lg:mt-0"
                        >
                            <div className="sticky top-24 rounded-3xl bg-gray-50 p-8">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Order Summary
                                </h2>

                                <dl className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-600">
                                            Subtotal
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {formatPrice(subtotal)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-600">
                                            Shipping
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            Free
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-base font-semibold text-gray-900">
                                            Total
                                        </dt>
                                        <dd className="text-base font-semibold text-gray-900">
                                            {formatPrice(subtotal)}
                                        </dd>
                                    </div>
                                </dl>

                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    disabled={checkingOut}
                                    className="mt-8 w-full rounded-full bg-[#0071e3] px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-[#0077ED] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {checkingOut ? (
                                        <span className="inline-flex items-center">
                                            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Processing...
                                        </span>
                                    ) : (
                                        'Proceed to Checkout'
                                    )}
                                </button>

                                <div className="mt-5 flex items-center justify-center gap-2">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                        />
                                    </svg>
                                    <span className="text-xs text-gray-400">
                                        Secure checkout
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
