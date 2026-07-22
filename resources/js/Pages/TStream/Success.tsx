import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

interface Props {
    activated: boolean;
    email: string | null;
}

export default function Success({ activated, email }: Props) {
    return (
        <MainLayout>
            <Head title="T-Stream Premium — Success" />
            <section className="flex min-h-[70vh] items-center justify-center bg-black px-6 text-white">
                <div className="max-w-xl text-center">
                    {activated ? (
                        <>
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-4xl">✓</div>
                            <h1 className="mt-8 text-4xl font-bold">You&apos;re Premium!</h1>
                            <p className="mt-4 text-lg text-white/70">
                                Your subscription is active{email ? <> for <span className="font-semibold text-white">{email}</span></> : null}.
                                Open the T-Stream app on your iPhone — it will pick up your
                                Premium plan automatically, and ad breaks are gone for good.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl font-bold">Almost there…</h1>
                            <p className="mt-4 text-lg text-white/70">
                                We couldn&apos;t confirm the payment yet. If you completed checkout,
                                your plan will activate within a few minutes. Otherwise, head back
                                and try again.
                            </p>
                        </>
                    )}
                    <Link
                        href="/t-stream"
                        className="mt-10 inline-block rounded-xl bg-red-600 px-8 py-3 font-semibold transition hover:bg-red-500"
                    >
                        Back to T-Stream
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}
