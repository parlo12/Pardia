import MainLayout from '@/Layouts/MainLayout';
import { Order } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface Props {
    order: Order;
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        completed: 'bg-green-100 text-green-700',
        processing: 'bg-blue-100 text-blue-700',
        pending: 'bg-amber-100 text-amber-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}
        >
            {status}
        </span>
    );
}

function formatPrice(amount: string | number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function OrderShow({ order }: Props) {
    return (
        <MainLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link
                        href={route('orders.index')}
                        className="inline-flex items-center text-sm font-medium text-[#0071e3] transition-colors hover:text-[#0077ED]"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        All Orders
                    </Link>
                </motion.div>

                {/* Order Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-6"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                            {order.order_number}
                        </h1>
                        <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        Placed on {formatDate(order.created_at)}
                    </p>
                </motion.div>

                {/* Order Items */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-10 rounded-3xl bg-gray-50 p-8"
                >
                    <h2 className="text-sm font-semibold text-gray-900">Items</h2>
                    <ul className="mt-4 divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                            <li key={item.id}>
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
                                    className="flex items-center gap-4 py-5"
                                >
                                    {/* Product Thumbnail */}
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                                        {item.product?.thumbnail ? (
                                            <img
                                                src={item.product.thumbnail}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex flex-1 items-center justify-between">
                                        <div>
                                            {item.product ? (
                                                <Link
                                                    href={route('products.show', item.product.slug)}
                                                    className="text-sm font-medium text-gray-900 hover:text-[#0071e3] transition-colors"
                                                >
                                                    {item.product.name}
                                                </Link>
                                            ) : (
                                                <span className="text-sm font-medium text-gray-900">
                                                    Product #{item.product_id}
                                                </span>
                                            )}
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                Qty: {item.quantity} &times; {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatPrice(parseFloat(item.price) * item.quantity)}
                                        </p>
                                    </div>
                                </motion.div>
                            </li>
                        ))}
                    </ul>

                    {/* Total */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-6">
                        <p className="text-base font-semibold text-gray-900">Total</p>
                        <p className="text-xl font-semibold text-gray-900">
                            {formatPrice(order.total)}
                        </p>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 flex items-center justify-center gap-4"
                >
                    <Link
                        href={route('products.index')}
                        className="inline-flex items-center rounded-full bg-[#0071e3] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#0077ED] active:scale-[0.98]"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        href={route('orders.index')}
                        className="inline-flex items-center rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-900 transition-all hover:bg-gray-50 active:scale-[0.98]"
                    >
                        All Orders
                    </Link>
                </motion.div>
            </div>
        </MainLayout>
    );
}
