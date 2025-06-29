"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types/"
import Cookies from "js-cookie"

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

export function useShopProducts() {
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const shopId = Cookies.get("shopId");

        if (!shopId) {
            throw new Error("Shop ID not found in cookies. Please ensure user setup is complete.")
        }

        const res = await fetch(`http://localhost:5000/shops/${shopId}/products`, {
          cache: "no-store",
        })

        if (!res.ok) throw new Error("Failed to fetch products")
        const json = await res.json();
        setData(json)

      } catch (err: any) {
        setError(err)
        console.error("Error fetching shop products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products: data?.products ?? [], pagination: data?.pagination, loading, error }
}
