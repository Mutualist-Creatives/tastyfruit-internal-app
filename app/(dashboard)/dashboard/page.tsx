"use client";

import StatCard from "@/components/stat-card";
import SalesChart from "@/components/sales-chart";
import RecentActivity from "@/components/recent-activity";
import { Package, FileText, CookingPot } from "lucide-react";

const dashboardStats = [
  { title: "Total Produk", value: "1,250", icon: Package },
  { title: "Total Publikasi", value: "78", icon: FileText },
  { title: "Total Resep", value: "112", icon: CookingPot },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-slate-800">
        Dashboard Overview
      </h1>

      {/* Bagian Kartu Statistik */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Bagian Utama dengan Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom kiri untuk Grafik, memakan 2 bagian */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Kolom kanan untuk Aktivitas, memakan 1 bagian */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
