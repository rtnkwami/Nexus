import { useState, useEffect } from "react"
import { useShopProducts } from "./useShopProducts"
import { useProductSearch } from "./useProductSearch"
import { deleteProduct } from "@/lib/api/products"
import { Product } from "@/types"

export const useProductInventory = () => {
  const { products: fetchedProducts, loading, error } = useShopProducts()
  const {
    searchResults, pagination, isSearching, searchError, searchProducts, clearSearch
  } = useProductSearch()

  const [products, setProducts] = useState<Product[]>([])
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showingSearchResults, setShowingSearchResults] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean,
    productId: string,
    productName: string
  } | null>(null)

  useEffect(() => {
    if (fetchedProducts.length && !showingSearchResults) {
      setProducts(fetchedProducts)
    }
  }, [fetchedProducts, showingSearchResults])

  useEffect(() => {
    if (showingSearchResults) setProducts(searchResults)
  }, [searchResults, showingSearchResults])

  const handleSearch = async (filters: any) => {
    if (filters.searchTerm || filters.minPrice || filters.maxPrice || filters.category) {
      await searchProducts(filters)
      setShowingSearchResults(true)
    } else {
      handleClearSearch()
    }
  }

  const handleClearSearch = () => {
    clearSearch()
    setShowingSearchResults(false)
    setProducts(fetchedProducts)
  }

  const handleCreate = () => setIsCreateModalOpen(true)
  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id)
    if (product) setEditProduct(product)
  }

  const handleProductUpdate = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)))
    setEditProduct(null)
  }

  const handleProductCreate = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct])
    setIsCreateModalOpen(false)
  }

  const handleCloseModal = () => {
    setEditProduct(null)
    setIsCreateModalOpen(false)
  }

  const handleDeleteClick = (id: string) => {
    const product = products.find(p => p.id === id)
    if (product) {
      setDeleteConfirm({ isOpen: true, productId: id, productName: product.name })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    try {
      await deleteProduct(deleteConfirm.productId)
      setProducts(prev => prev.filter(p => p.id !== deleteConfirm.productId))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handleDeleteCancel = () => setDeleteConfirm(null)

  const categories = [...new Set(fetchedProducts.map(p => p.category))].filter(Boolean)

  return {
    state: {
      products, editProduct, isCreateModalOpen, isSearching,
      searchError, showingSearchResults, pagination,
      deleteConfirm, categories, loading, error
    },
    handlers: {
      handleSearch, handleClearSearch, handleCreate, handleEdit,
      handleProductUpdate, handleProductCreate, handleCloseModal,
      handleDeleteClick, handleDeleteConfirm, handleDeleteCancel
    },
    derived: {
      isModalOpen: !!editProduct || isCreateModalOpen,
      isEditMode: !!editProduct,
      modalTitle: editProduct ? "Update Product" : "Create New Product"
    }
  }
}
