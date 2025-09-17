export default function SkeletonCard() {
  return (
    <div className="flex items-center rounded-lg border bg-white p-6 shadow-sm">
      {/* Ikon Skeleton */}
      <div className="mr-4 h-12 w-12 rounded-full bg-slate-200 animate-pulse"></div>

      {/* Teks Skeleton */}
      <div className="w-full space-y-2">
        <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse"></div>
        <div className="h-6 w-1/2 rounded bg-slate-200 animate-pulse"></div>
      </div>
    </div>
  );
}
