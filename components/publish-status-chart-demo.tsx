"use client";

import { useRouter } from "next/navigation";
import PublishStatusChart from "./publish-status-chart";
import { usePublishStatus, DateRange } from "@/hooks/use-dashboard-data";

interface PublishStatusChartDemoProps {
  dateRange?: DateRange;
}

/**
 * Demo component showing how to use PublishStatusChart with data fetching
 *
 * Usage:
 * ```tsx
 * import PublishStatusChartDemo from "@/components/publish-status-chart-demo";
 *
 * export default function DashboardPage() {
 *   const dateRange = {
 *     from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
 *     to: new Date(),
 *   };
 *
 *   return <PublishStatusChartDemo dateRange={dateRange} />;
 * }
 * ```
 */
export default function PublishStatusChartDemo({
  dateRange,
}: PublishStatusChartDemoProps) {
  const router = useRouter();
  const { data, isLoading, error } = usePublishStatus(dateRange);

  const handleBarClick = (
    status: "published" | "draft",
    contentType: string
  ) => {
    // Map content type keys to route paths
    const routeMap: Record<string, string> = {
      products: "/dashboard/products",
      recipes: "/dashboard/recipes",
      publications: "/dashboard/publications",
    };

    const route = routeMap[contentType];
    if (route) {
      // Navigate with status filter
      const statusParam = status === "published" ? "published" : "draft";
      router.push(`${route}?status=${statusParam}`);
    }
  };

  return (
    <PublishStatusChart
      data={data}
      loading={isLoading}
      error={error as Error}
      onBarClick={handleBarClick}
    />
  );
}
