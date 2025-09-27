import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const hasValidImage =
    product.images && product.images.length > 0 && product.images[0];

  return (
    <Link href={`/products/${product.id}`} className="w-full max-w-xs">
      <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden rounded-lg p-0">
        {/* Image full bleed */}
        <div className="relative w-full aspect-[4/3]">
          {hasValidImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Text with padding */}
        <div className="p-3">
          <CardTitle className="text-base mb-1">{product.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-1">
            {product.description ?? "No description available."}
          </CardDescription>
          <p className="text-lg font-medium">{Number(product.price).toLocaleString("en-GH", {
              style: "currency",
              currency: "GHS",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</p>
        </div>
      </Card>
    </Link>
  );
}
