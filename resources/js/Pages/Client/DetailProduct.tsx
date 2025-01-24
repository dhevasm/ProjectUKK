import ClientLayout from "@/Layouts/ClientLayout";
import ShareModal from "./ShareModal";
import CartModal from "./CartModal";
import BuyNowModal from "./BuyNowModal";
import Review from "./Review";

import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { cn } from "@/lib/utils";
import { User, settings, Category, Product } from "@/types";
import { LucideMoveLeft, ShoppingBag } from "lucide-react";
import { router } from "@inertiajs/react";
import { Textarea } from "@/Components/ui/textarea";

import {
    ChevronLeft,
    ChevronRight,
    Star,
    Truck,
    Info,
} from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

export interface reviews{
    id: number;
    user: User;
    rating: number;
    comment: string;
    created_at: string;
}

interface DetailProductProps {
    settings: settings[];
    categories: Category[];
    product: Product;
    products: Product[];
    auth: {
        user: User;
    };
    totalCart: number;
    role: string;
    reviews: reviews[];
    isCanReview: boolean;
}



export default function DetailProduct({
    settings,
    categories,
    product,
    auth,
    products,
    totalCart,
    role,
    reviews,
    isCanReview
}: DetailProductProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.product_images.length);
    };

    const prevImage = () => {
        setSelectedImage(
            (prev) =>
                (prev - 1 + product.product_images.length) %
                product.product_images.length
        );
    };

    const [rating, setRating] = useState(0);
    useEffect(() => {
        let total = 0;
        if (reviews.length === 0) {
            setRating(0);
            return;
        }

        reviews.map((review) => {
            total += review.rating;
        });
        setRating(total / reviews.length);
    }, [reviews]);


    return (
        <>
           <ClientLayout role={role} categories={categories} settings={settings} Products={products} auth={auth} totalCart={totalCart} header={product.name}>
                <main className="flex-grow container mx-auto px-4 py-4">
                    <div className="space-y-4 md:px-10 md:py-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="#"
                                                onClick={() =>
                                                    router.get(route("welcome"))
                                                }
                                            >
                                                Home
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={route("category.show", product.category.name.replace(/\s+/g, '-'))}>
                                                {product.category.name}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={route("product.show.detail", product.name.replace(/\s+/g, '-'))}>
                                                {product.name}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            <div className="text-end">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-customDark rounded-full transition-colors"
                            >
                                <LucideMoveLeft className="w-5 h-5 text-[var(--app-color)]" />
                            </button>
                            </div>
                        </div>
                        <div className="min-h-screen bg-background">
                            <div className="mx-auto max-w-7xl">
                                <div className="grid gap-8 lg:grid-cols-2">
                                    <div className="relative">
                                        <div className="relative aspect-square overflow-hidden rounded-lg">
                                            <img
                                                src={
                                                    "/" +
                                                    product.product_images[
                                                        selectedImage
                                                    ].url
                                                }
                                                alt={`Product image ${
                                                    selectedImage + 1
                                                }`}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-customDark p-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80  dark:bg-customDark p-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="mt-4 grid grid-cols-4 gap-4">
                                            {product.product_images.map(
                                                (image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            setSelectedImage(
                                                                index
                                                            )
                                                        }
                                                        className={cn(
                                                            "relative aspect-square overflow-hidden rounded-lg border-2",
                                                            selectedImage ===
                                                                index
                                                                ? "border-[var(--app-color)]"
                                                                : "border-transparent"
                                                        )}
                                                    >
                                                        <img
                                                            src={
                                                                "/" + image.url
                                                            }
                                                            alt={`Thumbnail ${
                                                                index + 1
                                                            }`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h1 className="text-3xl font-bold">
                                                {product.name}
                                            </h1>
                                            <div className="mt-4 flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={cn(
                                                                    "h-5 w-5",
                                                                    i <
                                                                        Math.floor(
                                                                            rating
                                                                        )
                                                                        ? "fill-yellow-500 text-yellow-500"
                                                                        : "fill-muted text-muted"
                                                                )}
                                                            />
                                                        )
                                                    )}

                                                    <span className="ml-2 text-sm text-muted-foreground">
                                                     {rating.toFixed(1)}
                                                    </span>
                                                    <span className="ml-2 text-sm text-muted-foreground">

                                                        ({reviews.length} reviews)
                                                    </span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <ShareModal product={product} />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                                <ShoppingBag className="mr-2 h-4 w-4" />
                                                Terjual {" "}
                                                {product.sold} Lembar
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-3xl font-bold">
                                                Rp.{" "}
                                                {product.price.toLocaleString()}{" "}
                                                / Lembar
                                            </p>
                                            <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                                <Truck className="mr-2 h-4 w-4" />
                                                Biaya pengiriman belum termasuk
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                                <Info className="mr-2 h-4 w-4" />
                                                Minimal pembelian{" "}
                                                {product.min_order} Lembar
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                                <Info className="mr-2 h-4 w-4" />
                                                Sisa Stock{" "}
                                                {product.stock} Lembar
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <CartModal product={product} user={auth.user}/>
                                            <BuyNowModal product={product} user={auth.user}/>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="font-medium ">
                                                Description
                                            </h3>
                                            <Textarea  className="mt-2 h-52 border-none text-muted-foreground" value={product.description} readOnly/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="review"></div>
                   <Review reviews={reviews} role={role} isCanReview={isCanReview} productId={product.id} user={auth.user}/>
                </main>
           </ClientLayout>
        </>
    );
}
