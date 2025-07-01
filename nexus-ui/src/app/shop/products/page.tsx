"use client"

import ProductTable from "@/components/ProductTable"
import { useShopProducts } from "@/hooks/useShopProducts"
import Link from "next/link"

export default function ProductInventory() {
  const { products, loading, error } = useShopProducts()

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">Error loading products</p>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Product Inventory</h2>
        <Link href="/shop/products/create">
            <button className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                + Add Product
            </button>
        </Link>
      </div>
      <ProductTable
        products={products}
        onEdit={(id) => console.log("edit", id)}
        onDelete={(id) => console.log("delete", id)}
      />
    </div>
  )
}