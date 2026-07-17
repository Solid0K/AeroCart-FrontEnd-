import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-6 shadow-[var(--shadow-soft)]"
      >
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${danger ? "bg-danger/15 text-danger" : "bg-primary/15 text-primary"}`}
        >
          <AlertTriangle size={20} />
        </div>
        <h2 className="mt-4 font-display text-lg font-semibold text-text">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-text-muted">{description}</p>}

        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
