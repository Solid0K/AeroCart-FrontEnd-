import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, LogOut, User } from "lucide-react";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export default function Topbar({ onMenuClick }) {
  const { toggle } = useCommandPalette();
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-text-muted hover:bg-white/5 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <button
        onClick={toggle}
        className="flex h-10 flex-1 max-w-md items-center gap-2 rounded-xl border border-white/10
          bg-surface px-3.5 text-sm text-text-faint transition-colors hover:border-white/20"
      >
        <Search size={16} />
        <span className="flex-1 text-left">Search products, orders…</span>
        <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        {!isAdmin && (
          <Link
            to="/cart"
            className="relative rounded-lg p-2.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-slate-900">
                {itemCount}
              </span>
            )}
          </Link>
        )}

        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white"
            >
              {user.username?.[0]?.toUpperCase() || "U"}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[var(--shadow-soft)]">
                  <div className="border-b border-white/10 px-3.5 py-3">
                    <p className="truncate text-sm font-medium text-text">{user.username}</p>
                    <p className="truncate text-xs text-text-faint">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-text-muted hover:bg-white/5"
                  >
                    <User size={15} /> Profile
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      navigate("/login");
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-danger hover:bg-danger/10"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
