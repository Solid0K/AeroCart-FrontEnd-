export default function Card({ className = "", hover = false, children, ...props }) {
  return (
    <div
      className={`surface-card rounded-[var(--radius-card)] shadow-[var(--shadow-soft)]
        ${hover ? "transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-primary)]" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
