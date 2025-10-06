"use client";

import { useEffect } from "react";
import StatCard from "@/components/stat-card";
import ContentGrowthChart from "@/components/content-growth-chart";
import RecentActivity from "@/components/recent-activity";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { ErrorState } from "@/components/error-states";
import ErrorBoundary from "@/components/error-boundary";
import { useFetch } from "@/hooks/use-api";
import {
  Package,
  FileText,
  CookingPot,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  overview: {
    totalProducts: number;
    totalRecipes: number;
    totalPublications: number;
    activeProducts: number;
    publishedRecipes: number;
    publishedPublications: number;
  };
  productsByCategory: Array<{
    category: string;
    count: number;
  }>;
  recentActivity: {
    newProducts: number;
    newRecipes: number;
    newPublications: number;
  };
  monthlyData: {
    products: Array<{ count: number }>;
    recipes: Array<{ count: number }>;
  };
}

export default function DashboardPage() {
  const {
    data: stats,
    loading,
    error,
    fetch: fetchData,
    retry,
  } = useFetch<DashboardStats>();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    await fetchData(
      async () => {
        const response = await fetch("/api/dashboard/stats");
        if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        return response.json();
      },
      {
        errorMessage: "Gagal memuat data dashboard",
        showErrorToast: false, // We'll show custom error state instead
      }
    );
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Dashboard"
        message="Tidak dapat memuat data dashboard. Silakan coba lagi."
        onRetry={fetchDashboardStats}
      />
    );
  }

  if (!stats) {
    return (
      <ErrorState
        title="Data Tidak Tersedia"
        message="Data dashboard tidak tersedia saat ini."
        onRetry={fetchDashboardStats}
      />
    );
  }

  const dashboardStats = [
    {
      title: "Total Produk",
      value: stats.overview.totalProducts.toString(),
      icon: Package,
      subtitle: `${stats.overview.activeProducts} aktif`,
    },
    {
      title: "Total Resep",
      value: stats.overview.totalRecipes.toString(),
      icon: CookingPot,
      subtitle: `${stats.overview.publishedRecipes} dipublikasi`,
    },
    {
      title: "Total Publikasi",
      value: stats.overview.totalPublications.toString(),
      icon: FileText,
      subtitle: `${stats.overview.publishedPublications} dipublikasi`,
    },
  ];

  const alertStats = [
    {
      title: "Produk Baru",
      value: stats.recentActivity.newProducts.toString(),
      icon: Package,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Resep Baru",
      value: stats.recentActivity.newRecipes.toString(),
      icon: CookingPot,
      color: "text-[#003CE9] bg-[#B5FE28]/20",
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
        <ErrorBoundary>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dashboardStats.map((stat) => (
              <Card
                key={stat.title}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-[#003CE9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#003CE9]">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ErrorBoundary>

        {/* Bagian Alert Stats */}
        <ErrorBoundary>
          <div className="grid gap-4 md:grid-cols-2">
            {alertStats.map((stat) => (
              <Card
                key={stat.title}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Dalam 7 hari terakhir
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ErrorBoundary>

        {/* Bagian Kategori Produk */}
        <ErrorBoundary>
          <Card>
            <CardHeader>
              <CardTitle>Produk per Kategori</CardTitle>
              <CardDescription>
                Distribusi produk berdasarkan kategori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.productsByCategory.map((category) => (
                  <div
                    key={category.category}
                    className="text-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="text-2xl font-bold text-[#003CE9]">
                      {category.count}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {category.category}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ErrorBoundary>

        {/* Bagian Utama dengan Grid Layout */}
        <div className="grid gap-4 lg:grid-cols-7">
          {/* Kolom kiri untuk Grafik */}
          <div className="lg:col-span-4">
            <ErrorBoundary>
              <ContentGrowthChart monthlyData={stats.monthlyData} />
            </ErrorBoundary>
          </div>

          {/* Kolom kanan untuk Aktivitas */}
          <div className="lg:col-span-3">
            <ErrorBoundary>
              <RecentActivity recentActivity={stats.recentActivity} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
