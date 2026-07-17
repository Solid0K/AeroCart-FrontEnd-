import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = "", id, ...props },
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
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          className={`h-11 w-full rounded-xl border border-white/10 bg-surface
            ${Icon ? "pl-10" : "pl-3.5"} pr-3.5 text-sm text-text placeholder:text-text-faint
            outline-none transition-colors focus:border-primary
            ${error ? "border-danger" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default Input;
