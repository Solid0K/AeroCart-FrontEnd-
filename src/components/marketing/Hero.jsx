import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useCommandPalette } from "@/hooks/useCommandPalette";

const FLOAT_CARDS = [
  { color: "var(--color-cat-violet)", label: "Audio", top: "6%", left: "58%", rotate: "-6deg", delay: "0s" },
  { color: "var(--color-cat-cyan)", label: "Home", top: "38%", left: "78%", rotate: "4deg", delay: "1.2s" },
  { color: "var(--color-cat-amber)", label: "Wearables", top: "64%", left: "54%", rotate: "-3deg", delay: "0.6s" },
];

export default function Hero() {
  const { user } = useAuth();
  const { toggle } = useCommandPalette();

  return (
    <section className="relative overflow-hidden rounded-[var(--radius-card)] surface-card px-6 py-14 sm:px-10 sm:py-20">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />

      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-text-muted">
            Real-time stock, tracked to the unit
          </span>

          <h1 className="text-balance mt-5 font-display text-4xl font-semibold leading-[1.05] text-text sm:text-5xl">
            Shopping that keeps up
            <span className="text-primary">.</span>
          </h1>

          <p className="mt-4 max-w-md text-base text-text-muted">
            Every listing you see is backed by live inventory — no surprise
            "out of stock" at checkout. Browse, add to cart, and check out in
            seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/products">
              <Button size="lg" icon={ArrowRight} className="flex-row-reverse">
                Shop the catalog
              </Button>
            </Link>
            {!user && (
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Create an account
                </Button>
              </Link>
            )}
            <button
              onClick={toggle}
              className="hidden h-12 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-text-faint hover:border-white/20 sm:flex"
            >
              <Search size={15} />
              Quick search
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* signature visual: floating cards echoing the real product-card
            design, colored by the category rail system — not a stock photo */}
        <div className="relative hidden h-72 lg:block" aria-hidden="true">
          {FLOAT_CARDS.map((c) => (
            <div
              key={c.label}
              className="animate-float absolute w-36 rounded-2xl border border-white/10 bg-surface p-3 shadow-[var(--shadow-soft)]"
              style={{
                top: c.top,
                left: c.left,
                "--float-rotate": c.rotate,
                animationDelay: c.delay,
              }}
            >
              <div
                className="mb-2 h-16 w-full rounded-lg"
                style={{ background: `color-mix(in oklab, ${c.color} 30%, var(--color-surface))` }}
              />
              <div className="h-2 w-3/4 rounded-full bg-white/10" />
              <div className="mt-1.5 h-2 w-1/2 rounded-full" style={{ background: c.color, opacity: 0.6 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
