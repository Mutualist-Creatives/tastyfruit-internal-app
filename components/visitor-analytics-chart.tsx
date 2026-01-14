"use client";

import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface VisitorAnalyticsChartProps {
  data?: Array<{
    date: string; // ISO date string
    visitors: number;
    pageViews: number;
  }>;
  loading?: boolean;
  error?: Error | null;
}

const chartConfig = {
  visitors: {
    label: "Pengunjung",
    color: "hsl(221, 100%, 46%)", // Primary blue
  },
  pageViews: {
    label: "Page Views",
    color: "hsl(75, 98%, 57%)", // Secondary green
  },
} satisfies ChartConfig;

export default function VisitorAnalyticsChart({
  data,
  loading = false,
  error = null,
}: VisitorAnalyticsChartProps) {
  // Loading state
  if (loading) {
    return <VisitorAnalyticsChartSkeleton />;
  }

  // Error state
  if (error) {
    return <VisitorAnalyticsChartError error={error} />;
  }

  // Empty state
  if (!data || data.length === 0) {
    return <VisitorAnalyticsChartEmpty />;
  }

  // Transform data for chart
  const chartData = data.map((item) => ({
    date: item.date,
    formattedDate: format(new Date(item.date), "dd MMM yyyy", {
      locale: localeId,
    }),
    visitors: item.visitors,
    pageViews: item.pageViews,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Pengunjung</CardTitle>
        <CardDescription>
          Trend pengunjung dan page views web client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="formattedDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Show short format for x-axis
                const parts = value.split(" ");
                return `${parts[0]} ${parts[1]}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="visitors"
              type="monotone"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-visitors)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="pageViews"
              type="monotone"
              stroke="var(--color-pageViews)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-pageViews)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Skeleton loader component
function VisitorAnalyticsChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

// Empty state component
function VisitorAnalyticsChartEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Pengunjung</CardTitle>
        <CardDescription>
          Trend pengunjung dan page views web client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Belum ada data analytics
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Data pengunjung akan muncul setelah web client mulai dikunjungi
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Error state component
function VisitorAnalyticsChartError({ error }: { error: Error }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Pengunjung</CardTitle>
        <CardDescription>
          Trend pengunjung dan page views web client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg font-medium text-destructive">
            Gagal memuat data analytics
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {error.message || "Terjadi kesalahan saat memuat data"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
