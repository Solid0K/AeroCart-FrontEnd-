import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, AlertCircle, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import Pagination from "@/components/common/Pagination";
import { EmptyState } from "@/components/ui/Feedback";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getProducts } from "@/api/products";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price,asc", label: "Price: low to high" },
  { value: "price,desc", label: "Price: high to low" },
  { value: "name,asc", label: "Name: A to Z" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlPage = Number(searchParams.get("page") || 0);
  const urlSort = searchParams.get("sort") || "";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep the URL in sync with the debounced search text, resetting to page 0.
  useEffect(() => {
    if (debouncedSearch === urlSearch) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedSearch) next.set("search", debouncedSearch);
      else next.delete("search");
      next.set("page", "0");
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // If the URL search changes from elsewhere (e.g. a category chip), reflect it in the input.
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getProducts({
      search: urlSearch || undefined,
      page: urlPage,
      size: PAGE_SIZE,
      sort: urlSort || undefined,
    })
      .then((res) => {
        if (!cancelled) setData(res);
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
  }, [urlSearch, urlPage, urlSort]);

  function goToPage(page) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSortChange(sort) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (sort) next.set("sort", sort);
      else next.delete("sort");
      next.set("page", "0");
      return next;
    });
  }

  function clearSearch() {
    setSearchInput("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Shop</h1>
        <p className="mt-1 text-sm text-text-muted">
          {data.totalElements > 0
            ? `${data.totalElements} product${data.totalElements === 1 ? "" : "s"}`
            : "Browse the catalog"}
          {urlSearch && (
            <>
              {" "}
              for <span className="text-text">"{urlSearch}"</span>
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products…"
            className="h-11 w-full rounded-xl border border-white/10 bg-surface pl-10 pr-9 text-sm text-text outline-none transition-colors placeholder:text-text-faint focus:border-primary"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-text-faint" />
          <select
            value={urlSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-surface px-3 text-sm text-text outline-none focus:border-primary"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!error && loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!error && !loading && data.content.length === 0 && (
        <EmptyState
          icon={Search}
          title="No products found"
          description={
            urlSearch
              ? `Nothing matched "${urlSearch}". Try a different search.`
              : "Check back once products are added."
          }
        />
      )}

      {!error && !loading && data.content.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="pt-2">
            <Pagination page={urlPage} totalPages={data.totalPages} onChange={goToPage} />
          </div>
        </>
      )}
    </div>
  );
}
