import { Card, CardContent } from "@/Components/ui/card";

interface CategoryType {
    id: number;
    name: string;
    image: string;
}

interface productImagesType {
    id: number;
    product_id: number;
    url: string;
}

interface ProductType {
    id: number;
    name: string;
    category: CategoryType;
    price: number;
    min_order: number;
    sold: number;
    description: string;
    visible: boolean;
    created_at: string;
    product_images: productImagesType[];
};

const ProductCard = ({ product } : {product: ProductType}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105">
      <CardContent className="p-4">
        <div className="aspect-square mb-2 overflow-hidden rounded-lg">
          <img
            src={product.product_images[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="space-y-1">
          <p className="font-medium truncate group-hover:text-[var(--app-color)] transition-colors duration-300">
            {product.name}
          </p>
          <p className="text-lg font-bold text-[var(--app-color)]">
            Rp {product.price.toLocaleString()}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span>Min. {product.min_order} pcs</span>
            <span className="mx-2">•</span>
            <span>Terjual {product.sold}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
