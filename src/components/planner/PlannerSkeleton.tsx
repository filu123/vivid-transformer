import { Skeleton } from "@/components/ui/skeleton";

export const PlannerSkeleton = () => {
  return (
    <div className="space-y-6 p-4 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  );
};