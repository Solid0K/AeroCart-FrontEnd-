import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Skeleton, EmptyState } from "@/components/ui/Feedback";
import ProductForm from "@/components/admin/ProductForm";
import { getProduct } from "@/api/products";
import { adminUpdateProduct } from "@/api/admin";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    getProduct(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (cancelled) return;
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

  async function handleSubmit(payload) {
    await adminUpdateProduct(id, payload);
    navigate("/admin/products");
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Link
        to="/admin/products"
        className="flex w-fit items-center gap-1.5 text-sm text-text-faint hover:text-text-muted"
      >
        <ArrowLeft size={14} /> Back to products
      </Link>

      {loading && (
        <Card className="flex flex-col gap-4 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      )}

      {!loading && notFound && (
        <EmptyState
          icon={Package}
          title="Product not found"
          action={
            <Link to="/admin/products">
              <Button variant="secondary" size="sm" icon={ArrowLeft}>
                Back to products
              </Button>
            </Link>
          }
        />
      )}

      {!loading && product && (
        <>
          <div>
            <h1 className="font-display text-2xl font-semibold text-text">Edit product</h1>
            <p className="mt-1 font-mono text-sm text-text-faint">{product.sku}</p>
          </div>
          <Card className="p-6">
            <ProductForm initialValues={product} onSubmit={handleSubmit} submitLabel="Save changes" />
          </Card>
        </>
      )}
    </div>
  );
}
