"use client"

// Import React hooks for state and effect management
import { useEffect, useState } from "react"
// Import the product table component for displaying products in a table
import ProductTable from "@/components/ProductTable"
// Import the custom hook to fetch products for the current shop
import { useShopProducts } from "@/hooks/useShopProducts"
// Import the Product type from the single source of truth
import { Product } from "@/types"
// Import the product form for creating/updating products
import { ProductForm } from "@/components/ProductForm"
// Import the search component
import ProductSearch, { SearchFilters } from "@/components/ProductSearch"
// Import the search hook
import { useProductSearch } from "@/hooks/useProductSearch"
// Import dialog components for modal UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { getAccessToken } from "@auth0/nextjs-auth0"

export const deleteProduct = async (productId: string) => {
  try {
    const token = await getAccessToken();

    const response = await fetch(`http://localhost:5000/shops/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

/**
 * ProductInventory component manages the product inventory page.
 * - Fetches products for the current shop using a custom hook.
 * - Maintains local state for products and the currently edited product.
 * - Handles editing and updating products via a modal form.
 * - Handles creating new products via the same modal form.
 * - Provides search functionality with basic and advanced filters.
 */
export default function ProductInventory() {  
  // Fetch products, loading, and error state from the custom hook
  const {
    products: fetchedProducts,
    loading,
    error,
  } = useShopProducts()

  // Search functionality
  const {
    searchResults,
    pagination,
    isSearching,
    searchError,
    searchProducts,
    clearSearch
  } = useProductSearch()

  // Local state for the list of products (to allow local updates after edits)
  const [products, setProducts] = useState<Product[]>([])
  // Local state for the product currently being edited (null if none)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  // Local state to track if the modal is open for creating a new product
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  // State to track if we're showing search results or all products
  const [showingSearchResults, setShowingSearchResults] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<{
  isOpen: boolean
  productId: string
  productName: string
} | null>(null)

  // Keep local products state in sync with fetched products from the server
  useEffect(() => {
    // Only update if fetchedProducts is non-empty and we're not showing search results
    if (fetchedProducts.length && !showingSearchResults) {
      setProducts(fetchedProducts)
    }
  }, [fetchedProducts, showingSearchResults])

  // Handle search
  const handleSearch = async (filters: SearchFilters) => {
    if (filters.searchTerm.trim() || filters.minPrice || filters.maxPrice || filters.category) {
      await searchProducts(filters)
      setShowingSearchResults(true)
    } else {
      // If no search criteria, show all products
      handleClearSearch()
    }
  }

  // Handle clearing search
  const handleClearSearch = () => {
    clearSearch()
    setShowingSearchResults(false)
    setProducts(fetchedProducts)
  }

  // Update products when search results change
  useEffect(() => {
    if (showingSearchResults) {
      setProducts(searchResults)
    }
  }, [searchResults, showingSearchResults])

  // Handler to open the edit modal for a specific product by id
  const handleEdit = (id: string) => {
    // Find the product in the local state
    const product = products.find((p) => p.id === id)
    // If found, set it as the product to edit (opens the modal)
    if (product) setEditProduct(product)
  }

  // Handler to open the create modal
  const handleCreate = () => {
    setIsCreateModalOpen(true)
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

  // Handler to add a new product to local state after successful creation
  const handleProductCreate = (newProduct: Product) => {
    // Add the new product to the local products array
    setProducts((prev) => [...prev, newProduct])
    // Close the create modal
    setIsCreateModalOpen(false)
  }

  // Handler to close any open modal
  const handleCloseModal = () => {
    setEditProduct(null)
    setIsCreateModalOpen(false)
  }

  const handleDeleteClick = (id: string) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      setDeleteConfirm({ isOpen: true, productId: id, productName: product.name })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    try {
      await deleteProduct(deleteConfirm.productId)
      setProducts((prev) =>
        prev.filter((p) => p.id !== deleteConfirm.productId)
      )
      // toast.success("Product deleted")   // optional
    } catch (err) {
      console.error(err)
      // toast.error("Delete failed")       // optional
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handleDeleteCancel = () => setDeleteConfirm(null)

  // Show loading or error states if needed
  if (loading) return <p>Loading…</p>
  if (error) return <p className="text-red-500">Error loading products</p>

  // Determine modal state and content
  const isModalOpen = !!editProduct || isCreateModalOpen
  const isEditMode = !!editProduct
  const modalTitle = isEditMode ? "Update Product" : "Create New Product"

  // Extract unique categories from products for the search filter
  const categories = [...new Set(fetchedProducts.map(p => p.category))].filter(Boolean)

  // Render the product inventory UI
  return (
    <div className="space-y-6">
      {/* Header with title and add product button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Product Inventory</h2>

        <button 
          onClick={handleCreate}
          className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
        >
          + Add Product
        </button>
      </div>

      {/* Search Component */}
      <ProductSearch
        onSearch={handleSearch}
        isLoading={isSearching}
        categories={categories}
        placeholder="Search products by name, description..."
      />

      {/* Search Error Alert */}
      {searchError && (
        <Alert variant="destructive">
          <AlertDescription>{searchError}</AlertDescription>
        </Alert>
      )}

      {/* Search Results Info */}
      {showingSearchResults && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <span className="text-sm text-blue-800">
            {pagination ? (
              <>
                Showing {products.length} of {pagination.totalProducts} result{pagination.totalProducts !== 1 ? 's' : ''}
                {pagination.totalPages > 1 && (
                  <span className="ml-2 text-blue-600">
                    (Page {pagination.currentPage} of {pagination.totalPages})
                  </span>
                )}
              </>
            ) : (
              <>Showing {products.length} search result{products.length !== 1 ? 's' : ''}</>
            )}
          </span>
          <button
            onClick={handleClearSearch}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Show all products
          </button>
        </div>
      )}

      {/* Product table listing all products with edit/delete actions */}
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Empty state for no products */}
      {products.length === 0 && !isSearching && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {showingSearchResults ? "No products found matching your search." : "No products found."}
          </p>
        </div>
      )}

      {/* Modal dialog for editing or creating a product */}
      <Dialog
        open={isModalOpen}
        onOpenChange={handleCloseModal}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>

          {/* Render the product form for editing */}
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

          {/* Render the product form for creating */}
          {isCreateModalOpen && (
            <ProductForm
              mode="create"
              onSuccess={handleProductCreate}
            />
          )}
        </DialogContent>
      </Dialog>

      {deleteConfirm && (
        <Dialog open onOpenChange={handleDeleteCancel}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete “{deleteConfirm.productName}”? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}