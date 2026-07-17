import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  ClipboardList,
  TriangleAlert,
  ChevronRight,
  Plus,
  Warehouse,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Feedback";
import StatCard from "@/components/admin/StatCard";
import { getProducts } from "@/api/products";
import { adminGetOrders } from "@/api/admin";
import { formatCurrency, formatDate } from "@/utils/format";

export default function AdminDashboard() {
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.allSettled([
      getProducts({ page: 0, size: 1 }),
      adminGetOrders({ page: 0, size: 5, sort: "createdAt,desc" }),
      getProducts({ page: 0, size: 5, sort: "stockQuantity,asc" }),
    ]).then(([productsRes, ordersRes, lowStockRes]) => {
      if (cancelled) return;
      if (productsRes.status === "fulfilled") setTotalProducts(productsRes.value.totalElements);
      if (ordersRes.status === "fulfilled") {
        setTotalOrders(ordersRes.value.totalElements);
        setRecentOrders(ordersRes.value.content);
      }
      if (lowStockRes.status === "fulfilled") setLowStock(lowStockRes.value.content);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">A quick look at the store.</p>
        </div>
        <Link to="/admin/products/new">
          <Button icon={Plus}>Add product</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Boxes}
          label="Active products"
          value={totalProducts}
          color="var(--color-secondary)"
          loading={loading}
        />
        <StatCard
          icon={ClipboardList}
          label="Total orders"
          value={totalOrders}
          color="var(--color-primary)"
          loading={loading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-text">Recent orders</h2>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <Card className="divide-y divide-white/10">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4">
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            {!loading && recentOrders.length === 0 && (
              <p className="p-5 text-sm text-text-faint">No orders yet.</p>
            )}
            {!loading &&
              recentOrders.map((order) => (
                <div key={order.orderId} className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{order.userEmail}</p>
                    <p className="text-xs text-text-faint">{formatDate(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                  <span className="w-20 shrink-0 text-right font-mono text-sm text-text">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              ))}
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-text">Low stock</h2>
            <Link
              to="/admin/inventory"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
            >
              Manage <ChevronRight size={14} />
            </Link>
          </div>
          <Card className="divide-y divide-white/10">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4">
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            {!loading && lowStock.length === 0 && (
              <p className="p-5 text-sm text-text-faint">Nothing low on stock right now.</p>
            )}
            {!loading &&
              lowStock.map((product) => (
                <Link
                  key={product.id}
                  to="/admin/inventory"
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-white/5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{product.name}</p>
                    <p className="text-xs text-text-faint">{product.category}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 text-sm font-medium ${product.stockQuantity <= 5 ? "text-danger" : "text-accent"}`}
                  >
                    {product.stockQuantity <= 5 && <TriangleAlert size={13} />}
                    {product.stockQuantity} left
                  </span>
                </Link>
              ))}
          </Card>
        </section>
      </div>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-text">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link to="/admin/products/new">
            <Card hover className="flex items-center gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Plus size={18} />
              </div>
              <span className="font-medium text-text">Add a product</span>
            </Card>
          </Link>
          <Link to="/admin/inventory">
            <Card hover className="flex items-center gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                <Warehouse size={18} />
              </div>
              <span className="font-medium text-text">Adjust inventory</span>
            </Card>
          </Link>
          <Link to="/admin/orders">
            <Card hover className="flex items-center gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <ClipboardList size={18} />
              </div>
              <span className="font-medium text-text">Manage orders</span>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
