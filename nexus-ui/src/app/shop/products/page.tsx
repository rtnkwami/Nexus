"use client"

import { useProductInventory } from "@/hooks/useProductInventory"
import ProductTable from "@/components/ProductTable"
import ProductSearch from "@/components/ProductSearch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProductForm } from "@/components/ProductForm"

export default function ProductInventoryPage() {
  const {
    state,
    handlers,
    derived,
  } = useProductInventory()

  const {
    products,
    editProduct,
    isCreateModalOpen,
    isSearching,
    searchError,
    showingSearchResults,
    pagination,
    deleteConfirm,
    categories,
  } = state

  const {
    handleCreate,
    handleEdit,
    handleProductCreate,
    handleProductUpdate,
    handleCloseModal,
    handleSearch,
    handleClearSearch,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = handlers

  const isModalOpen = derived.isModalOpen
  const modalTitle = derived.modalTitle
  // Render the product inventory UI
  return (
    <div className="space-y-6">
      {/* Header with title and add product button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Inventory</h2>

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
        onClearSearch={handleClearSearch}
        isLoading={isSearching}
        categories={categories}
        placeholder="Search products by name, description..."
        hasActiveSearch={showingSearchResults}
        showClearButton={showingSearchResults}
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
              Are you sure you want to delete &quot;{deleteConfirm.productName}&quot;? This
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