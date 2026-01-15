"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function UsersPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-5 w-56 mt-2" />
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <Skeleton className="h-10 flex-1 rounded-md" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-10" />
                </th>
                <th className="px-6 py-3 text-right">
                  <Skeleton className="h-4 w-10 ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Skeleton className="h-5 w-48" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
