import { useState, useRef, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { cn } from "@/lib/utils";
import { User, settings, Category, Product } from "@/types";
import { Head } from "@inertiajs/react";
import Header from "@/Components/client/Header";
import Footer from "@/Components/client/Footer";
import { LucideMoveLeft, ShoppingBag } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast, Toaster } from "sonner";
import { Input } from "@/Components/ui/input";

import CartModal from "./CartModal";

import {
    ChevronLeft,
    ChevronRight,
    Share2,
    Star,
    Truck,
    Info,
    Check,
    Copy,
} from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

interface DetailProductProps {
    settings: settings[];
    categories: Category[];
    product: Product;
    products: Product[];
    auth: {
        user: User;
    };
    totalCart: number;
}

export default function DetailProduct({
    settings,
    categories,
    product,
    auth,
    products,
    totalCart
}: DetailProductProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [copied, setCopied] = useState(false);
    const linkRef = useRef<HTMLInputElement>(null);

    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);

    const handleCopyLink = () => {
        if (linkRef.current) {
            linkRef.current.select();
            document.execCommand("copy");
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

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

    const socialMediaPlatforms = [
        {
            name: "WhatsApp",
            icon: "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/whatsapp.svg",
            color: "bg-green-500",
            shareUrl: `https://wa.me/?text=Check out this product: ${product.name}`,
        },
        {
            name: "Facebook",
            icon: "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/facebook.svg",
            color: "bg-blue-600",
            shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
        },
        {
            name: "Twitter",
            icon: "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/twitter.svg",
            color: "bg-sky-500",
            shareUrl: `https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this product: ${product.name}`,
        },
        {
            name: "Telegram",
            icon: "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/telegram.svg",
            color: "bg-blue-500",
            shareUrl: `https://t.me/share/url?url=${window.location.href}&text=Check out this product: ${product.name}`,
        },
    ];

    const reviews = [
        {
            id: 1,
            user: {
                name: "John Doe",
                avatar: "/api/placeholder/32/32",
            },
            rating: 5,
            comment: "Great product! Exactly what I was looking for.",
            date: "2024-01-10",
        },
        {
            id: 2,
            user: {
                name: "Jane Smith",
                avatar: "/api/placeholder/32/32",
            },
            rating: 4,
            comment: "Good quality, fast delivery. Would recommend.",
            date: "2024-01-09",
        },
    ];

    return (
        <>
            <Head title={product.name} />
            <div className="bg-white dark:bg-customDark2 min-h-screen flex flex-col">
                <Header
                    settings={settings}
                    categories={categories}
                    auth={auth}
                    products={products}
                    totalCart={totalCart}
                />

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
                                            <BreadcrumbLink href="#">
                                                Product
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="#">
                                                {product.name}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            <div className="text-end">
                                <button onClick={() => window.history.back()}>
                                    <LucideMoveLeft className="text-[var(--app-color)]" />
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
                                                                            5
                                                                        )
                                                                        ? "fill-yellow-500 text-yellow-500"
                                                                        : "fill-muted text-muted"
                                                                )}
                                                            />
                                                        )
                                                    )}
                                                    <span className="ml-2 text-sm text-muted-foreground">
                                                        ({100} reviews)
                                                    </span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                            >
                                                                <Share2 className="h-5 w-5" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Share
                                                                    Product
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4">
                                                                <div className="flex space-x-2">
                                                                    <Input
                                                                        ref={
                                                                            linkRef
                                                                        }
                                                                        readOnly
                                                                        value={
                                                                            window
                                                                                .location
                                                                                .href
                                                                        }
                                                                        className="flex-1"
                                                                    />
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={
                                                                            handleCopyLink
                                                                        }
                                                                    >
                                                                        {copied ? (
                                                                            <Check className="h-4 w-4" />
                                                                        ) : (
                                                                            <Copy className="h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                </div>

                                                                {/* Social Media Buttons */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    {socialMediaPlatforms.map(
                                                                        (
                                                                            platform
                                                                        ) => (
                                                                            <a
                                                                                key={
                                                                                    platform.name
                                                                                }
                                                                                href={
                                                                                    platform.shareUrl
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className={cn(
                                                                                    "flex items-center justify-center gap-2 rounded-lg p-4 text-white transition-colors hover:opacity-90",
                                                                                    platform.color
                                                                                )}
                                                                            >
                                                                                <img
                                                                                    src={
                                                                                        platform.icon
                                                                                    }
                                                                                    alt={
                                                                                        platform.name
                                                                                    }
                                                                                    className="h-6 w-6 invert"
                                                                                />
                                                                                <span>
                                                                                    {
                                                                                        platform.name
                                                                                    }
                                                                                </span>
                                                                            </a>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
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
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                size="lg"
                                            >
                                                Buy Now
                                            </Button>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="font-medium">
                                                Description
                                            </h3>
                                            <p className="mt-2 text-muted-foreground">
                                                {product.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-8">
                            Product Reviews
                        </h2>

                        {/* Add Review Form */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Write a Review</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() =>
                                                    setHoverRating(star)
                                                }
                                                onMouseLeave={() =>
                                                    setHoverRating(0)
                                                }
                                            >
                                                <Star
                                                    className={cn(
                                                        "h-6 w-6",
                                                        (hoverRating ||
                                                            rating) >= star
                                                            ? "fill-yellow-500 text-yellow-500"
                                                            : "fill-muted text-muted"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="comment">
                                            Your Review
                                        </Label>
                                        <Textarea
                                            id="comment"
                                            placeholder="Share your thoughts about the product..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <Button className="w-full" variant="theme">
                                        Submit Review
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Existing Reviews */}
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start space-x-4">
                                            <Avatar>
                                                <AvatarImage
                                                    src={review.user.avatar}
                                                />
                                                <AvatarFallback>
                                                    {review.user.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="font-semibold">
                                                        {review.user.name}
                                                    </h4>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(
                                                            review.date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={cn(
                                                                    "h-4 w-4",
                                                                    i <
                                                                        review.rating
                                                                        ? "fill-yellow-500 text-yellow-500"
                                                                        : "fill-muted text-muted"
                                                                )}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
                <Toaster richColors position="top-right" theme={theme} />
                <Footer settings={settings} />
            </div>
        </>
    );
}
