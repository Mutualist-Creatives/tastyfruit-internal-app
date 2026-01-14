"use client";

import StatCard from "@/components/stat-card";
import ContentGrowthChart from "@/components/content-growth-chart";
import RecentActivity from "@/components/recent-activity";
import { Package, FileText, CookingPot } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <ErrorState
        title="Gagal Memuat Dashboard"
        message="Tidak dapat memuat data dashboard. Silakan coba lagi."
        onRetry={fetchDashboardStats}
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Data Tidak Tersedia"
        message="Data dashboard tidak tersedia saat ini."
        onRetry={fetchDashboardStats}
      />
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
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang di TastyFruit Admin Panel
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-[#B5FE28] text-[#003CE9] border-[#003CE9]"
          >
            <Activity className="mr-1 h-3 w-3" />
            Live
          </Badge>
        </div>

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
    </ErrorBoundary>
  );
}
