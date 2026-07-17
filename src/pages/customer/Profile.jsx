import { Link, useNavigate } from "react-router-dom";
import { Package, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

const ROLE_STYLES = {
  Admin: "bg-accent/15 text-accent border-accent/30",
  User: "bg-primary/15 text-primary border-primary/30",
};

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-text">Profile</h1>

      <Card className="flex items-center gap-4 p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-semibold text-white">
          {user.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-medium text-text">{user.username}</p>
          <p className="truncate text-sm text-text-muted">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.roles?.map((role) => (
              <span
                key={role}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${ROLE_STYLES[role] || ROLE_STYLES.User}`}
              >
                {role === "Admin" && <ShieldCheck size={11} />}
                {role}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <Card className="divide-y divide-white/10">
        <Link
          to="/orders"
          className="flex items-center gap-3 p-4 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-text"
        >
          <Package size={17} className="text-text-faint" />
          My orders
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-3 p-4 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-text"
          >
            <LayoutDashboard size={17} className="text-text-faint" />
            Admin dashboard
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 p-4 text-left text-sm text-danger transition-colors hover:bg-danger/10"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </Card>

      <p className="text-center text-xs text-text-faint">
        Editing profile details isn't available yet — the backend doesn't expose an
        update endpoint for it.
      </p>
    </div>
  );
}
