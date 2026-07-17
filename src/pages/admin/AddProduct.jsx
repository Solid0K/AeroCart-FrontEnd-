import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Card from "@/components/ui/Card";
import ProductForm from "@/components/admin/ProductForm";
import { adminAddProduct } from "@/api/admin";

export default function AdminAddProduct() {
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    await adminAddProduct(payload);
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
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Add product</h1>
        <p className="mt-1 text-sm text-text-muted">
          A SKU is generated automatically from the category.
        </p>
      </div>
      <Card className="p-6">
        <ProductForm onSubmit={handleSubmit} submitLabel="Add product" />
      </Card>
    </div>
  );
}
