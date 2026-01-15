"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface FormPageSkeletonProps {
  /** Number of form fields to show */
  fieldCount?: number;
  /** Show image upload area */
  hasImageUpload?: boolean;
  /** Show rich text editor area */
  hasRichEditor?: boolean;
  /** Title text to show in skeleton */
  title?: string;
}

export function FormPageSkeleton({
  fieldCount = 4,
  hasImageUpload = false,
  hasRichEditor = false,
}: FormPageSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header - Back button and Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        {/* Image Upload Area */}
        {hasImageUpload && (
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        )}

        {/* Regular Form Fields */}
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}

        {/* Rich Text Editor Area */}
        {hasRichEditor && (
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}
