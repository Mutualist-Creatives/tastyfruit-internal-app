"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/stat-card";
import SalesChart from "@/components/sales-chart";
import RecentActivity from "@/components/recent-activity";
import {
  Package,
  FileText,
  CookingPot,
  AlertTriangle,
  CheckCircle,
  Eye,
} from "lucide-react";

interface DashboardStats {
  overview: {
    totalProducts: number;
    totalRecipes: number;
    totalPublications: number;
    activeProducts: number;
    publishedRecipes: number;
    publishedPublications: number;
    lowStockProducts: number;
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
    products: any[];
    recipes: any[];
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Failed to load dashboard data
        </div>
      </div>
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
      title: "Stok Rendah",
      value: stats.overview.lowStockProducts.toString(),
      icon: AlertTriangle,
      color: "text-orange-600 bg-orange-100",
    },
    {
      title: "Produk Baru (7 hari)",
      value: stats.recentActivity.newProducts.toString(),
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Resep Baru (7 hari)",
      value: stats.recentActivity.newRecipes.toString(),
      icon: Eye,
      color: "text-blue-600 bg-blue-100",
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

      {/* Bagian Alert Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {alertStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg border p-6 shadow-sm"
          >
            <div className="flex items-center">
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Kategori Produk */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Produk per Kategori
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.productsByCategory.map((category) => (
            <div key={category.category} className="text-center">
              <div className="text-2xl font-bold text-primary">
                {category.count}
              </div>
              <div className="text-sm text-slate-600">{category.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bagian Utama dengan Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom kiri untuk Grafik, memakan 2 bagian */}
        <div className="lg:col-span-2">
          <SalesChart monthlyData={stats.monthlyData} />
        </div>

        {/* Kolom kanan untuk Aktivitas, memakan 1 bagian */}
        <div className="lg:col-span-1">
          <RecentActivity recentActivity={stats.recentActivity} />
        </div>
      </div>
    </div>
  );
}
