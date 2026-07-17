import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/errors";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";
  const justRegistered = Boolean(location.state?.registered);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Could not sign in. Check your credentials."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text">Welcome back</h1>
      <p className="mt-1 text-sm text-text-muted">Sign in to keep shopping.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {justRegistered && !error && (
          <div className="flex items-start gap-2 rounded-xl border border-success/30 bg-success/10 px-3.5 py-2.5 text-sm text-success">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>Account created — sign in to continue.</span>
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          icon={Mail}
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          icon={Lock}
          placeholder="••••••••"
          required
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <Button type="submit" loading={submitting} className="mt-2 w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        New to AeroCart?{" "}
        <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
          Create an account
        </Link>
      </p>
    </div>
  );
}
