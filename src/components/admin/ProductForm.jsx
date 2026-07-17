import { useState } from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "",
  stockQuantity: "",
  imageUrls: [],
};

export default function ProductForm({ initialValues, onSubmit, submitLabel = "Save product" }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initialValues,
    price: initialValues?.price ?? "",
    stockQuantity: initialValues?.stockQuantity ?? "",
    imageUrls: initialValues?.imageUrls || [],
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.category.trim()) next.category = "Category is required.";
    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price < 0.01) {
      next.price = "Price must be at least 0.01.";
    }
    const stock = Number(form.stockQuantity);
    if (form.stockQuantity === "" || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      next.stockQuantity = "Stock must be a whole number, 0 or more.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function addImageUrl() {
    set("imageUrls", [...form.imageUrls, ""]);
  }

  function updateImageUrl(index, value) {
    const next = [...form.imageUrls];
    next[index] = value;
    set("imageUrls", next);
  }

  function removeImageUrl(index) {
    set(
      "imageUrls",
      form.imageUrls.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stockQuantity: Number(form.stockQuantity),
        imageUrls: form.imageUrls.map((u) => u.trim()).filter(Boolean),
      });
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Couldn't save this product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {submitError && (
        <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <Input
        label="Product name"
        name="name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
        placeholder="Wireless headphones"
      />

      <Textarea
        label="Description"
        name="description"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="What makes this product worth buying?"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price"
          name="price"
          type="number"
          step="0.01"
          min="0.01"
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
          error={errors.price}
          placeholder="0.00"
        />
        <Input
          label="Stock quantity"
          name="stockQuantity"
          type="number"
          step="1"
          min="0"
          value={form.stockQuantity}
          onChange={(e) => set("stockQuantity", e.target.value)}
          error={errors.stockQuantity}
          placeholder="0"
        />
      </div>

      <Input
        label="Category"
        name="category"
        value={form.category}
        onChange={(e) => set("category", e.target.value)}
        error={errors.category}
        placeholder="Audio, Home, Wearables…"
      />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-medium text-text-muted">Image URLs</label>
          <button
            type="button"
            onClick={addImageUrl}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
          >
            <Plus size={13} /> Add URL
          </button>
        </div>
        {form.imageUrls.length === 0 && (
          <p className="text-xs text-text-faint">
            No images yet — the product will show a placeholder icon.
          </p>
        )}
        <div className="flex flex-col gap-2">
          {form.imageUrls.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={url}
                onChange={(e) => updateImageUrl(i, e.target.value)}
                placeholder="https://…"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeImageUrl(i)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-text-faint transition-colors hover:bg-danger/10 hover:text-danger"
                aria-label="Remove image URL"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" loading={submitting} className="mt-2 w-full sm:w-fit">
        {submitLabel}
      </Button>
    </form>
  );
}
