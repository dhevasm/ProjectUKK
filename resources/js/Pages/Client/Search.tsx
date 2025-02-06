
import { settings, Category, Product, User } from "@/types";
import ProductCard from "@/Components/ProductCard";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Slider } from "@/Components/ui/slider";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import ClientLayout from "@/Layouts/ClientLayout";

interface PropsType {
  categories: Category[];
  settings: settings[];
  Products: Product[];
  auth: {
    user: User;
  };
  totalCart: number;
  role: string;
  admin: User;
}

export default function Search({
  categories,
  settings,
  Products,
  auth,
  totalCart,
  role,
  admin,
}: PropsType) {
  const [filteredProducts, setFilteredProducts] = useState(Products);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, Math.max(...Products.map(p => p.price))],
    sortBy: "newest",
    minOrder: 0,
    categories: [] as number[],
    inStock: false
  });

  const uniqueCategories = Array.from(new Set(Products.map(p => p.category_id)));


  useEffect(() => {
    let result = [...Products];

    result = result.filter(product =>
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
    );

    if (filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category_id)
      );
    }

    if (filters.minOrder > 0) {
      result = result.filter(product =>
        product.min_order >= filters.minOrder
      );
    }


    if (filters.inStock) {
      result = result.filter(product => product.stock > 0);
    }

    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "bestselling":
        result.sort((a, b) => b.sold - a.sold);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredProducts(result);
  }, [filters, Products]);

  return (
    <>
        <ClientLayout admin={admin} role={role} categories={categories} settings={settings} Products={Products} auth={auth} totalCart={totalCart} header={"Search"}>
            <main className="container mx-auto px-4 py-8">
                <div className="md:hidden mb-4">
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full"
                >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                <aside className={`w-full md:w-64 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <div className="bg-white dark:bg-customDark p-4 rounded-lg shadow">
                    <div className="mb-6">
                        <h3 className="font-medium mb-4">Rentang Harga</h3>
                        <Slider
                        defaultValue={[0, Math.max(...Products.map(p => p.price))]}
                        max={Math.max(...Products.map(p => p.price))}
                        step={Math.max(...Products.map(p => p.price)) / 10}
                        onValueChange={(value : any) => setFilters({...filters, priceRange: value})}
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>Rp {filters.priceRange[0].toLocaleString()}</span>
                        <span>Rp {filters.priceRange[1].toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-medium mb-4">Kategori</h3>
                        <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center">
                            <Checkbox
                                id={`category-${cat.id}`}
                                checked={filters.categories.includes(cat.id)}
                                onCheckedChange={(checked : boolean) => {
                                const newCategories = checked
                                    ? [...filters.categories, cat.id]
                                    : filters.categories.filter(id => id !== cat.id);
                                setFilters({...filters, categories: newCategories});
                                }}
                            />
                            <label htmlFor={`category-${cat.id}`} className="ml-2 text-sm">
                                {cat.name}
                            </label>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                        <Checkbox
                            id="in-stock"
                            checked={filters.inStock}
                            onCheckedChange={(checked : boolean) =>
                            setFilters({...filters, inStock: checked as boolean})
                            }
                        />
                        <label htmlFor="in-stock" className="ml-2 text-sm">
                            Tersedia
                        </label>
                        </div>
                    </div>
                    </div>
                </aside>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                        Ditampilkan {filteredProducts.length} hasil
                    </p>
                    <Select
                        value={filters.sortBy}
                        onValueChange={(value) => setFilters({...filters, sortBy: value})}
                    >
                        <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="newest">Terbaru</SelectItem>
                        <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
                        <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
                        <SelectItem value="bestselling">Terlaris</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    </div>

                    {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            Tidak ada produk yang ditemukan
                        </p>
                    </div>
                    )}
                </div>
                </div>
            </main>
        </ClientLayout>
    </>
  );
}
