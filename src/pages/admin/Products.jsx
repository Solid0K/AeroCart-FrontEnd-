import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  X,
  Plus,
  Pencil,
  EyeOff,
  Trash2,
  Package,
  AlertCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CategoryBadge } from "@/components/ui/Badge";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { getProducts } from "@/api/products";
import { adminSoftDeleteProduct, adminAbsoluteDeleteProduct } from "@/api/admin";
import { categoryColor } from "@/utils/categoryColor";
import { formatCurrency } from "@/utils/format";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 0);

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null); // { type, product }
  const [actionLoading, setActionLoading] = useState(false);

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

  function fetchProducts() {
    setLoading(true);
    setError("");
    return getProducts({ search: urlSearch || undefined, page, size: PAGE_SIZE })
      .then((res) => setData(res))
      .catch(() => setError("Couldn't load products right now."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelled = false;
    fetchProducts().then(() => {
      if (cancelled) return;
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, page]);

  function goToPage(p) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(p));
      return next;
    });
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setActionLoading(true);
    try {
      if (confirmTarget.type === "soft") {
        await adminSoftDeleteProduct(confirmTarget.product.id);
      } else {
        await adminAbsoluteDeleteProduct(confirmTarget.product.id);
      }
      setConfirmTarget(null);
      fetchProducts();
    } catch {
      setError("Couldn't complete that action.");
      setConfirmTarget(null);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">Products</h1>
          <p className="mt-1 text-sm text-text-muted">
            {data.totalElements > 0 ? `${data.totalElements} active products` : "Manage your catalog"}
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button icon={Plus}>Add product</Button>
        </Link>
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

      <Card className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col gap-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        ) : data.content.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description={urlSearch ? `Nothing matched "${urlSearch}".` : "Add your first product to get started."}
          />
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-text-faint">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.content.map((product) => {
                const color = categoryColor(product.category);
                return (
                  <tr key={product.id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                          <Package size={15} className="text-text-faint" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-text">{product.name}</p>
                          <CategoryBadge category={product.category} color={color} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-text">{formatCurrency(product.price, product.currency)}</td>
                    <td className="p-4">
                      <span className={product.stockQuantity <= 5 ? "text-danger" : "text-text-muted"}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-text-faint">{product.sku}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-faint transition-colors hover:bg-white/5 hover:text-text"
                          aria-label="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setConfirmTarget({ type: "soft", product })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-faint transition-colors hover:bg-accent/10 hover:text-accent"
                          aria-label="Deactivate"
                        >
                          <EyeOff size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmTarget({ type: "absolute", product })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-faint transition-colors hover:bg-danger/10 hover:text-danger"
                          aria-label="Delete permanently"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <Pagination page={page} totalPages={data.totalPages} onChange={goToPage} />

      <ConfirmDialog
        open={!!confirmTarget}
        title={
          confirmTarget?.type === "soft"
            ? `Deactivate "${confirmTarget?.product.name}"?`
            : `Permanently delete "${confirmTarget?.product.name}"?`
        }
        description={
          confirmTarget?.type === "soft"
            ? "This hides it from the storefront. There's currently no way to reactivate it through the UI — a backend endpoint for that doesn't exist yet."
            : "This removes the product entirely and can't be undone."
        }
        confirmLabel={confirmTarget?.type === "soft" ? "Deactivate" : "Delete permanently"}
        danger
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
