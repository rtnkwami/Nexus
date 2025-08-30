// app/page.tsx

import ProductList from "@/components/ProductList"
import { Product } from "@/types";
import PopularProductsCarousel from "@/components/PopularProductsCarousel";

// --- deterministic color from category name (no hardcoded map)
const hueFromString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360; // 0..359
};
const accentStyle = (category: string): React.CSSProperties => ({
  // tweak saturation/lightness to taste
  backgroundColor: `hsl(${hueFromString(category)} 85% 45%)`,
});

// DATA FETCHERS (unchanged)
async function getCategories(): Promise<string[]> {
  const res = await fetch("http://localhost:5000/products/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories;
}
async function getPopularProductsByCategory(category: string): Promise<Product[]> {
  const url = `http://localhost:5000/products/categories/${encodeURIComponent(category)}/popular`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error(`Failed to fetch popular products for category: ${category}`, res.status, res.statusText);
    return [];
  }
  const data = await res.json();
  return data.popularProducts || [];
}
async function getOverallPopularProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/products/popular", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch overall popular products");
  const data = await res.json();
  return data.popularProducts || [];
}

export default async function Home() {
  const categories = await getCategories();
  const overallPopular = await getOverallPopularProducts();

  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const products = await getPopularProductsByCategory(category);
      return { category, products };
    })
  );

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Overall most popular */}
        <section className="mb-10">
          <PopularProductsCarousel products={overallPopular} />
        </section>

        {/* Popular by category */}
        <div className="space-y-8">
          {categoryData.map(({ category, products }, i) => {
            const bg = i % 2 === 0 ? "bg-white" : "bg-gray-50";
            return (
              <section
                key={category}
                className={`rounded-3xl ${bg} ring-1 ring-gray-200 shadow-sm p-5 sm:p-6`}
                aria-labelledby={`section-${i}`}
              >
                <div className="mb-4 flex items-center gap-3">
                  {/* dynamic accent from category name */}
                  <span className="inline-block h-1.5 w-10 rounded-full" style={accentStyle(category)} />
                  <h2 id={`section-${i}`} className="text-xl font-semibold tracking-tight">
                    Popular in {category}
                  </h2>
                </div>

                <ProductList products={products} />
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
