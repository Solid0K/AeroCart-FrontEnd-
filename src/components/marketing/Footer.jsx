import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

const LINKS = [
  {
    heading: "Shop",
    items: [
      { label: "All products", to: "/products" },
      { label: "Your cart", to: "/cart" },
      { label: "Order history", to: "/orders" },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Sign in", to: "/login" },
      { label: "Create account", to: "/register" },
      { label: "Profile", to: "/profile" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 pt-10">
      <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
              <Plane size={14} />
            </div>
            <span className="font-display text-base font-semibold text-text">AeroCart</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-text-muted">
            A Spring Boot + MongoDB commerce backend, given a frontend it
            deserves.
          </p>
        </div>

        {LINKS.map((group) => (
          <div key={group.heading}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-faint">
              {group.heading}
            </h4>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} AeroCart. Built as a portfolio project.</span>
        <span>Payments are simulated — no real transactions occur.</span>
      </div>
    </footer>
  );
}
