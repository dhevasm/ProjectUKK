import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/Components/ui/button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

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

    return (
        <GuestLayout>
            <Head title="Register" />
                <h1 className="text-center mb-6 text-3xl font-bold text-gray-800 dark:text-gray-200">Create Your Account</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Name" className="mb-2" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" className="mb-2" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" className="mb-2" />
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="block w-full rounded-md border-gray-300 shadow-sm pr-10"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
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
                        {/* {data.password && ( */}
                            <>
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
                            </>
                        {/* )} */}
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
                                className="block w-full rounded-md border-gray-300 shadow-sm pr-10"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
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
                        {processing ? 'Registering...' : 'Create Account'}
                    </Button>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account? {' '}
                            <Link
                                href={route('login')}
                                className="text-[var(--app-color)] hover:text-[var(--app-hover-color)] hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
        </GuestLayout>
    );
}
