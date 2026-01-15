"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ContentGrowthChartProps {
  monthlyData?: {
    products: Array<{ count: number }>;
    recipes: Array<{ count: number }>;
    publications?: Array<{ count: number }>;
  };
  isAdmin?: boolean;
}

export default function ContentGrowthChart({
  monthlyData,
  isAdmin = false,
}: ContentGrowthChartProps) {
  // Config for admin (Products and Recipes)
  const adminChartConfig = {
    products: {
      label: "Produk",
      color: "hsl(221, 100%, 46%)",
    },
    recipes: {
      label: "Resep",
      color: "hsl(75, 98%, 57%)",
    },
  } satisfies ChartConfig;

  // Config for non-admin (Publications and Recipes)
  const userChartConfig = {
    publications: {
      label: "Publikasi",
      color: "hsl(270, 50%, 50%)",
    },
    recipes: {
      label: "Resep",
      color: "hsl(75, 98%, 57%)",
    },
  } satisfies ChartConfig;

  const chartConfig = isAdmin ? adminChartConfig : userChartConfig;

  const defaultData = [
    { month: "Jan", products: 0, recipes: 0, publications: 0 },
    { month: "Feb", products: 0, recipes: 0, publications: 0 },
    { month: "Mar", products: 0, recipes: 0, publications: 0 },
    { month: "Apr", products: 0, recipes: 0, publications: 0 },
    { month: "May", products: 0, recipes: 0, publications: 0 },
    { month: "Jun", products: 0, recipes: 0, publications: 0 },
  ];

  const chartData = monthlyData
    ? defaultData.map((item, index) => ({
        month: item.month,
        products: monthlyData.products[index]?.count || 0,
        recipes: monthlyData.recipes[index]?.count || 0,
        publications: monthlyData.publications?.[index]?.count || 0,
      }))
    : defaultData;

  const description = isAdmin
    ? "Produk dan resep yang dibuat dalam 6 bulan terakhir"
    : "Publikasi dan resep yang dibuat dalam 6 bulan terakhir";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pertumbuhan Konten</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="recipes"
              type="natural"
              fill="var(--color-recipes)"
              fillOpacity={0.4}
              stroke="var(--color-recipes)"
              stackId="a"
            />
            {isAdmin ? (
              <Area
                dataKey="products"
                type="natural"
                fill="var(--color-products)"
                fillOpacity={0.4}
                stroke="var(--color-products)"
                stackId="a"
              />
            ) : (
              <Area
                dataKey="publications"
                type="natural"
                fill="var(--color-publications)"
                fillOpacity={0.4}
                stroke="var(--color-publications)"
                stackId="a"
              />
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
