// This custom hook fetches the list of products for the current shop from the backend API.
// It manages loading, error, and pagination state, and returns the products for use in UI components.

"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types/"
import Cookies from "js-cookie"

// ProductsResponse describes the expected shape of the products API response for a shop.
type ProductsResponse = {
  products: Product[]
  pagination: {
    currentPage: number
    totalPages: number
    totalProducts: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * useShopProducts fetches and returns products for the current shop.
 * - Reads the shopId from cookies (set during user setup).
 * - Handles loading and error states.
 * - Returns products and pagination info for use in shop management pages.
 */
export function useShopProducts() {
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // fetchProducts retrieves products for the current shop from the backend API.
    async function fetchProducts() {
      try {
        // Get the shopId from cookies (required for API request)
        const shopId = Cookies.get("shopId");

        if (!shopId) {
            throw new Error("Shop ID not found in cookies. Please ensure user setup is complete.")
        }

        // Fetch products for the shop from the backend API
        const res = await fetch(`http://localhost:5000/shops/${shopId}/products`, {
          cache: "no-store",
        })

        if (!res.ok) throw new Error("Failed to fetch products")
        const json = await res.json();
        setData(json)

      } catch (err: any) {
        // Set error state and log for debugging
        setError(err)
        console.error("Error fetching shop products:", err)
      } finally {
        // Always clear loading state
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Return products, pagination, loading, and error state for use in UI
  return { 
    products: data?.products ?? [],
    pagination: data?.pagination,
    loading,
    error,
  }
}
