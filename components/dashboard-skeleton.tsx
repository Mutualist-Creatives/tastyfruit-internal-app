"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DashboardSkeletonProps {
  isAdmin?: boolean;
}

export function DashboardSkeleton({ isAdmin = true }: DashboardSkeletonProps) {
  const cardCount = isAdmin ? 4 : 2;
  const gridCols = isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-2";

  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${gridCols}`}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            key={index}
            className="flex items-center rounded-lg border bg-white p-6 shadow-sm"
          >
            {/* Icon Skeleton */}
            <Skeleton className="mr-4 h-12 w-12 rounded-full" />
            {/* Content Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Activity Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Skeleton */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Activity Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: isAdmin ? 3 : 2 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Skeleton className="h-11 w-11 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-10 rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
