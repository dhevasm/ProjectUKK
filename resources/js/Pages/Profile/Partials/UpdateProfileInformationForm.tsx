import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Button, Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner'
import { router } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone,
            phone_verified_at: user.phone_verified_at,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
             toast.success('Data Updated.', {
                    description: 'Your data has been updated successfully.'
                });
            },
            onError: () => {
                toast.error('Failed to update data.', {
                    description: 'An error occurred while updating your data.'
                });
            }
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                    Informasi Akun
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update Username Email dan Nomor Telepon Akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />


                    <InputError className="mt-2" message={errors.email} />
                </div>
                <div>
                    <InputLabel htmlFor="phone" value="Nomor Telepon" />

                    <div className='flex items-center gap-2'>
                    <TextInput
                        id="phone"
                        type="number"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => {
                            let value = e.target.value;
                            if (value === '') {
                                value = '0';
                            }
                            // if (value.startsWith('0') || value.startsWith('62')) {
                            if (value.startsWith('0')) {
                                setData('phone', value);
                            } else {
                                toast.error('Invalid phone number.', {
                                    // description: 'Phone number must start with 0 or 62.'
                                    description: 'Phone number must start with 0.'
                                });
                            }
                        }}
                        autoComplete="tel-country-code webauthn"
                    />
                      { user.phone_verified_at === null && user.phone !== null ? (
                          <PrimaryButton type='reset' className='py-3' onClick={() => router.get(route("sendOTP"))}>Verify</PrimaryButton>
                    ) : ''}

                    </div>

                    { user.phone_verified_at === null && (
                        <p className="mt-2 text-sm text-red-600">
                            Nomor telepon Anda belum diverifikasi.
                        </p>
                    )}


                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Tersimpan.
                        </p>
                    </Transition>
                    <InputError className="mt-2" message={errors.phone} />
                </div>
            </form>
        </section>
    );
}
