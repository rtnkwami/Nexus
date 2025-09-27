import ProductList from "@/components/ProductList";
import { Product } from "@/types";
import PopularProductsCarousel from "@/components/PopularProductsCarousel";

const hueFromString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
};

const accentStyle = (category: string): React.CSSProperties => ({
  backgroundColor: `hsl(${hueFromString(category)} 85% 45%)`,
});

async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch("http://localhost:5000/products/categories", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.categories) ? data.categories : [];
  } catch (e) {
    console.error("Failed to fetch categories", e);
    return [];
  }
}

async function getPopularProductsByCategory(category: string): Promise<Product[]> {
  try {
    const url = `http://localhost:5000/products/categories/${encodeURIComponent(category)}/popular`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Failed to fetch popular products for category: ${category}`, res.status, res.statusText);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data?.popularProducts) ? data.popularProducts : [];
  } catch (e) {
    console.error(`Error fetching popular products for category: ${category}`, e);
    return [];
  }
}

async function getOverallPopularProducts(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:5000/products/popular", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.popularProducts) ? data.popularProducts : [];
  } catch (e) {
    console.error("Failed to fetch overall popular products", e);
    return [];
  }
}

export default async function Home() {
  const [categories, overallPopular] = await Promise.all([
    getCategories(),
    getOverallPopularProducts(),
  ]);

  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const products = await getPopularProductsByCategory(category);
      return { category, products };
    })
  );

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10">
          {overallPopular.length > 0 ? (
            <PopularProductsCarousel products={overallPopular} />
          ) : (
            <div className="rounded-3xl bg-gray-50 ring-1 ring-gray-200 shadow-sm p-8 text-center">
              <h2 className="text-lg font-semibold tracking-tight">No popular products right now</h2>
              <p className="mt-2 text-sm text-gray-600">Check back later as trends update.</p>
            </div>
          )}
        </section>

        {categoryData.length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm p-8 text-center">
            <h2 className="text-lg font-semibold tracking-tight">No categories available</h2>
            <p className="mt-2 text-sm text-gray-600">Try refreshing or come back later.</p>
          </div>
        ) : (
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
                    <span className="inline-block h-1.5 w-10 rounded-full" style={accentStyle(category)} />
                    <h2 id={`section-${i}`} className="text-xl font-semibold tracking-tight">
                      Popular in {category}
                    </h2>
                  </div>

                  {products.length > 0 ? (
                    <ProductList products={products} />
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                      <p className="text-sm text-gray-600">No popular items in {category} at the moment.</p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}