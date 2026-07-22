import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Landing() {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const subscribe: FormEventHandler = (e) => {
        e.preventDefault();
        post('/t-stream/checkout');
    };

    return (
        <MainLayout>
            <Head title="T-Stream — Your iPhone on your Tesla screen" />

            {/* Hero */}
            <section className="bg-black text-white">
                <div className="mx-auto max-w-5xl px-6 pb-20 pt-28 text-center">
                    <h1 className="text-5xl font-extrabold tracking-[0.3em] sm:text-6xl">
                        T-<span className="text-red-600">STREAM</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-xl text-white/70">
                        Mirror your entire iPhone to your Tesla&apos;s touchscreen. No cables,
                        no hacks — your phone&apos;s hotspot and the in-car browser do the rest.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <div className="rounded-xl border border-white/20 px-8 py-4 text-white/50">
                            <span className="block text-xs uppercase tracking-widest">Coming soon to the</span>
                            <span className="text-2xl font-semibold text-white/80"> App Store</span>
                        </div>
                        <a
                            href="#premium"
                            className="rounded-xl bg-red-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-red-500"
                        >
                            Go Premium — $6.99/mo
                        </a>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-zinc-950 py-20 text-white">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="text-center text-3xl font-bold">How it works</h2>
                    <div className="mt-12 grid gap-8 sm:grid-cols-3">
                        {[
                            {
                                step: '1',
                                title: 'Connect',
                                body: "Turn on your iPhone's Personal Hotspot and join it from your Tesla's Wi-Fi. Pair Bluetooth so audio plays in the car.",
                            },
                            {
                                step: '2',
                                title: 'Stream',
                                body: 'Tap Stream in the app. Your whole iPhone screen goes live — any app, any content you have the rights to view.',
                            },
                            {
                                step: '3',
                                title: 'Watch',
                                body: 'Open the Tesla browser, type the address the app shows you, tap Accept. Rotate and fill controls right on the car screen.',
                            },
                        ].map((item) => (
                            <div key={item.step} className="rounded-2xl border border-white/10 bg-white/5 p-8">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-lg font-bold">
                                    {item.step}
                                </div>
                                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                                <p className="mt-2 text-white/60">{item.body}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-10 text-center text-sm text-white/40">
                        For use while parked or by passengers. Keep your eyes on the road.
                    </p>
                </div>
            </section>

            {/* Pricing */}
            <section id="premium" className="bg-black py-20 text-white">
                <div className="mx-auto max-w-4xl px-6">
                    <h2 className="text-center text-3xl font-bold">Pricing</h2>
                    <div className="mt-12 grid gap-8 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                            <h3 className="text-2xl font-semibold">Free</h3>
                            <p className="mt-1 text-4xl font-extrabold">$0</p>
                            <ul className="mt-6 space-y-3 text-white/70">
                                <li>✓ Full screen mirroring</li>
                                <li>✓ Bluetooth audio in the car</li>
                                <li>✓ Rotation &amp; display controls</li>
                                <li className="text-white/40">— Short ad break every 2 minutes</li>
                            </ul>
                        </div>
                        <div className="rounded-2xl border-2 border-red-600 bg-white/5 p-8">
                            <h3 className="text-2xl font-semibold">
                                Premium <span className="ml-2 rounded-full bg-red-600 px-3 py-1 text-xs uppercase tracking-wider">No ads</span>
                            </h3>
                            <p className="mt-1 text-4xl font-extrabold">
                                $6.99<span className="text-lg font-normal text-white/50">/month</span>
                            </p>
                            <ul className="mt-6 space-y-3 text-white/70">
                                <li>✓ Everything in Free</li>
                                <li>✓ Zero ad breaks — ever</li>
                                <li>✓ Supports new features first</li>
                                <li>✓ Cancel anytime</li>
                            </ul>
                            <form onSubmit={subscribe} className="mt-8">
                                <label className="block text-sm text-white/60" htmlFor="email">
                                    Use the same email you sign in with in the T-Stream app
                                </label>
                                <div className="mt-2 flex gap-2">
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full rounded-lg border-white/20 bg-black/60 text-white placeholder-white/30 focus:border-red-600 focus:ring-red-600"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="whitespace-nowrap rounded-lg bg-red-600 px-6 font-semibold transition hover:bg-red-500 disabled:opacity-50"
                                    >
                                        {processing ? '…' : 'Subscribe'}
                                    </button>
                                </div>
                                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer / legal */}
            <section className="border-t border-white/10 bg-black py-10 text-center text-sm text-white/40">
                <div className="mx-auto max-w-4xl space-y-3 px-6">
                    <p>
                        <Link href="/tstream/terms" className="underline hover:text-white/70">Terms of Service</Link>
                        <span className="mx-3">·</span>
                        <Link href="/tstream/privacy" className="underline hover:text-white/70">Privacy Policy</Link>
                    </p>
                    <p>
                        T-Stream is a product of Pardia. Not affiliated with, endorsed by, or sponsored by Tesla, Inc.
                        TESLA and the Tesla models are trademarks of Tesla, Inc.
                    </p>
                </div>
            </section>
        </MainLayout>
    );
}
