import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { DeletedProductColumn, ProductType } from "./DeletedProductColumn";
import { DataTable } from "../DataTable";
import { Button } from "@/Components/ui/button";

export default function DeletedProduct({
    products,
}: {
    products: ProductType[];
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Deleted Product
                </h2>
            }
        >
            <Head title="Deleted Product" />

            <div className="py-12 flex-col md:flex-row flex gap-4 px-4">
                <div className="w-full">
                    <div className="overflow-hidden bg-white shadow-sm rounded-md sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between">
                                Deleted Products
                                <Button
                                    variant={"outline"}
                                    onClick={() =>
                                        router.get(route("product.index"))
                                    }
                                >
                                    Back
                                </Button>
                            </div>
                            <DataTable
                                columns={DeletedProductColumn}
                                data={products}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
