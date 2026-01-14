import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="ml-4 flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function AlertStatSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="ml-4">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
    </div>
  );
}

export function CategoryStatsSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-8 w-8 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  // Fixed heights untuk menghindari hydration error
  const barHeights = [
    120, 180, 90, 150, 200, 110, 170, 130, 160, 140, 190, 100,
  ];

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="mb-4">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="h-80 flex items-end justify-between space-x-2">
        {barHeights.map((height, i) => (
          <Skeleton
            key={i}
            className="w-full"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-64" />

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <AlertStatSkeleton key={i} />
        ))}
      </div>

      {/* Category Stats */}
      <CategoryStatsSkeleton />

      {/* Chart and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-1">
          <RecentActivitySkeleton />
        </div>
      </div>
    </div>
  );
}
