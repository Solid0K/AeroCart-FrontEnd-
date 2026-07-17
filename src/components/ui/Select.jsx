import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(function Select(
  { label, error, className = "", id, children, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={`h-11 w-full appearance-none rounded-xl border border-white/10 bg-surface px-3.5 pr-9 text-sm text-text
            outline-none transition-colors focus:border-primary
            ${error ? "border-danger" : ""} ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-faint"
        />
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default Select;
