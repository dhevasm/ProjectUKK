import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { ProductsColumn, ProductType } from "./ProductColumn";
import { DataTable } from "../DataTable";
import { Button } from "@/Components/ui/button";
import { Trash2, PackagePlus } from "lucide-react";

export default function ProductTable({
    products,
    totalTrash,
}: {
    products: ProductType[];
    totalTrash: number;
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-12 flex-col md:flex-row flex gap-4 px-4">
                <div className="w-full">
                    <div className="overflow-hidden bg-white dark:bg-customDark shadow-sm dark:shadow-slate-800/50 rounded-md sm:rounded-lg border dark:border-slate-800 transition-colors duration-300
">
                        <div className="p-6 text-gray-900 dark:text-gray-200">
                            <div className="flex justify-between">
                                Manage Products
                                <div className="flex gap-2">
                                    <Button
                                        variant={"outline"}
                                        onClick={() =>
                                            router.get(route("product.create"))
                                        }
                                    >
                                        <PackagePlus />{" "}
                                        <span className="hidden md:block">
                                            New Product
                                        </span>
                                    </Button>
                                    <Button
                                        variant={"outline"}
                                        onClick={() =>
                                            router.get(route("product.trash"))
                                        }
                                        className="relative"
                                    >
                                        <Trash2 className="relative z-10" />
                                        {totalTrash > 0 && (
                                            <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                                {totalTrash}
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <DataTable
                                columns={ProductsColumn}
                                data={products}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
