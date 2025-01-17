import React from 'react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/Components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />
                <Link
                    href={route('login')}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-200  w-fit hover:text-[var(--app-hover-color)]"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Link>

                <div className="text-center mt-5">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Reset Password</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Forgot your password? No problem. Enter your email and we'll send you a password reset link.
                    </p>
                </div>

                {status && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Enter your email"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <Button
                        variant="default"
                        className="w-full  bg-[var(--app-color)] text-white hover:bg-[var(--app-hover-color)] flex items-center justify-center"
                        disabled={processing}
                    >
                        {processing ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-4">
                    Remember your password? {' '}
                    <Link
                        href={route('login')}
                        className="text-[var(--app-color)] hover:text-[var(--app-hover-color)] hover:underline"
                    >
                        Log in
                    </Link>
                </div>
        </GuestLayout>
    );
}
