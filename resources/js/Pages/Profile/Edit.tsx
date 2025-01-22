import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateImage from './Partials/UpdateImage';
import AddressInput from './Partials/AddressInput';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12 flex-col md:flex-row flex gap-4 px-4 md:px-2 md:ps-6">
                <div className="w-full space-y-6">
                    <div className='grid grid-col-1 md:grid-cols-2 gap-4'>
                        <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateImage/>
                        </div>

                        <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                        <AddressInput/>
                    </div>

                    <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
