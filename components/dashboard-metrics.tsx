"use client";

import { Package, FileCheck, Calendar } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { useDashboardMetrics, DateRange } from "@/hooks/use-dashboard-data";

interface DashboardMetricsProps {
  dateRange?: DateRange;
}

export function DashboardMetrics({ dateRange }: DashboardMetricsProps) {
  const { data: metrics, isLoading } = useDashboardMetrics(dateRange);

  const formatBreakdown = (
    products: number,
    recipes: number,
    publications: number
  ) => {
    return `${products} produk\n${recipes} resep\n${publications} publikasi`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Konten */}
      <MetricCard
        title="Total Konten"
        value={metrics?.totalContent ?? 0}
        subtitle="Semua jenis konten"
        icon={Package}
        trend={metrics?.trends.totalContent}
        breakdown={
          metrics
            ? formatBreakdown(
                metrics.breakdown.products,
                metrics.breakdown.recipes,
                metrics.breakdown.publications
              )
            : undefined
        }
        loading={isLoading}
      />

      {/* Konten Aktif */}
      <MetricCard
        title="Konten Aktif"
        value={metrics?.activeContent ?? 0}
        subtitle="Konten yang dipublikasi"
        icon={FileCheck}
        trend={metrics?.trends.activeContent}
        breakdown={
          metrics
            ? formatBreakdown(
                metrics.breakdown.products,
                metrics.breakdown.recipes,
                metrics.breakdown.publications
              )
            : undefined
        }
        loading={isLoading}
      />

      {/* Konten Minggu Ini */}
      <MetricCard
        title="Konten Minggu Ini"
        value={metrics?.contentThisWeek ?? 0}
        subtitle="Dibuat dalam 7 hari terakhir"
        icon={Calendar}
        trend={metrics?.trends.contentThisWeek}
        breakdown={
          metrics
            ? formatBreakdown(
                metrics.breakdown.products,
                metrics.breakdown.recipes,
                metrics.breakdown.publications
              )
            : undefined
        }
        loading={isLoading}
      />
    </div>
  );
}
