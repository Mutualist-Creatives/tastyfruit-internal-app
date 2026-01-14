# Quick Start: Publish Status Chart

Get the Publish Status Chart up and running in your dashboard in 5 minutes!

## 🚀 1-Minute Integration

Add this to your dashboard page:

```tsx
import PublishStatusChartDemo from "@/components/publish-status-chart-demo";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <PublishStatusChartDemo />
    </div>
  );
}
```

That's it! The chart will automatically fetch and display your content's publish status.

## 📊 Side-by-Side with Visitor Analytics

For the recommended layout (7-5 grid):

```tsx
import VisitorAnalyticsChartDemo from "@/components/visitor-analytics-chart-demo";
import PublishStatusChartDemo from "@/components/publish-status-chart-demo";

export default function DashboardPage() {
  const dateRange = {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  };

  return (
    <div className="p-6">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <VisitorAnalyticsChartDemo dateRange={dateRange} />
        </div>
        <div className="lg:col-span-5">
          <PublishStatusChartDemo dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
}
```

## 🎯 What You Get

- ✅ **Grouped Bar Chart**: Published vs Draft for each content type
- ✅ **Color Coded**: Green for published, orange for draft
- ✅ **Interactive**: Click bars to navigate to filtered content lists
- ✅ **Tooltips**: Hover to see detailed breakdown
- ✅ **Labels**: Count numbers on top of each bar
- ✅ **Loading States**: Skeleton loader while fetching
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Empty State**: Helpful message when no data
- ✅ **Responsive**: Works on all screen sizes

## 🔌 API Endpoint

The chart automatically uses this endpoint:

```
GET /api/dashboard/publish-status
```

Optional query parameters:

- `from`: Start date (ISO string)
- `to`: End date (ISO string)

Example response:

```json
{
  "products": { "published": 24, "draft": 6 },
  "recipes": { "published": 18, "draft": 4 },
  "publications": { "published": 15, "draft": 8 }
}
```

## 🧪 Test It

1. **Start your dev server**:

   ```bash
   npm run dev
   ```

2. **Test the API**:

   ```bash
   curl http://localhost:3000/api/dashboard/publish-status
   ```

3. **View in browser**:
   Navigate to your dashboard page

## 🎨 Customize

### Change Colors

Edit `components/publish-status-chart.tsx`:

```typescript
const chartConfig = {
  published: {
    label: "Published",
    color: "hsl(142, 76%, 36%)", // Your green
  },
  draft: {
    label: "Draft",
    color: "hsl(38, 92%, 50%)", // Your orange
  },
};
```

### Custom Navigation

Edit `components/publish-status-chart-demo.tsx`:

```typescript
const handleBarClick = (status: "published" | "draft", contentType: string) => {
  // Your custom logic
  console.log(`Clicked ${status} for ${contentType}`);
};
```

## 📱 Responsive Layouts

### Full Width

```tsx
<div className="w-full">
  <PublishStatusChartDemo />
</div>
```

### Two Column Grid

```tsx
<div className="grid gap-4 md:grid-cols-2">
  <VisitorAnalyticsChartDemo />
  <PublishStatusChartDemo />
</div>
```

### Three Column Grid (with Metric Cards)

```tsx
<div className="space-y-4">
  {/* Metric Cards */}
  <div className="grid gap-4 md:grid-cols-3">
    <MetricCard {...} />
    <MetricCard {...} />
    <MetricCard {...} />
  </div>

  {/* Charts */}
  <div className="grid gap-4 lg:grid-cols-12">
    <div className="lg:col-span-7">
      <VisitorAnalyticsChartDemo />
    </div>
    <div className="lg:col-span-5">
      <PublishStatusChartDemo />
    </div>
  </div>
</div>
```

## 🔍 Troubleshooting

### Chart shows "Belum ada data konten"

- Check if you have content in your database
- Verify the API endpoint returns data
- Check browser console for errors

### Navigation not working

- Ensure content list pages exist at:
  - `/dashboard/products`
  - `/dashboard/recipes`
  - `/dashboard/publications`
- Verify pages handle `?status=published` or `?status=draft` query params

### Styling looks off

- Ensure Tailwind CSS is configured
- Verify shadcn/ui components are installed
- Check if chart colors are in your theme

## 📚 More Information

- **Full Integration Guide**: `components/PUBLISH-STATUS-INTEGRATION.md`
- **Visual Guide**: `TASK-5-VISUAL-GUIDE.md`
- **Completion Summary**: `TASK-5-COMPLETION-SUMMARY.md`
- **Design Spec**: `.kiro/specs/dashboard-overhaul/design.md`

## ✨ Next Steps

1. ✅ Add chart to dashboard
2. ⬜ Implement status filtering on content pages
3. ⬜ Add date range filter
4. ⬜ Test with real data
5. ⬜ Customize colors to match your brand

---

**Need help?** Check the integration guide or visual guide for more details!
