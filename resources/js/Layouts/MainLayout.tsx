import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect } from 'react';
import { PageProps, CartItem } from '@/types';

export default function MainLayout({ children }: PropsWithChildren) {
    const { auth, cart, flash } = usePage<PageProps>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const cartCount = Object.values(cart || {}).reduce(
        (total: number, item: CartItem) => total + item.quantity,
        0,
    );

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]'
                        : 'bg-transparent'
                }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                href={route('home')}
                                className="text-xl font-semibold tracking-tight text-gray-900"
                            >
                                Pardia
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            <Link
                                href={route('products.index')}
                                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#0071e3]"
                            >
                                Products
                            </Link>
                            <Link
                                href={route('products.index', { is_free: '1' })}
                                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#0071e3]"
                            >
                                Free Tools
                            </Link>
                        </div>

                        {/* Desktop Right Side */}
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            {/* Cart Icon */}
                            <Link
                                href={route('cart.index')}
                                className="relative text-gray-600 transition-colors hover:text-[#0071e3]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#0071e3] text-[10px] font-medium text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Auth Links */}
                            {auth.user ? (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setUserDropdownOpen(!userDropdownOpen)
                                        }
                                        className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-[#0071e3]"
                                    >
                                        {auth.user.name}
                                        <svg
                                            className={`ml-1.5 h-3.5 w-3.5 transition-transform duration-200 ${
                                                userDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    {userDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            />
                                            <div className="absolute right-0 z-50 mt-3 w-48 overflow-hidden rounded-2xl bg-white py-1.5 shadow-lg ring-1 ring-black/5">
                                                <Link
                                                    href={route('devices.index')}
                                                    className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                                    onClick={() =>
                                                        setUserDropdownOpen(false)
                                                    }
                                                >
                                                    My Devices
                                                </Link>
                                                <Link
                                                    href={route('orders.index')}
                                                    className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                                    onClick={() =>
                                                        setUserDropdownOpen(false)
                                                    }
                                                >
                                                    My Orders
                                                </Link>
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                                    onClick={() =>
                                                        setUserDropdownOpen(false)
                                                    }
                                                >
                                                    Profile
                                                </Link>
                                                {auth.user.is_admin && (
                                                    <>
                                                        <div className="my-1 border-t border-gray-100" />
                                                        <Link
                                                            href={route('telemetry.index')}
                                                            className="block px-4 py-2 text-sm font-medium text-[#0071e3] transition-colors hover:bg-blue-50"
                                                            onClick={() =>
                                                                setUserDropdownOpen(false)
                                                            }
                                                        >
                                                            Telemetry
                                                        </Link>
                                                    </>
                                                )}
                                                <div className="my-1 border-t border-gray-100" />
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                                    onClick={() =>
                                                        setUserDropdownOpen(false)
                                                    }
                                                >
                                                    Log Out
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-600 transition-colors hover:text-[#0071e3]"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-[#0071e3] px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-[#0077ED]"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Right Side */}
                        <div className="flex items-center space-x-4 md:hidden">
                            <Link
                                href={route('cart.index')}
                                className="relative text-gray-600"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#0071e3] text-[10px] font-medium text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-600"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            mobileMenuOpen ? 'hidden' : 'block'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            mobileMenuOpen ? 'block' : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                        mobileMenuOpen
                            ? 'max-h-[500px] bg-white/95 backdrop-blur-xl border-t border-gray-100'
                            : 'max-h-0'
                    }`}
                >
                    <div className="space-y-1 px-4 pb-6 pt-3">
                        <Link
                            href={route('products.index')}
                            className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Products
                        </Link>
                        <Link
                            href={route('products.index', { is_free: '1' })}
                            className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Free Tools
                        </Link>

                        <div className="my-3 border-t border-gray-100" />

                        {auth.user ? (
                            <>
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    Signed in as{' '}
                                    <span className="font-medium text-gray-900">
                                        {auth.user.name}
                                    </span>
                                </div>
                                <Link
                                    href={route('devices.index')}
                                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Devices
                                </Link>
                                <Link
                                    href={route('orders.index')}
                                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Orders
                                </Link>
                                <Link
                                    href={route('profile.edit')}
                                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                {auth.user.is_admin && (
                                    <Link
                                        href={route('telemetry.index')}
                                        className="block rounded-lg px-3 py-2.5 text-base font-medium text-[#0071e3] transition-colors hover:bg-blue-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Telemetry
                                    </Link>
                                )}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full rounded-lg px-3 py-2.5 text-left text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log Out
                                </Link>
                            </>
                        ) : (
                            <div className="space-y-2 pt-2">
                                <Link
                                    href={route('login')}
                                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block rounded-full bg-[#0071e3] px-3 py-2.5 text-center text-base font-medium text-white transition-colors hover:bg-[#0077ED]"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Flash Messages */}
            <FlashMessages flash={flash} />

            {/* Main Content */}
            <main className="pt-16">{children}</main>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-[#f5f5f7]">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                        {/* Brand */}
                        <div className="sm:col-span-2 md:col-span-1">
                            <Link
                                href={route('home')}
                                className="text-lg font-semibold tracking-tight text-gray-900"
                            >
                                Pardia
                            </Link>
                            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
                                Building the future with innovative software and
                                hardware solutions designed for tomorrow.
                            </p>
                        </div>

                        {/* Products */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                                Products
                            </h3>
                            <ul className="mt-4 space-y-3">
                                <li>
                                    <Link
                                        href={route('products.index')}
                                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                                    >
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('products.index', {
                                            is_free: '1',
                                        })}
                                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                                    >
                                        Free Tools
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('products.index', {
                                            type: 'software',
                                        })}
                                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                                    >
                                        Software
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('products.index', {
                                            type: 'hardware',
                                        })}
                                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                                    >
                                        Hardware
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                                Company
                            </h3>
                            <ul className="mt-4 space-y-3">
                                <li>
                                    <span className="text-sm text-gray-500">
                                        About
                                    </span>
                                </li>
                                <li>
                                    <span className="text-sm text-gray-500">
                                        Careers
                                    </span>
                                </li>
                                <li>
                                    <span className="text-sm text-gray-500">
                                        Contact
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                                Legal
                            </h3>
                            <ul className="mt-4 space-y-3">
                                <li>
                                    <span className="text-sm text-gray-500">
                                        Privacy Policy
                                    </span>
                                </li>
                                <li>
                                    <span className="text-sm text-gray-500">
                                        Terms of Service
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <p className="text-center text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} Pardia. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FlashMessages({
    flash,
}: {
    flash: { success: string | null; error: string | null };
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash.success, flash.error]);

    if (!visible || (!flash.success && !flash.error)) {
        return null;
    }

    return (
        <div className="fixed top-20 right-4 z-[60] space-y-2">
            {flash.success && (
                <div className="animate-[slideIn_0.3s_ease-out] rounded-2xl bg-white px-5 py-3 text-sm font-medium text-green-800 shadow-lg ring-1 ring-green-200/50">
                    <div className="flex items-center space-x-2">
                        <svg
                            className="h-4 w-4 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}
            {flash.error && (
                <div className="animate-[slideIn_0.3s_ease-out] rounded-2xl bg-white px-5 py-3 text-sm font-medium text-red-800 shadow-lg ring-1 ring-red-200/50">
                    <div className="flex items-center space-x-2">
                        <svg
                            className="h-4 w-4 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
