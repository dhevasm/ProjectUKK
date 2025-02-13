import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown, Trash2, Pencil, Check, X, Truck, Package } from "lucide-react";
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
} from "@/Components/ui/alert-dialog";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { User, Product, dataUndangan } from "@/types";


export type DeliveryType = {
    id: number;
    user: User;
    name: string;
    phone: string;
    address: string;
    coordinate: string;
    status: string;
};

export const DeliveryColumn: ColumnDef<DeliveryType>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap">
                   Delivery Id
                </div>
            );
        },
    },
    {
        accessorKey: "user.id",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap">
                   User Id
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => {
            const phone: string = row.getValue('phone');
            return (
                <a className='text-green-500 underline' href={`https://wa.me/${phone}`} target='_blank'>
                    {phone}
                </a>
            );
        }
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
            <span className='cursor-pointer truncate'>{truncatedAddress}</span>
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
        accessorKey: "coordinate",
        header: "Coordinate",
        },
        {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {

            const status: string = row.getValue("status");
            const statusColor = status === "proccess" ? "yellow" :  status === "pending"? "gray" : status === "delivery"? "blue" : status === "cancelled" ? "red" : status === "refund" ? "red" : "green";
            return (
            <span className={`badge bg-${statusColor}-500 text-white px-3 rounded-full text-xs flex items-center justify-center`}>
                {status}
            </span>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Tanggal Transaksi
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date: string = row.getValue("created_at");
            const formattedDate = new Date(date);
            return (
                <div className="text-center">
                    {`${String(formattedDate.getDate()).padStart(
                        2,
                        "0"
                    )}-${String(formattedDate.getMonth() + 1).padStart(
                        2,
                        "0"
                    )}-${formattedDate.getFullYear()}`}
                </div>
            );
        },
    },
    {
        accessorKey: "id",
        header: "Action",
        cell: ({ row }) => {
            const deliveryStatus = row.getValue("status");

            return (
                 <div className="flex justify-center gap-2">
                {
                    deliveryStatus == "pending" &&  <Button title="Kirim Paket" onClick={() => {
                        router.get(route("delivery.changeStatus", { id: row.getValue("id"), status: "delivery" }));
                    }} className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-sm text-white rounded h-8">
                        <Truck />
                    </Button>
                }
                {
                    deliveryStatus == "delivery" &&
                    <Button title="Paket Sampai Tujuan" onClick={() => {
                        router.get(route("delivery.changeStatus", { id: row.getValue("id"), status: "delivered" }));
                    }} className="bg-green-500 hover:bg-green-600 px-2 py-1 text-sm text-white rounded h-8">
                        <Package />
                    </Button>
                }
                </div>
            )
        }
    },


];
