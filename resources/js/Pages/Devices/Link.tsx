import React, { FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '@/Layouts/MainLayout';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export default function LinkDevice() {
    const { data, setData, post, processing, errors } = useForm({
        device_id: '',
        nickname: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('devices.store'));
    };

    return (
        <MainLayout>
            <Head title="Link Your Device" />

            <section className="relative overflow-hidden bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            className="w-full max-w-lg"
                        >
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    Link Your Device
                                </h1>
                                <p className="mt-3 text-lg text-gray-500">
                                    Connect your Mac to get personalized product recommendations based on your device's health data.
                                </p>
                            </div>

                            {/* Form Card */}
                            <motion.div
                                variants={fadeInUp}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100"
                            >
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Device ID Input */}
                                    <div>
                                        <label htmlFor="device_id" className="block text-sm font-medium text-gray-900">
                                            Device ID
                                        </label>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Open Pardia Battery Management on your Mac and find your Device ID in Settings.
                                        </p>
                                        <input
                                            id="device_id"
                                            type="text"
                                            value={data.device_id}
                                            onChange={(e) => setData('device_id', e.target.value.trim())}
                                            placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                                            className="mt-2 block w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#0071e3] transition-all"
                                            required
                                        />
                                        {errors.device_id && (
                                            <p className="mt-2 text-sm text-red-600">{errors.device_id}</p>
                                        )}
                                    </div>

                                    {/* Nickname Input */}
                                    <div>
                                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-900">
                                            Device Nickname
                                            <span className="ml-1 text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <input
                                            id="nickname"
                                            type="text"
                                            value={data.nickname}
                                            onChange={(e) => setData('nickname', e.target.value)}
                                            placeholder="e.g. My MacBook Pro"
                                            className="mt-2 block w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#0071e3] transition-all"
                                            maxLength={100}
                                        />
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={processing || !data.device_id}
                                        className="w-full rounded-xl bg-[#0071e3] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0077ED] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Linking...' : 'Link Device'}
                                    </button>
                                </form>
                            </motion.div>

                            {/* How it works */}
                            <motion.div
                                variants={fadeInUp}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mt-10"
                            >
                                <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
                                    How it works
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <Step
                                        number={1}
                                        title="Install PBM"
                                        description="Download Pardia Battery Management for your Mac"
                                    />
                                    <Step
                                        number={2}
                                        title="Find your ID"
                                        description="Open PBM Settings to find your unique Device ID"
                                    />
                                    <Step
                                        number={3}
                                        title="Get recommendations"
                                        description="We'll suggest products tailored to your device's needs"
                                    />
                                </div>
                            </motion.div>

                            {/* Skip Link */}
                            <div className="mt-8 text-center">
                                <Link
                                    href={route('home')}
                                    className="text-sm text-gray-400 transition-colors hover:text-gray-600"
                                >
                                    Skip for now — I'll do this later
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
    return (
        <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                {number}
            </div>
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
    );
}
