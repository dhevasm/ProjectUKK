import { ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import { settings, Category, Product, User } from "@/types";
import Header from "@/Components/client/Header";
import Footer from "@/Components/client/Footer";
import ProductCard from "@/Components/ProductCard";
import { Head } from "@inertiajs/react";

interface PropsType {
    category: Category;
    categories: Category[];
    settings: settings[];
    Products: Product[];
    auth: {
        user: User;
    };
    totalCart: number;
}

export default function DetailCategory({
    category,
    categories,
    settings,
    Products,
    auth,
    totalCart
}: PropsType) {
    return (
        <>
            <Header settings={settings} totalCart={totalCart} categories={categories} auth={auth} products={Products} />
            <Head title={category.name} />
            <div className="min-h-screen bg-gray-50 dark:bg-customDark2">
                <div className="relative h-[300px] overflow-hidden">
                    <img
                        src={"/" + category.image}
                        alt={category.name}
                        className="h-full w-full object-cover blur-sm"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center px-8">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => router.get(route("welcome"))}
                                className="flex items-center gap-2 rounded-lg bg-white/90 dark:bg-slate-900 dark:text-gray-200 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white shadow-lg"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Store
                            </button>
                        </div>
                        <div className="relative flex flex-col items-center">
                            <img
                                src={"/" + category.image}
                                alt="Logo"
                                className="h-40 w-40 rounded-full border-4 border-white mb-4"
                            />
                            <h1 className="text-4xl font-bold text-white text-center">
                                {category.name}
                            </h1>
                        </div>
                    </div>
                </div>
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="px-4 md:px-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Products</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {Products.length > 0 ?
                                Products.map((product) => (
                                    product.visible == true ?  <ProductCard key={product.id} product={product} /> : ""
                                )) : "No products found"}
                        </div>
                    </div>
                </main>
            </div>

            <Footer settings={settings} />
        </>
    );
}
