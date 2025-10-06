# Publish Status Chart Integration Guide

## Overview

The Publish Status Chart displays the distribution of content by publication status (Published vs Draft) across all content types (Products, Recipes, Publications). This guide shows you how to integrate it into your dashboard.

## Components Created

1. **PublishStatusChart** (`components/publish-status-chart.tsx`)

   - Main chart component with bar chart visualization
   - Includes loading, error, and empty states
   - Supports click handlers for navigation
   - Color-coded bars (green for published, orange for draft)
   - Labels on top of bars showing counts

2. **PublishStatusChartDemo** (`components/publish-status-chart-demo.tsx`)

   - Demo component with data fetching and navigation
   - Shows how to use the chart with real data

3. **API Endpoint** (`app/api/dashboard/publish-status/route.ts`)

   - GET endpoint that returns publish status data
   - Supports date range filtering via query params
   - Groups data by content type and status

4. **Hook** (`hooks/use-dashboard-data.ts`)
   - `usePublishStatus` hook for data fetching
   - Includes caching and error handling

## Quick Start

### Option 1: Use the Demo Component (Recommended)

```tsx
import PublishStatusChartDemo from "@/components/publish-status-chart-demo";

export default function DashboardPage() {
  const dateRange = {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  };

  return (
    <div className="grid gap-4">
      <PublishStatusChartDemo dateRange={dateRange} />
    </div>
  );
}
```

### Option 2: Use the Chart Component Directly

```tsx
import PublishStatusChart from "@/components/publish-status-chart";
import { usePublishStatus } from "@/hooks/use-dashboard-data";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePublishStatus();

  const handleBarClick = (
    status: "published" | "draft",
    contentType: string
  ) => {
    const routeMap = {
      products: "/dashboard/products",
      recipes: "/dashboard/recipes",
      publications: "/dashboard/publications",
    };

    const route = routeMap[contentType];
    if (route) {
      router.push(`${route}?status=${status}`);
    }
  };

  return (
    <PublishStatusChart
      data={data}
      loading={isLoading}
      error={error as Error}
      onBarClick={handleBarClick}
    />
  );
}
```

## API Usage

### Endpoint

```
GET /api/dashboard/publish-status
```

### Query Parameters

- `from` (optional): ISO date string for start date
- `to` (optional): ISO date string for end date

### Response Format

```json
{
  "products": {
    "published": 24,
    "draft": 6
  },
  "recipes": {
    "published": 18,
    "draft": 4
  },
  "publications": {
    "published": 15,
    "draft": 8
  }
}
```

### Example Request

```typescript
const response = await fetch(
  "/api/dashboard/publish-status?from=2024-01-01&to=2024-01-31"
);
const data = await response.json();
```

## Features

### 1. Grouped Bar Chart

- Shows Published (green) and Draft (orange) bars side by side
- Grouped by content type (Products, Recipes, Publications)
- Labels on top of each bar showing the count

### 2. Interactive Navigation

- Click on any bar to navigate to the content list page
- Automatically filters by status and content type
- Example: Clicking "Draft" bar for "Products" navigates to `/dashboard/products?status=draft`

### 3. Hover Tooltips

- Shows detailed breakdown when hovering over bars
- Displays content type and count for each status

### 4. Loading States

- Skeleton loader while data is fetching
- Matches the chart dimensions for smooth transition

### 5. Error Handling

- Displays error message if data fetch fails
- Shows user-friendly error state with icon

### 6. Empty State

- Shows when no data is available
- Includes helpful message and icon

## Customization

### Change Colors

Edit the `chartConfig` in `components/publish-status-chart.tsx`:

```typescript
const chartConfig = {
  published: {
    label: "Published",
    color: "hsl(142, 76%, 36%)", // Change this
  },
  draft: {
    label: "Draft",
    color: "hsl(38, 92%, 50%)", // Change this
  },
} satisfies ChartConfig;
```

### Customize Navigation

Modify the `handleBarClick` function in the demo component:

```typescript
const handleBarClick = (status: "published" | "draft", contentType: string) => {
  // Your custom navigation logic
  console.log(`Clicked ${status} bar for ${contentType}`);
};
```

### Adjust Chart Dimensions

Modify the `margin` property in the BarChart component:

```typescript
<BarChart
  data={chartData}
  margin={{
    left: 12,
    right: 12,
    top: 20,    // Adjust these values
    bottom: 12,
  }}
>
```

## Integration with Dashboard Layout

### Side-by-Side with Visitor Analytics

```tsx
<div className="grid gap-4 md:grid-cols-2">
  <VisitorAnalyticsChartDemo dateRange={dateRange} />
  <PublishStatusChartDemo dateRange={dateRange} />
</div>
```

### Full Width Layout

```tsx
<div className="grid gap-4">
  <PublishStatusChartDemo dateRange={dateRange} />
</div>
```

### Responsive Grid (7-5 ratio as per design)

```tsx
<div className="grid gap-4 lg:grid-cols-12">
  <div className="lg:col-span-7">
    <VisitorAnalyticsChartDemo dateRange={dateRange} />
  </div>
  <div className="lg:col-span-5">
    <PublishStatusChartDemo dateRange={dateRange} />
  </div>
</div>
```

## Testing

### Test the API Endpoint

```bash
# Test without date range
curl http://localhost:3000/api/dashboard/publish-status

# Test with date range
curl "http://localhost:3000/api/dashboard/publish-status?from=2024-01-01T00:00:00.000Z&to=2024-01-31T23:59:59.999Z"
```

### Test the Component

Create a test page at `app/test-publish-status/page.tsx`:

```tsx
import PublishStatusChartDemo from "@/components/publish-status-chart-demo";

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Publish Status Chart Test</h1>
      <PublishStatusChartDemo />
    </div>
  );
}
```

## Troubleshooting

### Chart Not Showing Data

1. Check if the API endpoint is returning data:

   ```bash
   curl http://localhost:3000/api/dashboard/publish-status
   ```

2. Check browser console for errors

3. Verify database has content with different statuses

### Navigation Not Working

1. Ensure the route paths in `handleBarClick` match your actual routes
2. Check if the status query parameter is being handled in the target page

### Styling Issues

1. Ensure Tailwind CSS is properly configured
2. Check if shadcn/ui components are installed
3. Verify chart colors are defined in the theme

## Next Steps

1. Add the chart to your main dashboard page
2. Implement status filtering on content list pages
3. Add date range filter to update the chart dynamically
4. Consider adding export functionality for the chart data

## Related Components

- `VisitorAnalyticsChart` - Line chart for visitor analytics
- `MetricCard` - Metric cards for dashboard overview
- `RecentContentWidget` - Widget showing recent content

## Requirements Covered

This implementation covers the following requirements from the spec:

- ✅ 3.1: Bar chart for publish status
- ✅ 3.2: Grouped bars with labels and color coding
- ✅ 3.3: Click handler for navigation
- ✅ 3.4: Hover tooltip with breakdown
- ✅ 3.5: API endpoint for publish status data
