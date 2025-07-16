"use client"

import Image from "next/image"
import Link from "next/link"
import { Pencil, Trash, MoreVertical } from "lucide-react"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  products: Product[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: "Out of stock", variant: "destructive" }
  if (stock <= 100) return { label: "Low stock", variant: "warning" }
  return { label: "In stock", variant: "success" }
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="border rounded-lg overflow-x-auto shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const status = getStockStatus(product.stock)

            return (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded border-2 border-dashed border-gray-400"></div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-blue-600">
                  <Link href={`/shop/products/${product.id}`} className="hover:underline">
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3 text-right">{product.stock}</td>
                <td className="px-4 py-3">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </td>
                <td className="px-4 py-3 text-right">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(product.id)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(product.id)}
                        className="text-red-600 focus:text-red-700"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {products.length === 0 && (
        <p className="text-center text-muted-foreground py-6 text-sm">
          No products found.
        </p>
      )}
    </div>
  )
}
