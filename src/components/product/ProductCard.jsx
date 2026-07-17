import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Check, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { CategoryBadge } from "@/components/ui/Badge";
import { categoryColor } from "@/utils/categoryColor";
import { formatCurrency } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const color = categoryColor(product.category);
  const image = product.imageUrls?.[0];
  const inStock = product.stockQuantity > 0;

  const [status, setStatus] = useState("idle"); // idle | loading | added

  async function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/products" } } });
      return;
    }
    if (!inStock || status === "loading") return;
    setStatus("loading");
    try {
      await addItem({ productId: product.id, quantity: 1 });
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <Card hover className="group flex flex-col overflow-hidden">
      <Link to={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden"
          style={{
            background: `linear-gradient(150deg, color-mix(in oklab, ${color.value} 22%, var(--color-surface)), var(--color-surface))`,
          }}
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package size={32} style={{ color: color.value }} className="opacity-70" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <CategoryBadge category={product.category} color={color} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-1 font-display text-base font-medium text-text">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-text-muted">{product.description}</p>

          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="font-mono text-lg font-semibold text-text">
              {formatCurrency(product.price, product.currency)}
            </span>
            <span
              className={`text-xs font-medium ${inStock ? "text-success" : "text-danger"}`}
            >
              {inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!inStock || status === "loading"}
          className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors
            disabled:cursor-not-allowed disabled:opacity-50
            ${status === "added" ? "bg-success/15 text-success" : "bg-primary text-white hover:bg-primary-hover"}`}
        >
          {status === "loading" && <Loader2 size={15} className="animate-spin" />}
          {status === "added" && <Check size={15} />}
          {status === "idle" && <ShoppingCart size={15} />}
          {status === "added" ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </Card>
  );
}
