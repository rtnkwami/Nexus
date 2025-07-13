// This file defines the main landing page of the application.
// It fetches a list of products from the backend and displays them using the ProductList component.

import ProductList from "@/components/ProductList"
import { Product } from "@/types"

// Pagination type describes the structure of pagination data returned by the backend.
// This helps with type safety and future extensibility if pagination controls are added.
type Pagination = {
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// ProductResponse type describes the expected shape of the product API response.
type ProductResponse = {
  products: Product[]
  pagination: Pagination
}

// getProducts fetches the list of products from the backend API.
// The 'no-store' cache option ensures fresh data is fetched on every request (useful during development).
async function getProducts(): Promise<ProductResponse> {
  const res = await fetch("http://localhost:5000/products", {
    cache: "no-store", // avoid caching during dev
  });

  if (!res.ok) throw new Error("Failed to fetch products")

  return res.json();
}

// Home is the main page component.
// It loads products from the backend and renders them in a grid using ProductList.
export default async function Home() {
  // Fetch product data from the backend API
  const data = await getProducts();
  const products = data.products;

  // Render the main content area with a title and the product list
  return (
    <main className="px-4 py-2">
      <h1 className="text-2xl font-semibold mb-4">Featured Products</h1>
      <ProductList products={products} />
    </main>
  )
};