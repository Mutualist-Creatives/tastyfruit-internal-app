# Visitor Analytics Chart Integration Guide

## Overview

The Visitor Analytics Chart component displays visitor trends and page views for the web client in a line chart format. It includes loading states, error handling, and empty states.

## Components Created

1. **VisitorAnalyticsChart** (`components/visitor-analytics-chart.tsx`)

   - Main chart component with all states (loading, error, empty, data)
   - Uses recharts Line chart with smooth curves
   - Responsive design with proper margins

2. **VisitorAnalyticsChartDemo** (`components/visitor-analytics-chart-demo.tsx`)
   - Demo component showing integration with data fetching
   - Uses `useVisitorAnalytics` hook from `hooks/use-dashboard-data.ts`

## Features Implemented

✅ Line chart with smooth curves (monotone interpolation)
✅ Gradient-style visualization with dots on data points
✅ Responsive margins and sizing
✅ Tooltip with formatted date and visitor/page view counts
✅ Empty state with icon and message "Belum ada data analytics"
✅ Skeleton loader with shimmer effect
✅ Error state with retry suggestion
✅ Connected to `/api/analytics/visitors` endpoint
✅ Date range filtering support

## API Endpoint

**GET** `/api/analytics/visitors`

Query Parameters:

- `from` (optional): ISO date string for start date
- `to` (optional): ISO date string for end date

Response:

```json
[
  {
    "date": "2024-01-01",
    "visitors": 150,
    "pageViews": 450
  },
  ...
]
```

## Usage

### Basic Usage (with data fetching)

```tsx
import VisitorAnalyticsChartDemo from "@/components/visitor-analytics-chart-demo";

export default function DashboardPage() {
  const dateRange = {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  };

  return (
    <div className="grid gap-4">
      <VisitorAnalyticsChartDemo dateRange={dateRange} />
    </div>
  );
}
```

### Advanced Usage (manual data management)

```tsx
import VisitorAnalyticsChart from "@/components/visitor-analytics-chart";
import { useVisitorAnalytics } from "@/hooks/use-dashboard-data";

export default function CustomDashboard() {
  const { data, isLoading, error } = useVisitorAnalytics({
    from: new Date("2024-01-01"),
    to: new Date("2024-01-31"),
  });

  return (
    <VisitorAnalyticsChart
      data={data}
      loading={isLoading}
      error={error as Error}
    />
  );
}
```

### Standalone Usage (with custom data)

```tsx
import VisitorAnalyticsChart from "@/components/visitor-analytics-chart";

export default function CustomChart() {
  const customData = [
    { date: "2024-01-01", visitors: 100, pageViews: 300 },
    { date: "2024-01-02", visitors: 120, pageViews: 350 },
    { date: "2024-01-03", visitors: 90, pageViews: 280 },
  ];

  return <VisitorAnalyticsChart data={customData} />;
}
```

## Component States

### 1. Loading State

Shows skeleton loader with shimmer effect matching chart dimensions.

### 2. Data State

Displays line chart with:

- Two lines: Visitors (blue) and Page Views (green)
- Smooth curves with dots on data points
- Interactive tooltip showing date and counts
- Responsive grid and margins

### 3. Empty State

Shows when no data is available:

- TrendingUp icon
- Message: "Belum ada data analytics"
- Helpful subtitle

### 4. Error State

Shows when data fetching fails:

- Warning icon
- Error message
- Suggestion to check connection

## Styling

The component uses:

- Tailwind CSS for styling
- shadcn/ui Card components
- Custom chart colors from design system:
  - Visitors: `hsl(221, 100%, 46%)` (Primary blue)
  - Page Views: `hsl(75, 98%, 57%)` (Secondary green)

## Date Formatting

Dates are formatted using `date-fns` with Indonesian locale:

- Tooltip: "12 Jan 2024" format
- X-axis: Short format "12 Jan"

## Accessibility

- `accessibilityLayer` enabled on chart
- Proper ARIA labels on card components
- Keyboard navigation support
- Screen reader friendly

## Performance

- Data cached for 5 minutes (via React Query)
- Responsive container adapts to parent width
- Optimized re-renders with proper memoization

## Next Steps

To integrate into the main dashboard:

1. Import the demo component in your dashboard page
2. Pass the date range from your date range filter
3. The component will automatically fetch and display data
4. Handle the date range state in your parent component

Example:

```tsx
// app/(dashboard)/dashboard/page.tsx
"use client";

import { useState } from "react";
import VisitorAnalyticsChartDemo from "@/components/visitor-analytics-chart-demo";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  return (
    <div className="space-y-4">
      {/* Date range filter component here */}

      <div className="grid gap-4 md:grid-cols-2">
        <VisitorAnalyticsChartDemo dateRange={dateRange} />
        {/* Other charts/widgets */}
      </div>
    </div>
  );
}
```

## Testing

To test the component:

1. **With mock data**: The API endpoint returns mock data by default
2. **Empty state**: Pass `data={[]}` to the component
3. **Loading state**: Pass `loading={true}` to the component
4. **Error state**: Pass `error={new Error("Test error")}` to the component

## Requirements Satisfied

✅ **Requirement 2.1**: Line chart displays visitor analytics
✅ **Requirement 2.2**: Chart shows data for selected date range with tooltip
✅ **Requirement 2.4**: Empty state with informative message
✅ **Requirement 2.5**: Skeleton loader during data fetch
✅ **Requirement 2.6**: Tooltip shows formatted date and visitor counts
