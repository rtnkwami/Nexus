"use client"

import { Pencil, Trash } from "lucide-react"
// import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Product } from "@/types"

type Props = {
  products: Product[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {/* <th className="px-4 py-3">Image</th> */}
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-2 font-medium">
                <Link href={`/shop/products/${product.id}`} className="text-blue-600 hover:underline">
                  {product.name}
                </Link>
                </td>
              <td className="px-4 py-2">${product.price.toFixed(2)}</td>
              <td className="px-4 py-2 font-medium">{product.category}</td>
              <td className="px-4 py-2">{product.stock}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(product.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete?.(product.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <p className="text-center text-muted-foreground py-6">No products found.</p>
      )}
    </div>
  )
}
