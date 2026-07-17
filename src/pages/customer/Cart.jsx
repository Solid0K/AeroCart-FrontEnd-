import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Trash2, AlertCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/product/QuantitySelector";
import { EmptyState, PageSpinner } from "@/components/ui/Feedback";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";

export default function Cart() {
  const { cart, loading, updateItem, removeItem, clear } = useCart();
  const navigate = useNavigate();
  const [itemErrors, setItemErrors] = useState({});
  const [pendingId, setPendingId] = useState(null);

  async function handleQuantityChange(productId, quantity) {
    setPendingId(productId);
    setItemErrors((e) => ({ ...e, [productId]: null }));
    try {
      await updateItem(productId, { productId, quantity });
    } catch (err) {
      setItemErrors((e) => ({
        ...e,
        [productId]: getErrorMessage(err, "Couldn't update quantity."),
      }));
    } finally {
      setPendingId(null);
    }
  }

  async function handleRemove(productId) {
    setPendingId(productId);
    try {
      await removeItem(productId);
    } finally {
      setPendingId(null);
    }
  }

  if (loading && cart.items.length === 0) return <PageSpinner />;

  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Find something you like and it'll show up here."
        action={
          <Link to="/products">
            <Button size="sm">Browse products</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text">Your cart</h1>
        <button
          onClick={clear}
          className="text-sm text-text-faint transition-colors hover:text-danger"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          {cart.items.map((item) => (
            <Card key={item.productId} className="flex items-center gap-4 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/5">
                <Package size={24} className="text-text-faint" />
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  to={`/products/${item.productId}`}
                  className="line-clamp-1 font-medium text-text hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="mt-0.5 font-mono text-sm text-text-muted">
                  {formatCurrency(item.unitPrice)} each
                </p>
                {itemErrors[item.productId] && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
                    <AlertCircle size={12} />
                    {itemErrors[item.productId]}
                  </p>
                )}
              </div>

              <QuantitySelector
                value={item.quantity}
                onChange={(q) => handleQuantityChange(item.productId, q)}
                max={99}
              />

              <div className="w-24 shrink-0 text-right font-mono font-semibold text-text">
                {formatCurrency(item.subtotal)}
              </div>

              <button
                onClick={() => handleRemove(item.productId)}
                disabled={pendingId === item.productId}
                className="shrink-0 rounded-lg p-2 text-text-faint transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={16} />
              </button>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-5 lg:sticky lg:top-20">
          <h2 className="font-display text-lg font-semibold text-text">Order summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
            <span>Subtotal</span>
            <span className="font-mono text-text">{formatCurrency(cart.totalAmount)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-text-muted">
            <span>Shipping</span>
            <span className="text-success">Free</span>
          </div>
          <div className="my-4 border-t border-white/10" />
          <div className="flex items-center justify-between">
            <span className="font-medium text-text">Total</span>
            <span className="font-mono text-xl font-semibold text-text">
              {formatCurrency(cart.totalAmount)}
            </span>
          </div>
          <Button
            size="lg"
            className="mt-5 w-full flex-row-reverse"
            onClick={() => navigate("/checkout")}
            icon={ArrowRight}
          >
            Checkout
          </Button>
        </Card>
      </div>
    </div>
  );
}
