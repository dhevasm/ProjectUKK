import { useState } from "react";
import { Product, User } from "@/types";

import { ShoppingCart, Minus, Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";


export default function BuyNowModal({ product, user }: { product: Product, user: User }) {
    const [quantity, setQuantity] = useState(product.min_order);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState({
        bride_name: "",
        bride_father_name: "",
        bride_mother_name: "",
        groom_name: "",
        groom_father_name: "",
        groom_mother_name: "",
        location: user.address,
        note: "",
        akad: "",
        resepsi: "",
    });

    const decreaseQuantity = () => {
        if (quantity > 1 && quantity > product.min_order) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        router.post(
            route("buy.now"),
            {
                product_id: product.id,
                quantity: quantity,
                bride_name: data.bride_name,
                bride_father_name: data.bride_father_name,
                bride_mother_name: data.bride_mother_name,
                groom_name: data.groom_name,
                groom_father_name: data.groom_father_name,
                groom_mother_name: data.groom_mother_name,
                location: data.location,
                akad: data.akad,
                resepsi: data.resepsi,
                note: data.note,
            },
            {
                preserveScroll: true,
                onError: (errors: any) => {
                    toast.error("Failed to add product", {
                        description:
                            "An error occurred : " + Object.values(errors)[0],
                    });
                },
            }
        );

        setOpen(false);
    };



    const formatDateForInput = () => {
        const fiveDaysLater = new Date();
        fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
        return fiveDaysLater.toISOString().slice(0, 16);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                >
                    Buy Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Wedding Registration Form
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                         {/* Groom's Details */}
                         <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Groom's Details
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="groom_name">Groom's Name</Label>
                                <Input
                                    id="groom_name"
                                    value={data.groom_name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            groom_name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter groom's name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="groom_father_name">
                                    Groom's Father Name
                                </Label>
                                <Input
                                    id="groom_father_name"
                                    value={data.groom_father_name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            groom_father_name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter groom's father name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="groom_mother_name">
                                    Groom's Mother Name
                                </Label>
                                <Input
                                    id="groom_mother_name"
                                    value={data.groom_mother_name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            groom_mother_name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter groom's mother name"
                                    required
                                />
                            </div>
                        </div>


                        {/* Bride's Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Bride's Details
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="bridge_name">
                                    Bride's Name
                                </Label>
                                <Input
                                    id="bridge_name"
                                    value={data.bride_name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            bride_name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter bride's name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bridge_father_name">
                                    Bride's Father Name
                                </Label>
                                <Input
                                    id="bridge_father_name"
                                    value={data.bride_father_name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            bride_father_name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter bride's father name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bridge_mother_name">
                                    Bride's Mother Name
                                </Label>
                                <Input
                                    id="bridge_mother_name"
                                    value={data.bride_mother_name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            bride_mother_name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter bride's mother name"
                                    required
                                />
                            </div>
                        </div>


                    </div>

                    {/* Wedding Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Wedding Details
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        location: e.target.value,
                                    })
                                }
                                placeholder="Enter wedding location"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Akad Date & Time</Label>
                                <Input
                                    type="datetime-local"
                                    className="w-full custom-date-picker"
                                    value={data.akad}
                                    min={formatDateForInput()}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            akad: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Resepsi Date & Time</Label>
                                <Input
                                    type="datetime-local"
                                    className="w-full custom-date-picker"
                                    value={data.resepsi}
                                    min={formatDateForInput()}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            resepsi: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note">Additional Notes</Label>
                            <Textarea
                                id="note"
                                value={data.note}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        note: e.target.value,
                                    })
                                }
                                placeholder="Enter any additional notes or special requirements"
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-2">
                        <div className="flex gap-4 items-center">
                            <Label htmlFor="quantity">Quantity</Label>
                            <div className="flex items-center space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={decreaseQuantity}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(parseInt(e.target.value))
                                    }
                                    onBlur={(e) => {
                                        parseInt(e.target.value) <
                                        product.min_order
                                            ? setQuantity(product.min_order)
                                            : parseInt(e.target.value) >
                                              product.stock
                                            ? setQuantity(product.stock)
                                            : setQuantity(
                                                  parseInt(e.target.value)
                                              );
                                    }}
                                    className="w-20 text-center"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={increaseQuantity}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="theme">
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
