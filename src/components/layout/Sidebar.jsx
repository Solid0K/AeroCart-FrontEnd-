import { NavLink } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Package,
  User,
  LayoutDashboard,
  Boxes,
  Warehouse,
  ClipboardList,
  Plane,
} from "lucide-react";

const CUSTOMER_LINKS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/products", label: "Shop", icon: ShoppingBag },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/profile", label: "Profile", icon: User },
];

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default function Sidebar({ mode = "customer", open, onClose }) {
  const links = mode === "admin" ? ADMIN_LINKS : CUSTOMER_LINKS;

  return (
    <>
      {/* mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r
          border-white/10 bg-surface transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center gap-2.5 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Plane size={16} />
          </div>
          <span className="font-display text-lg font-semibold">AeroCart</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {mode === "admin" && (
            <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-text-faint">
              Admin
            </p>
          )}
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                ${isActive ? "bg-primary/15 text-text" : "text-text-muted hover:bg-white/5 hover:text-text"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity
                      ${isActive ? "opacity-100" : "opacity-0"}`}
                  />
                  <Icon
                    size={17}
                    className={isActive ? "text-primary" : "text-text-faint group-hover:text-text-muted"}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <p className="px-3 py-2 text-xs text-text-faint">
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono">
              ⌘K
            </kbd>{" "}
            to search
          </p>
        </div>
      </aside>
    </>
  );
}
