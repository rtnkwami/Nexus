import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

type Product = {
  id: string
  name: string
  imageUrl: string
  price: number
  description?: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full max-w-xs p-3">
        <div className="relative w-full h-36 mb-3">
            <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="rounded-md object-cover"
            />
        </div>
        <CardTitle className="text-base mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-1">
            {product.description ?? "No description available."}
        </CardDescription>
        <p className="text-lg font-medium">${product.price.toFixed(2)}</p>
    </Card>
  )
}