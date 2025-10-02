"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface SalesChartProps {
  monthlyData?: {
    products: any[];
    recipes: any[];
  };
}

export default function SalesChart({ monthlyData }: SalesChartProps) {
  // Default data jika tidak ada monthlyData
  const defaultData = [
    { name: "Jan", products: 0, recipes: 0 },
    { name: "Feb", products: 0, recipes: 0 },
    { name: "Mar", products: 0, recipes: 0 },
    { name: "Apr", products: 0, recipes: 0 },
    { name: "May", products: 0, recipes: 0 },
    { name: "Jun", products: 0, recipes: 0 },
  ];

  const data = monthlyData
    ? defaultData.map((item, index) => ({
        name: item.name,
        products: monthlyData.products[index]?.count || 0,
        recipes: monthlyData.recipes[index]?.count || 0,
      }))
    : defaultData;

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="font-heading text-lg font-semibold">Content Overview</h3>
      <p className="text-sm text-slate-500 mb-4">
        Produk dan resep yang dibuat per bulan
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar dataKey="products" fill="#003CE9" radius={[4, 4, 0, 0]} />
          <Bar dataKey="recipes" fill="#9CFF00" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
