import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Feedback";

export default function StatCard({ icon: Icon, label, value, color = "var(--color-primary)", loading }) {
  return (
    <Card className="p-5">
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`, color }}
      >
        <Icon size={19} />
      </div>
      <p className="text-sm text-text-muted">{label}</p>
      {loading ? (
        <Skeleton className="mt-1.5 h-7 w-16" />
      ) : (
        <p className="mt-0.5 font-display text-2xl font-semibold text-text">{value}</p>
      )}
    </Card>
  );
}
