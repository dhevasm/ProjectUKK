import { Card, CardContent } from "@/Components/ui/card";
import { router } from "@inertiajs/react";
import { Product } from '@/types';
import { Badge } from "@/Components/ui/badge";
import { Heart, Package, Star, Truck } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {

  return (
    <Card
      onClick={() => {
        router.get(route('product.show.detail', { id: product.id }));
      }}
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      <CardContent className="p-0">


        {/* Image Container */}
        <div className="aspect-square overflow-hidden relative">
          <img
            src={"/" + product.product_images[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          {/* Image Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-sm font-medium">View Details</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          <h3 className="font-medium line-clamp-2 text-sm leading-tight group-hover:text-[var(--app-color)] transition-colors duration-200">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="text-lg font-bold text-[var(--app-color)]">
              Rp {product.price.toLocaleString()} / Lembar
            </div>
            <div className="flex items-center text-xs">
              <Package size={14} className="mr-1" />
              <span>Min. {product.min_order} lembar</span>
            </div>
          </div>


          {/* Product Stats */}
          <div className="flex items-center text-xs text-gray-500 space-x-3">
            <div className="flex items-center">
              <Star size={14} className="mr-1 text-yellow-400" />
              <span>4.8</span>
            </div>

            <div className="flex items-center">
              <Truck size={14} className="mr-1" />
              <span>{product.sold} sold</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
