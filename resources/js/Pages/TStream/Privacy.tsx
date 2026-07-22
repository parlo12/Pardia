import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="mt-10">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <div className="mt-3 space-y-3 text-white/70">{children}</div>
        </section>
    );
}

export default function Privacy() {
    return (
        <MainLayout>
            <Head title="T-Stream Privacy Policy" />
            <div className="bg-black py-24 text-white">
                <div className="mx-auto max-w-3xl px-6">
                    <h1 className="text-4xl font-bold">T-Stream Privacy Policy</h1>
                    <p className="mt-2 text-white/50">Effective date: July 21, 2026 · Pardia (“we”, “us”)</p>

                    <Section title="The most important thing first">
                        <p>
                            <strong className="text-white">Your screen content never touches our servers.</strong> T-Stream
                            mirrors your iPhone directly to your car&apos;s browser over your phone&apos;s own
                            Personal Hotspot. The video stream travels only between your phone and your car.
                            We cannot see, store, or intercept what you stream.
                        </p>
                    </Section>

                    <Section title="What we collect">
                        <p>When you use the T-Stream app, we collect:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                <strong className="text-white">Account information</strong> — your name and email
                                address from Apple or Google sign-in (Apple lets you hide your real email; that
                                works fine with T-Stream).
                            </li>
                            <li>
                                <strong className="text-white">Vehicle information you provide</strong> — the Tesla
                                model, model year, and paint color you select during setup. We do not connect to
                                your vehicle and do not collect driving, location, or vehicle-sensor data.
                            </li>
                            <li>
                                <strong className="text-white">Usage analytics</strong> — a randomly generated
                                device identifier, app version, iOS version, subscription plan, and streaming
                                session statistics (when a stream started, how long it lasted, frames sent,
                                viewer count, and the quality settings used).
                            </li>
                            <li>
                                <strong className="text-white">Payment information</strong> — subscriptions are
                                processed by Stripe or Apple. We never see or store your card number.
                            </li>
                        </ul>
                    </Section>

                    <Section title="How we use it">
                        <ul className="list-disc space-y-2 pl-6">
                            <li>To operate the app: syncing your subscription across the app and this website.</li>
                            <li>To improve the product: understanding which quality settings, cars, and features are used.</li>
                            <li>
                                To fund the free tier: we may share <strong className="text-white">aggregated or
                                pseudonymous</strong> usage and vehicle statistics (for example, “X% of our users
                                drive a Model Y”) with advertising and analytics partners, and we may earn revenue
                                from that sharing. We do not sell your name, email, or the content of your streams.
                            </li>
                        </ul>
                    </Section>

                    <Section title="Your choices">
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                <strong className="text-white">Opt out of analytics</strong> any time in the app:
                                Settings → Privacy → “Share usage analytics.” When off, the app stops sending
                                usage data entirely.
                            </li>
                            <li>
                                <strong className="text-white">Delete your data</strong>: email{' '}
                                <a href="mailto:support@pardia.io" className="text-red-500 underline">support@pardia.io</a>{' '}
                                from your account email and we will delete your account and associated data within 30 days.
                            </li>
                            <li>
                                California and EU/EEA residents have additional rights (access, correction,
                                deletion, portability, and objection to sale/sharing). Use the same email to
                                exercise them.
                            </li>
                        </ul>
                    </Section>

                    <Section title="Retention & security">
                        <p>
                            We keep account and usage data while your account is active and for up to 12 months
                            after your last activity, then delete or anonymize it. Data is stored on servers in
                            the United States and protected with industry-standard measures (TLS in transit,
                            access controls).
                        </p>
                    </Section>

                    <Section title="Children">
                        <p>T-Stream is not directed at children under 13, and we do not knowingly collect their data.</p>
                    </Section>

                    <Section title="Changes & contact">
                        <p>
                            We&apos;ll post any changes to this policy here and update the effective date. Material
                            changes will be announced in the app. Questions:{' '}
                            <a href="mailto:support@pardia.io" className="text-red-500 underline">support@pardia.io</a>.
                        </p>
                        <p className="text-white/40">
                            T-Stream is not affiliated with, endorsed by, or sponsored by Tesla, Inc.
                        </p>
                    </Section>
                </div>
            </div>
        </MainLayout>
    );
}
