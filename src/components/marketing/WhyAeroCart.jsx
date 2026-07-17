import { ShieldCheck, Gauge, PackageCheck, SearchCode } from "lucide-react";
import Card from "@/components/ui/Card";

const REASONS = [
  {
    icon: PackageCheck,
    title: "Stock you can trust",
    description:
      "Every order re-checks quantity against live inventory before it's placed — the cart never sells you something that isn't there.",
    color: "var(--color-cat-emerald)",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Accounts are protected with JWT-based auth and encrypted passwords, and admin actions are locked behind role checks.",
    color: "var(--color-cat-cyan)",
  },
  {
    icon: SearchCode,
    title: "Search that understands intent",
    description:
      "Full-text search across names, descriptions, and categories, so you find what you meant, not just an exact string match.",
    color: "var(--color-cat-violet)",
  },
  {
    icon: Gauge,
    title: "Built for speed",
    description:
      "A lean MongoDB-backed catalog keeps browsing and checkout fast, even as the product list grows.",
    color: "var(--color-cat-amber)",
  },
];

export default function WhyAeroCart() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-text">Why AeroCart</h2>
        <p className="mt-1 text-sm text-text-muted">
          The details that make checkout feel effortless.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map(({ icon: Icon, title, description, color }) => (
          <Card key={title} className="p-5">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`, color }}
            >
              <Icon size={19} />
            </div>
            <h3 className="font-display text-base font-medium text-text">{title}</h3>
            <p className="mt-1.5 text-sm text-text-muted">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
