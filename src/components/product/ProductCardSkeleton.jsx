import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Feedback";

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <div className="px-4 pb-4">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </Card>
  );
}
