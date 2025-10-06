# Task 4: Visitor Analytics Chart - Visual Guide

## 🎨 Component States Preview

### 1. Loading State

```
┌─────────────────────────────────────────────┐
│ [████████████████]  ← Shimmer animation     │
│ [████████████████████]                      │
│                                             │
│ [█████████████████████████████████████████] │
│ [█████████████████████████████████████████] │
│ [█████████████████████████████████████████] │
│ [█████████████████████████████████████████] │
│                                             │
└─────────────────────────────────────────────┘
```

### 2. Empty State

```
┌─────────────────────────────────────────────┐
│ Analytics Pengunjung                        │
│ Trend pengunjung dan page views web client  │
│                                             │
│              📈 TrendingUp Icon             │
│                                             │
│         Belum ada data analytics            │
│                                             │
│   Data pengunjung akan muncul setelah       │
│   web client mulai dikunjungi               │
│                                             │
└─────────────────────────────────────────────┘
```

### 3. Error State

```
┌─────────────────────────────────────────────┐
│ Analytics Pengunjung                        │
│ Trend pengunjung dan page views web client  │
│                                             │
│              ⚠️  Warning Icon               │
│                                             │
│        Gagal memuat data analytics          │
│                                             │
│        Failed to fetch visitor data         │
│                                             │
└─────────────────────────────────────────────┘
```

### 4. Data State (Normal)

```
┌─────────────────────────────────────────────┐
│ Analytics Pengunjung                        │
│ Trend pengunjung dan page views web client  │
│                                             │
│  600│                          ●────●       │
│     │                    ●────●             │
│  400│              ●────●                   │
│     │        ●────●                         │
│  200│  ●────●                               │
│     │                                       │
│    0└─────────────────────────────────────  │
│      01 Jan  02 Jan  03 Jan  04 Jan  05 Jan│
│                                             │
│      ● Pengunjung    ● Page Views          │
└─────────────────────────────────────────────┘
```

### 5. Tooltip Interaction

```
┌─────────────────────────────────────────────┐
│ Analytics Pengunjung                        │
│                                             │
│  600│              ┌──────────────────┐     │
│     │              │ 12 Jan 2024      │     │
│  400│              │ Pengunjung: 150  │●    │
│     │              │ Page Views: 420  │     │
│  200│              └──────────────────┘     │
│     │        ●────●                         │
│    0└─────────────────────────────────────  │
│      01 Jan  02 Jan  03 Jan  04 Jan  05 Jan│
└─────────────────────────────────────────────┘
```

## 🎯 Chart Features

### Line Styles

- **Visitors Line**:

  - Color: Blue (`hsl(221, 100%, 46%)`)
  - Stroke width: 2px
  - Curve: Smooth (monotone)
  - Dots: 4px (6px on hover)

- **Page Views Line**:
  - Color: Green (`hsl(75, 98%, 57%)`)
  - Stroke width: 2px
  - Curve: Smooth (monotone)
  - Dots: 4px (6px on hover)

### Grid & Axes

- **Grid**: Dashed lines (3-3 pattern), vertical lines hidden
- **X-Axis**: Date labels, no tick lines, 8px margin
- **Y-Axis**: Auto-scaled based on data

### Tooltip

- **Trigger**: Hover over data points
- **Content**:
  - Formatted date (e.g., "12 Jan 2024")
  - Visitor count with label
  - Page views count with label
- **Style**: White background, border, shadow

## 📐 Responsive Behavior

### Desktop (> 1024px)

```
┌────────────────────────────────────────────────────────┐
│  Full width chart with all labels visible             │
│  Margins: 12px all sides                               │
│  Aspect ratio: 16:9 (video aspect)                     │
└────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)

```
┌──────────────────────────────────────────┐
│  Slightly compressed chart               │
│  Labels may rotate or skip               │
│  Maintains readability                   │
└──────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌────────────────────────────┐
│  Compact chart             │
│  Fewer x-axis labels       │
│  Touch-friendly dots       │
│  Scrollable if needed      │
└────────────────────────────┘
```

## 🔄 State Transitions

```
Initial Load
    ↓
[Loading State] ← Skeleton with shimmer
    ↓
Fetch Data
    ↓
    ├─→ Success → [Data State] ← Chart with data
    ├─→ Empty → [Empty State] ← No data message
    └─→ Error → [Error State] ← Error message
```

## 🎨 Color Palette

```
Primary Blue (Visitors)
━━━━━━━━━━━━━━━━━━━━
hsl(221, 100%, 46%)
RGB: 0, 94, 235
Hex: #005EEB

Secondary Green (Page Views)
━━━━━━━━━━━━━━━━━━━━
hsl(75, 98%, 57%)
RGB: 226, 245, 7
Hex: #E2F507

Muted (Skeleton/Empty)
━━━━━━━━━━━━━━━━━━━━
CSS: bg-muted
Tailwind: muted

Destructive (Error)
━━━━━━━━━━━━━━━━━━━━
CSS: text-destructive
Tailwind: destructive
```

## 📊 Data Format

### Input Data Structure

```typescript
interface AnalyticsData {
  date: string; // ISO date: "2024-01-01"
  visitors: number; // Integer: 150
  pageViews: number; // Integer: 450
}
```

### Example Data

```json
[
  { "date": "2024-01-01", "visitors": 120, "pageViews": 350 },
  { "date": "2024-01-02", "visitors": 150, "pageViews": 420 },
  { "date": "2024-01-03", "visitors": 90, "pageViews": 280 },
  { "date": "2024-01-04", "visitors": 180, "pageViews": 520 },
  { "date": "2024-01-05", "visitors": 200, "pageViews": 600 }
]
```

## 🔌 Integration Example

### Step 1: Import Component

```tsx
import VisitorAnalyticsChartDemo from "@/components/visitor-analytics-chart-demo";
```

### Step 2: Define Date Range

```tsx
const [dateRange, setDateRange] = useState({
  from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  to: new Date(),
});
```

### Step 3: Render Component

```tsx
<VisitorAnalyticsChartDemo dateRange={dateRange} />
```

### Complete Example

```tsx
"use client";

import { useState } from "react";
import VisitorAnalyticsChartDemo from "@/components/visitor-analytics-chart-demo";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <VisitorAnalyticsChartDemo dateRange={dateRange} />
        {/* Other charts */}
      </div>
    </div>
  );
}
```

## 🧪 Testing Scenarios

### Scenario 1: Normal Operation

```tsx
// 7 days of data
<VisitorAnalyticsChartDemo
  dateRange={{
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  }}
/>
```

### Scenario 2: Long Period (30 days)

```tsx
// 30 days of data
<VisitorAnalyticsChartDemo
  dateRange={{
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  }}
/>
```

### Scenario 3: Custom Range

```tsx
// Specific date range
<VisitorAnalyticsChartDemo
  dateRange={{
    from: new Date("2024-01-01"),
    to: new Date("2024-01-31"),
  }}
/>
```

### Scenario 4: Manual States

```tsx
// Test loading
<VisitorAnalyticsChart loading={true} />

// Test empty
<VisitorAnalyticsChart data={[]} />

// Test error
<VisitorAnalyticsChart error={new Error("Network error")} />
```

## ✅ Visual Checklist

Before deploying, verify:

- [ ] Loading skeleton appears smoothly
- [ ] Shimmer animation is visible
- [ ] Empty state icon is centered
- [ ] Empty state message is clear
- [ ] Error state shows warning icon
- [ ] Error message is readable
- [ ] Chart lines are smooth (not jagged)
- [ ] Chart colors match design (blue & green)
- [ ] Dots appear on data points
- [ ] Dots enlarge on hover
- [ ] Tooltip appears on hover
- [ ] Tooltip shows formatted date
- [ ] Tooltip shows both metrics
- [ ] X-axis labels are readable
- [ ] Y-axis scales appropriately
- [ ] Grid lines are subtle
- [ ] Chart is responsive on mobile
- [ ] Chart is responsive on tablet
- [ ] Chart is responsive on desktop
- [ ] No console errors
- [ ] No TypeScript errors

## 🎉 Ready to Deploy!

Once all checklist items are verified, the component is ready for production use in the dashboard.
