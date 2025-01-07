import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from '../Profile/Partials/DeleteUserForm';
import UpdatePasswordForm from '../Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '../Profile/Partials/UpdateProfileInformationForm';
import UpdateImage from '../Profile/Partials/UpdateImage';
import AddressInput from '../Profile/Partials/AddressInput';
import { Toaster } from 'sonner';
import Header from '@/Components/client/Header';
import Footer from '@/Components/client/Footer';

export default function Profile({
    mustVerifyEmail,
    status,
    settings,
    categories,
    auth,
}: PageProps<{ mustVerifyEmail: boolean; status?: string;}>) {
    return (
        <>
            <Head title="Profile" />
            <Header settings={settings} categories={categories} auth={auth} />
            <div className="py-12">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className='grid grid-col-1 md:grid-cols-2 gap-4'>
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateImage/>
                        </div>

                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <AddressInput/>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
            <Toaster richColors position="top-right"/>
            <Footer settings={settings} />
        </>
    );
}
