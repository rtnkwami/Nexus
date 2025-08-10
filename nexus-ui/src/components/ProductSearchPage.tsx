"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductList from "@/components/ProductList"
import ProductSearch from "@/components/ProductSearch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Product } from "@/types"
import { SearchFilters } from "@/components/ProductSearch"

interface SearchResponse {
  products: Product[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalProducts: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Product search results page that displays products matching search criteria
 * Uses the ProductSearch component for filtering and ProductList for display
 */
export default function ProductSearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('search') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: initialQuery
  })
  const [hasSearched, setHasSearched] = useState(false)
  const [pagination, setPagination] = useState<SearchResponse['pagination']>()
  const [categories, setCategories] = useState<string[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  // Fetch categories from API
  const fetchCategories = async () => {
    setCategoriesLoading(true)
    setCategoriesError(null)
    
    try {
      const response = await fetch('/api/products/categories', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`)
      }

      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Categories fetch error:', error)
      setCategoriesError(error instanceof Error ? error.message : 'Failed to fetch categories')
      // Fallback to hardcoded categories if API fails
      setCategories([
        "Electronics",
        "Clothing",
        "Books",
        "Home & Garden",
        "Sports",
        "Beauty",
        "Toys",
        "Automotive"
      ])
    } finally {
      setCategoriesLoading(false)
    }
  }

  // Fetch products based on search filters
  const searchProducts = async (filters: SearchFilters) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()

      if (filters.searchTerm) {
        queryParams.append('search', filters.searchTerm)
      }
      
      if (filters.minPrice !== undefined) {
        queryParams.append('minPrice', filters.minPrice.toString())
      }
      
      if (filters.maxPrice !== undefined) {
        queryParams.append('maxPrice', filters.maxPrice.toString())
      }
      
      if (filters.category) {
        queryParams.append('category', filters.category)
      }

      // Make API call to search across all shops or a public endpoint
      const response = await fetch(
        `/api/products/search?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`)
      }

      const data: SearchResponse = await response.json()
      console.log(data);
      setProducts(data.products || [])
      setPagination(data.pagination)
      setHasSearched(true)
    } catch (error) {
      console.error('Search error:', error)
      setError(error instanceof Error ? error.message : 'Search failed')
      setProducts([])
      setHasSearched(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search from the ProductSearch component
  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters)
    searchProducts(filters)
  }

  // Handle clearing search
  const handleClearSearch = () => {
    const emptyFilters = { searchTerm: '' }
    setSearchFilters(emptyFilters)
    setProducts([])
    setHasSearched(false)
    setPagination(undefined)
  }

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Search on initial load if there's a query parameter
  useEffect(() => {
    if (initialQuery) {
      searchProducts({ searchTerm: initialQuery })
    }
  }, [initialQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Products</h1>
        <p className="text-gray-600">
          Find products from all our partner shops
        </p>
      </div>

      {/* Categories Error Alert */}
      {categoriesError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Warning: {categoriesError}. Using fallback categories.
          </AlertDescription>
        </Alert>
      )}

      {/* Search Component */}
      <div className="mb-8">
        <ProductSearch
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          isLoading={isLoading}
          categories={categories}
          categoriesLoading={categoriesLoading}
          placeholder="Search products across all shops..."
          hasActiveSearch={hasSearched && products.length > 0}
          showClearButton={hasSearched}
        />
      </div>

      {/* Search Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Results Info */}
      {hasSearched && (
        <div className="mb-6">
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">
                Search Results
              </h2>
              <p className="text-sm text-blue-800">
                {pagination ? (
                  <>
                    Showing {products.length} of {pagination.totalProducts} product{pagination.totalProducts !== 1 ? 's' : ''}
                    {searchFilters.searchTerm && (
                      <span className="ml-1">
                        for &quot;{searchFilters.searchTerm}&quot;
                      </span>
                    )}
                    {pagination.totalPages > 1 && (
                      <span className="ml-2 text-blue-600">
                        (Page {pagination.currentPage} of {pagination.totalPages})
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    Found {products.length} product{products.length !== 1 ? 's' : ''}
                    {searchFilters.searchTerm && (
                      <span className="ml-1">
                        for &quot;{searchFilters.searchTerm}&quot;
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Searching products...</p>
        </div>
      )}

      {/* Product Results */}
      {!isLoading && products.length > 0 && (
        <ProductList products={products} />
      )}

      {/* Empty State */}
      {!isLoading && hasSearched && products.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg 
                className="mx-auto h-12 w-12" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              {searchFilters.searchTerm 
                ? `No products match "${searchFilters.searchTerm}". Try adjusting your search terms or filters.`
                : "Try searching with different criteria."
              }
            </p>
          </div>
        </div>
      )}

      {/* No Search Performed Yet */}
      {!isLoading && !hasSearched && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg 
                className="mx-auto h-12 w-12" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to search
            </h3>
            <p className="text-gray-500">
              Enter a search term above to find products from all our partner shops.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}