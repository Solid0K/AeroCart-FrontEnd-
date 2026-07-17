import { Link } from "react-router-dom";
import { categoryColor } from "@/utils/categoryColor";

export default function CategoryStrip({ categories }) {
  if (!categories?.length) return null;

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold text-text">Shop by category</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {categories.map(({ name, count }) => {
          const color = categoryColor(name);
          return (
            <Link
              key={name}
              to={`/products?search=${encodeURIComponent(name)}`}
              className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-surface py-2 pl-2 pr-4 transition-colors hover:border-white/20"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `color-mix(in oklab, ${color.value} 20%, transparent)`,
                  color: color.value,
                }}
              >
                {name?.[0]?.toUpperCase()}
              </span>
              <span className="text-sm font-medium text-text-muted group-hover:text-text">
                {name}
              </span>
              {count != null && (
                <span className="text-xs text-text-faint">{count}</span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
