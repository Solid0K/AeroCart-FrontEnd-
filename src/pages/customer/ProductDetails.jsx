import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Check,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CategoryBadge } from "@/components/ui/Badge";
import { Skeleton, EmptyState } from "@/components/ui/Feedback";
import QuantitySelector from "@/components/product/QuantitySelector";
import ProductCard from "@/components/product/ProductCard";
import { getProduct, getProducts } from "@/api/products";
import { categoryColor } from "@/utils/categoryColor";
import { formatCurrency } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [addStatus, setAddStatus] = useState("idle");
  const [addError, setAddError] = useState("");

  const [related, setRelated] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setQuantity(1);
    setAddStatus("idle");
    setAddError("");

    getProduct(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
      })
      .catch((err) => {
        if (cancelled) return;
        // Backend's ErrorResponse.statusCode is more reliable here than the
        // actual HTTP status, which GlobalExceptionHandler currently sends
        // as 409 for ProductNotFound regardless of the payload's own code.
        const code = err?.response?.data?.statusCode ?? err?.response?.status;
        if (code === 404) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product?.category) return;
    let cancelled = false;
    getProducts({ search: product.category, size: 5 })
      .then((res) => {
        if (cancelled) return;
        setRelated((res?.content || []).filter((p) => p.id !== product.id).slice(0, 4));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product?.category, product?.id]);

  async function handleAddToCart() {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    setAddError("");
    setAddStatus("loading");
    try {
      await addItem({ productId: product.id, quantity });
      setAddStatus("added");
      setTimeout(() => setAddStatus("idle"), 1800);
    } catch (err) {
      setAddError(getErrorMessage(err, "Couldn't add this to your cart."));
      setAddStatus("idle");
    }
  }

  if (loading) return <ProductDetailsSkeleton />;

  if (notFound) {
    return (
      <EmptyState
        icon={Package}
        title="Product not found"
        description="It may have been removed or is no longer available."
        action={
          <Link to="/products">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              Back to shop
            </Button>
          </Link>
        }
      />
    );
  }

  if (!product) return null;

  const color = categoryColor(product.category);
  const image = product.imageUrls?.[0];
  const inStock = product.stockQuantity > 0;

  return (
    <div className="flex flex-col gap-12">
      <nav className="flex items-center gap-1.5 text-sm text-text-faint">
        <Link to="/products" className="hover:text-text-muted">
          Shop
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-text-muted">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card
          className="relative aspect-square overflow-hidden"
          style={{
            background: `linear-gradient(150deg, color-mix(in oklab, ${color.value} 20%, var(--color-surface)), var(--color-surface))`,
          }}
        >
          {image ? (
            <img src={image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package size={56} style={{ color: color.value }} className="opacity-60" />
            </div>
          )}
        </Card>

        <div className="flex flex-col">
          <CategoryBadge category={product.category} color={color} />
          <h1 className="mt-3 font-display text-3xl font-semibold text-text">{product.name}</h1>
          <p className="mt-3 font-mono text-3xl font-semibold text-text">
            {formatCurrency(product.price, product.currency)}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-text-muted">{product.description}</p>

          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${inStock ? "bg-success" : "bg-danger"}`} />
            <span className={inStock ? "text-success" : "text-danger"}>
              {inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
            </span>
          </div>

          {addError && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {inStock && (
              <QuantitySelector value={quantity} onChange={setQuantity} max={product.stockQuantity} />
            )}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!inStock || addStatus === "loading"}
              variant={addStatus === "added" ? "secondary" : "primary"}
              className={addStatus === "added" ? "!bg-success/15 !text-success !shadow-none" : ""}
            >
              {addStatus === "loading" && <Loader2 size={16} className="animate-spin" />}
              {addStatus === "added" && <Check size={16} />}
              {addStatus === "idle" && <ShoppingCart size={16} />}
              {addStatus === "added" ? "Added to cart" : inStock ? "Add to cart" : "Out of stock"}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-5 font-display text-xl font-semibold text-text">
            More in {product.category}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-11 w-48" />
      </div>
    </div>
  );
}
