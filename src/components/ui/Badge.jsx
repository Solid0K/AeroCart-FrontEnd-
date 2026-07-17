const STATUS_STYLES = {
  Pending: "bg-accent/15 text-accent border-accent/30",
  Paid: "bg-success/15 text-success border-success/30",
  Shipped: "bg-secondary/15 text-secondary border-secondary/30",
  Failed: "bg-danger/15 text-danger border-danger/30",
  Cancelled: "bg-white/10 text-text-faint border-white/10",
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Cancelled;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function CategoryBadge({ category, color }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{
        color: color.value,
        borderColor: `color-mix(in oklab, ${color.value} 35%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${color.value} 15%, transparent)`,
      }}
    >
      {category}
    </span>
  );
}
