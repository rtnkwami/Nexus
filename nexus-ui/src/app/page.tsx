// This file defines the main landing page of the application.
// It fetches a list of categories and then gets popular products for each category.

import ProductList from "@/components/ProductList"
import { Product } from "@/types"

// getCategories fetches the list of available categories from the backend API.
async function getCategories(): Promise<string[]> {
  const res = await fetch("http://localhost:5000/products/categories", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch categories")

  const data = await res.json();
  return data.categories;
}

// getPopularProductsByCategory fetches popular products for a specific category
async function getPopularProductsByCategory(category: string): Promise<Product[]> {
  const url = `http://localhost:5000/products/categories/${encodeURIComponent(category)}/popular`;
  console.log("Fetching:", url);
  
  const res = await fetch(url, {
    cache: "no-store",
  });

  console.log("Response status:", res.status, "for category:", category);
  
  if (!res.ok) {
    console.error(`Failed to fetch popular products for category: ${category}`, res.status, res.statusText);
    return [];
  }

  const data = await res.json();
  console.log("Raw response data for", category, ":", data);
  return data.popularProducts || [];
}

// Home is the main page component.
export default async function Home() {
  // Fetch categories
  const categories = await getCategories();
  console.log("Categories:", categories);
  
  // Fetch popular products for each category
  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const products = await getPopularProductsByCategory(category);
      console.log(`Products for ${category}:`, products);
      return {
        category,
        products
      };
    })
  );

  console.log("Final categoryData:", categoryData);

  return (
    <main className="px-4 py-2">
      <h1 className="text-2xl font-semibold mb-6">Popular Products</h1>
      
      <div className="space-y-8">
        {categoryData.map(({ category, products }) => (
          <section key={category}>
            <h2 className="text-xl font-medium mb-4">Popular in {category}</h2>
            <ProductList products={products} />
          </section>
        ))}
      </div>
    </main>
  )
};