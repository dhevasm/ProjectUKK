import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown, Trash2, Pencil, Check, X, Truck, Printer } from "lucide-react";
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
import CartEdit from "@/Pages/Client/CartEdit";
import PaymentStatusModal from "@/Pages/Client/PaymentStatusModal";
import Summary from "./Summary";

export type TransactionType = {
    id: number;
    user: User;
    product: Product;
    data_undangan: dataUndangan;
    payment_id: string;
    delivery_id: string;
    quantity: number;
    status: string;
    created_at: string;
};

export const TransactionColumn: ColumnDef<TransactionType>[] = [
    {
        accessorKey: "payment.order_id",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap w-40">
                    Order ID
                </div>
            );
        },
    },
    {
        accessorKey: "user.name",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap w-20">
                    Name
                </div>
            );
        },
    },
    {
        accessorKey: "product.name",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap w-16">
                    Product
                </div>
            );
        },
    },

    {
        accessorKey: "data_undangan.id",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap">
                    Data Undangan
                </div>
            );
        },
        cell: ({ row }) => {
            return(
                <div className="flex justify-center">
                    <CartEdit dataUndangan={row.getValue("data_undangan")} product={row.getValue("product")} />
                </div>
            )
        },
        },
        {
        accessorKey: "quantity",
        header: "Quantity",
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
            accessorKey: "payment",
            header: "Payment",
            cell: ({ row }) => {
                return(
                    <div className="flex justify-center">
                        <PaymentStatusModal payment={row.getValue("payment")} />
                    </div>
                )
            },
        }
        ,
        {
        accessorKey: "delivery.status",
        header: "Delivery",
        },
        {
        accessorKey: "delivery.id",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap">
                    Delivery ID
                </div>
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
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Estimasi Pengerjaan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date: string = row.getValue("created_at");
            const formattedDate = new Date(date);
            formattedDate.setDate(formattedDate.getDate() + 5);
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
            const transactionStatus = row.getValue("status");

            return (
                <div className="flex justify-start gap-2">

                    {
                        transactionStatus == "pending" && <Button title="Batalkan Transaksi" onClick={() => {
                            router.get(route("transaction.changeStatus", { id: row.getValue("id"), status: "cancelled" }));
                        }} className="bg-red-500 hover:bg-red-600 px-2 py-1 text-sm text-white rounded h-8">
                            <X />
                        </Button>
                    }

                    {
                        transactionStatus == "pending" && <Button title="Proses Pesanan" onClick={() => {
                            router.get(route("transaction.changeStatus", { id: row.getValue("id"), status: "proccess" }));
                        }} className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-white text-sm rounded h-8">
                            <Check />
                        </Button>
                    }

                    {
                        transactionStatus == "proccess" &&   <Button title="Tambahkan Ke Antrian Pengiriman" onClick={() => {
                            router.get(route("transaction.changeStatus", { id: row.getValue("id"), status: "delivery" }));
                        }} className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-white text-sm rounded h-8">
                            <Truck />
                        </Button>
                    }

                    {
                        transactionStatus == "completed" || transactionStatus == "cancelled" ? <Summary quantity={parseInt(row.getValue("quantity"))} product={row.getValue("product")} payment={row.getValue("payment")} status={row.getValue("status") == "completed" ? "success" : "failed"}/>  : null
                    }


                </div>
            )
        }
    },
    {
        accessorKey: "product",
        header: "",
        cell: ({ row }) => {
            return (
                <div className="hidden">

                </div>
            );
        },
    },
    {
        accessorKey: "data_undangan",
        header: "",
        cell: ({ row }) => {
            return (
                <div className="hidden">

                </div>
            );
        },
    },





];
