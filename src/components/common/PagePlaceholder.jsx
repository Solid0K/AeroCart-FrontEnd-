import Card from "@/components/ui/Card";

export default function PagePlaceholder({ title, description }) {
  return (
    <Card className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-10 text-center">
      <h1 className="font-display text-2xl font-semibold text-text">{title}</h1>
      <p className="max-w-md text-sm text-text-muted">
        {description || "This page is coming up in the next build step."}
      </p>
    </Card>
  );
}
