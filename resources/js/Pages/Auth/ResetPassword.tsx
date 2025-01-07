import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/Components/ui/button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fungsi untuk validasi kekuatan password
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(data.password);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Reset Password</h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Create a new secure password for your account
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="email" value="Email" className="mb-2" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="New Password" className="mb-2" />
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-10"
                                autoComplete="new-password"
                                isFocused={true}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                        </div>
                        {/* Password Strength Indicator */}
                        <div className="mt-1 h-1 w-full bg-gray-200 rounded">
                            <div
                                className={`h-1 rounded transition-all duration-300 ${
                                    passwordStrength === 0 ? 'bg-red-500 w-[20%]' :
                                    passwordStrength === 1 ? 'bg-red-500 w-[40%]' :
                                    passwordStrength === 2 ? 'bg-yellow-500 w-[60%]' :
                                    passwordStrength === 3 ? 'bg-green-500 w-[80%]' :
                                    'bg-green-500 w-full'
                                }`}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {passwordStrength === 0 && "Very weak password"}
                            {passwordStrength === 1 && "Weak password"}
                            {passwordStrength === 2 && "Moderate password"}
                            {passwordStrength === 3 && "Strong password"}
                            {passwordStrength >= 4 && "Very strong password"}
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className="mb-2"
                        />
                        <div className="relative">
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-10"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                        </div>
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <Button
                        variant="default"
                        className="w-full mt-4  bg-[var(--app-color)] text-white hover:bg-[var(--app-hover-color)]"
                        disabled={processing}
                    >
                        {processing ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-4">
                    <Link
                        href={route('login')}
                        className="text-[var(--app-color)] hover:text-[var(--app-hover-color)] hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
        </GuestLayout>
    );
}
