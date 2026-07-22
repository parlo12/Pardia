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

export default function Terms() {
    return (
        <MainLayout>
            <Head title="T-Stream Terms of Service" />
            <div className="bg-black py-24 text-white">
                <div className="mx-auto max-w-3xl px-6">
                    <h1 className="text-4xl font-bold">T-Stream Terms of Service</h1>
                    <p className="mt-2 text-white/50">Effective date: July 21, 2026 · Pardia (“we”, “us”)</p>

                    <Section title="1. The service">
                        <p>
                            T-Stream is an iPhone app that mirrors your phone&apos;s screen to a vehicle&apos;s
                            web browser over your phone&apos;s Personal Hotspot. By downloading or using
                            T-Stream you agree to these terms.
                        </p>
                    </Section>

                    <Section title="2. Safety — read this one">
                        <p>
                            <strong className="text-white">Never watch or interact with a stream while driving.</strong>{' '}
                            T-Stream is intended for use while parked or by passengers. You are solely
                            responsible for complying with all traffic laws and your vehicle
                            manufacturer&apos;s guidance. We are not liable for accidents, citations, or
                            damages arising from use of the app while a vehicle is in motion.
                        </p>
                    </Section>

                    <Section title="3. Your account">
                        <p>
                            You sign in with Apple or Google. You&apos;re responsible for activity under your
                            account. You must be at least 13 years old (or the age of digital consent in
                            your country).
                        </p>
                    </Section>

                    <Section title="4. Subscriptions & billing">
                        <ul className="list-disc space-y-2 pl-6">
                            <li>The free tier shows periodic ad breaks during streaming.</li>
                            <li>
                                Premium costs <strong className="text-white">$6.99/month</strong>, billed through
                                the App Store or through Stripe on this website, and renews automatically until
                                cancelled.
                            </li>
                            <li>
                                Cancel anytime — via your Apple subscription settings, or for website
                                subscriptions by emailing{' '}
                                <a href="mailto:support@pardia.io" className="text-red-500 underline">support@pardia.io</a>.
                                Cancellation takes effect at the end of the current billing period; fees already
                                paid are non-refundable except where required by law.
                            </li>
                        </ul>
                    </Section>

                    <Section title="5. Acceptable use">
                        <p>
                            Stream only content you have the right to view and display. You may not use
                            T-Stream to violate any law, any third party&apos;s rights, or any streaming
                            service&apos;s terms. We may suspend accounts that abuse the service.
                        </p>
                    </Section>

                    <Section title="6. Not affiliated with Tesla">
                        <p>
                            T-Stream is an independent product of Pardia. It is not affiliated with,
                            endorsed by, or sponsored by Tesla, Inc. TESLA, MODEL S, MODEL 3, MODEL X,
                            MODEL Y, and CYBERTRUCK are trademarks of Tesla, Inc. Vehicle browser behavior
                            may change at any time via manufacturer software updates, which are outside our
                            control.
                        </p>
                    </Section>

                    <Section title="7. Disclaimers & limitation of liability">
                        <p>
                            T-Stream is provided “as is” without warranties of any kind. To the maximum
                            extent permitted by law, our total liability for any claim related to the
                            service is limited to the amount you paid us in the 12 months before the claim
                            arose.
                        </p>
                    </Section>

                    <Section title="8. Changes">
                        <p>
                            We may update these terms; material changes will be announced in the app or by
                            email. Continued use after changes take effect constitutes acceptance.
                        </p>
                    </Section>

                    <Section title="9. Contact">
                        <p>
                            Pardia ·{' '}
                            <a href="mailto:support@pardia.io" className="text-red-500 underline">support@pardia.io</a>
                        </p>
                    </Section>
                </div>
            </div>
        </MainLayout>
    );
}
