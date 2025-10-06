# Metric Cards Integration Guide

## Overview

Task 3 "Create New Metric Cards" has been completed. This includes:

1. ✅ Enhanced MetricCard component with trends, tooltips, and skeleton loaders
2. ✅ Total Konten metric with breakdown
3. ✅ Konten Aktif metric with breakdown
4. ✅ Konten Minggu Ini metric with breakdown

## Files Created

### 1. `components/metric-card.tsx`

Enhanced metric card component with:

- Trend indicators (up/down arrows with percentage)
- Hover tooltips for breakdown details
- Click handlers for navigation
- Skeleton loader state
- Responsive design

### 2. `components/dashboard-metrics.tsx`

Main component that renders all three metric cards:

- Total Konten (sum of all content types)
- Konten Aktif (published content)
- Konten Minggu Ini (content created in last 7 days)

Each metric includes:

- Trend comparison vs previous period
- Breakdown tooltip (X produk, Y resep, Z publikasi)
- Proper loading states

### 3. `app/api/dashboard/metrics/route.ts` (Updated)

Enhanced API endpoint that now calculates:

- Total content with trend vs previous period
- Active content with trend vs previous period
- Content this week with trend vs last week
- Breakdown by content type (products, recipes, publications)

## Integration Steps

### Option 1: Replace Existing Metrics Section

In `app/(dashboard)/dashboard/page.tsx`, replace the existing metrics section:

```tsx
// Add import at the top
import { DashboardMetrics } from "@/components/dashboard-metrics";

// Replace the existing metrics grid with:
<DashboardMetrics dateRange={dateRange} />;
```

### Option 2: Side-by-Side Comparison

Keep both implementations temporarily to compare:

```tsx
import { DashboardMetrics } from "@/components/dashboard-metrics";

// Add new section
<div className="space-y-4">
  <h2 className="text-xl font-semibold">New Metrics (Enhanced)</h2>
  <DashboardMetrics dateRange={dateRange} />
</div>;

// Keep existing metrics below for comparison
```

## Features

### MetricCard Component

**Props:**

- `title`: Card title
- `value`: Numeric value to display
- `subtitle`: Optional subtitle text
- `icon`: Lucide icon component
- `trend`: Optional trend data (value, direction, label)
- `breakdown`: Optional tooltip content
- `onClick`: Optional click handler
- `loading`: Loading state

**Example:**

```tsx
<MetricCard
  title="Total Konten"
  value={156}
  subtitle="Semua jenis konten"
  icon={Package}
  trend={{
    value: 12,
    direction: "up",
    label: "vs periode sebelumnya",
  }}
  breakdown="45 produk\n67 resep\n44 publikasi"
  loading={false}
/>
```

### API Response Format

```typescript
{
  totalContent: number,
  activeContent: number,
  contentThisWeek: number,
  trends: {
    totalContent: {
      value: number,        // percentage
      direction: "up" | "down" | "neutral",
      label: string
    },
    activeContent: { ... },
    contentThisWeek: { ... }
  },
  breakdown: {
    products: number,
    recipes: number,
    publications: number
  }
}
```

## Testing

To test the implementation:

1. Start the development server
2. Navigate to the dashboard page
3. Verify all three metric cards display correctly
4. Hover over cards to see breakdown tooltips
5. Check trend indicators show correct direction and percentage
6. Verify skeleton loaders appear during data fetch

## Requirements Satisfied

- ✅ **Requirement 1.2**: Metric cards display icon, title, value, subtitle, and trend indicator
- ✅ **Requirement 1.3**: Data updates with auto-refresh (via React Query)
- ✅ **Requirement 1.4**: Hover tooltip shows breakdown details
- ✅ **Requirement 1.5**: Click handler support for navigation
- ✅ **Requirement 1.1**: All three metrics implemented (Total, Active, This Week)

## Next Steps

After integrating the new metrics:

1. Remove old metric card implementations if no longer needed
2. Add click handlers to navigate to filtered content lists
3. Implement date range filter to update metrics dynamically
4. Test with real data in production environment
