import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ChangeEvent, useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

interface categoryType {
    id: number;
    name: string;
}

export type ProductType = {
    id: number;
    name: string;
    category_id: number;
    price: number;
    min_order: number;
    sold: number;
    stock: number;
    description: string;
    visible: boolean;
};

interface ImagesType {
    id: number;
    url: string;
    product_id: number;
}

export default function EditProduct({
    categories,
    product,
    productImages,
}: {
    categories: categoryType[];
    product: ProductType;
    productImages: ImagesType[];
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: product.name,
            category_id: product.category_id,
            price: product.price,
            stock: product.stock,
            min_order: product.min_order,
            description: product.description,
            visible: false,
            images: images,
        });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
        setData("images", [...images, ...files]);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    useEffect(() => {
        if(product.visible) {
            document.getElementById("visibleSwitch")?.click();
        }

        categories.map((category: any) => {
            if(category.id === product.category_id) {
                setSelectedCategory(category.name);
            }
        });


        productImages.map((image: any) => {
            const newPreviews = "/"+image.url;
            setPreviews((prevPreviews) => {
                if (!prevPreviews.includes(newPreviews)) {
                    return [...prevPreviews, newPreviews];
                }
                return prevPreviews;
            });
        });
    }, [])

    useEffect(() => {
        setValue(selectedCategory);
    }, [selectedCategory])

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("product.update", product.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Product Edited", {
                    description: "Product has been edited successfully",
                });
            },
            onError: (errors: any) => {
                toast.error("Failed to edit product", {
                    description:
                        "An error occurred : " + Object.values(errors)[0],
                });
            },
        });
    };

    const deleteImage = (name : string) => {

    if(name.includes("storage")) {
            router.delete(route("deleteProductImage", name.split("/").pop()?.split(".")[0]), {
                preserveScroll: true,
                onSuccess: () => {
                    setPreviews(previews.filter((preview) => preview !== name));
                    toast.success("Image deleted", {
                        description: "Image has been deleted successfully",
                    });
                },
                onError: (errors : any) => {
                    toast.error("Failed to delete image", {
                        description: "An error occurred : " + Object.values(errors)[0],
                    });
                }

            });
        }else{
            setImages(images.filter((image) => image.name !== name));
            setPreviews(previews.filter((preview) => preview !== name));
        }
    }

    useEffect(() => {
        console.log(data.visible);
    }, [data.visible]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit product
                </h2>
            }
        >
            <Head title="Edit Product" />

            <div className="py-12 flex-col md:flex-row flex gap-4 px-4">
                <div className="w-full">
                    <div className="overflow-hidden bg-white shadow-sm rounded-md sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between">
                            Edit Products {product.name}
                                    <Button
                                        variant={"outline"}
                                        onClick={() =>
                                            router.get(route("product.index"))
                                        }
                                    >
                                        Back
                                    </Button>
                            </div>
                            <form onSubmit={submit} className="my-4">
                                <div className="flex gap-4 mb-4">
                                    <div className="w-full">
                                        <Label>Name</Label>
                                        <Input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="w-[300px]">
                                        <Label>Category</Label>
                                        <Popover
                                            open={open}
                                            onOpenChange={setOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between"
                                                >
                                                    {value
                                                        ? categories.find(
                                                              (category: any) =>
                                                                  category.name ===
                                                                  value
                                                          )?.name
                                                        : "Select category..."}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search category..."
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            No category found.
                                                        </CommandEmpty>
                                                        <CommandGroup defaultValue={"Erba"}>
                                                            {categories.map(
                                                                (
                                                                    category: any
                                                                ) => (
                                                                    <CommandItem
                                                                        key={
                                                                            category.name
                                                                        }
                                                                        value={
                                                                            category.name
                                                                        }

                                                                        onSelect={(
                                                                            currentValue
                                                                        ) => {
                                                                            setValue(
                                                                                currentValue ===
                                                                                    value
                                                                                    ? ""
                                                                                    : currentValue
                                                                            );
                                                                            setOpen(
                                                                                false
                                                                            );
                                                                            setData(
                                                                                "category_id",
                                                                                category.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                value ===
                                                                                    category.name
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <div className="w-full">
                                        <Label>Price</Label>
                                        <Input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData(
                                                    "price",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            placeholder="0"
                                            required
                                        />
                                    </div>

                                    <div className="w-full">
                                        <Label>Stock</Label>
                                        <Input
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) =>
                                                setData(
                                                    "stock",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            placeholder="0"
                                            required
                                        />
                                    </div>

                                    <div className="w-full">
                                        <Label>Min Pembelian</Label>
                                        <Input
                                            type="number"
                                            value={data.min_order}
                                            onChange={(e) =>
                                                setData(
                                                    "min_order",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <div className="w-full">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="w-20">
                                        <Label>Visible</Label>
                                        <br />
                                        <Switch
                                            id="visibleSwitch"
                                            onClick={() =>
                                                setData(
                                                    "visible",
                                                    !data.visible
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label>Image</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">
                                                        Click to upload
                                                    </span>{" "}
                                                    or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 10MB
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                        {previews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-45 h-45 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteImage(preview)
                                                    }
                                                    className="absolute hidden group-hover:flex items-center justify-center top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button
                                        type="submit"
                                        variant={"theme"}
                                        className="w-full"
                                        onClick={submit}
                                        disabled={processing}
                                    >
                                        {processing ? "Loading..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
