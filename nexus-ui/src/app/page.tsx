// This file defines the main landing page of the application.
// It fetches a list of categories and then gets popular products for each category.

import ProductList from "@/components/ProductList"
import { Product } from "@/types";
import PopularProductsCarousel from "@/components/PopularProductsCarousel";

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
  
  const res = await fetch(url, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    console.error(`Failed to fetch popular products for category: ${category}`, res.status, res.statusText);
    return [];
  }

  const data = await res.json();
  return data.popularProducts || [];
}

// getOverallPopularProducts fetches the most popular products overall
async function getOverallPopularProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/products/popular", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch overall popular products")

  const data = await res.json();
  return data.popularProducts || [];
}

// Home is the main page component.
export default async function Home() {
  // Fetch categories and overall popular products
  const categories = await getCategories();
  const overallPopular = await getOverallPopularProducts();
  
  // Fetch popular products for each category
  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const products = await getPopularProductsByCategory(category);
      return {
        category,
        products
      };
    })
  );

  return (
    <main className="px-4 py-2">      
      {/* Overall most popular products */}
      <section className="mb-8">
        {/* <h1 className="text-xl font-medium mb-4">Most Popular This Week</h1> */}
        <PopularProductsCarousel products={overallPopular} />
      </section>
      
      {/* Popular by category */}
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