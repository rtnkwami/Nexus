import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  // Check if there's a valid image
  const hasValidImage = product.images && product.images.length > 0 && product.images[0];

  return (
    <Link href={`/products/${product.id}`} className="w-full max-w-xs">
      <Card className="p-3 hover:shadow-md transition-shadow duration-300 cursor-pointer">
        <div className="relative w-full aspect-[4/3] mb-3">
          {hasValidImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="rounded-md object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>
        <CardTitle className="text-base mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-1">
          {product.description ?? "No description available."}
        </CardDescription>
        <p className="text-lg font-medium">&#8373;{product.price.toFixed(2)}</p>
      </Card>
    </Link>
  );
}