/**
 * Demo/Example of how to integrate the new DashboardMetrics component
 * into the existing dashboard page.
 *
 * Replace the existing metrics section in app/(dashboard)/dashboard/page.tsx with:
 *
 * import { DashboardMetrics } from "@/components/dashboard-metrics";
 *
 * // In the component:
 * <DashboardMetrics dateRange={dateRange} />
 *
 * This will render all three metric cards:
 * - Total Konten (with breakdown tooltip)
 * - Konten Aktif (with breakdown tooltip)
 * - Konten Minggu Ini (with breakdown tooltip)
 *
 * Each card includes:
 * - Icon with brand color background
 * - Large value display
 * - Subtitle for context
 * - Trend indicator (up/down arrow with percentage)
 * - Hover tooltip showing breakdown by content type
 * - Skeleton loader during data fetch
 * - Responsive grid layout (3 cols desktop, 2 cols tablet, 1 col mobile)
 */

"use client";

import { useState } from "react";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { DateRange } from "@/hooks/use-dashboard-data";

export function DashboardMetricsDemo() {
  const [dateRange] = useState<DateRange>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Metrics</h2>
        <p className="text-muted-foreground">
          Enhanced metric cards with trends and breakdowns
        </p>
      </div>
      <DashboardMetrics dateRange={dateRange} />
    </div>
  );
}
