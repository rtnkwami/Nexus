"use client"

// Import React hooks for state and effect management
import { useEffect, useState } from "react"
// Import Next.js Link for navigation
import Link from "next/link"
// Import the product table component for displaying products in a table
import ProductTable from "@/components/ProductTable"
// Import the custom hook to fetch products for the current shop
import { useShopProducts } from "@/hooks/useShopProducts"
// Import the Product type from the single source of truth
import { Product } from "@/types"
// Import the product form for creating/updating products
import { ProductForm } from "@/components/ProductForm"
// Import dialog components for modal UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * ProductInventory component manages the product inventory page.
 * - Fetches products for the current shop using a custom hook.
 * - Maintains local state for products and the currently edited product.
 * - Handles editing and updating products via a modal form.
 */
export default function ProductInventory() {
  // Fetch products, loading, and error state from the custom hook
  const {
    products: fetchedProducts,
    loading,
    error,
  } = useShopProducts()

  // Local state for the list of products (to allow local updates after edits)
  const [products, setProducts] = useState<Product[]>([])
  // Local state for the product currently being edited (null if none)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  // Keep local products state in sync with fetched products from the server
  useEffect(() => {
    // Only update if fetchedProducts is non-empty
    if (fetchedProducts.length) {
      setProducts(fetchedProducts)
    }
  }, [fetchedProducts])

  // Handler to open the edit modal for a specific product by id
  const handleEdit = (id: string) => {
    // Find the product in the local state
    const product = products.find((p) => p.id === id)
    // If found, set it as the product to edit (opens the modal)
    if (product) setEditProduct(product)
  }

  // Handler to update a product in local state after a successful update
  const handleProductUpdate = (updated: Product) => {
    // Replace the updated product in the local products array
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
    // Close the edit modal
    setEditProduct(null)
  }

  // Show loading or error states if needed
  if (loading) return <p>Loading…</p>
  if (error)   return <p className="text-red-500">Error loading products</p>

  // Render the product inventory UI
  return (
    <div className="space-y-4">
      {/* Header with title and add product button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Product Inventory</h2>

        <Link href="/shop/products/create">
          <button className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Product table listing all products with edit/delete actions */}
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={(id) => console.log("delete", id)}
      />

      {/* Modal dialog for editing a product */}
      <Dialog
        open={!!editProduct}
        onOpenChange={() => setEditProduct(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
          </DialogHeader>

          {/* Render the product form if a product is being edited */}
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
