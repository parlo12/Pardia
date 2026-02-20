import MainLayout from '@/Layouts/MainLayout';
import { Order } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface Props {
    order: Order;
}

export default function Success({ order }: Props) {
    const formatPrice = (amount: string | number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <MainLayout>
            <Head title="Order Confirmed" />

            <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
                {/* Success Animation */}
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                            delay: 0.1,
                        }}
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
                    >
                        <motion.svg
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="h-10 w-10 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                        >
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </motion.svg>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                            Order Confirmed
                        </h1>
                        <p className="mt-3 text-base text-gray-500">
                            Thank you for your purchase. Your order has been
                            placed successfully.
                        </p>
                    </motion.div>
                </div>

                {/* Order Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-12 rounded-3xl bg-gray-50 p-8"
                >
                    {/* Order Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Order Number
                            </p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {order.order_number}
                            </p>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Date
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                {formatDate(order.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="mt-6 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 capitalize">
                            {order.status}
                        </span>
                    </div>

                    {/* Items List */}
                    <div className="mt-6">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Items
                        </h2>
                        <ul className="mt-4 divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                                <li key={item.id}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.6 + index * 0.08,
                                        }}
                                        className="flex items-center gap-4 py-4"
                                    >
                                    {/* Product Thumbnail */}
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                        {item.product?.thumbnail ? (
                                            <img
                                                src={item.product.thumbnail}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <svg
                                                    className="h-6 w-6 text-gray-300"
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

                                    {/* Product Info */}
                                    <div className="flex flex-1 items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {item.product?.name ??
                                                    `Product #${item.product_id}`}
                                            </h3>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatPrice(
                                                parseFloat(item.price) *
                                                    item.quantity,
                                            )}
                                        </p>
                                    </div>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Total */}
                    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
                        <p className="text-base font-semibold text-gray-900">
                            Total Paid
                        </p>
                        <p className="text-xl font-semibold text-gray-900">
                            {formatPrice(order.total)}
                        </p>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                >
                    <Link
                        href={route('products.index')}
                        className="inline-flex items-center rounded-full bg-[#0071e3] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#0077ED] active:scale-[0.98]"
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
                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-900 transition-all hover:bg-gray-50 active:scale-[0.98]"
                    >
                        View Dashboard
                    </Link>
                </motion.div>
            </div>
        </MainLayout>
    );
}
