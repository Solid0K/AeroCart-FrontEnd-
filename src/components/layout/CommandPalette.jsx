import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Package,
  User,
  LayoutDashboard,
  Boxes,
  ClipboardList,
  Search,
  CornerDownLeft,
} from "lucide-react";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useAuth } from "@/hooks/useAuth";

export default function CommandPalette() {
  const { open, close } = useCommandPalette();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => {
    const base = [
      { label: "Home", icon: Home, action: () => navigate("/") },
      { label: "Shop products", icon: ShoppingBag, action: () => navigate("/products") },
      { label: "View cart", icon: ShoppingCart, action: () => navigate("/cart") },
      { label: "My orders", icon: Package, action: () => navigate("/orders") },
      { label: "Profile", icon: User, action: () => navigate("/profile") },
    ];
    if (isAdmin) {
      base.push(
        { label: "Admin: Dashboard", icon: LayoutDashboard, action: () => navigate("/admin") },
        { label: "Admin: Products", icon: Boxes, action: () => navigate("/admin/products") },
        { label: "Admin: Orders", icon: ClipboardList, action: () => navigate("/admin/orders") }
      );
    }
    return base;
  }, [isAdmin, navigate]);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  if (!open) return null;

  function runCommand(cmd) {
    if (!cmd) return;
    cmd.action();
    close();
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      runCommand(filtered[activeIndex]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[14vh]"
      onClick={close}
    >
      <div
        role="dialog"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[var(--shadow-soft)]"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search size={16} className="text-text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to a page or action…"
            className="h-12 w-full bg-transparent text-sm text-text outline-none placeholder:text-text-faint"
          />
          <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-text-faint">
            Esc
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-text-faint">
              No matches for "{query}"
            </li>
          )}
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            const isActive = i === activeIndex;
            return (
              <li key={cmd.label}>
                <button
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => runCommand(cmd)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors
                    ${isActive ? "bg-primary/15 text-text" : "text-text-muted hover:bg-white/5"}`}
                >
                  <Icon size={16} className={isActive ? "text-primary" : "text-text-faint"} />
                  <span className="flex-1">{cmd.label}</span>
                  {isActive && <CornerDownLeft size={14} className="text-text-faint" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
