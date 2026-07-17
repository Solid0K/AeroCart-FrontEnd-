import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import Hero from "@/components/marketing/Hero";
import WhyAeroCart from "@/components/marketing/WhyAeroCart";
import CategoryStrip from "@/components/marketing/CategoryStrip";
import Footer from "@/components/marketing/Footer";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { EmptyState } from "@/components/ui/Feedback";
import { getProducts } from "@/api/products";

// No dedicated "list categories" endpoint exists on the backend, so we
// derive category chips from whatever page of products we fetch here.
// This is an approximation (it reflects only the fetched page, not the
// full catalog) — a real /user/categories endpoint would be a nice
// backend addition down the line, but that's outside this frontend build.
function deriveCategories(products) {
  const counts = new Map();
  for (const p of products) {
    if (!p.category) continue;
    counts.set(p.category, (counts.get(p.category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .slice(0, 6);
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getProducts({ page: 0, size: 24 })
      .then((data) => {
        if (cancelled) return;
        setProducts(data?.content || []);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load products right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = products.slice(0, 8);
  const categories = deriveCategories(products);

  return (
    <div className="flex flex-col gap-14 pb-8">
      <Hero />

      {categories.length > 0 && <CategoryStrip categories={categories} />}

      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-text">
              Featured products
            </h2>
            <p className="mt-1 text-sm text-text-muted">Fresh off the shelf.</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {!error && loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && !loading && featured.length === 0 && (
          <EmptyState
            title="No products yet"
            description="Once products are added in the admin dashboard, they'll show up here."
          />
        )}

        {!error && !loading && featured.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <WhyAeroCart />

      <Footer />
    </div>
  );
}
