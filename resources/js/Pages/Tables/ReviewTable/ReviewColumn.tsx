import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import {
    ArrowUpDown,
    Trash2,
    Pencil,
    Check,
    X,
    Truck,
    Package,
    Star,
} from "lucide-react";
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

export type ReviewType = {
    id: number;
    user: User;
    product: string;
    comment: string;
    rating: number;
    created_at: string;
};

export const ReviewColumn: ColumnDef<ReviewType>[] = [
    {
        accessorKey: "product.name",
        header: ({ column }) => {
            return <div className="whitespace-nowrap w-40">Produk</div>;
        },
    },
    {
        accessorKey: "user.name",
        header: ({ column }) => {
            return <div className="whitespace-nowrap">Username</div>;
        },
    },
    {
        accessorKey: "comment",
        header: "Komentar",
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating: number = row.getValue("rating");
            return (
                <div className="text-center flex">
                    {Array.from({ length: rating }, (_, i) => (
                        <Star
                            key={i}
                            className="text-yellow-400 w-5 fill-yellow-400"
                        />
                    ))}
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
                    Tanggal Review
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
            const reviewId = row.getValue("id");

            return (
                <div className="flex justify-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button
                                title="Hapus Review"
                                className="bg-red-500 hover:bg-red-600 px-2 py-1 text-sm text-white rounded h-8"
                            >
                                <X />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Apakah kamu yakin?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Anda akan menghapus review dan rating dari
                                    pengguna.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="px-0"
                                    onClick={() => {
                                        router.delete(
                                            route("review.destroy", {
                                                id: reviewId,
                                            }),
                                            {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    toast.success(
                                                        "Review Deleted.",
                                                        {
                                                            description:
                                                                "Your review has been deleted successfully.",
                                                        }
                                                    );
                                                },
                                                onError: (errors) => {
                                                    toast.error(
                                                        "Failed to delete review",
                                                        {
                                                            description:
                                                                "An error occurred : " +
                                                                Object.values(
                                                                    errors
                                                                )[0],
                                                        }
                                                    );
                                                },
                                            }
                                        );
                                    }}
                                >
                                    <Button className="bg-red-500 hover:bg-red-600 w-full px-2 py-1 text-sm rounded">
                                        Hapus
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
