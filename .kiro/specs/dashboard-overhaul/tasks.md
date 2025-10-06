# Implementation Plan

- [x] 1. Setup and Dependencies

  - Install required packages (react-query/swr, date-fns, recharts updates)
  - Setup React Query or SWR for data fetching and caching
  - Create API route structure for dashboard endpoints
  - Setup analytics tracking infrastructure (if not exists)
  - _Requirements: All_

- [x] 2. Remove E-commerce Related Content

  - [x] 2.1 Remove "Stok Rendah" metric card

    - Remove from dashboardStats array
    - Remove from API response
    - _Requirements: Context_

  - [x] 2.2 Update terminology from "Sales" to "Content"

    - Rename SalesChart to ContentGrowthChart
    - Update chart titles and descriptions
    - _Requirements: Context_

  - [x] 2.3 Remove stock-related data from dashboard stats interface

    - Update DashboardStats TypeScript interface
    - Remove lowStockProducts field
    - _Requirements: Context_

-

- [x] 3. Create New Metric Cards

  - [x] 3.1 Create enhanced MetricCard component

    - Add trend indicator with arrow icon and percentage
    - Add hover tooltip with breakdown details
    - Add click handler for navigation
    - Implement skeleton loader
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [x] 3.2 Implement Total Konten metric

    - Calculate sum of all content types
    - Add trend comparison vs previous period
    - Add breakdown tooltip (X produk, Y resep, Z publikasi)
    - _Requirements: 1.1, 1.2_

  - [x] 3.3 Implement Konten Aktif metric

    - Count published content across all types
    - Add trend comparison
    - Add breakdown tooltip
    - _Requirements: 1.1, 1.2_

  - [x] 3.4 Implement Konten Minggu Ini metric

    - Count content created in last 7 days
    - Add trend comparison vs previous week
    - Add breakdown tooltip
    - _Requirements: 1.1, 1.2_

- [x] 4. Create Visitor Analytics Chart

  - [x] 4.1 Create VisitorAnalyticsChart component

    - Use Line chart from recharts/shadcn
    - Implement smooth curves with gradient fill
    - Add responsive margins and sizing
    - _Requirements: 2.1, 2.2_

  - [x] 4.2 Implement tooltip with date and visitor count

    - Format date properly (e.g., "12 Jan 2024")
    - Show visitor count and page views
    - _Requirements: 2.2, 2.6_

  - [x] 4.3 Add empty state for no analytics data

    - Show message "Belum ada data analytics"
    - Add illustration or icon
    - _Requirements: 2.4_

  - [x] 4.4 Implement skeleton loader

    - Match chart dimensions
    - Shimmer effect
    - _Requirements: 2.5_

  - [x] 4.5 Connect to analytics API endpoint

    - Create GET /api/analytics/visitors endpoint
    - Fetch data based on date range
    - Handle errors gracefully
    - _Requirements: 2.1, 2.2_

- [x] 5. Create Publish Status Chart

  - [x] 5.1 Create PublishStatusChart component

    - Use Bar chart from recharts/shadcn
    - Implement grouped bars (Published vs Draft)
    - Color code: green for published, orange for draft
    - _Requirements: 3.1, 3.2_

  - [x] 5.2 Add labels on top of bars

    - Show count numbers
    - Format properly
    - _Requirements: 3.2_

  - [x] 5.3 Implement click handler for navigation

    - Navigate to content list with filter
    - Pass status and content type as query params
    - _Requirements: 3.3_

  - [x] 5.4 Add hover tooltip with breakdown

    - Show detail per content type
    - Format nicely
    - _Requirements: 3.4_

  - [x] 5.5 Connect to API endpoint

    - Create endpoint to get publish status data
    - Group by content type and status
    - _Requirements: 3.1, 3.5_

- [ ] 6. Create Quick Actions Widget

  - [ ] 6.1 Create QuickActionsWidget component
    - Card container with title
    - Grid layout for action buttons
    - _Requirements: 5.1, 5.2_
  - [ ] 6.2 Create action buttons
    - Tambah Produk (Package icon, primary color)
    - Tambah Resep (CookingPot icon, secondary color)
    - Tambah Publikasi (FileText icon, accent color)
    - _Requirements: 5.2_
  - [ ] 6.3 Implement hover effects
    - Scale transform
    - Shadow increase
    - Smooth transition
    - _Requirements: 5.4_
  - [ ] 6.4 Implement navigation on click
    - Navigate to respective add pages
    - _Requirements: 5.3_
  - [ ] 6.5 Make responsive
    - 3 columns on desktop
    - 2 columns on tablet
    - 1-2 columns on mobile
    - _Requirements: 5.5, 12.1_

- [ ] 7. Create Recent Content Widget

  - [ ] 7.1 Create RecentContentWidget component
    - Card container with title and "Lihat Semua" link
    - List layout for content items
    - _Requirements: 4.1, 4.2_
  - [ ] 7.2 Create RecentContentItem component
    - Thumbnail with fallback icon
    - Title (clickable)
    - Content type badge
    - Status badge
    - Last modified date (relative time using date-fns)
    - Quick action buttons (View, Edit, Delete)
    - _Requirements: 4.2_
  - [ ] 7.3 Implement thumbnail display
    - Show image if available
    - Fallback to icon based on content type
    - Proper aspect ratio and sizing
    - _Requirements: 4.2_
  - [ ] 7.4 Implement relative time display
    - Use date-fns formatDistanceToNow
    - Show "2 jam yang lalu", "3 hari yang lalu", etc.
    - _Requirements: 4.2_
  - [ ] 7.5 Implement quick actions
    - View: open preview modal or navigate to detail
    - Edit: navigate to edit page
    - Delete: show confirm dialog
    - _Requirements: 4.4, 4.5_
  - [ ] 7.6 Add empty state
    - Show when no content exists
    - Add CTA "Buat Konten Pertama"
    - _Requirements: 4.7_
  - [ ] 7.7 Connect to API endpoint
    - Create GET /api/dashboard/recent-content endpoint
    - Fetch 5 most recent content
    - Include all content types
    - _Requirements: 4.1_

- [ ] 8. Create Content by Category Widget

  - [ ] 8.1 Create ContentByCategoryWidget component
    - Card container with title
    - Grid layout for category cards
    - _Requirements: 6.1, 6.2_
  - [ ] 8.2 Create CategoryCard component
    - Emoji or icon for fruit category
    - Category name
    - Count number (large and bold)
    - Progress bar or visual indicator
    - _Requirements: 6.3_
  - [ ] 8.3 Implement click handler
    - Navigate to products page with category filter
    - _Requirements: 6.4_
  - [ ] 8.4 Implement hover effect
    - Background color change
    - Shadow increase
    - _Requirements: 6.5_
  - [ ] 8.5 Handle empty categories
    - Show "0" with different styling
    - Still clickable
    - _Requirements: 6.6_
  - [ ] 8.6 Make responsive grid
    - 5 columns on large desktop
    - 3-4 columns on desktop
    - 2-3 columns on tablet
    - 2 columns on mobile
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ] 8.7 Connect to API endpoint
    - Create GET /api/dashboard/categories endpoint
    - Count content per category
    - Calculate percentages
    - _Requirements: 6.1_

- [ ] 9. Create Activity Timeline Widget

  - [ ] 9.1 Create ActivityTimelineWidget component
    - Card container with title
    - Scrollable list container
    - _Requirements: 7.1, 7.2_
  - [ ] 9.2 Create ActivityItem component
    - Color-coded dot (green: create, blue: update, red: delete)
    - Activity description
    - User name (if available)
    - Relative timestamp
    - _Requirements: 7.2_
  - [ ] 9.3 Implement click handler
    - Navigate to content (if not deleted)
    - Show disabled state for deleted content
    - _Requirements: 7.3, 7.6_
  - [ ] 9.4 Implement infinite scroll
    - Use intersection observer
    - Load more button or auto-load
    - Show loading spinner
    - _Requirements: 7.4_
  - [ ] 9.5 Add empty state
    - Show when no activities
    - _Requirements: 7.5_
  - [ ] 9.6 Connect to API endpoint
    - Create GET /api/dashboard/activities endpoint
    - Support pagination (page, limit)
    - Return activity log with details
    - _Requirements: 7.1, 7.4_

- [ ] 10. Implement Date Range Filter

  - [ ] 10.1 Create DateRangeFilter component
    - Dropdown with preset options
    - Custom date picker option
    - Apply and Clear buttons
    - _Requirements: 8.1, 8.2_
  - [ ] 10.2 Implement preset options
    - 7 Hari Terakhir (default)
    - 30 Hari Terakhir
    - 3 Bulan Terakhir
    - Custom Range
    - _Requirements: 8.2_
  - [ ] 10.3 Implement custom date picker
    - Use shadcn/ui Popover + Calendar
    - Date range selection
    - Validation (start <= end)
    - _Requirements: 8.4, 8.6_
  - [ ] 10.4 Implement onChange handler
    - Update all affected components
    - Show loading states
    - Fetch new data
    - _Requirements: 8.3, 8.5_
  - [ ] 10.5 Implement localStorage persistence
    - Save selected date range
    - Restore on page load
    - _Requirements: 8.5, 8.7_
  - [ ] 10.6 Add validation and error handling
    - Validate date range
    - Show error message for invalid range
    - _Requirements: 8.6_

- [ ] 11. Implement Search Functionality

  - [ ] 11.1 Create SearchBar component
    - Input with search icon
    - Dropdown for results
    - Loading indicator
    - _Requirements: 10.1, 10.2_
  - [ ] 11.2 Implement debounced search
    - Debounce input (300ms)
    - Cancel previous requests
    - _Requirements: 10.2_
  - [ ] 11.3 Create SearchResults dropdown
    - List of results (max 10)
    - Thumbnail, title, type badge
    - Quick actions (View, Edit)
    - Highlight search term
    - _Requirements: 10.3_
  - [ ] 11.4 Implement result click handler
    - Navigate to detail/edit page
    - Close dropdown
    - _Requirements: 10.4_
  - [ ] 11.5 Implement Enter key handler
    - Navigate to full search results page
    - Pass query as param
    - _Requirements: 10.5_
  - [ ] 11.6 Add empty state
    - Show "Tidak ada hasil" message
    - Add suggestion
    - _Requirements: 10.6_
  - [ ] 11.7 Implement recent searches
    - Show when search bar focused
    - Store in localStorage (max 5)
    - Clickable to re-search
    - _Requirements: 10.7_
  - [ ] 11.8 Create search API endpoint
    - Create GET /api/search endpoint
    - Search across all content types
    - Support limit parameter
    - Return relevant fields
    - _Requirements: 10.1, 10.2_

- [ ] 12. Implement Auto-Refresh

  - [ ] 12.1 Create useAutoRefresh hook
    - Setup interval (5 minutes)
    - Pause/resume functionality
    - Cleanup on unmount
    - _Requirements: 9.1, 9.2_
  - [ ] 12.2 Implement visibility change detection
    - Use document.visibilitychange event
    - Pause when tab hidden
    - Resume and fetch when tab visible
    - _Requirements: 9.4_
  - [ ] 12.3 Implement user interaction detection
    - Track mouse/keyboard events
    - Pause refresh during interaction
    - Resume after idle period
    - _Requirements: 9.2_
  - [ ] 12.4 Implement incremental data fetching
    - Fetch only changed data
    - Use lastFetchTimestamp parameter
    - Merge with existing data
    - _Requirements: 9.2, 14.2_
  - [ ] 12.5 Implement error handling with backoff
    - Retry on network error
    - Exponential backoff (1s, 2s, 4s, 8s)
    - Max retry attempts
    - _Requirements: 9.5_
  - [ ] 12.6 Create auto-refresh indicator
    - Pulsing dot or icon
    - "Last updated: X ago" text
    - Show in header
    - _Requirements: 9.7_
  - [ ] 12.7 Implement manual refresh button
    - Force refresh all data
    - Show loading state
    - Update last updated time
    - _Requirements: 9.6_

- [ ] 13. Implement Export Functionality

  - [ ] 13.1 Create ExportButton component
    - Dropdown menu with format options
    - CSV, PDF, Excel options
    - Loading state
    - _Requirements: 11.1, 11.2_
  - [ ] 13.2 Implement CSV export
    - Generate CSV from dashboard data
    - Include metrics, charts data, recent content
    - Auto-download with proper filename
    - _Requirements: 11.3, 11.4_
  - [ ] 13.3 Implement PDF export
    - Generate PDF with charts as images
    - Include header with logo and date range
    - Include all sections
    - Include footer with timestamp
    - _Requirements: 11.3, 11.6_
  - [ ] 13.4 Implement Excel export (optional)
    - Generate XLSX file
    - Multiple sheets for different data
    - _Requirements: 11.2_
  - [ ] 13.5 Add error handling
    - Show error toast on failure
    - Retry option
    - Suggest alternative format
    - _Requirements: 11.5_
  - [ ] 13.6 Create export API endpoint
    - Create POST /api/dashboard/export endpoint
    - Accept format and date range
    - Generate file server-side
    - Return file URL or stream
    - _Requirements: 11.1, 11.2_

- [ ] 14. Implement Responsive Design

  - [ ] 14.1 Update metrics section layout
    - 3 columns on desktop (> 1024px)
    - 2 columns on tablet (768px - 1024px)
    - 1 column on mobile (< 768px)
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ] 14.2 Update charts section layout
    - Side by side on desktop (7-5 grid)
    - Stacked on tablet and mobile
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ] 14.3 Update widgets section layout
    - 2 columns grid on desktop
    - 2 columns on tablet
    - 1 column on mobile
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ] 14.4 Make search bar responsive
    - Full width on mobile
    - Collapse to icon button option
    - _Requirements: 12.4_
  - [ ] 14.5 Make date range filter responsive
    - Use native date picker on mobile
    - Simplified UI
    - _Requirements: 12.5_
  - [ ] 14.6 Make export button responsive
    - Simplified menu on mobile
    - Icon only option
    - _Requirements: 12.6_
  - [ ] 14.7 Make charts touch-friendly
    - Enable touch interactions
    - Pinch to zoom (optional)
    - Swipe for horizontal scroll
    - _Requirements: 12.7_

- [ ] 15. Implement Loading States

  - [ ] 15.1 Create DashboardSkeleton component
    - Full page skeleton matching layout
    - Skeleton for metrics cards
    - Skeleton for charts
    - Skeleton for widgets
    - _Requirements: 13.1_
  - [ ] 15.2 Create widget-specific skeletons
    - MetricCardSkeleton
    - ChartSkeleton
    - RecentContentSkeleton
    - ActivityTimelineSkeleton
    - _Requirements: 13.2_
  - [ ] 15.3 Implement shimmer effect
    - Animated gradient
    - Smooth animation
    - _Requirements: 13.1_
  - [ ] 15.4 Implement loading states for auto-refresh
    - Subtle indicator (no skeleton)
    - Preserve existing data
    - _Requirements: 13.2_

- [ ] 16. Implement Error Handling

  - [ ] 16.1 Create error states for widgets
    - Error icon and message
    - Retry button
    - Suggestion text
    - _Requirements: 13.3, 13.4_
  - [ ] 16.2 Implement partial data handling
    - Show available data
    - Error indicator for failed widgets
    - Don't block other widgets
    - _Requirements: 13.5_
  - [ ] 16.3 Implement auto-refresh error handling
    - Silent retry with backoff
    - Subtle error indicator if persistent
    - Don't interrupt user
    - _Requirements: 13.6_
  - [ ] 16.4 Implement offline detection
    - Detect network offline
    - Show offline banner
    - Pause auto-refresh
    - Resume when online
    - _Requirements: 13.7_

- [ ] 17. Implement Performance Optimizations

  - [ ] 17.1 Setup React Query or SWR
    - Configure cache times
    - Setup stale-while-revalidate
    - Configure retry logic
    - _Requirements: 14.2_
  - [ ] 17.2 Implement parallel data fetching
    - Use Promise.all for independent requests
    - Fetch metrics, analytics, content simultaneously
    - _Requirements: 14.2_
  - [ ] 17.3 Implement code splitting
    - Lazy load chart components
    - Lazy load heavy widgets
    - Use React.lazy and Suspense
    - _Requirements: 14.3_
  - [ ] 17.4 Implement memoization
    - Memoize chart data transformations
    - Memoize expensive calculations
    - Use useMemo and useCallback
    - _Requirements: 14.3_
  - [ ] 17.5 Implement virtualization for activity timeline
    - Use @tanstack/react-virtual
    - Render only visible items
    - _Requirements: 14.3_
  - [ ] 17.6 Optimize images
    - Use Next.js Image component
    - Lazy load below-fold images
    - Proper sizing and formats
    - _Requirements: 14.5_
  - [ ] 17.7 Implement debouncing and throttling
    - Debounce search input
    - Throttle scroll events
    - Debounce resize events
    - _Requirements: 14.3_

- [ ] 18. Implement Accessibility

  - [ ] 18.1 Add keyboard navigation
    - Tab through all interactive elements
    - Enter/Space to activate buttons
    - Arrow keys for charts (optional)
    - Escape to close modals/dropdowns
    - _Requirements: 15.1_
  - [ ] 18.2 Add ARIA labels and roles
    - Label all icon buttons
    - Add roles to custom components
    - Add aria-live for dynamic updates
    - _Requirements: 15.2_
  - [ ] 18.3 Implement focus management
    - Visible focus indicators
    - Focus trap in modals
    - Return focus after modal close
    - _Requirements: 15.3_
  - [ ] 18.4 Add alternative text
    - Alt text for all images
    - Data table alternative for charts
    - Descriptive labels
    - _Requirements: 15.2, 15.6_
  - [ ] 18.5 Ensure color contrast
    - Check all text meets WCAG AA (4.5:1)
    - Don't rely on color alone
    - Test with color blindness simulator
    - _Requirements: 15.5_
  - [ ] 18.6 Implement reduced motion support
    - Respect prefers-reduced-motion
    - Disable animations if preferred
    - _Requirements: 15.7_

- [ ] 19. Create API Endpoints

  - [ ] 19.1 Create GET /api/dashboard/stats endpoint
    - Accept from and to date parameters
    - Return all dashboard data
    - Optimize query performance
    - _Requirements: All_
  - [ ] 19.2 Create GET /api/dashboard/metrics endpoint
    - Return metrics with trends
    - Calculate comparison with previous period
    - _Requirements: 1.1, 1.2_
  - [ ] 19.3 Create GET /api/analytics/visitors endpoint
    - Return visitor data for date range
    - Group by day
    - Include page views
    - _Requirements: 2.1, 2.2_
  - [ ] 19.4 Create GET /api/dashboard/recent-content endpoint
    - Return 5 most recent content
    - Include all content types
    - Include thumbnail, status, dates
    - _Requirements: 4.1_
  - [ ] 19.5 Create GET /api/dashboard/activities endpoint
    - Return activity log with pagination
    - Include user, action, content details
    - Support page and limit params
    - _Requirements: 7.1, 7.4_
  - [ ] 19.6 Create GET /api/dashboard/categories endpoint
    - Return content count per category
    - Calculate percentages
    - _Requirements: 6.1_
  - [ ] 19.7 Create GET /api/search endpoint
    - Search across all content types
    - Support limit parameter
    - Return relevant fields
    - Highlight search term (optional)
    - _Requirements: 10.1, 10.2_
  - [ ] 19.8 Create POST /api/dashboard/export endpoint
    - Accept format (csv, pdf, excel) and date range
    - Generate file server-side
    - Return file URL or stream
    - _Requirements: 11.1, 11.2_

- [ ] 20. Testing and Polish

  - [ ] 20.1 Test all user flows
    - Load dashboard
    - Change date range
    - Search content
    - Use quick actions
    - Export data
    - _Requirements: All_
  - [ ] 20.2 Test auto-refresh behavior
    - Verify 5-minute interval
    - Test pause on inactive
    - Test resume on visibility change
    - _Requirements: 9.1, 9.2, 9.4_
  - [ ] 20.3 Test responsive design
    - Test on mobile devices
    - Test on tablets
    - Test on different desktop sizes
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ] 20.4 Test error scenarios
    - Network errors
    - API errors
    - Partial data failures
    - Offline mode
    - _Requirements: 13.3, 13.4, 13.5, 13.7_
  - [ ] 20.5 Test performance
    - Measure initial load time
    - Check for memory leaks
    - Test with large datasets
    - Profile rendering performance
    - _Requirements: 14.1, 14.2, 14.3_
  - [ ] 20.6 Test accessibility
    - Keyboard navigation
    - Screen reader compatibility
    - Color contrast
    - Focus management
    - _Requirements: 15.1, 15.2, 15.3, 15.5_
  - [ ] 20.7 Cross-browser testing
    - Test on Chrome, Firefox, Safari, Edge
    - Fix any browser-specific issues
    - _Requirements: All_
  - [ ] 20.8 Polish animations and transitions
    - Smooth transitions
    - Consistent timing
    - No janky animations
    - _Requirements: All_

- [ ] 21. Documentation
  - [ ] 21.1 Document API endpoints
    - Request/response formats
    - Parameters and validation
    - Error responses
    - Examples
    - _Requirements: All_
  - [ ] 21.2 Document components
    - Props interfaces
    - Usage examples
    - JSDoc comments
    - _Requirements: All_
  - [ ] 21.3 Create user guide
    - How to use dashboard features
    - How to interpret metrics
    - How to export data
    - Screenshots
    - _Requirements: All_
  - [ ] 21.4 Document performance optimizations
    - Caching strategy
    - Auto-refresh behavior
    - Best practices
    - _Requirements: 14.1, 14.2, 14.3_
