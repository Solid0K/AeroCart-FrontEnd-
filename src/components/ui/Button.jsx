import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-[var(--shadow-glow-primary)]",
  secondary:
    "bg-card text-text hover:bg-card/70 border border-white/10",
  ghost: "bg-transparent text-text-muted hover:text-text hover:bg-white/5",
  danger: "bg-danger/90 text-white hover:bg-danger",
  accent: "bg-accent text-slate-900 font-semibold hover:brightness-110",
};

const SIZES = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    children,
    icon: Icon,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-medium
        transition-all duration-150 active:scale-[0.97]
        disabled:opacity-50 disabled:pointer-events-none
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  );
});

export default Button;
