import { Card, CardContent } from "@/Components/ui/card";
import { router } from "@inertiajs/react";
import { Product } from '@/types';
import { Badge } from "@/Components/ui/badge";
import { Heart, Package, Star, Truck, Info } from "lucide-react";
import { useEffect, useState } from "react";

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const ProductCard = ({ product }: { product: Product }) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (product.reviews.length === 0) {
      setRating(0);
      return;
    }
    let total = 0;
    product.reviews.map((review) => {
      total += review.rating;
    });
    setRating(total / product.reviews.length);
  }, [product.reviews]);

  return (
    <Card
      onClick={() => {
        router.get(route('product.show.detail', { name: product.name.replace(/\s+/g, '-') }));
      }}
      className="group hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-customDark transition-all duration-300 cursor-pointer relative overflow-hidden rounded-xl border dark:border-gray-700"
    >
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden relative">
          <img
            src={"/" + product.product_images[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-sm font-medium px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Lihat Detail
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-medium line-clamp-2 text-sm leading-tight group-hover:text-[var(--app-color)] transition-colors duration-200">
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-[var(--app-color)]">
                Rp {product.price.toLocaleString("id-ID")}
              </div>
              {product.stock < product.min_order && (
                <Badge variant="destructive" className="text-xs">
                  Habis
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <Package size={14} className="mr-1" />
                <span>Stok: {formatNumber(product.stock)}</span>
              </div>
              <div className="flex items-center">
                <Info size={14} className="mr-1" />
                <span>Min. {product.min_order}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
                  <Star size={14} className="mr-1" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Truck size={14} className="mr-1" />
                <span>{formatNumber(product.sold)} terjual</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
