import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/Components/ui/button';
import { ArrowUpDown, Trash2, Pencil, ShieldBan } from "lucide-react"
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
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export type UserType = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    phone: string;
    address: string;
    banned_until: string;
}

export const UserColumns: ColumnDef<UserType>[] = [
    {
    accessorKey: 'name',
    header: ({ column }) => {
    return (
    <Button variant="ghost" onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
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
    <Button variant="ghost" onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
    )
    },
    cell: ({ row }) => {
    return (
    <a className='text-blue-500 underline'
        href={`https://mail.google.com/mail/u/0/?tf=cm&fs=1&to=${row.getValue('email')}`}
        target='_blank'>{row.getValue('email')}</a>
    );
    }
    },
    {
    accessorKey: 'created_at',
    header: ({ column }) => {
    return (
    <Button variant="ghost" onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
    )
    },
    cell: ({ row }) => {
    const date: string = row.getValue('created_at');
    const formattedDate = new Date(date);
    return `${String(formattedDate.getDate()).padStart(2, '0')}-${String(formattedDate.getMonth() + 1).padStart(2,
    '0')}-${formattedDate.getFullYear()}`;
    },
    },
    {
    accessorKey: 'phone',
    header: 'Phone',
    },
    {
    accessorKey: 'address',
    header: () => {
        return (
            <div className='w-20'>
                Address
            </div>
        )
    },
    cell: ({ row }) => {
    const address: string = row.getValue('address');
    let truncatedAddress = "";
    if(address){
    truncatedAddress = address.length > 20 ? address.substring(0, 20) + '...' : address;
    }
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
        accessorKey: 'banned_until',
        header: () => {
            return (
                <div className='w-20 '>
                    Banned
                </div>
            )
        },
        cell: ({ row }) => {
            const bannedUntil: string = row.getValue('banned_until');
            if (bannedUntil) {
                const date = new Date(bannedUntil);
                return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            }
            return "Free";
        }
    },
    {
    accessorKey: 'id',
    header: 'Actions',
    cell: ({ row }) => {
    const userId: number = row.getValue('id');

    const handleEdit = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        router.post(route('user.update', id), {
            'name': (document.getElementById('username') as HTMLInputElement)?.value,
            'email': (document.getElementById('email') as HTMLInputElement)?.value,
            'phone': (document.getElementById('phone') as HTMLInputElement)?.value,
            'address': (document.getElementById('address') as HTMLTextAreaElement)?.value,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                (document.querySelector('[data-state="open"]') as HTMLElement)?.click();
                toast.success("User updated!", {
                    description: "User has been updated successfully",
                });
            },
            onError: (errors: any) => {
                (document.querySelector('[data-state="open"]') as HTMLElement)?.click();
                toast.error("Failed to update user", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    };

    const handleBan = (id: number) => {
        const date = document.querySelector("#inputDate") as HTMLInputElement;
        const bandate = date.value;

        router.post(route('user.ban', id), {
            date : bandate
        }, {
            preserveScroll: true,
            onSuccess: () => {
                (document.querySelector('[data-state="open"]') as HTMLElement)?.click();
                toast.success("User banned!", {
                    description: "User has been banned successfully",
                });
            },
            onError: (errors: any) => {
                (document.querySelector('[data-state="open"]') as HTMLElement)?.click();
                toast.error("Failed to ban user", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }

    const handleUnBan = (id: number) => {
        router.get(route('user.unban', id));
    }

    return (
    <div className='flex gap-1'>
        <AlertDialog>
            <AlertDialogTrigger>
                <Button  title="Edit Pengguna" className='bg-blue-500 hover:bg-blue-600 px-2 py-1 text-sm rounded h-8'>
                    <Pencil />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit User</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    <form onSubmit={(e) => handleEdit(e, row.getValue("id"))} id='' className='flex flex-col gap-2'>
                        <Label htmlFor='username'>
                            Username:
                            <Input id='username' name='username' type='text' defaultValue={row.getValue('name')} className='my-2' />
                        </Label>
                        <Label htmlFor='email'>
                            Email:
                            <Input id='email' type='email' name='email' defaultValue={row.getValue('email')}
                                className='my-2' />
                        </Label>
                        <Label htmlFor='phone'>
                            Phone:
                            <Input id='phone' type='number' name='phone' defaultValue={row.getValue('phone')}
                                className='my-2' />
                        </Label>
                        <Label htmlFor='address'>
                            Address:
                            <Textarea id='address' name='address' defaultValue={row.getValue('address')}
                                className='my-2' />
                        </Label>
                        <Button type='submit' className='bg-blue-500 hover:bg-blue-600 w-full px-2 py-1 text-sm rounded'>
                            Save Changes
                        </Button>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </form>
                </AlertDialogDescription>
            </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
            <AlertDialogTrigger>
                <Button  title="Hapus Pengguna" className='bg-red-500 hover:bg-red-600 px-2 py-1 text-sm rounded h-8'>
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
                    <AlertDialogAction className='px-0' onClick={()=> handleDelete(userId)}>
                        <Button className='bg-red-500 hover:bg-red-600 w-full px-2 py-1 text-sm rounded'>
                            Continue
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
            <AlertDialogTrigger>
                <Button  title="Blokir Pengguna" className='bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-sm rounded h-8'>
                    <ShieldBan />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ban User : {row.getValue("name")} | Status : {row.getValue("banned_until") == null ? "free" : "banned"}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    <div className='flex flex-col gap-2'>
                        <Label>
                            Ban until:
                        </Label>
                        <Input type='date' id='inputDate' className='custom-date-picker' />
                        <div className='flex gap-2'>
                            <Button onClick={() => {
                                const input = document.querySelector('#inputDate') as HTMLInputElement;
                                const date = new Date();
                                date.setDate(date.getDate() + 7);
                                input.value = date.toISOString().split('T')[0];
                            }} className='bg-gray-500 hover:bg-gray-600 px-2 py-1 text-sm rounded'>7 Days</Button>
                            <Button onClick={() => {
                                const input = document.querySelector('#inputDate') as HTMLInputElement;
                                const date = new Date();
                                date.setDate(date.getDate() + 30);
                                input.value = date.toISOString().split('T')[0];
                            }} className='bg-gray-500 hover:bg-gray-600 px-2 py-1 text-sm rounded'>30 Days</Button>
                            <Button onClick={() => {
                                const input = document.querySelector('#inputDate') as HTMLInputElement;
                                const date = new Date();
                                date.setFullYear(date.getFullYear() + 100);
                                input.value = date.toISOString().split('T')[0];
                            }} className='bg-gray-500 hover:bg-gray-600 px-2 py-1 text-sm rounded'>Forever</Button>
                            <Button  onClick={() => handleUnBan(row.getValue("id"))} className='bg-green-500 hover:bg-green-600 px-2 py-1 text-sm rounded'>Unban</Button>
                        </div>
                    </div>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='px-0'>
                        <Button onClick={() => handleBan(row.getValue("id"))} className='bg-yellow-500 hover:bg-yellow-600 w-full px-2 py-1 text-sm rounded'>
                            Confirm
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
