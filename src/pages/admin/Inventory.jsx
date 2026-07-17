import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, Package, AlertCircle, Check, Minus, Plus } from "lucide-react";
import Card from "@/components/ui/Card";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import Pagination from "@/components/common/Pagination";
import { getProducts } from "@/api/products";
import { adminAdjustStock } from "@/api/admin";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getErrorMessage } from "@/utils/errors";

const PAGE_SIZE = 10;

export default function AdminInventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 0);

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deltas, setDeltas] = useState({}); // productId -> pending delta string
  const [rowState, setRowState] = useState({}); // productId -> { loading, error, applied }

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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getProducts({
      search: urlSearch || undefined,
      page,
      size: PAGE_SIZE,
      sort: "stockQuantity,asc",
    })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load inventory right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [urlSearch, page]);

  function goToPage(p) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(p));
      return next;
    });
  }

  async function applyDelta(productId) {
    const raw = deltas[productId];
    const delta = Number(raw);
    if (!raw || Number.isNaN(delta) || !Number.isInteger(delta) || delta === 0) return;

    setRowState((s) => ({ ...s, [productId]: { loading: true, error: null } }));
    try {
      const updated = await adminAdjustStock(productId, { quantity: delta });
      setData((d) => ({
        ...d,
        content: d.content.map((p) => (p.id === productId ? updated : p)),
      }));
      setDeltas((d) => ({ ...d, [productId]: "" }));
      setRowState((s) => ({ ...s, [productId]: { loading: false, applied: true } }));
      setTimeout(() => {
        setRowState((s) => ({ ...s, [productId]: { loading: false, applied: false } }));
      }, 1500);
    } catch (err) {
      setRowState((s) => ({
        ...s,
        [productId]: { loading: false, error: getErrorMessage(err, "Couldn't adjust stock.") },
      }));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Inventory</h1>
        <p className="mt-1 text-sm text-text-muted">
          Sorted lowest stock first. Enter a positive number to restock, negative to remove.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products…"
          className="h-11 w-full rounded-xl border border-white/10 bg-surface pl-10 pr-9 text-sm text-text outline-none transition-colors placeholder:text-text-faint focus:border-primary"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <Card className="divide-y divide-white/10">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-10 w-full" />
            </div>
          ))}

        {!loading && data.content.length === 0 && (
          <EmptyState icon={Package} title="No products found" />
        )}

        {!loading &&
          data.content.map((product) => {
            const state = rowState[product.id] || {};
            return (
              <div key={product.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Package size={16} className="text-text-faint" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text">{product.name}</p>
                  <p className="text-xs text-text-faint">{product.category}</p>
                </div>

                <span
                  className={`w-24 shrink-0 text-sm font-medium ${product.stockQuantity <= 5 ? "text-danger" : "text-text-muted"}`}
                >
                  {product.stockQuantity} in stock
                </span>

                <div className="flex shrink-0 items-center gap-2">
                  <input
                    type="number"
                    value={deltas[product.id] || ""}
                    onChange={(e) =>
                      setDeltas((d) => ({ ...d, [product.id]: e.target.value }))
                    }
                    placeholder="±qty"
                    className="h-9 w-20 rounded-lg border border-white/10 bg-surface px-2.5 text-center text-sm text-text outline-none focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => applyDelta(product.id)}
                    disabled={state.loading}
                    className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors disabled:opacity-50
                      ${state.applied ? "bg-success/15 text-success" : "bg-primary/15 text-primary hover:bg-primary/25"}`}
                  >
                    {state.applied ? <Check size={13} /> : Number(deltas[product.id]) < 0 ? <Minus size={13} /> : <Plus size={13} />}
                    {state.applied ? "Applied" : "Apply"}
                  </button>
                </div>

                {state.error && (
                  <p className="w-full text-xs text-danger">{state.error}</p>
                )}
              </div>
            );
          })}
      </Card>

      <Pagination page={page} totalPages={data.totalPages} onChange={goToPage} />
    </div>
  );
}
