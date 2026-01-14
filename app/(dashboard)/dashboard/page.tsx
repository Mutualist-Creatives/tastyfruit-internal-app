"use client";

import StatCard from "@/components/stat-card";
import SalesChart from "@/components/sales-chart";
import RecentActivity from "@/components/recent-activity";
import { Package, FileText, CookingPot } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  const stats = data.data;

  const dashboardStats = [
    {
      title: "Total Produk",
      value: (stats.products || 0).toString(),
      icon: Package,
      subtitle: "produk terdaftar",
    },
    {
      title: "Total Resep",
      value: (stats.recipes || 0).toString(),
      icon: CookingPot,
      subtitle: "resep tersedia",
    },
    {
      title: "Total Publikasi",
      value: (stats.publications || 0).toString(),
      icon: FileText,
      subtitle: "publikasi dibuat",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-slate-800">
        Dashboard Overview
      </h1>

      {/* Bagian Kartu Statistik Utama */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Bagian Utama dengan Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom kiri untuk Grafik, memakan 2 bagian */}
        <div className="lg:col-span-2">
          <SalesChart monthlyData={{ products: [], recipes: [] }} />
        </div>

        {/* Kolom kanan untuk Aktivitas, memakan 1 bagian */}
        <div className="lg:col-span-1">
          <RecentActivity
            recentActivity={{
              newProducts: 0,
              newRecipes: 0,
              newPublications: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
