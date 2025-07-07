import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import { Product } from "@/types"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full max-w-xs p-3">
        <div className="relative w-full aspect-[4/3] mb-3">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="rounded-md object-cover"
            />
        </div>
        <CardTitle className="text-base mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-1">
            {product.description ?? "No description available."}
        </CardDescription>
        <p className="text-lg font-medium">&#8373;{product.price.toFixed(2)}</p>
    </Card>
  )
}