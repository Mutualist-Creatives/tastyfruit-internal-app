"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { BarChart3 } from "lucide-react";
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

interface PublishStatusChartProps {
  data?: {
    products: {
      published: number;
      draft: number;
    };
    recipes: {
      published: number;
      draft: number;
    };
    publications: {
      published: number;
      draft: number;
    };
  };
  loading?: boolean;
  error?: Error | null;
  onBarClick?: (status: "published" | "draft", contentType: string) => void;
}

const chartConfig = {
  published: {
    label: "Published",
    color: "hsl(142, 76%, 36%)", // Green
  },
  draft: {
    label: "Draft",
    color: "hsl(38, 92%, 50%)", // Orange
  },
} satisfies ChartConfig;

export default function PublishStatusChart({
  data,
  loading = false,
  error = null,
  onBarClick,
}: PublishStatusChartProps) {
  // Loading state
  if (loading) {
    return <PublishStatusChartSkeleton />;
  }

  // Error state
  if (error) {
    return <PublishStatusChartError error={error} />;
  }

  // Empty state
  if (!data) {
    return <PublishStatusChartEmpty />;
  }

  // Transform data for chart
  const chartData = [
    {
      contentType: "Produk",
      contentTypeKey: "products",
      published: data.products.published,
      draft: data.products.draft,
    },
    {
      contentType: "Resep",
      contentTypeKey: "recipes",
      published: data.recipes.published,
      draft: data.recipes.draft,
    },
    {
      contentType: "Publikasi",
      contentTypeKey: "publications",
      published: data.publications.published,
      draft: data.publications.draft,
    },
  ];

  const handleBarClick = (data: any, status: "published" | "draft") => {
    if (onBarClick && data) {
      onBarClick(status, data.contentTypeKey);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Publikasi</CardTitle>
        <CardDescription>
          Distribusi konten berdasarkan status publikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="contentType"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="published"
              fill="var(--color-published)"
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data, "published")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <LabelList
                dataKey="published"
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="draft"
              fill="var(--color-draft)"
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data, "draft")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <LabelList
                dataKey="draft"
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Skeleton loader component
function PublishStatusChartSkeleton() {
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
function PublishStatusChartEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Publikasi</CardTitle>
        <CardDescription>
          Distribusi konten berdasarkan status publikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Belum ada data konten
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Data akan muncul setelah konten dibuat
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Error state component
function PublishStatusChartError({ error }: { error: Error }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Publikasi</CardTitle>
        <CardDescription>
          Distribusi konten berdasarkan status publikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg font-medium text-destructive">
            Gagal memuat data status publikasi
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {error.message || "Terjadi kesalahan saat memuat data"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
