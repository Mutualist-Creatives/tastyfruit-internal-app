"use client";

import { useState } from "react";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { TableSkeleton } from "@/components/skeletons/list-skeleton";
import { GridSkeleton } from "@/components/skeletons/list-skeleton";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";

export default function DemoSkeleton() {
  const [activeDemo, setActiveDemo] = useState<string>("dashboard");

  const demos = [
    { id: "dashboard", label: "Dashboard Skeleton" },
    { id: "table", label: "Table Skeleton" },
    { id: "grid", label: "Grid Skeleton" },
    { id: "form", label: "Form Skeleton" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Skeleton Components Demo</h2>
        <div className="flex gap-2 mb-6">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === demo.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeDemo === "dashboard" && <DashboardSkeleton />}
        {activeDemo === "table" && <TableSkeleton rows={5} />}
        {activeDemo === "grid" && <GridSkeleton items={6} />}
        {activeDemo === "form" && <FormSkeleton />}
      </div>
    </div>
  );
}
