import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { UserColumns, UserType } from './UserColumns';
import { DataTable } from '../DataTable';

interface props{
    users: UserType[];
}

export default function UserTable({ users }: props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users
                </h2>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm rounded-md sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            User Tables


                            <div className="container mx-auto py-4">
                                <DataTable columns={UserColumns} data={users} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
