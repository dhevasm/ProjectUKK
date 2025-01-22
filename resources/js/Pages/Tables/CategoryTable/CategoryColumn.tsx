import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown, Trash2, Pencil } from "lucide-react";
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

export type CategoryType = {
    id: number;
    name: string;
    image: string;
    created_at: string;
};

export const CategoryColumn: ColumnDef<CategoryType>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "image",
        header: ({ column }) => {
            return <div className="w-20">Image</div>;
        },
        cell: ({ row }) => {
            return (
                <img
                    className="w-20 h-20 rounded-full object-cover"
                    src={row.getValue("image")}
                ></img>
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
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date: string = row.getValue("created_at");
            const formattedDate = new Date(date);
            return `${String(formattedDate.getDate()).padStart(
                2,
                "0"
            )}-${String(formattedDate.getMonth() + 1).padStart(
                2,
                "0"
            )}-${formattedDate.getFullYear()}`;
        },
    },
    {
        accessorKey: "id",
        header: "Actions",
        cell: ({ row }) => {
            const categoryId: number = row.getValue("id");

            const [previewImage, setPreviewImage] = useState<string | null>(
                row.getValue("image")
            )
            const [image, setImage] = useState<File | undefined>(undefined);
            const [category, setCategory] = useState<string>(row.getValue("name"));

            const handlePreviewImage = (
                e: React.ChangeEvent<HTMLInputElement>
            ) => {
                const file = e.target.files?.[0];
                if (file) {
                    setImage(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setPreviewImage(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                }
            };

            const handleUpdateCategory = () => {
                router.post(
                    route("category.update", categoryId),
                    {
                        name: category,
                        image: image,
                    },
                    {
                        onSuccess: () => {
                            toast.success("Category added", {
                                description:
                                    "Category has been updated successfully",
                            });
                        },
                        onError: (errors) => {
                            toast.error("Failed to update category", {
                                description:
                                    "An error occurred : " +
                                    Object.values(errors)[0],
                            });
                        },
                    }
                );
            };

            const handleDelete = (id: number) => {
                router.delete(route("category.destroy", id), {
                    onSuccess: () => {
                        toast.success("Category deleted successfully");
                    },
                    onError: (errors) => {
                        toast.error("Failed to delete category", {
                            description:
                                "An error occurred : " +
                                Object.values(errors)[0],
                        });
                    },
                });
            };

            return (
                <div className="flex gap-1">
                    {/* Edit Modal */}
                    <AlertDialog onOpenChange={() => {setCategory(row.getValue("name")); setPreviewImage(row.getValue("image"))}}>
                        <AlertDialogTrigger>
                            <Button title="Edit Kategori" className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-sm rounded h-8">
                                <Pencil />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Edit Category
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    <div className="container mx-auto py-4">
                                        <div className="mb-4">
                                            <Label>Category Name</Label>
                                            <Input
                                                type="text"
                                                value={category}
                                                onChange={(e) =>
                                                    setCategory(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <Label>Category Image</Label>
                                            <Input
                                                type="file"
                                                onChange={handlePreviewImage}
                                            />
                                        </div>

                                        {previewImage && (
                                            <div className="mb-4">
                                                <img
                                                    src={previewImage}
                                                    alt="preview"
                                                    className="w-32 h-32 rounded-full object-cover"
                                                />
                                            </div>
                                        )}

                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="px-0"
                                    onClick={handleUpdateCategory}
                                >
                                    <Button className="bg-blue-500 hover:bg-blue-600 w-full px-2 py-1 text-sm rounded">
                                        Save Changes
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Delete Modal */}
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button  title="Hapus Kategori" className="bg-red-500 hover:bg-red-600 px-2 py-1 text-sm rounded h-8">
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
                                    permanently delete the category and all its products.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="px-0"
                                    onClick={() => handleDelete(categoryId)}
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
