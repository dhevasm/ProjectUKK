import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { TransactionColumn, TransactionType } from './TransactionColumn';
import { DataTable } from '../DataTable';
interface props {
    transactions: TransactionType[];
}

export default function UserTable({ transactions }: props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    Transactions
                </h2>
            }
        >
            <Head title="Transactions" />

            <div className="py-12 flex-col md:flex-row flex gap-4 px-4 md:px-2 md:ps-6">
                <div className="w-full">
                    <div className="overflow-hidden bg-white dark:bg-customDark shadow-sm dark:shadow-slate-800/50 rounded-md sm:rounded-lg border dark:border-slate-800 transition-colors duration-300">
                        <div className="p-6 text-gray-900 dark:text-gray-200">
                            <h3 className="text-lg font-medium">Manage Transactions</h3>

                            <div className="container mx-auto">
                                <DataTable columns={TransactionColumn} data={transactions}  />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
