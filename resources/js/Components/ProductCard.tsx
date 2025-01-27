import { Card, CardContent } from "@/Components/ui/card";
import { router } from "@inertiajs/react";
import { Product } from '@/types';
import { Badge } from "@/Components/ui/badge";
import { Heart, Package, Star, Truck, Info } from "lucide-react";
import { useEffect,useState } from "react";

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
      className="group hover:shadow-xl bg-white dark:bg-customDark transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      <CardContent className="p-0">

        <div className="aspect-square overflow-hidden relative">
          <img
            src={"/" + product.product_images[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Lihat Detail</span>
          </div>
        </div>

        <div className="p-4 space-y-1">
          <h3 className="font-medium line-clamp-2 text-sm leading-tight group-hover:text-[var(--app-color)] transition-colors duration-200">
            {product.name}
          </h3>

          <div className="space-y-1">
            <div className="text-lg font-bold text-[var(--app-color)]">
              Rp {product.price.toLocaleString("id-ID")}
            </div>
            <div className="flex items-center text-xs">
            <Package size={14} className="mr-1" />
              <span>Stok: {product.stock}</span>
                  {product.stock < product.min_order && (
                    <Badge variant="destructive" className="ml-2">
                      Habis
                    </Badge>
                  )}
            </div>
            <div className="flex items-center text-xs">
              <Info size={14} className="mr-1" />
              <span>Min. {product.min_order}</span>
            </div>
          </div>


          <div className="flex items-center text-xs text-gray-500 space-x-3">
            <div className="flex items-center">
              <Star size={14} className="mr-1 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>

            <div className="flex items-center">
              <Truck size={14} className="mr-1" />
              <span>{product.sold} terjual</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
