import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { CategoryColumn, CategoryType } from "./CategoryColumn";
import { DataTable } from "../DataTable";
import { toast } from "sonner";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";

export default function CategoryTable({ categories }: { categories: CategoryType[] }) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [image, setImage] = useState<File | undefined>(undefined);
    const [category, setCategory] = useState("");

    const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route("category.store"), {
            name: category,
            image: image,
        },{
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Category added", {
                    description: "New category has been addded successfully",
                });
            },
            onError: (errors) => {
                toast.error("Failed to add category", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    Category
                </h2>
            }
        >
            <Head title="Categories" />

            <div className="py-12 flex-col md:flex-row flex gap-4 px-4">
                <div className="w-full md:w-1/3">
                    <div className="overflow-hidden bg-white dark:bg-customDark shadow-sm dark:shadow-slate-800/50 rounded-md sm:rounded-lg border dark:border-slate-800 transition-colors duration-300">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Add Category
                            <form onSubmit={handleAddCategory} className="container mx-auto py-4">
                                <div className="mb-4">
                                    <Label className="dark:text-gray-200">Category Name</Label>
                                    <Input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="dark:bg-customDark2 dark:border-gray-600 dark:text-gray-200"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label className="dark:text-gray-200">Category Image</Label>
                                    <Input
                                        type="file"
                                        onChange={handlePreviewImage}
                                        className="dark:bg-customDark2 dark:border-gray-600 dark:text-gray-200"
                                        required
                                    />
                                </div>
                                {previewImage && (
                                <div className="mb-4">
                                    <img src={previewImage} alt="preview" className="w-32 h-32 rounded-full object-cover" />
                                </div>
                                )}
                                <Button type="submit" variant={"theme"}>Add Category</Button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-2/3">
                    <div className="overflow-hidden bg-white dark:bg-customDark shadow-sm dark:shadow-slate-800/50 rounded-md sm:rounded-lg border dark:border-slate-800 transition-colors duration-300">
                        <div className="p-6 text-gray-900 dark:text-gray-200">
                            Manage Category
                            <div className="container mx-auto py-4">
                                <DataTable columns={CategoryColumn} data={categories} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
