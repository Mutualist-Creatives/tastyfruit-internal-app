"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ResepPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Search Skeleton */}
      <Skeleton className="h-10 w-full max-w-md rounded-lg" />

      {/* Recipes Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            {/* Image Skeleton */}
            <Skeleton className="h-48 w-full" />

            <div className="p-6">
              {/* Status Badge */}
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Title */}
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3 mb-2" />

              {/* Description */}
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              {/* Time & Servings */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
