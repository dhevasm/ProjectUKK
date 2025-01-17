import { Card, CardContent } from "@/Components/ui/card";
import { useState, useEffect, useRef } from "react";
import ProductCard from "@/Components/ProductCard";
import { settings, Category, Product } from "@/types";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/ui/carousel";
import { router } from "@inertiajs/react";

interface HomeProps {
    settings: settings[];
    categories: Category[];
    products: Product[];
}

export default function Home({ settings, categories, products }: HomeProps) {
    const [images, setImages] = useState<string[]>([]);
    const nextButton = useRef<HTMLButtonElement>(null);

    const latestProducts = [...products]
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        )
        .slice(0, 6);

    const popularProducts = [...products]
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 6);

    useEffect(() => {
        const interval = setInterval(() => {
            nextButton.current?.click();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const newImages = settings
            .filter((setting) => setting.key.includes("carousel_image"))
            .map((setting) => setting.value);

        setImages(newImages);
    }, [settings]);


    // Handle Categories
    const [showAll, setShowAll] = useState(false);

    const itemsPerRow = {
        'default': 2,
        'sm': 3,
        'md': 4,
        'lg': 6
    };

    const maxItemsCollapsed = itemsPerRow.lg;

    const displayedCategories = showAll
        ? categories
        : categories.slice(0, maxItemsCollapsed);

    const toggleView = () => {
        setShowAll(!showAll);
    };

    return (
        <div className="space-y-8 md:px-10 md:py-5">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index}>
                            <img
                                src={image}
                                alt="slider"
                                className="object-cover w-full h-[150px] md:h-[250px] rounded-lg"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext ref={nextButton} className="hidden md:flex" />
            </Carousel>

            {/* Categories section */}
            <div className="px-4 md:px-0">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold mb-4">Kategori</h2>
                <button
                    onClick={toggleView}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                    {showAll ? 'Lihat Sedikit' : 'Lihat Semua'}
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {displayedCategories.map((category) => (
                    <Card
                        key={category.id}
                        className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform"
                        onClick={() => router.get(route("category.show", category.id))}
                    >
                        <CardContent className="p-4">
                            <div className="aspect-square mb-2 overflow-hidden rounded-lg">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <p className="text-center font-medium truncate group-hover:text-[var(--app-hover-color)] transition-colors duration-300">
                                {category.name}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

            {/* Latest Products */}
            {products.length > 0 ? (
                <>
                    <div className="px-4 md:px-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Terbaru</h2>
                            <button className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                                Lihat Semua
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {latestProducts.map((product) =>
                                product.visible == true ? (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ) : (
                                    ""
                                )
                            )}
                        </div>
                    </div>

                    {/* Popular Products */}
                    <div className="px-4 md:px-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">
                                Terpopuler
                            </h2>
                            <button className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                                Lihat Semua
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {popularProducts.map((product) =>
                                product.visible == true ? (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ) : (
                                    ""
                                )
                            )}
                        </div>
                    </div>

                    {/* All Products */}
                    <div className="px-4 md:px-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">
                                Disarankan
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {products.map((product) =>
                                product.visible == true ? (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ) : (
                                    ""
                                )
                            )}
                        </div>
                    </div>
                </>
            ) : (
                "No Product Found"
            )}
        </div>
    );
}
