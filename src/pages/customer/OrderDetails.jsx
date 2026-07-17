import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Package, ChevronRight, ArrowLeft } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { getOrder } from "@/api/orders";
import { formatCurrency, formatDate } from "@/utils/format";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setOrder(null);

    getOrder(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err) => {
        if (cancelled) return;
        // See ProductDetails.jsx for the same statusCode-vs-HTTP-status note —
        // GlobalExceptionHandler sends payload.statusCode=404 but HTTP 409.
        const code = err?.response?.data?.statusCode ?? err?.response?.status;
        if (code === 404) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <EmptyState
        icon={Package}
        title="Order not found"
        description="This order doesn't exist or doesn't belong to your account."
        action={
          <Link to="/orders">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              Back to orders
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-text-faint">
        <Link to="/orders" className="hover:text-text-muted">
          Orders
        </Link>
        <ChevronRight size={14} />
        <span className="font-mono text-text-muted">
          #{order.orderId.slice(-8).toUpperCase()}
        </span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">
            Order #{order.orderId.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-text-muted">Placed {formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <Card className="divide-y divide-white/10">
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-text-faint">
              <Package size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-text">{item.productName}</p>
              <p className="text-xs text-text-faint">
                {formatCurrency(item.unitPrice)} × {item.quantity}
              </p>
            </div>
            <span className="font-mono font-semibold text-text">
              {formatCurrency(item.subTotal)}
            </span>
          </div>
        ))}
      </Card>

      <Card className="flex items-center justify-between p-5">
        <span className="font-medium text-text">Total</span>
        <span className="font-mono text-xl font-semibold text-text">
          {formatCurrency(order.totalAmount)}
        </span>
      </Card>
    </div>
  );
}
