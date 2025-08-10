"use client"

import { useState, useCallback } from "react"
import { Product } from "@/types"
import { SearchFilters } from "@/components/ProductSearch"
import Cookies  from "js-cookie"

interface Pagination {
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface UseProductSearchResult {
  searchResults: Product[]
  pagination: Pagination | null
  isSearching: boolean
  searchError: string | null
  searchProducts: (filters: SearchFilters, page?: number) => Promise<void>
  clearSearch: () => void
}

/**
 * Custom hook to handle product search functionality
 * Makes API calls to search products based on filters
 */
export function useProductSearch(): UseProductSearchResult {
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const searchProducts = useCallback(async (filters: SearchFilters, page: number = 1) => {
    setIsSearching(true)
    setSearchError(null)

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

      // Add pagination parameter
      queryParams.append('page', page.toString())

      const shopId = Cookies.get("shopId");
      
      // Make API call
      const response = await fetch(
        `http://localhost:5000/shops/${shopId}/products?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log(data);
      setSearchResults(data.products || [])
      setPagination(data.pagination || null)
    } catch (error) {
      console.error('Search error:', error)
      setSearchError(error instanceof Error ? error.message : 'Search failed')
      setSearchResults([])
      setPagination(null)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchResults([])
    setPagination(null)
    setSearchError(null)
  }, [])

  return {
    searchResults,
    pagination,
    isSearching,
    searchError,
    searchProducts,
    clearSearch
  }
}