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

interface CarouselLink {
    key: string;
    value: string;
  }

export default function Home({ settings, categories, products }: HomeProps) {
    const [images, setImages] = useState<string[]>([]);
    const nextButton = useRef<HTMLButtonElement>(null);
    const [carouselLink, setCarouselLink] = useState<CarouselLink[]>([]);
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

        settings.forEach((setting) => {
            if (setting.key.includes("carousel_link")) {
                setCarouselLink((prevLinks) => {
                  const key = setting.key.split("_").pop() as string;
                  const value = setting.value as string;
                  if (!prevLinks.some((link) => link.key === key)) {
                    return [...prevLinks, { key, value }];
                  }
                  return prevLinks;
                });
              }
        });
    }, [settings]);

    useEffect(() => {
        if (carouselLink.length > 0) {
            carouselLink.forEach((link) => {
                const anchor = document.querySelector(
                    `#anchor${link.key}`
                ) as HTMLAnchorElement;
                if (anchor) {
                    anchor.href = link.value;
                }
            }
        )};
    }, [carouselLink]);


    // Handle Categories
    const [showAll, setShowAll] = useState(false);

    const itemsPerRow = {
        'default': 2,
        'sm': 2,
        'mdmini' : 3,
        'md': 4,
        'lg': 6
    };


    const getMaxItemsCollapsed = () => {
        if (window.innerWidth >= 1025) return itemsPerRow.lg;
        if (window.innerWidth >= 821) return itemsPerRow.md;
        if (window.innerWidth >= 768) return itemsPerRow.mdmini;
        if (window.innerWidth >= 640) return itemsPerRow.sm;
        return itemsPerRow.default;
    };

    const [maxItemsCollapsed, setMaxItemsCollapsed] = useState(getMaxItemsCollapsed());

    useEffect(() => {
        const handleResize = () => setMaxItemsCollapsed(getMaxItemsCollapsed());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const displayedCategories = showAll
        ? categories
        : categories.slice(0, maxItemsCollapsed);

    const toggleView = () => {
        setShowAll(!showAll);
    };

    return (
        <div className="space-y-8 md:px-10 md:py-5 mb-20">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index}>
                            <a href="#" id={`anchor${image.split("/").pop()?.split(".")[0]}`}>
                                <img
                                    src={image}
                                    alt="slider"
                                    className="object-cover w-full h-[150px] md:h-[250px] rounded-lg"
                                />
                            </a>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext ref={nextButton} className="hidden md:flex" />
            </Carousel>

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
      {displayedCategories.map((category) => (
        <Card
          key={category.id}
          className="group relative overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer bg-white dark:bg-customDark border-0"
          onClick={() => router.get(route("category.show", category.name.replace(/\s+/g, "-")))}
        >
          <CardContent className="p-0">
            <div className="relative">
              <div className="aspect-square w-36 mx-auto overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-center font-semibold text-sm text-white drop-shadow-md">
                  {category.name}
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-customDark dark:to-customDark2 p-2 rounded-b-lg">
              <div className="flex justify-center items-center space-x-1">
                <span className="text-xs  text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Lihat Undangan {category.name}
                </span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
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
                            {/* <button className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                                Lihat Semua
                            </button> */}
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
                                Populer
                            </h2>
                            {/* <button className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                                Lihat Semua
                            </button> */}
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
