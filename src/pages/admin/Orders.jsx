import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Package, ChevronDown, AlertCircle, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import Pagination from "@/components/common/Pagination";
import { adminGetOrders, adminUpdateOrderStatus } from "@/api/admin";
import { formatCurrency, formatDate } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";

const PAGE_SIZE = 8;
const STATUSES = ["Pending", "Paid", "Failed", "Shipped", "Cancelled"];

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 0);

  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [rowState, setRowState] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    adminGetOrders({ page, size: PAGE_SIZE, sort: "createdAt,desc" })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load orders right now.");
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

  function toggleExpand(orderId) {
    setExpandedId((current) => (current === orderId ? null : orderId));
  }

  async function handleStatusUpdate(orderId) {
    const nextStatus = statusDrafts[orderId];
    if (!nextStatus) return;
    setRowState((s) => ({ ...s, [orderId]: { loading: true, error: null } }));
    try {
      const updated = await adminUpdateOrderStatus(orderId, nextStatus);
      setData((d) => ({
        ...d,
        content: d.content.map((o) => (o.orderId === orderId ? updated : o)),
      }));
      setRowState((s) => ({ ...s, [orderId]: { loading: false, applied: true } }));
      setTimeout(() => {
        setRowState((s) => ({ ...s, [orderId]: { loading: false, applied: false } }));
      }, 1500);
    } catch (err) {
      setRowState((s) => ({
        ...s,
        [orderId]: { loading: false, error: getErrorMessage(err, "Couldn't update status.") },
      }));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Orders</h1>
        <p className="mt-1 text-sm text-text-muted">
          {data.totalElements > 0 ? `${data.totalElements} orders` : "All customer orders"}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <Card className="divide-y divide-white/10">
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-8 w-full" />
            </div>
          ))}

        {!loading && data.content.length === 0 && (
          <EmptyState icon={Package} title="No orders yet" />
        )}

        {!loading &&
          data.content.map((order) => {
            const expanded = expandedId === order.orderId;
            const state = rowState[order.orderId] || {};
            const draft = statusDrafts[order.orderId] ?? order.status;

            return (
              <div key={order.orderId}>
                <button
                  onClick={() => toggleExpand(order.orderId)}
                  className="flex w-full flex-wrap items-center gap-3 p-4 text-left transition-colors hover:bg-white/5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{order.userEmail}</p>
                    <p className="font-mono text-xs text-text-faint">
                      #{order.orderId.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                  <span className="w-24 shrink-0 text-right font-mono text-sm text-text">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-text-faint transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>

                {expanded && (
                  <div className="border-t border-white/10 bg-white/[0.02] p-4">
                    <div className="flex flex-col gap-2">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between text-sm">
                          <span className="text-text-muted">
                            {item.productName} <span className="text-text-faint">× {item.quantity}</span>
                          </span>
                          <span className="font-mono text-text">{formatCurrency(item.subTotal)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-white/10 pt-4">
                      <Select
                        label="Update status"
                        value={draft}
                        onChange={(e) =>
                          setStatusDrafts((d) => ({ ...d, [order.orderId]: e.target.value }))
                        }
                        className="w-44"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
                      <Button
                        size="md"
                        onClick={() => handleStatusUpdate(order.orderId)}
                        loading={state.loading}
                        disabled={draft === order.status}
                        icon={state.applied ? Check : undefined}
                        variant={state.applied ? "secondary" : "primary"}
                        className={state.applied ? "!bg-success/15 !text-success !shadow-none" : ""}
                      >
                        {state.applied ? "Updated" : "Update status"}
                      </Button>
                      {state.error && <p className="text-xs text-danger">{state.error}</p>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </Card>

      <Pagination page={page} totalPages={data.totalPages} onChange={goToPage} />
    </div>
  );
}
