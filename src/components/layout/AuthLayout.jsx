import { Outlet, Link } from "react-router-dom";
import { Plane } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-10">
      {/* ambient color wash, quiet by default */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <Plane size={18} />
          </div>
          <span className="font-display text-xl font-semibold text-text">AeroCart</span>
        </Link>

        <div className="surface-card rounded-[var(--radius-card)] p-7 shadow-[var(--shadow-soft)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
