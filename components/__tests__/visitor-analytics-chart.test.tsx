/**
 * Visual and functional tests for VisitorAnalyticsChart
 *
 * To run these tests manually:
 * 1. Import the component in a test page
 * 2. Test each state (loading, error, empty, data)
 * 3. Verify responsive behavior
 * 4. Check tooltip interactions
 */

import VisitorAnalyticsChart from "../visitor-analytics-chart";

// Test data
export const mockVisitorData = [
  { date: "2024-01-01", visitors: 120, pageViews: 350 },
  { date: "2024-01-02", visitors: 150, pageViews: 420 },
  { date: "2024-01-03", visitors: 90, pageViews: 280 },
  { date: "2024-01-04", visitors: 180, pageViews: 520 },
  { date: "2024-01-05", visitors: 200, pageViews: 600 },
  { date: "2024-01-06", visitors: 170, pageViews: 480 },
  { date: "2024-01-07", visitors: 160, pageViews: 450 },
];

// Test cases for manual testing
export const testCases = {
  // 1. Loading state
  loading: {
    component: <VisitorAnalyticsChart loading={true} />,
    description: "Should show skeleton loader with shimmer effect",
  },

  // 2. Empty state
  empty: {
    component: <VisitorAnalyticsChart data={[]} />,
    description: "Should show empty state with icon and message",
  },

  // 3. Error state
  error: {
    component: (
      <VisitorAnalyticsChart error={new Error("Failed to fetch data")} />
    ),
    description: "Should show error state with error message",
  },

  // 4. Data state (normal)
  withData: {
    component: <VisitorAnalyticsChart data={mockVisitorData} />,
    description: "Should show line chart with visitor and page view data",
  },

  // 5. Data state (single day)
  singleDay: {
    component: (
      <VisitorAnalyticsChart
        data={[{ date: "2024-01-01", visitors: 100, pageViews: 300 }]}
      />
    ),
    description: "Should handle single data point gracefully",
  },

  // 6. Data state (large dataset)
  largeDataset: {
    component: (
      <VisitorAnalyticsChart
        data={Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          visitors: Math.floor(Math.random() * 200) + 50,
          pageViews: Math.floor(Math.random() * 600) + 150,
        }))}
      />
    ),
    description: "Should handle 30 days of data with proper x-axis labels",
  },
};

/**
 * Manual test checklist:
 *
 * Visual Tests:
 * □ Skeleton loader appears with shimmer animation
 * □ Empty state shows TrendingUp icon and message
 * □ Error state shows warning icon and error message
 * □ Chart displays with proper colors (blue for visitors, green for page views)
 * □ Chart has smooth curves (monotone interpolation)
 * □ Dots appear on data points
 * □ Grid lines are visible and properly styled
 *
 * Interaction Tests:
 * □ Hovering over data points shows tooltip
 * □ Tooltip displays formatted date (e.g., "12 Jan 2024")
 * □ Tooltip shows visitor count and page views
 * □ Tooltip follows cursor smoothly
 * □ Active dots enlarge on hover
 *
 * Responsive Tests:
 * □ Chart adapts to container width
 * □ Chart maintains aspect ratio
 * □ X-axis labels don't overlap on mobile
 * □ Tooltip is readable on all screen sizes
 *
 * Accessibility Tests:
 * □ Card has proper heading structure
 * □ Chart has accessibility layer enabled
 * □ Keyboard navigation works (if applicable)
 * □ Screen reader announces chart content
 */
