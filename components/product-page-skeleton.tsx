"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProductPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Search & Filter Skeleton */}
      <div className="flex gap-4 items-center">
        <Skeleton className="h-10 flex-1 max-w-md rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-12" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* Image Skeleton */}
                    <Skeleton className="h-10 w-10 rounded-lg mr-4" />
                    {/* Name and Description */}
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}
