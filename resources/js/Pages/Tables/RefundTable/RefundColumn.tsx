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


export type RefundType = {
    id: number;
    user: User;
    order_id: string;
    reason: string;
    status: string;
    created_at: string;
};

export const RefundColumn: ColumnDef<RefundType>[] = [
    {
        accessorKey: "order_id",
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
                <div className="whitespace-nowrap">
                   Username
                </div>
            );
        },
    },

    {
        accessorKey: "reason",
        header: "Alasan",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status: string = row.getValue("status");
            const statusColor =  status === "pending"? "gray" : status === "rejected" ? "red" : status === "approved" ? "green" : "gray";
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
                    Tanggal Refund
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
                    <Button title="Tolak Refund" className="bg-red-500 hover:bg-red-600 px-2 py-1 text-sm text-white rounded h-8">
                            <X />
                        </Button>
                        <Button onClick={() => {
                            router.post(route("refund.changeStatus", { id: row.getValue("id"), status: "approved" }));
                        }} title="Proses Refund" className="bg-green-500 hover:bg-green-600 px-2 py-1 text-white text-sm rounded h-8">
                            <Check />
                        </Button>
                </div>
            )
        }
    },


];
