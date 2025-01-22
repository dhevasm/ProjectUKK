import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { Package, Truck, CreditCard, LucideMoveLeft } from "lucide-react";
import { settings, Category, Product, User, Cart } from "@/types";
import ClientLayout from "@/Layouts/ClientLayout";
import { router } from "@inertiajs/react";
import { Textarea } from "@/Components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

interface PropsType {
    category: Category;
    categories: Category[];
    settings: settings[];
    Products: Product[];
    auth: {
        user: User;
    };
    totalCart: number;
    items: Cart[];
    snapToken: string;
    orderId: string;
    role: string;
}

const CheckoutPage = ({
    category,
    categories,
    settings,
    Products,
    auth,
    totalCart,
    items,
    snapToken,
    orderId,
    role,
}: PropsType) => {
    const [subtotal, setSubtotal] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [priceData, setPriceData] = useState({
        productionPrice: 0,
        deliveryCost: 0,
        tax: 0,
    });
    const [data, setData] = useState({
        name: auth.user.name,
        phone: auth.user.phone,
        address: auth.user.address,
    });

    useEffect(() => {
        settings.forEach((setting) => {
            if (setting.key === "production_price") {
                setPriceData((prev) => ({
                    ...prev,
                    productionPrice: parseInt(setting.value),
                }));
            }
            if (setting.key === "delivery_price") {
                setPriceData((prev) => ({
                    ...prev,
                    deliveryCost: parseInt(setting.value),
                }));
            }
            if (setting.key === "tax") {
                setPriceData((prev) => ({
                    ...prev,
                    tax: parseInt(setting.value),
                }));
            }
        });
    }, []);

    useEffect(() => {

        const newSubtotal = items.map((item) => item.product.price * item.quantity).reduce((a, b) => a + b, 0);

        setSubtotal(newSubtotal);

        const productionCost = priceData.productionPrice;
        const shippingCost = priceData.deliveryCost;
        const tax = priceData.tax;

        const taxPrice = subtotal * (tax / 100);
        const total = subtotal + productionCost + shippingCost + taxPrice;

        setTotalPrice(total);
    }, [items, priceData]);

    const handleCheckout = () => {
        router.post(route("checkout.store"), {
            ids : items.map((item) => item.id),
            total : totalPrice,
            phone : data.phone,
            name : data.name,
        }, {
            preserveScroll: true,
                onError: (errors: any) => {
                    toast.error("Failed to checkout", {
                        description:
                            "An error occurred : " + Object.values(errors)[0],
                    });
                },
        });
    }

    const updatePayment = (status: string, method:string) => {
        router.post(route("checkout.update"), {
            ids: items.map((item) => item.id),
            total: totalPrice,
            phone: data.phone,
            name: data.name,
            order_id: orderId,
            method: method,
            status: status,
            snap_token: snapToken,
    },{
        onError: (errors: any) => {
            toast.error("Failed to complete payment", {
                description:
                    "An error occurred : " + Object.values(errors)[0],
            });
        },
    });
    }

    useEffect(() => {
        if(snapToken != undefined){
            window.snap.pay(snapToken, {
                onSuccess: function(result : any) {
                    updatePayment("settlement", result.payment_type);
                },
                onPending: function(result : any) {
                    updatePayment("pending", result.payment_type);
                },
                onError: function(result : any) {
                    updatePayment("failed", result.payment_type);
                },
                onClose: function() {
                    toast.error("Payment canceled");
                    setTimeout(() => {
                        router.get(route("cart.index"));
                    }, 1000);
                }
            });
        }
    }, [snapToken]);

    return (
        <ClientLayout
            role={role}
            categories={categories}
            settings={settings}
            Products={Products}
            auth={auth}
            totalCart={totalCart}
            header={"Checkout"}
        >
            <div className="min-h-screen bg-gray-50 dark:bg-customDark2">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="flex justify-between items-center">
                        <div></div>
                        <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
                            Checkout
                        </h1>
                        <div className="text-end">
                            <button onClick={() => router.get(route("cart.index"))}>
                                <LucideMoveLeft className="text-[var(--app-color)]" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Card className="shadow-lg dark:border-cusbg-customDark">
                                <CardHeader className="space-y-1 border-b bg-gray-50 dark:bg-customDark dark:border-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <CardTitle className="dark:text-white">
                                            Data Penerima
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <form className="space-y-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="name"
                                                className="dark:text-gray-200"
                                            >
                                                Nama Penerima
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="John"
                                                value={data.name}
                                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                                className="dark:bg-customDark dark:border-gray-700"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="phone"
                                                className="dark:text-gray-200"
                                            >
                                                Nomor Telepon Penerima
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="number"
                                                value={data.phone}
                                                onChange={(e) => setData({ ...data, phone: e.target.value })}
                                                placeholder="+62 812-3456-7890"
                                                className="dark:bg-customDark dark:border-gray-700"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="address"
                                                className="dark:text-gray-200"
                                            >
                                                Alamat Lengkap
                                            </Label>
                                            <Textarea
                                                readOnly
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData({ ...data, address: e.target.value })}
                                                placeholder="Jl. Sudirman No. 123"
                                                className="dark:bg-customDark dark:border-gray-700"
                                            />
                                        </div>

                                        <Button
                                            type="reset"
                                            onClick={() =>
                                                router.get("/profile#address")
                                            }
                                            className="w-full"
                                            variant={"theme"}
                                        >
                                            Edit Alamat
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Ringkasan Pesanan */}
                        <div className="space-y-6">
                            <Card className="shadow-lg dark:border-cusbg-customDark">
                                <CardHeader className="space-y-1 border-b bg-gray-50 dark:bg-customDark dark:border-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <CardTitle className="dark:text-white">
                                            Ringkasan Pesanan
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex space-x-4"
                                            >
                                                <img
                                                    src={
                                                        item.product
                                                            .product_images[0]
                                                            .url
                                                    }
                                                    alt={item.product.name}
                                                    className="w-24 h-24 object-cover rounded-lg shadow dark:shadow-cusbg-customDark"
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <h3 className="font-medium text-lg dark:text-white">
                                                        {item.product.name +
                                                            "( " +
                                                            item.data_undangan
                                                                .bride_name +
                                                            " & " +
                                                            item.data_undangan
                                                                .groom_name +
                                                            " )"}
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                    <p className="font-medium text-blue-600 dark:text-blue-400">
                                                        Rp{" "}
                                                        {item.product.price.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </p>
                                                    <p className="font-medium text-blue-600 dark:text-blue-400">
                                                        Rp{" "}
                                                        {(item.product.price * item.quantity).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <Separator className="dark:bg-gray-700" />

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Subtotal
                                                </span>
                                                <span className="dark:text-gray-200">
                                                    Rp{" "}
                                                    {subtotal.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </span>
                                            </div>
                                            {
                                                priceData.productionPrice > 0 && subtotal > 0 ? (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            Production Cost
                                                        </span>
                                                        <span className="dark:text-gray-200">
                                                        Rp {priceData.productionPrice.toLocaleString("id-ID")}
                                                        </span>
                                                    </div>
                                                ) : ""
                                            }

                                            {
                                                priceData.deliveryCost > 0 && subtotal > 0 ? (
                                                    <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Delivery Cost
                                                    </span>
                                                    <span className="dark:text-gray-200">
                                                    Rp {priceData.deliveryCost.toLocaleString("id-ID")}
                                                    </span>
                                                </div>
                                                ) : ""
                                            }

                                            {
                                                priceData.tax > 0 && subtotal > 0 ? (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                        Tax {priceData.tax} %
                                                        </span>
                                                        <span className="dark:text-gray-200">
                                                        Rp {(subtotal * (priceData.tax/100)).toLocaleString("id-ID")}
                                                        </span>
                                                    </div>
                                                ) : ""
                                            }

                                            <Separator className="dark:bg-gray-700" />
                                            <div className="flex justify-between font-bold text-lg">
                                                <span className="dark:text-white">
                                                    Total
                                                </span>
                                                <span className="text-blue-600 dark:text-blue-400">
                                                    Rp{" "}
                                                    {totalPrice.toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        </div>

                                        <Button onClick={handleCheckout} variant={"theme"} className="w-full">
                                            Bayar Sekarang
                                        </Button>

                                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                                            Dengan menekan tombol di atas, Anda
                                            menyetujui syarat dan ketentuan yang
                                            berlaku
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
};

export default CheckoutPage;
