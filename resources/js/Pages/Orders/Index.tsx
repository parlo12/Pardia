import MainLayout from '@/Layouts/MainLayout';
import { Order, PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface Props {
    orders: PaginatedData<Order>;
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
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}
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
        month: 'short',
        day: 'numeric',
    });
}

export default function OrdersIndex({ orders }: Props) {
    const isEmpty = orders.data.length === 0;

    return (
        <MainLayout>
            <Head title="My Orders" />

            <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        My Orders
                    </h1>
                    {!isEmpty && (
                        <p className="mt-3 text-lg text-gray-500">
                            {orders.total} {orders.total === 1 ? 'order' : 'orders'} total
                        </p>
                    )}
                </motion.div>

                {isEmpty ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-20 flex flex-col items-center text-center"
                    >
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                            No orders yet
                        </h2>
                        <p className="mt-2 text-base text-gray-500 max-w-md">
                            You haven't placed any orders yet. Browse our products and find something perfect for your device.
                        </p>
                        <Link
                            href={route('products.index')}
                            className="mt-8 inline-flex items-center rounded-full bg-[#0071e3] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#0077ED] active:scale-[0.98]"
                        >
                            Browse Products
                            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </motion.div>
                ) : (
                    /* Orders List */
                    <div className="mt-10 space-y-4">
                        {orders.data.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <Link
                                    href={route('orders.show', order.order_number)}
                                    className="group block rounded-2xl bg-gray-50 p-6 transition-all duration-300 hover:bg-gray-100 hover:shadow-sm"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {order.order_number}
                                            </h3>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">
                                                {formatDate(order.created_at)}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="mt-4 flex items-center gap-3">
                                        {order.items.slice(0, 4).map((item) => (
                                            <div
                                                key={item.id}
                                                className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-white"
                                            >
                                                {item.product?.thumbnail ? (
                                                    <img
                                                        src={item.product.thumbnail}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {order.items.length > 4 && (
                                            <span className="text-xs text-gray-400">
                                                +{order.items.length - 4} more
                                            </span>
                                        )}
                                        <div className="ml-auto flex items-center gap-1.5">
                                            <span className="text-xs text-gray-400">
                                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                            </span>
                                            <svg className="h-4 w-4 text-gray-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#0071e3]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Pagination */}
                        {orders.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {orders.links.map((link, i) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={i}
                                                className="px-3 py-2 text-sm text-gray-300"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-[#0071e3] text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
