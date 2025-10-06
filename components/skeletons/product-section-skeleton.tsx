import { Card } from "@/components/ui/card";

export function ProductSectionSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="flex items-start gap-4 p-6">
        {/* Drag Handle Skeleton */}
        <div className="mt-1 size-5 bg-muted rounded shrink-0" />

        {/* Product Image Skeleton */}
        <div className="size-16 bg-muted rounded-lg shrink-0" />

        {/* Product Info Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {/* Product Name */}
              <div className="h-6 w-48 bg-muted rounded" />
              {/* Category */}
              <div className="h-4 w-32 bg-muted rounded" />
              {/* Description */}
              <div className="h-4 w-full max-w-md bg-muted rounded" />
            </div>

            {/* Status Badge and Actions Skeleton */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="size-8 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ProductSectionSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSectionSkeleton key={i} />
      ))}
    </div>
  );
}
