import { ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { settings, Category, Product, User } from "@/types";
import Header from "@/Components/client/Header";
import Footer from "@/Components/client/Footer";
import ProductCard from "@/Components/ProductCard";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Slider } from "@/Components/ui/slider";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Filter, SlidersHorizontal } from "lucide-react";

interface PropsType {
  categories: Category[];
  settings: settings[];
  Products: Product[];
  auth: {
    user: User;
  };
  totalCart: number;
}

export default function Search({
  categories,
  settings,
  Products,
  auth,
  totalCart,
}: PropsType) {
  const [filteredProducts, setFilteredProducts] = useState(Products);
  const [showFilters, setShowFilters] = useState(true);
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

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category_id)
      );
    }

    // Min order filter
    if (filters.minOrder > 0) {
      result = result.filter(product =>
        product.min_order >= filters.minOrder
      );
    }


    // In stock filter
    if (filters.inStock) {
      result = result.filter(product => product.stock > 0);
    }

    // Sorting
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
      <Header settings={settings} categories={categories} auth={auth} products={Products} totalCart={totalCart} />
      <Head title="Search" />
      <main className="container mx-auto px-4 py-8">
        {/* Mobile Filter Toggle */}
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
          {/* Filters Sidebar */}
          <aside className={`w-full md:w-64 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white dark:bg-customDark p-4 rounded-lg shadow">
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Price Range</h3>
                <Slider
                  defaultValue={[0, Math.max(...Products.map(p => p.price))]}
                  max={Math.max(...Products.map(p => p.price))}
                  step={1000}
                  onValueChange={(value : any) => setFilters({...filters, priceRange: value})}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Rp {filters.priceRange[0].toLocaleString()}</span>
                  <span>Rp {filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Categories</h3>
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

              {/* Other Filters */}
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
                    In Stock
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} results
              </p>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters({...filters, sortBy: value})}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="bestselling">Best Selling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </>
  );
}
