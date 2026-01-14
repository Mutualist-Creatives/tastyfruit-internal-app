# Design Document

## Overview

Dashboard TastyFruit Admin Panel adalah command center untuk content management system yang memberikan real-time insights, quick actions, dan comprehensive analytics tentang konten dan web client visitors. Design ini fokus pada information density, actionability, dan performance.

**Key Design Principles:**

1. **Information First** - Data yang paling penting di atas
2. **Actionable** - Quick actions untuk common tasks
3. **Real-time** - Auto-refresh dengan performance optimization
4. **Responsive** - Optimal experience di semua devices
5. **Accessible** - WCAG AA compliant

## Architecture

### Component Hierarchy

```
DashboardPage (app/(dashboard)/dashboard/page.tsx)
├── DashboardHeader
│   ├── Title & Welcome Message
│   ├── DateRangeFilter
│   ├── SearchBar
│   ├── RefreshButton
│   └── ExportButton
├── MetricsSection
│   ├── MetricCard (Total Konten)
│   ├── MetricCard (Konten Aktif)
│   └── MetricCard (Konten Minggu Ini)
├── ChartsSection
│   ├── VisitorAnalyticsChart (Line Chart)
│   └── PublishStatusChart (Bar Chart)
├── WidgetsSection
│   ├── QuickActionsWidget
│   ├── RecentContentWidget
│   ├── ContentByCategoryWidget
│   └── ActivityTimelineWidget
└── AutoRefreshIndicator
```

### Data Flow

```
┌─────────────────────────────────────────┐
│         Dashboard Page Load             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│    Parallel Data Fetching (Promise.all) │
│    ├── Metrics Data                     │
│    ├── Analytics Data                   │
│    ├── Recent Content                   │
│    ├── Activity Timeline                │
│    └── Category Distribution            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│         Render Components               │
│         with Skeleton Loaders           │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│      Setup Auto-Refresh (5 min)         │
│      Setup Visibility Change Listener   │
└─────────────────────────────────────────┘
```

### State Management

**Local State:**

- Date range filter
- Search query
- Auto-refresh status
- Loading states per widget
- Error states per widget

**Server State (React Query / SWR):**

- Dashboard metrics
- Analytics data
- Recent content
- Activity timeline
- Category distribution

**Cache Strategy:**

- Metrics: 1 minute TTL
- Analytics: 5 minutes TTL
- Recent content: 30 seconds TTL
- Activity timeline: 30 seconds TTL
- Category distribution: 5 minutes TTL

## Components and Interfaces

### 1. DashboardHeader Component

**Purpose:** Header dengan title, filters, search, dan actions.

**Props:**

```typescript
interface DashboardHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onExport: (format: "csv" | "pdf" | "excel") => void;
  isRefreshing: boolean;
  lastUpdated: Date;
}

interface DateRange {
  from: Date;
  to: Date;
  preset?: "7d" | "30d" | "3m" | "custom";
}
```

**Layout:**

```
┌────────────────────────────────────────────────────────┐
│  Dashboard                    [Last updated: 2m ago]   │
│  Selamat datang, Admin        [🔄 Refresh] [📥 Export]│
│                                                        │
│  [📅 7 Hari Terakhir ▼]  [🔍 Search...]              │
└────────────────────────────────────────────────────────┘
```

### 2. MetricCard Component

**Purpose:** Card untuk menampilkan single metric dengan trend.

**Props:**

```typescript
interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number; // percentage
    direction: "up" | "down" | "neutral";
    label: string; // "vs minggu lalu"
  };
  onClick?: () => void;
  loading?: boolean;
}
```

**Styling:**

- Card dengan hover effect (shadow, scale)
- Icon dengan brand color background
- Large number (text-3xl atau text-4xl)
- Trend indicator dengan arrow icon dan color
- Skeleton loader saat loading

**Example:**

```
┌─────────────────────────┐
│ Total Konten        📦  │
│                         │
│ 156                     │
│                         │
│ ↑ 12% vs minggu lalu    │
└─────────────────────────┘
```

### 3. VisitorAnalyticsChart Component

**Purpose:** Line chart untuk menampilkan visitor trends.

**Props:**

```typescript
interface VisitorAnalyticsChartProps {
  data: AnalyticsData[];
  dateRange: DateRange;
  loading?: boolean;
}

interface AnalyticsData {
  date: string; // ISO date
  visitors: number;
  pageViews: number;
}
```

**Chart Config:**

- Line chart dengan smooth curves
- Gradient fill di bawah line
- Tooltip dengan date dan visitor count
- Responsive dengan proper margins
- Empty state jika tidak ada data

**Implementation:**

```typescript
const chartConfig = {
  visitors: {
    label: "Pengunjung",
    color: "hsl(221, 100%, 46%)", // Primary blue
  },
  pageViews: {
    label: "Page Views",
    color: "hsl(75, 98%, 57%)", // Secondary green
  },
} satisfies ChartConfig;
```

### 4. PublishStatusChart Component

**Purpose:** Bar chart untuk menampilkan publish status distribution.

**Props:**

```typescript
interface PublishStatusChartProps {
  data: PublishStatusData;
  onBarClick?: (status: "published" | "draft", contentType: string) => void;
  loading?: boolean;
}

interface PublishStatusData {
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
```

**Chart Config:**

- Grouped bar chart
- Green untuk published, orange untuk draft
- Labels di atas bars
- Clickable bars untuk navigation
- Legend di bottom

### 5. QuickActionsWidget Component

**Purpose:** Widget dengan shortcut buttons untuk create content.

**Props:**

```typescript
interface QuickActionsWidgetProps {
  onActionClick: (action: "product" | "recipe" | "publication") => void;
}
```

**Layout:**

```
┌─────────────────────────────────────┐
│  Quick Actions                      │
│                                     │
│  ┌──────────┐ ┌──────────┐ ┌─────┐│
│  │ 📦       │ │ 🍳       │ │ 📄  ││
│  │ Tambah   │ │ Tambah   │ │ Tam ││
│  │ Produk   │ │ Resep    │ │ Pub ││
│  └──────────┘ └──────────┘ └─────┘│
└─────────────────────────────────────┘
```

**Styling:**

- Large buttons dengan icon dan text
- Hover effect (scale, shadow)
- Brand colors per action type
- Responsive grid (3 cols desktop, 2 cols mobile)

### 6. RecentContentWidget Component

**Purpose:** List konten terbaru dengan quick actions.

**Props:**

```typescript
interface RecentContentWidgetProps {
  content: RecentContent[];
  onEdit: (id: string, type: ContentType) => void;
  onView: (id: string, type: ContentType) => void;
  onDelete: (id: string, type: ContentType) => void;
  loading?: boolean;
}

interface RecentContent {
  id: string;
  title: string;
  type: "product" | "recipe" | "publication";
  status: "published" | "draft";
  thumbnail?: string;
  lastModified: Date;
}

type ContentType = "product" | "recipe" | "publication";
```

**Layout:**

```
┌─────────────────────────────────────────────┐
│  Konten Terbaru              [Lihat Semua] │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ [IMG] Apel Fuji                     │   │
│  │       [Produk] [Published]          │   │
│  │       2 jam yang lalu               │   │
│  │       [👁️ View] [✏️ Edit] [🗑️ Delete]│   │
│  └─────────────────────────────────────┘   │
│  ... (4 more items)                         │
└─────────────────────────────────────────────┘
```

**Features:**

- Thumbnail dengan fallback icon
- Badge untuk type dan status
- Relative time (using date-fns)
- Hover effect untuk quick actions
- Empty state dengan CTA

### 7. ContentByCategoryWidget Component

**Purpose:** Grid cards menampilkan distribusi konten per kategori.

**Props:**

```typescript
interface ContentByCategoryWidgetProps {
  categories: CategoryData[];
  onCategoryClick: (category: string) => void;
  loading?: boolean;
}

interface CategoryData {
  name: string; // Apel, Jeruk, etc.
  count: number;
  icon?: string; // emoji or icon name
  percentage: number; // of total content
}
```

**Layout:**

```
┌─────────────────────────────────────────────┐
│  Konten per Kategori                        │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │ 🍎   │ │ 🍊   │ │ 🥭   │ │ 🍌   │      │
│  │ Apel │ │Jeruk │ │Mangga│ │Pisang│      │
│  │  24  │ │  18  │ │  15  │ │  12  │      │
│  │ ████ │ │ ███  │ │ ██   │ │ ██   │      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
└─────────────────────────────────────────────┘
```

**Features:**

- Emoji atau icon untuk setiap kategori
- Progress bar visual
- Clickable untuk filter
- Responsive grid (2-5 columns)

### 8. ActivityTimelineWidget Component

**Purpose:** Timeline aktivitas terbaru dengan infinite scroll.

**Props:**

```typescript
interface ActivityTimelineWidgetProps {
  activities: Activity[];
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
}

interface Activity {
  id: string;
  type: "create" | "update" | "delete";
  contentType: "product" | "recipe" | "publication";
  contentTitle: string;
  contentId?: string; // null if deleted
  user?: string;
  timestamp: Date;
}
```

**Layout:**

```
┌─────────────────────────────────────────────┐
│  Activity Timeline                          │
│                                             │
│  ● Produk "Apel Fuji" dibuat               │
│    2 jam yang lalu                          │
│                                             │
│  ● Resep "Jus Jeruk" diupdate              │
│    3 jam yang lalu                          │
│                                             │
│  ● Publikasi "Tips Buah" dihapus           │
│    5 jam yang lalu                          │
│                                             │
│  [Load More...]                             │
└─────────────────────────────────────────────┘
```

**Features:**

- Color-coded dots (green, blue, red)
- Relative timestamps
- Clickable items (except deleted)
- Infinite scroll with lazy loading
- Empty state

### 9. DateRangeFilter Component

**Purpose:** Filter untuk memilih date range.

**Props:**

```typescript
interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: DateRangePreset[];
}

interface DateRangePreset {
  label: string;
  value: "7d" | "30d" | "3m" | "custom";
  getRange: () => { from: Date; to: Date };
}
```

**UI:**

- Dropdown dengan presets
- Custom date picker (shadcn/ui Popover + Calendar)
- Apply button untuk custom range
- Clear button untuk reset

### 10. SearchBar Component

**Purpose:** Quick search dengan dropdown results.

**Props:**

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  onResultClick: (result: SearchResult) => void;
  placeholder?: string;
}

interface SearchResult {
  id: string;
  title: string;
  type: ContentType;
  thumbnail?: string;
  url: string;
}
```

**Features:**

- Debounced input (300ms)
- Dropdown results (max 10)
- Highlight search term
- Recent searches
- Keyboard navigation (arrow keys, enter)

## Data Models

### Dashboard Stats Model

```typescript
interface DashboardStats {
  metrics: {
    totalContent: number;
    activeContent: number;
    contentThisWeek: number;
    trends: {
      totalContent: TrendData;
      activeContent: TrendData;
      contentThisWeek: TrendData;
    };
  };
  analytics: {
    visitors: AnalyticsData[];
    pageViews: AnalyticsData[];
  };
  publishStatus: PublishStatusData;
  recentContent: RecentContent[];
  categories: CategoryData[];
  activities: Activity[];
}

interface TrendData {
  value: number; // percentage
  direction: "up" | "down" | "neutral";
  comparisonPeriod: string; // "vs minggu lalu"
}
```

### API Endpoints

**Dashboard:**

- `GET /api/dashboard/stats?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get all dashboard data
- `GET /api/dashboard/metrics?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get metrics only
- `GET /api/dashboard/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get analytics data
- `GET /api/dashboard/recent-content?limit=5` - Get recent content
- `GET /api/dashboard/activities?page=1&limit=10` - Get activity timeline
- `GET /api/dashboard/categories` - Get category distribution
- `POST /api/dashboard/export` - Export dashboard data

**Search:**

- `GET /api/search?q=query&limit=10` - Quick search across all content

**Analytics (Web Client):**

- `GET /api/analytics/visitors?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get visitor data
- `GET /api/analytics/pageviews?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get pageview data

## Error Handling

### Error Types

1. **Network Errors**

   - Show error state in affected widget
   - Retry button
   - Don't block other widgets

2. **Partial Data Errors**

   - Show available data
   - Error indicator for failed widgets
   - Auto-retry in background

3. **Auto-Refresh Errors**

   - Silent retry with exponential backoff
   - Show error indicator if persistent
   - Don't interrupt user

4. **Export Errors**
   - Toast notification with error message
   - Retry option
   - Suggest alternative format

### Loading States

1. **Initial Load**

   - Full page skeleton matching layout
   - Shimmer effect

2. **Widget Refresh**

   - Skeleton within widget
   - Preserve layout

3. **Auto-Refresh**

   - Subtle indicator (pulsing dot)
   - No skeleton (preserve data)

4. **Infinite Scroll**
   - Loading spinner at bottom
   - Smooth append

## Performance Optimization

### Data Fetching

1. **Parallel Requests**

   ```typescript
   const [metrics, analytics, content, activities] = await Promise.all([
     fetchMetrics(dateRange),
     fetchAnalytics(dateRange),
     fetchRecentContent(),
     fetchActivities(),
   ]);
   ```

2. **Incremental Updates**

   ```typescript
   // Only fetch changed data on auto-refresh
   const updates = await fetchIncrementalUpdates(lastFetchTimestamp);
   ```

3. **Caching**
   ```typescript
   // Use React Query or SWR
   const { data, isLoading } = useQuery(
     ["dashboard-metrics", dateRange],
     () => fetchMetrics(dateRange),
     { staleTime: 60000 } // 1 minute
   );
   ```

### Rendering

1. **Code Splitting**

   ```typescript
   const VisitorAnalyticsChart = lazy(() => import("./VisitorAnalyticsChart"));
   const ActivityTimeline = lazy(() => import("./ActivityTimeline"));
   ```

2. **Virtualization**

   ```typescript
   // For activity timeline
   import { useVirtualizer } from "@tanstack/react-virtual";
   ```

3. **Memoization**
   ```typescript
   const chartData = useMemo(
     () => transformAnalyticsData(analytics),
     [analytics]
   );
   ```

### Auto-Refresh

1. **Visibility API**

   ```typescript
   useEffect(() => {
     const handleVisibilityChange = () => {
       if (document.hidden) {
         pauseAutoRefresh();
       } else {
         resumeAutoRefresh();
         fetchLatestData();
       }
     };

     document.addEventListener("visibilitychange", handleVisibilityChange);
     return () =>
       document.removeEventListener("visibilitychange", handleVisibilityChange);
   }, []);
   ```

2. **Debounce User Interaction**
   ```typescript
   const debouncedRefresh = useMemo(
     () =>
       debounce(() => {
         if (!isUserInteracting) {
           refreshData();
         }
       }, 5 * 60 * 1000), // 5 minutes
     []
   );
   ```

## Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .widgets-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .widgets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .charts-grid {
    grid-template-columns: 7fr 5fr;
  }
  .widgets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### Mobile Optimizations

1. **Collapsible Widgets**

   - Widgets can be collapsed on mobile
   - Save state to localStorage

2. **Touch-Friendly**

   - Minimum 44x44px touch targets
   - Swipe gestures for navigation

3. **Simplified Charts**
   - Reduce data points on mobile
   - Horizontal scroll for wide charts

## Accessibility

### Keyboard Navigation

```typescript
// Example: MetricCard
<Card
  tabIndex={0}
  role="button"
  aria-label={`${title}: ${value}. ${trend?.label}`}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick?.();
    }
  }}
>
  {/* content */}
</Card>
```

### Screen Reader Support

```typescript
// Example: Chart
<div role="img" aria-label="Visitor analytics chart showing trend over time">
  <AreaChart {...props} />
  <table className="sr-only">
    <caption>Visitor data</caption>
    <thead>
      <tr>
        <th>Date</th>
        <th>Visitors</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.date}>
          <td>{item.date}</td>
          <td>{item.visitors}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### ARIA Live Regions

```typescript
// Auto-refresh indicator
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {isRefreshing ? "Refreshing dashboard data" : `Last updated ${lastUpdated}`}
</div>
```

## Testing Strategy

### Unit Tests

1. **Component Tests**

   - MetricCard rendering and interactions
   - Chart data transformation
   - Widget empty states
   - Date range filter logic

2. **Hook Tests**
   - useAutoRefresh behavior
   - useDashboardData fetching
   - useSearch debouncing

### Integration Tests

1. **User Flows**

   - Load dashboard → See all widgets
   - Change date range → Charts update
   - Search content → Navigate to result
   - Export data → Download file

2. **Auto-Refresh**
   - Auto-refresh triggers after 5 minutes
   - Pause on user inactive
   - Resume on visibility change

### E2E Tests (Optional)

1. **Critical Paths**
   - Dashboard loads successfully
   - Quick actions navigate correctly
   - Export generates file
   - Search returns results

## Wireframes

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Dashboard                    [📅 7 Days] [🔍] [🔄] [📥]     │
│  Welcome back, Admin          Last updated: 2m ago           │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Total    │  │ Konten   │  │ Konten   │                   │
│  │ Konten   │  │ Aktif    │  │ Minggu   │                   │
│  │   156    │  │   142    │  │ Ini: 12  │                   │
│  │ ↑ 12%    │  │ ↑ 8%     │  │ ↑ 20%    │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────┐  ┌──────────────────────┐   │
│  │ Visitor Analytics          │  │ Publish Status       │   │
│  │ [Line Chart]               │  │ [Bar Chart]          │   │
│  │                            │  │                      │   │
│  │                            │  │                      │   │
│  └────────────────────────────┘  └──────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ Quick Actions  │  │ Recent Content │  │ Activity      │ │
│  │ [3 buttons]    │  │ [5 items]      │  │ Timeline      │ │
│  │                │  │                │  │ [10 items]    │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Content by Category                                    │ │
│  │ [Grid of category cards]                               │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────┐
│ Dashboard      [☰]   │
│ [📅] [🔍] [🔄] [📥] │
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ Total Konten     │ │
│ │ 156  ↑ 12%       │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Konten Aktif     │ │
│ │ 142  ↑ 8%        │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Konten Minggu    │ │
│ │ 12   ↑ 20%       │ │
│ └──────────────────┘ │
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ Visitor Chart    │ │
│ │ [Scrollable]     │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Status Chart     │ │
│ └──────────────────┘ │
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ Quick Actions    │ │
│ │ [2x2 grid]       │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Recent Content   │ │
│ │ [Collapsed]      │ │
│ └──────────────────┘ │
└──────────────────────┘
```
