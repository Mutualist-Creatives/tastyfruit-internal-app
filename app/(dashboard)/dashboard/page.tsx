"use client";

import StatCard from "@/components/stat-card";
import ContentGrowthChart from "@/components/content-growth-chart";
import RecentActivity from "@/components/recent-activity";
import { Package, FileText, CookingPot, Users } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks";
import { ErrorState } from "@/components/error-states";
import ErrorBoundary from "@/components/error-boundary";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardStats();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return <DashboardSkeleton isAdmin={isAdmin} />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Data Tidak Tersedia"
        message="Data dashboard tidak tersedia saat ini."
        onRetry={refetch}
      />
    );
  }

  const stats = data.data;

  // Stats for all users (Publications and Recipes)
  const baseStats = [
    {
      title: "Total Publikasi",
      value: (stats.publications || 0).toString(),
      icon: FileText,
      subtitle: "publikasi dibuat",
    },
    {
      title: "Total Resep",
      value: (stats.recipes || 0).toString(),
      icon: CookingPot,
      subtitle: "resep tersedia",
    },
  ];

  // Additional stats for admin (Products and Users)
  const adminStats = [
    {
      title: "Total Produk",
      value: (stats.products || 0).toString(),
      icon: Package,
      subtitle: "produk terdaftar",
    },
    {
      title: "Total Users",
      value: (stats.users || 0).toString(),
      icon: Users,
      subtitle: "pengguna terdaftar",
    },
    ...baseStats,
  ];

  const dashboardStats = isAdmin ? adminStats : baseStats;

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
        <div
          className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${
            isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-2"
          }`}
        >
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
            <ContentGrowthChart
              monthlyData={
                stats.monthlyData || {
                  products: [],
                  recipes: [],
                  publications: [],
                }
              }
              isAdmin={isAdmin}
            />
          </div>

          {/* Kolom kanan untuk Aktivitas, memakan 1 bagian */}
          <div className="lg:col-span-1">
            <RecentActivity
              recentActivity={
                stats.recentActivity || {
                  newProducts: 0,
                  newRecipes: 0,
                  newPublications: 0,
                }
              }
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
