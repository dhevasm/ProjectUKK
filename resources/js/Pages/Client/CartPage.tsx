import { Head } from "@inertiajs/react";
import CartHeader from "@/Components/client/CartHeader";
import Footer from "@/Components/client/Footer";
import { PageProps } from "@/types";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { router } from "@inertiajs/react";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    Gift,
    ArrowRight,
    Truck,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { toast, Toaster } from "sonner";

import { settings, Category, Product, User, Cart, dataUndangan } from "@/types";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/Components/ui/dialog";

interface CartProps {
    settings: settings[];
    categories: Category[];
    products: Product[];
    auth: {
        user: User;
    };
    carts: Cart[];
}

export default function CartPage({
    settings,
    categories,
    products,
    auth,
    carts,
}: CartProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [subtotal, setSubtotal] = useState<number>(0);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            const allCartIds = carts.map((cart) => cart.id);
            setSelectedItems(allCartIds);
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (cartId: number, checked: boolean) => {
        setSelectedItems((prevSelected) => {
            if (checked) {
                const newSelected = [...prevSelected, cartId];
                if (newSelected.length === carts.length) {
                    setSelectAll(true);
                }
                return newSelected;
            } else {
                const newSelected = prevSelected.filter((id) => id !== cartId);
                setSelectAll(false);
                return newSelected;
            }
        });
    };

        useEffect(() => {
            setSelectAll(selectedItems.length === carts.length);

            const newSubtotal = selectedItems.reduce((total, selectedId) => {
                const cart = carts.find(cart => cart.id === selectedId);
                if (cart) {
                    return total + (cart.quantity * cart.product.price);
                }
                return total;
            }, 0);

            setSubtotal(newSubtotal);
        }, [selectedItems, carts]);

    const [quantities, setQuantities] = useState<{ [key: number]: number }>(
        () => {
            return carts.reduce((acc, cart) => {
                acc[cart.id] = cart.quantity;
                return acc;
            }, {} as { [key: number]: number });
        }
    );

    const [timeoutIds, setTimeoutIds] = useState<{
        [key: number]: NodeJS.Timeout;
    }>({});

    const updateQuantity = useCallback(
        (id: number, qty: number) => {
            router.post(
                route("cart.qty", id),
                {
                    quantity: qty,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log("Quantity updated successfully");
                    },
                    onError: (errors: any) => {
                        toast.error("Failed to add product", {
                            description:
                                "An error occurred : " + Object.values(errors)[0],
                        });
                        setQuantities((prev) => ({
                            ...prev,
                            [id]:
                                carts.find((cart) => cart.id === id)
                                    ?.quantity || 1,
                        }));
                    },
                }
            );
        },
        [carts]
    );

    const handleQuantityChange = (id: number, newQty: number) => {
        if (newQty < 1) newQty = 1;

        setQuantities((prev) => ({
            ...prev,
            [id]: newQty,
        }));

        if (timeoutIds[id]) {
            clearTimeout(timeoutIds[id]);
        }

        const timeoutId = setTimeout(() => {
            updateQuantity(id, newQty);
            setTimeoutIds((prev) => {
                const newTimeouts = { ...prev };
                delete newTimeouts[id];
                return newTimeouts;
            });
        }, 1000);

        setTimeoutIds((prev) => ({
            ...prev,
            [id]: timeoutId,
        }));
    };

    const handleQuantityButton = (
        id: number,
        action: "increment" | "decrement"
    ) => {
        const currentQty = quantities[id];
        const newQty =
            action === "increment"
                ? currentQty + 1
                : Math.max(1, currentQty - 1);

        handleQuantityChange(id, newQty);
    };

    useEffect(() => {
        return () => {
            Object.values(timeoutIds).forEach((timeoutId) => {
                clearTimeout(timeoutId);
            });
        };
    }, [timeoutIds]);

    const handleDelete = (id:number) => {
        router.delete(route("cart.destroy", id),{
            preserveScroll: true,
                onSuccess: () => {
                    toast.success("Cart delete!", {
                        description:
                            "Cart has been deleted successfully",
                    });
                },
                onError: (errors: any) => {
                    toast.error("Failed to delete cart", {
                        description:
                            "An error occurred : " + Object.values(errors)[0],
                    });
                },
        });
    }

    return (
        <>
            <Head title="Cart" />
            <div className="bg-gray-50 dark:bg-customDark2 min-h-screen flex flex-col">
                <CartHeader
                    settings={settings}
                    categories={categories}
                    auth={auth}
                    totalCart={carts.length}
                />

                <main className="flex-grow container mx-auto px-4 py-8">
                    {carts.length > 0 ? (
                        <div className="lg:grid lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-4">
                                <Card className="bg-white dark:bg-customDark">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-4">
                                            <Checkbox
                                                checked={selectAll}
                                                onCheckedChange={
                                                    handleSelectAll
                                                }
                                            />
                                            <span className="text-sm font-medium">
                                                Select All Items
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white dark:bg-customDark">
                                    <CardContent className="divide-y">
                                        {carts.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-4 flex space-x-4"
                                            >
                                                <Checkbox
                                                    id={`item-${item.id}`}
                                                    checked={selectedItems.includes(
                                                        item.id
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleSelectItem(
                                                            item.id,
                                                            checked as boolean
                                                        )
                                                    }
                                                />

                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={
                                                            "/" +
                                                            item.product
                                                                .product_images[0]
                                                                ?.url
                                                        }
                                                        alt={item.product.name}
                                                        className="w-24 h-24 object-cover rounded-lg"
                                                    />
                                                </div>

                                                <div className="flex-grow space-y-2">
                                                    <h3 onClick={() => router.get(route("product.show.detail", item.product.id))} className="font-medium line-clamp-2 hover:cursor-pointer hover:underline">
                                                        {item.product.name}
                                                    </h3>

                                                    <div className="text-sm text-gray-500">
                                                        Min. Order:{" "}
                                                        {item.product.min_order}{" "}
                                                        pcs
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="text-lg font-bold text-[var(--app-color)]">
                                                            Rp{" "}
                                                            {item.product.price}
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleQuantityButton(
                                                                        item.id,
                                                                        "decrement"
                                                                    )
                                                                }
                                                                disabled={
                                                                    quantities[
                                                                        item.id
                                                                    ] <= 1
                                                                }
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>

                                                            <Input
                                                                type="number"
                                                                value={
                                                                    quantities[
                                                                        item.id
                                                                    ]
                                                                }
                                                                onChange={(e) =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                                className="w-20 text-center"
                                                                min={1}
                                                            />

                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleQuantityButton(
                                                                        item.id,
                                                                        "increment"
                                                                    )
                                                                }
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>

                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-red-500 hover:text-red-600"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Delete Item</DialogTitle>
                                                                        <DialogDescription>
                                                                            Are you sure you want to delete this item from your cart? This action cannot be undone.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white hover:text-white" onClick={() => handleDelete(item.id)}>
                                                                            Delete
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-4 space-y-4 mt-4 lg:mt-0">
                                <Card className="bg-white dark:bg-customDark">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <Gift className="h-5 w-5 text-[var(--app-color)]" />
                                            <span className="font-medium">
                                                Apply Coupon
                                            </span>
                                        </div>
                                        <div className="mt-4 flex space-x-2">
                                            <Input placeholder="Enter coupon code" />
                                            <Button variant="outline">
                                                Apply
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white dark:bg-customDark">
                                    <CardContent className="p-4 space-y-4">
                                        <h3 className="font-semibold text-lg">
                                            Order Summary
                                        </h3>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Subtotal {carts.length} items</span>
                                                <span>Rp {subtotal}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span>Shipping Cost</span>
                                                <span>Rp 200</span>
                                            </div>

                                            <div className="pt-2 border-t">
                                                <div className="flex justify-between font-semibold text-lg">
                                                    <span>Total</span>
                                                    <span className="text-[var(--app-color)]">
                                                        Rp 200
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant={"theme"}
                                            className="w-full"
                                            size="lg"
                                        >
                                            Proceed to Checkout
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white dark:bg-customDark">
                                    <CardContent className="p-4">
                                        <div className="flex items-start space-x-3 text-sm text-gray-600">
                                            <Truck className="h-5 w-5 flex-shrink-0 mt-1" />
                                            <p>
                                                Free shipping for orders above
                                                Rp 500,000 to selected areas
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                            <h2 className="mt-4 text-lg font-medium">
                                Your cart is empty
                            </h2>
                            <p className="mt-2 text-gray-500">
                                Browse our products and find something you like
                            </p>
                            <Button
                                className="mt-6"
                                onClick={() => router.get(route("welcome"))}
                                variant={"theme"}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    )}
                </main>

                <Toaster richColors position="top-right" theme={theme} />
                <Footer settings={settings} />
            </div>
        </>
    );
}
