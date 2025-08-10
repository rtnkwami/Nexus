// app/products/search/page.tsx
import { Suspense } from 'react'
import ProductSearchPage from '@/components/ProductSearchPage'

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductSearchPage />
    </Suspense>
  )
}

export const metadata = {
  title: 'Search Products - Nexus',
  description: 'Search products from all our partner shops',
}