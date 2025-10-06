# Task 3: Visual Guide - New Metric Cards

## What You'll See

### Desktop Layout (3 columns)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ Total Konten  📦 │  │ Konten Aktif  ✓ │  │ Konten Minggu 📅 │ │
│  │                  │  │                  │  │ Ini              │ │
│  │ 156              │  │ 142              │  │ 12               │ │
│  │                  │  │                  │  │                  │ │
│  │ Semua jenis      │  │ Konten yang      │  │ Dibuat dalam 7   │ │
│  │ konten           │  │ dipublikasi      │  │ hari terakhir    │ │
│  │                  │  │                  │  │                  │ │
│  │ ↑ 12% vs periode │  │ ↑ 8% vs periode  │  │ ↑ 20% vs minggu  │ │
│  │ sebelumnya       │  │ sebelumnya       │  │ lalu             │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Hover State - Tooltip Breakdown

```
┌──────────────────┐
│ Total Konten  📦 │
│                  │  ┌─────────────────┐
│ 156              │  │ Breakdown:      │
│                  │  │                 │
│ Semua jenis      │  │ 45 produk       │
│ konten           │  │ 67 resep        │
│                  │  │ 44 publikasi    │
│ ↑ 12% vs periode │  └─────────────────┘
│ sebelumnya       │
└──────────────────┘
```

### Loading State - Skeleton

```
┌──────────────────┐
│ ████████      ⬜ │  ← Skeleton for title and icon
│                  │
│ ████             │  ← Skeleton for value
│                  │
│ ████████████     │  ← Skeleton for subtitle
│                  │
│ ████████         │  ← Skeleton for trend
└──────────────────┘
```

### Mobile Layout (1 column)

```
┌──────────────────┐
│ Total Konten  📦 │
│                  │
│ 156              │
│                  │
│ Semua jenis      │
│ konten           │
│                  │
│ ↑ 12% vs periode │
│ sebelumnya       │
└──────────────────┘

┌──────────────────┐
│ Konten Aktif  ✓  │
│                  │
│ 142              │
│                  │
│ Konten yang      │
│ dipublikasi      │
│                  │
│ ↑ 8% vs periode  │
│ sebelumnya       │
└──────────────────┘

┌──────────────────┐
│ Konten Minggu 📅 │
│ Ini              │
│                  │
│ 12               │
│                  │
│ Dibuat dalam 7   │
│ hari terakhir    │
│                  │
│ ↑ 20% vs minggu  │
│ lalu             │
└──────────────────┘
```

## Color Scheme

### Brand Colors (TastyFruit)

- **Primary Blue**: `#003CE9` - Used for icons, values, and accents
- **Secondary Green**: `#B5FE28` - Used for success states
- **Background**: White cards with subtle shadows

### Trend Colors

- **Up (Positive)**: Green (`text-green-600`)
- **Down (Negative)**: Red (`text-red-600`)
- **Neutral**: Gray (`text-gray-600`)

## Interactive States

### 1. Default State

- Clean white card
- Subtle shadow
- Icon in light blue circle

### 2. Hover State

- Increased shadow (elevation)
- Slight scale up (1.02x)
- Tooltip appears (if breakdown provided)
- Smooth transition (200ms)

### 3. Click State (if onClick provided)

- Cursor changes to pointer
- Card is clickable
- Navigates to detail view

### 4. Loading State

- Skeleton animation
- Shimmer effect
- Preserves layout

## Typography

### Title

- Font: Medium weight
- Size: Small (text-sm)
- Color: Default text

### Value

- Font: Bold
- Size: Extra large (text-3xl)
- Color: Primary blue (#003CE9)

### Subtitle

- Font: Regular
- Size: Extra small (text-xs)
- Color: Muted foreground

### Trend

- Font: Medium (percentage), Regular (label)
- Size: Extra small (text-xs)
- Color: Dynamic (green/red/gray)

## Icons Used

1. **Total Konten**: `Package` (Lucide)
2. **Konten Aktif**: `FileCheck` (Lucide)
3. **Konten Minggu Ini**: `Calendar` (Lucide)

### Trend Icons

- **Up**: `TrendingUp` arrow
- **Down**: `TrendingDown` arrow
- **Neutral**: `Minus` line

## Responsive Breakpoints

```css
/* Mobile: < 768px */
.metrics-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet: 768px - 1024px */
@media (min-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: > 1024px */
@media (min-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Animation Details

### Hover Animation

```css
transition: all 200ms ease-in-out;
transform: scale(1.02);
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

### Skeleton Animation

```css
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

## Accessibility Features

1. **Keyboard Navigation**: Cards are focusable when clickable
2. **Screen Reader**: Proper ARIA labels on icons
3. **Color Contrast**: Meets WCAG AA standards (4.5:1)
4. **Focus Indicators**: Visible focus ring
5. **Semantic HTML**: Proper heading hierarchy

## Data Flow

```
User Opens Dashboard
        ↓
DashboardMetrics Component Mounts
        ↓
useDashboardMetrics Hook Fetches Data
        ↓
Shows Skeleton Loaders
        ↓
API Returns Data
        ↓
MetricCards Render with Data
        ↓
User Hovers → Tooltip Shows Breakdown
        ↓
User Clicks → Navigate to Detail (if onClick)
```

## Example Data

### API Response

```json
{
  "totalContent": 156,
  "activeContent": 142,
  "contentThisWeek": 12,
  "trends": {
    "totalContent": {
      "value": 12,
      "direction": "up",
      "label": "vs periode sebelumnya"
    },
    "activeContent": {
      "value": 8,
      "direction": "up",
      "label": "vs periode sebelumnya"
    },
    "contentThisWeek": {
      "value": 20,
      "direction": "up",
      "label": "vs minggu lalu"
    }
  },
  "breakdown": {
    "products": 45,
    "recipes": 67,
    "publications": 44
  }
}
```

### Rendered Output

- **Total Konten**: 156 (↑ 12% vs periode sebelumnya)
  - Tooltip: "45 produk, 67 resep, 44 publikasi"
- **Konten Aktif**: 142 (↑ 8% vs periode sebelumnya)
  - Tooltip: "45 produk, 67 resep, 44 publikasi"
- **Konten Minggu Ini**: 12 (↑ 20% vs minggu lalu)
  - Tooltip: "45 produk, 67 resep, 44 publikasi"

---

**Visual Design**: Clean, modern, and professional
**User Experience**: Intuitive, informative, and interactive
**Performance**: Fast loading with skeleton states
**Accessibility**: WCAG AA compliant
