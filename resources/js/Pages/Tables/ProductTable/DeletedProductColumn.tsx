import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown, Trash2, ArchiveRestore } from "lucide-react";
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

export type ProductType = {
    id: number;
    name: string;
    category_id: number;
    price: number;
    min_order: number;
    sold: number;
    description: string;
    visible: boolean;
    created_at: string;
};

export const DeletedProductColumn: ColumnDef<ProductType>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "category.name",
        header: () => <div className="w-20">Category</div>,
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return `Rp. ${row.getValue("price")}`;
        },
    },
    {
        accessorKey: "min_order",
        header: () => <div className="w-20">Min Order</div>,
        cell: ({ row }) => row.getValue("min_order"),
    },
    {
        accessorKey: "sold",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Sold
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.getValue("sold"),
    },
    {
        accessorKey: "description",
        header: () => <div className="w-40">Description</div>,
        cell: ({ row }) => {
            const Description: string = row.getValue("description");
            const truncatedDescription =
                Description.length > 20
                    ? Description.substring(0, 20) + "..."
                    : Description;
            return (
                <AlertDialog>
                    <AlertDialogTrigger>
                        <span className="cursor-pointer">
                            {truncatedDescription}
                        </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Full Description
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                            {Description}
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
    {
        accessorKey: "visible",
        header: () => <div className="w-20">Visible</div>,
        cell: ({ row }) => (row.getValue("visible") ? "Yes" : "No"), // Display Yes/No based on boolean
    },
    {
        accessorKey: "id",
        header: "Actions",
        cell: ({ row }) => {
            const handleDelete = (id: number) => {
                router.delete(route("product.permanentDelete", id), {
                    onSuccess: () => {
                        toast.success("Product deleted permanently");
                    },
                    onError: (errors) => {
                        toast.error("Failed to delete permanently product", {
                            description:
                                "An error occurred : " +
                                Object.values(errors)[0],
                        });
                    },
                });
            };

            const handleRestore = (id: number) => {
                router.post(route("product.restore", id), {}, {
                    onSuccess: () => {
                        toast.success("Product restore successfully");
                    },
                    onError: (errors) => {
                        toast.error("Failed to restore product", {
                            description:
                                "An error occurred : " +
                                Object.values(errors)[0],
                        });
                    },
                });
            }

            return (
                <div className="flex gap-1">
                    {/* Modal Restore */}
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-sm rounded h-8">
                                <ArchiveRestore />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure you want to restore this product?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will restore the product.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="px-0"
                                    onClick={() =>
                                        handleRestore(row.getValue("id"))
                                    }
                                >
                                    <Button className="bg-yellow-500 hover:bg-yellow-600 w-full px-2 py-1 text-sm rounded">
                                        Continue
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Modal Delete */}
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button className="bg-red-500 hover:bg-red-600 px-2 py-1 text-sm rounded h-8">
                                <Trash2 />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete account and remove data
                                    from servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="px-0"
                                    onClick={() =>
                                        handleDelete(row.getValue("id"))
                                    }
                                >
                                    <Button className="bg-red-500 hover:bg-red-600 w-full px-2 py-1 text-sm rounded">
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
