"use client";

import VisitorAnalyticsChart from "./visitor-analytics-chart";
import { useVisitorAnalytics, DateRange } from "@/hooks/use-dashboard-data";

interface VisitorAnalyticsChartDemoProps {
  dateRange?: DateRange;
}

/**
 * Demo component showing how to use VisitorAnalyticsChart with data fetching
 *
 * Usage:
 * ```tsx
 * import VisitorAnalyticsChartDemo from "@/components/visitor-analytics-chart-demo";
 *
 * export default function DashboardPage() {
 *   const dateRange = {
 *     from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
 *     to: new Date(),
 *   };
 *
 *   return <VisitorAnalyticsChartDemo dateRange={dateRange} />;
 * }
 * ```
 */
export default function VisitorAnalyticsChartDemo({
  dateRange,
}: VisitorAnalyticsChartDemoProps) {
  const { data, isLoading, error } = useVisitorAnalytics(dateRange);

  return (
    <VisitorAnalyticsChart
      data={data}
      loading={isLoading}
      error={error as Error}
    />
  );
}
