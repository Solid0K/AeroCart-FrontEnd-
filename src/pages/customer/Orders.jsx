import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, ChevronRight, AlertCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import Pagination from "@/components/common/Pagination";
import { getOrders } from "@/api/orders";
import { formatCurrency, formatDate } from "@/utils/format";

const PAGE_SIZE = 8;

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 0);

  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getOrders({ page, size: PAGE_SIZE, sort: "createdAt,desc" })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your orders right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  function goToPage(p) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(p));
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-text">Your orders</h1>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!error && loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!error && !loading && data.content.length === 0 && (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Once you check out, your orders will show up here."
          action={
            <Link to="/products">
              <Button size="sm">Browse products</Button>
            </Link>
          }
        />
      )}

      {!error && !loading && data.content.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {data.content.map((order) => (
              <Link key={order.orderId} to={`/orders/${order.orderId}`}>
                <Card hover className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-text-faint">
                    <Package size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm text-text-muted">
                      #{order.orderId.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-text-faint">{formatDate(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                  <span className="hidden w-24 shrink-0 text-right font-mono font-semibold text-text sm:block">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-text-faint" />
                </Card>
              </Link>
            ))}
          </div>
          <div className="pt-2">
            <Pagination page={page} totalPages={data.totalPages} onChange={goToPage} />
          </div>
        </>
      )}
    </div>
  );
}
