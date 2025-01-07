import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/Components/ui/button';
import { ArrowUpDown, Trash2 } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/Components/ui/alert-dialog"

import { router } from '@inertiajs/react';
import { toast } from 'sonner'

export type UserType = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    phone: string;
    address: string;
}

export const UserColumns: ColumnDef<UserType>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => {
            return (
                <a className='text-blue-500 underline' href={`https://mail.google.com/mail/u/0/?tf=cm&fs=1&to=${row.getValue('email')}`} target='_blank'>{row.getValue('email')}</a>
            );
        }
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => {
            const date: string = row.getValue('created_at');
            const formattedDate = new Date(date);
            return `${String(formattedDate.getDate()).padStart(2, '0')}-${String(formattedDate.getMonth() + 1).padStart(2, '0')}-${formattedDate.getFullYear()}`;
        },
        },
        {
        accessorKey: 'phone',
        header: 'Phone',
        },
        {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => {
            const address: string = row.getValue('address');
            const truncatedAddress = address.length > 30 ? address.substring(0, 30) + '...' : address;
            return (
            <AlertDialog>
                <AlertDialogTrigger>
                <span className='cursor-pointer'>{truncatedAddress}</span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Full Address</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    {address}
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            );
        }
        },
        {
        accessorKey: 'id',
        header: 'Actions',
        cell: ({ row }) => {
            const userId: number = row.getValue('id');
            return (
                <div className='flex gap-1'>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button className='bg-red-500 hover:bg-red-600 px-2 py-1 text-sm rounded h-8'>
                            <Trash2 />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete account
                                and remove data from servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='px-0' onClick={() => handleDelete(userId)}>
                                <Button className='bg-red-500 hover:bg-red-600 w-full px-2 py-1 text-sm rounded'>
                                    Continue
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            );
        },
    },
];

const handleDelete = (id: number) => {
    router.delete(route('user.destroy', id), {
        onSuccess: () => {
            toast.success('User deleted successfully');
        },
        onError: (errors) => {
            toast.error("Failed to delete user", {
                description: "An error occurred : " + Object.values(errors)[0],
            });
        }
    });
};
