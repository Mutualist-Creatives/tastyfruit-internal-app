"use client";

import { useQuery } from "@tanstack/react-query";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DashboardMetrics {
  totalContent: number;
  activeContent: number;
  contentThisWeek: number;
  trends: {
    totalContent: {
      value: number;
      direction: "up" | "down" | "neutral";
      label: string;
    };
    activeContent: {
      value: number;
      direction: "up" | "down" | "neutral";
      label: string;
    };
    contentThisWeek: {
      value: number;
      direction: "up" | "down" | "neutral";
      label: string;
    };
  };
  breakdown: {
    products: number;
    recipes: number;
    publications: number;
  };
}

export interface AnalyticsData {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface RecentContent {
  id: string;
  title: string;
  type: "product" | "recipe" | "publication";
  status: "published" | "draft";
  thumbnail?: string | null;
  lastModified: Date;
}

export interface CategoryData {
  name: string;
  count: number;
  percentage: number;
}

export interface Activity {
  id: string;
  type: "create" | "update" | "delete";
  contentType: "product" | "recipe" | "publication";
  contentTitle: string;
  contentId?: string;
  timestamp: Date;
}

export interface PublishStatusData {
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
}

export function useDashboardMetrics(dateRange?: DateRange) {
  return useQuery<DashboardMetrics>({
    queryKey: ["dashboard-metrics", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) {
        params.append("from", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append("to", dateRange.to.toISOString());
      }

      const response = await fetch(`/api/dashboard/metrics?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard metrics");
      }
      return response.json();
    },
  });
}

export function useVisitorAnalytics(dateRange?: DateRange) {
  return useQuery<AnalyticsData[]>({
    queryKey: ["visitor-analytics", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) {
        params.append("from", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append("to", dateRange.to.toISOString());
      }

      const response = await fetch(`/api/analytics/visitors?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch visitor analytics");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRecentContent(limit = 5) {
  return useQuery<RecentContent[]>({
    queryKey: ["recent-content", limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/recent-content?limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recent content");
      }
      const data = await response.json();
      // Parse dates
      return data.map((item: any) => ({
        ...item,
        lastModified: new Date(item.lastModified),
      }));
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCategories() {
  return useQuery<CategoryData[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useActivities(page = 1, limit = 10) {
  return useQuery<{
    activities: Activity[];
    hasMore: boolean;
    page: number;
    limit: number;
  }>({
    queryKey: ["activities", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/activities?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      const data = await response.json();
      // Parse dates
      return {
        ...data,
        activities: data.activities.map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp),
        })),
      };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function usePublishStatus(dateRange?: DateRange) {
  return useQuery<PublishStatusData>({
    queryKey: ["publish-status", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) {
        params.append("from", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append("to", dateRange.to.toISOString());
      }

      const response = await fetch(`/api/dashboard/publish-status?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch publish status data");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
