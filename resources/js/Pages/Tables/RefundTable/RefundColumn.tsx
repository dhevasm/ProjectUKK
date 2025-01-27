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
import { Textarea } from "@/Components/ui/textarea";


interface Payment{
    id: string;
    order_id: string;
    snap_token: string;
    user: User;
    payment_method: string;
    gross_amount: number;
    status: string;
}

export type RefundType = {
    id: number;
    user: User;
    payment: Payment;
    reason: string;
    status: string;
    no_rekening: number;
    name: string;
    bank: string
    created_at: string;
};

export const RefundColumn: ColumnDef<RefundType>[] = [
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
                <div className="">
                   Username
                </div>
            );
        },
    },

    {
        accessorKey: "reason",
        header: ({ column }) => {
            return (
                <div className="w-40">
                   Alasan
                </div>
            );
        },
    },
    {
        accessorKey: "payment.gross_amount",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap">
                  Nilai Refund
                </div>
            );
        },
    },
    {
        accessorKey: "no_rekening",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap">
                  No Rekening
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div className="whitespace-nowrap">
                   Nama Rekening
                </div>
            );
        },
    },
    {
        accessorKey: "bank",
        header: "Bank",
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

            const [message, setMessage] = useState<string>("");

            const handleReject = () => {
                router.post(route("refund.changeStatus", { id: row.getValue("id") }), {
                    status : "rejected",
                    message: message
                },{
                    preserveScroll: true,
                    onSuccess: () => {
                        (document.querySelector('[data-state="open"]') as HTMLElement)?.click();
                        toast.success("Refund rejected!", {
                            description: "Refund has been rejected successfully",
                        });
                    },
                    onError: (errors: any) => {
                        (document.querySelector('[data-state="open"]') as HTMLElement)?.click();
                        toast.error("Failed to reject refund", {
                            description: "An error occurred : " + Object.values(errors)[0],
                        });
                    }
                });
            }

            return (
                 <div className="flex justify-center gap-2">
                    {
                        row.getValue("status") === "pending" && (
                            <>
                                <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button title="Tolak Refund" className="bg-red-500 hover:bg-red-600 px-2 py-1 text-sm text-white rounded h-8">
                                    <X />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tolak Refund</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <Label htmlFor="message">Enter your message:</Label>
                                        <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2 w-full" />
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <Button variant={"destructive"} onClick={handleReject}>Tolak</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button onClick={() => {
                            router.post(route("refund.changeStatus", { id: row.getValue("id")}), {status: "approved"});
                        }} title="Refund Selesai" className="bg-green-500 hover:bg-green-600 px-2 py-1 text-white text-sm rounded h-8">
                            <Check />
                        </Button>
                            </>
                        )
                    }

                </div>
            )
        }
    },


];
