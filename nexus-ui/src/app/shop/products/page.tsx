"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ProductTable from "@/components/ProductTable"
import { useShopProducts } from "@/hooks/useShopProducts"
import { Product } from "@/types"          // <‑‑ make sure this is the ONE source of truth
import { ProductForm } from "@/components/ProductForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ProductInventory() {
  const {
    products: fetchedProducts,
    loading,
    error,
  } = useShopProducts()

  /* 1️. local state for products and edit product */
  const [products, setProducts] = useState<Product[]>([])
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  /* initialise / keep in sync if server returns new list */
  useEffect(() => {
    if (fetchedProducts.length) {
      setProducts(fetchedProducts)
    }
  }, [fetchedProducts])

  /* open modal with chosen row */
  const handleEdit = (id: string) => {
    const product = products.find((p) => p.id === id)
    if (product) setEditProduct(product)
  }

  /* patch the local list after a successful update */
  const handleProductUpdate = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
    setEditProduct(null)
  }

  if (loading) return <p>Loading…</p>
  if (error)   return <p className="text-red-500">Error loading products</p>

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
        onEdit={handleEdit}
        onDelete={(id) => console.log("delete", id)}
      />

      <Dialog
        open={!!editProduct}
        onOpenChange={() => setEditProduct(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
          </DialogHeader>

          {editProduct && (
            <ProductForm
              mode="update"
              productId={editProduct.id}
              initialData={{
                name:        editProduct.name,
                price:       editProduct.price.toString(),
                description: editProduct.description,
                stock:       editProduct.stock.toString(),
                category:    editProduct.category,
              }}
              onSuccess={handleProductUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
