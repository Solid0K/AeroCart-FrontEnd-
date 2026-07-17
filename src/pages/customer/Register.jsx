import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/errors";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (form.password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords don't match.";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(getErrorMessage(err, "Could not create your account."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text">Create your account</h1>
      <p className="mt-1 text-sm text-text-muted">Join AeroCart in a few seconds.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Username"
          name="username"
          icon={User}
          placeholder="krishu"
          required
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
        />
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
          placeholder="At least 8 characters"
          required
          minLength={8}
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          icon={Lock}
          placeholder="Repeat your password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <Button type="submit" loading={submitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </div>
  );
}
