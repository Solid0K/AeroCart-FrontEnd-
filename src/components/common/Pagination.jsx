import { ChevronLeft, ChevronRight } from "lucide-react";

// `page` is zero-indexed to match Spring's Pageable, displayed as 1-indexed.
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1.5 text-text-faint">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors
              ${p === page ? "bg-primary text-white" : "text-text-muted hover:bg-white/5"}`}
          >
            {p + 1}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
        disabled={page === totalPages - 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

function buildPageList(page, totalPages) {
  const windowSize = 1;
  const list = [0];

  const start = Math.max(1, page - windowSize);
  const end = Math.min(totalPages - 2, page + windowSize);

  if (start > 1) list.push("…");
  for (let p = start; p <= end; p++) list.push(p);
  if (end < totalPages - 2) list.push("…");

  if (totalPages > 1) list.push(totalPages - 1);

  return list;
}
