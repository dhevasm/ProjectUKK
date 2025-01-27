import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/Components/ui/button';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { router } from '@inertiajs/react';
import  { JwtPayload } from "jwt-decode";

interface GoogleJwtPayload extends JwtPayload {
    name: string;
    email: string;
    picture: string;
    sub: string;
  }

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleGoogleOAuth = (response: any) => {
        const decoded = jwtDecode<GoogleJwtPayload>(response.credential);

        router.post(route('googleOauthHandle'), {
          'name': decoded.name,
          'email': decoded.email,
          'picture': decoded.picture,
          'password': decoded.sub,
        });
      };

      const handleGoogleOAuthError = (error : any) => {
        console.log(error);
      }


    return (
        <GuestLayout>
            <Head title="Login" />
                <h1 className='text-center mb-6 text-3xl font-bold text-gray-800 dark:text-gray-200'>Login</h1>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="email" value="Email" className="mb-2" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
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
                                autoComplete="current-password"
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
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-[var(--app-color)] hover:text-[var(--app-hover-color)] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <Button
                        variant="default"
                        className="w-full mt-4  bg-[var(--app-color)] text-white hover:bg-[var(--app-hover-color)]"
                        disabled={processing}
                    >
                        Log in
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-customDark dark:text-gray-200 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="d-flex flex-col w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleOAuth}
                            onError={() => handleGoogleOAuthError}
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account? {' '}
                            <Link
                                href={route('register')}
                                className="text-[var(--app-color)] hover:text-[var(--app-hover-color)] hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
        </GuestLayout>
    );
}
