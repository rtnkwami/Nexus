import ProductList from "@/components/ProductList"

type Product = {
  id: string
  name: string
  imageUrl: string
  price: number
  description?: string
}

type Pagination = {
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

type ProductResponse = {
  products: Product[]
  pagination: Pagination
}

async function getProducts(): Promise<ProductResponse> {
  const res = await fetch("http://localhost:5000/products", {
    cache: "no-store", // avoid caching during dev
  });

  if (!res.ok) throw new Error("Failed to fetch products")

  return res.json();
}


export default async function Home() {

  const data = await getProducts();
  const products = data.products;

  return (
    <main className="px-4 py-2">
      <h1 className="text-2xl font-semibold mb-4">Featured Products</h1>
      <ProductList products={products} />
    </main>
  )
};