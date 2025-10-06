# Design Document

## Overview

Sistem Manajemen Produk adalah CMS berbasis card untuk mengelola konten produk buah dan jenis-jenis buah yang akan ditampilkan di web client TastyFruit. Design ini fokus pada visual hierarchy, ease of use, dan konsistensi dengan shadcn/ui design system.

**Key Design Principles:**

1. **Visual First** - Foto dominan untuk memudahkan identifikasi
2. **Hierarchical** - Struktur Produk → Jenis Buah yang jelas
3. **Intuitive** - Drag and drop, collapsible sections, hover states
4. **Consistent** - Menggunakan shadcn/ui components
5. **Responsive** - Mobile-first approach

## Architecture

### Component Hierarchy

```
ProdukPage (app/(dashboard)/produk/page.tsx)
├── PageHeader
│   ├── Title
│   └── AddProductButton
├── SearchFilter
│   ├── SearchInput
│   ├── CategoryFilter
│   └── StatusFilter
├── ProductSectionList
│   └── ProductSection (multiple)
│       ├── ProductSectionHeader
│       │   ├── DragHandle
│       │   ├── ProductInfo
│       │   │   ├── ProductImage
│       │   │   ├── ProductName
│       │   │   ├── ProductDescription
│       │   │   └── StatusBadge
│       │   └── ProductActions
│       │       ├── EditButton
│       │       ├── DeleteButton
│       │       └── ToggleStatusButton
│       ├── CollapsibleContent
│       │   ├── AddFruitTypeButton
│       │   └── FruitTypeGrid
│       │       └── FruitTypeCard (multiple)
│       │           ├── DragHandle
│       │           ├── FruitTypeImage
│       │           ├── FruitTypeName
│       │           ├── FruitTypeDescription
│       │           └── HoverOverlay
│       │               ├── ViewDetailButton
│       │               ├── EditButton
│       │               └── DeleteButton
└── Pagination

TambahProdukPage (app/(dashboard)/produk/tambah/page.tsx)
├── PageHeader
├── ProductForm
│   ├── NameInput
│   ├── CategorySelect
│   ├── DescriptionEditor (TiptapEditor)
│   ├── ImageUpload
│   ├── StatusToggle
│   └── FormActions
│       ├── CancelButton
│       ├── PreviewButton
│       └── SubmitButton
└── PreviewModal

TambahJenisBuahPage (app/(dashboard)/produk/[productId]/jenis-buah/tambah/page.tsx)
├── PageHeader (with breadcrumb)
├── FruitTypeForm
│   ├── NameInput
│   ├── SlugInput (auto-generated)
│   ├── DescriptionEditor
│   ├── ImageUpload (required)
│   └── FormActions
└── PreviewModal
```

### Data Flow

```
┌─────────────────┐
│   User Action   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Hook     │
│  (useFetch,     │
│   useCrudApi)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Route     │
│   /api/products │
│   /api/fruit-   │
│   types         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│   (Supabase)    │
└─────────────────┘
```

### State Management

**Local State (useState):**

- Search term
- Active filters
- Current page
- Expanded sections
- Preview modal state
- Form data

**Server State (useFetch/useCrudApi):**

- Products list
- Fruit types list
- Loading states
- Error states

**Optimistic Updates:**

- Toggle status (update UI immediately, rollback on error)
- Reorder (update UI immediately, rollback on error)

## Components and Interfaces

### 1. ProductSection Component

**Purpose:** Container untuk satu produk dengan collapsible content untuk jenis-jenis buah.

**Props:**

```typescript
interface ProductSectionProps {
  product: Product;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onReorder: (productId: string, newOrder: number) => void;
  onFruitTypeReorder: (fruitTypeId: string, newOrder: number) => void;
}
```

**Styling:**

- Card component dari shadcn/ui
- Border dengan brand color saat expanded
- Smooth transition untuk collapse/expand
- Drag handle visible on hover

**Behavior:**

- Click header untuk toggle expand/collapse
- Drag handle untuk reorder
- Actions dropdown untuk Edit/Delete/Toggle Status

### 2. FruitTypeCard Component

**Purpose:** Card visual untuk menampilkan jenis buah dengan foto dominan.

**Props:**

```typescript
interface FruitTypeCardProps {
  fruitType: FruitType;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onReorder: (fruitTypeId: string, newOrder: number) => void;
}
```

**Styling:**

- Aspect ratio 4:3 atau 1:1 untuk gambar
- Rounded corners (lg)
- Shadow on hover
- Overlay dengan actions on hover (opacity 0 → 0.9)
- Drag handle di corner

**Layout:**

```
┌─────────────────────┐
│                     │
│      [IMAGE]        │ ← 60% height
│                     │
├─────────────────────┤
│  Nama Jenis Buah    │ ← 20% height
│  Deskripsi singkat  │ ← 20% height
│  (truncated)        │
└─────────────────────┘

On Hover:
┌─────────────────────┐
│   [Drag Handle]     │
│                     │
│   [View] [Edit]     │ ← Centered overlay
│      [Delete]       │
│                     │
└─────────────────────┘
```

### 3. ProductForm Component

**Purpose:** Reusable form untuk tambah/edit produk.

**Props:**

```typescript
interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading: boolean;
}

interface ProductFormData {
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}
```

**Validation:**

- Name: required, min 3 chars, max 100 chars
- Category: required, must be from predefined list
- Description: optional, rich text
- ImageUrl: optional, valid URL or file upload
- IsActive: boolean, default true

**Categories (Nama Buah):**

- Apel
- Jeruk
- Mangga
- Pisang
- Anggur
- Strawberry
- Melon
- Semangka
- Pepaya
- Nanas
- (dapat ditambah sesuai kebutuhan)

### 4. FruitTypeForm Component

**Purpose:** Form untuk tambah/edit jenis buah.

**Props:**

```typescript
interface FruitTypeFormProps {
  productId: string;
  productName: string;
  initialData?: Partial<FruitType>;
  onSubmit: (data: FruitTypeFormData) => Promise<void>;
  isLoading: boolean;
}

interface FruitTypeFormData {
  name: string;
  slug: string;
  description?: string;
  image: string; // required
}
```

**Validation:**

- Name: required, min 3 chars, max 100 chars
- Slug: required, auto-generated from name, lowercase, hyphenated
- Description: optional, rich text
- Image: required, valid URL or file upload

**Slug Generation:**

```typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

### 5. ConfirmDialog Component

**Purpose:** Dialog konfirmasi untuk operasi destructive (delete).

**Props:**

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}
```

**Usage:**

```typescript
<ConfirmDialog
  isOpen={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  onConfirm={handleConfirmDelete}
  title="Hapus Produk?"
  description="Produk dan semua jenis buahnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
  confirmText="Hapus"
  cancelText="Batal"
  variant="destructive"
/>
```

### 6. FruitTypeDetailModal Component

**Purpose:** Modal untuk menampilkan detail lengkap jenis buah.

**Props:**

```typescript
interface FruitTypeDetailModalProps {
  fruitType: FruitType | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}
```

**Layout:**

```
┌─────────────────────────────────┐
│  [X Close]                      │
│                                 │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │      [Large Image]        │ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  Nama Jenis Buah                │
│  [Status Badge]                 │
│                                 │
│  Deskripsi lengkap dengan       │
│  rich text formatting...        │
│                                 │
│  [Edit Button] [Delete Button]  │
└─────────────────────────────────┘
```

## Data Models

### Product Model

```typescript
interface Product {
  id: string;
  name: string; // Nama produk (kategori buah)
  category: string; // Kategori buah (Apel, Jeruk, dll)
  description?: string; // Rich text
  imageUrl?: string; // Hero image
  isActive: boolean; // Publish status
  order: number; // For drag and drop ordering
  createdAt: string;
  updatedAt: string;
  fruitTypes?: FruitType[]; // Relation
}
```

### FruitType Model

```typescript
interface FruitType {
  id: string;
  productId: string; // Foreign key
  name: string; // Nama jenis buah
  slug: string; // URL-friendly identifier
  description?: string; // Rich text
  image: string; // Required image URL
  order: number; // For drag and drop ordering
  createdAt: string;
  updatedAt: string;
}
```

### API Endpoints

**Products:**

- `GET /api/products` - List products with pagination, search, filter
- `GET /api/products/:id` - Get single product with fruit types
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (cascade delete fruit types)
- `PATCH /api/products/:id/status` - Toggle active status
- `PATCH /api/products/:id/order` - Update order

**Fruit Types:**

- `GET /api/products/:productId/fruit-types` - List fruit types for product
- `GET /api/fruit-types/:id` - Get single fruit type
- `POST /api/products/:productId/fruit-types` - Create fruit type
- `PUT /api/fruit-types/:id` - Update fruit type
- `DELETE /api/fruit-types/:id` - Delete fruit type
- `PATCH /api/fruit-types/:id/order` - Update order

## Error Handling

### Error Types

1. **Validation Errors**

   - Display inline below form fields
   - Red border on invalid fields
   - Clear error message

2. **Network Errors**

   - Toast notification with retry option
   - Error state component with "Coba Lagi" button
   - Maintain form data (don't clear on error)

3. **Upload Errors**

   - Specific error messages (file too large, invalid format, etc.)
   - Display below file upload component
   - Allow user to try different file

4. **Delete Errors**
   - Toast notification with error message
   - Don't close dialog on error
   - Allow user to retry or cancel

### Loading States

1. **Page Loading**

   - Skeleton components matching layout
   - Shimmer effect for visual feedback

2. **Form Submission**

   - Disable submit button
   - Show loading spinner in button
   - Disable all form fields

3. **Image Upload**

   - Progress bar for upload
   - Preview thumbnail while uploading
   - Cancel upload option

4. **Reordering**
   - Optimistic update (immediate visual feedback)
   - Rollback on error with toast notification

## Testing Strategy

### Unit Tests

1. **Component Tests**

   - ProductSection render and interactions
   - FruitTypeCard hover states and actions
   - Form validation logic
   - Slug generation utility

2. **Hook Tests**
   - useFetch data fetching and error handling
   - useCrudApi CRUD operations
   - Form state management

### Integration Tests

1. **User Flows**

   - Create product → Add fruit types → Reorder → Delete
   - Search and filter products
   - Edit product and fruit types
   - Toggle status and see updates

2. **API Integration**
   - Mock API responses
   - Test error scenarios
   - Test loading states

### E2E Tests (Optional)

1. **Critical Paths**
   - Complete product creation flow
   - Complete fruit type creation flow
   - Drag and drop reordering
   - Delete with cascade

## Accessibility

1. **Keyboard Navigation**

   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Escape to close modals/dialogs
   - Arrow keys for drag and drop alternative

2. **Screen Readers**

   - Proper ARIA labels for icon buttons
   - ARIA live regions for toast notifications
   - Semantic HTML (button, nav, main, etc.)
   - Alt text for all images

3. **Focus Management**

   - Visible focus indicators
   - Focus trap in modals
   - Return focus after modal close
   - Skip to main content link

4. **Color Contrast**
   - WCAG AA compliance (4.5:1 for text)
   - Don't rely on color alone for information
   - Test with color blindness simulators

## Performance Considerations

1. **Image Optimization**

   - Use Next.js Image component
   - Lazy load images below fold
   - Responsive images (srcset)
   - WebP format with fallback

2. **Code Splitting**

   - Lazy load preview modals
   - Lazy load rich text editor
   - Dynamic imports for heavy components

3. **Data Fetching**

   - Pagination for large lists
   - Debounce search input (300ms)
   - Cache API responses
   - Optimistic updates for better UX

4. **Drag and Drop**
   - Use react-beautiful-dnd or @dnd-kit
   - Virtualize long lists if needed
   - Throttle reorder API calls

## Design Tokens

### Colors

```css
/* Brand Colors */
--primary: #003ce9; /* TastyFruit Blue */
--secondary: #b5fe28; /* TastyFruit Green */

/* Status Colors */
--success: #10b981; /* Green */
--warning: #f59e0b; /* Orange */
--error: #ef4444; /* Red */
--info: #3b82f6; /* Blue */

/* Neutral Colors */
--background: #ffffff;
--foreground: #0f172a;
--muted: #f1f5f9;
--muted-foreground: #64748b;
--border: #e2e8f0;
```

### Spacing

```css
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */
--spacing-2xl: 3rem; /* 48px */
```

### Typography

```css
--font-heading: "Bricolage Grotesque", sans-serif;
--font-body: "Nunito", sans-serif;

--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Border Radius

```css
--radius-sm: 0.375rem; /* 6px */
--radius-md: 0.5rem; /* 8px */
--radius-lg: 0.75rem; /* 12px */
--radius-xl: 1rem; /* 16px */
```

## Wireframes

### Desktop Layout (> 1024px)

```
┌────────────────────────────────────────────────────────────┐
│  Manajemen Produk                    [+ Tambah Produk]     │
├────────────────────────────────────────────────────────────┤
│  [Search...] [Kategori ▼] [Status ▼] [Clear Filters]      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🍎 Apel Fuji                    [Edit] [Delete] [⋮]  │ │
│  │ Apel manis dengan tekstur renyah...    ● Aktif      │ │
│  │                                                      │ │
│  │ [+ Tambah Jenis Buah]                               │ │
│  │                                                      │ │
│  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │ │
│  │ │ IMG  │ │ IMG  │ │ IMG  │ │ IMG  │                │ │
│  │ │Fuji  │ │Gala  │ │Granny│ │Pink  │                │ │
│  │ │Jepang│ │USA   │ │Smith │ │Lady  │                │ │
│  │ └──────┘ └──────┘ └──────┘ └──────┘                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🍊 Jeruk Mandarin (Collapsed)   [Edit] [Delete] [⋮]  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [< Prev] [1] [2] [3] [Next >]                            │
└────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌──────────────────────┐
│ Manajemen Produk     │
│ [+ Tambah]           │
├──────────────────────┤
│ [Search...]          │
│ [Kategori ▼]         │
│ [Status ▼]           │
├──────────────────────┤
│                      │
│ ┌──────────────────┐ │
│ │ 🍎 Apel Fuji     │ │
│ │ ● Aktif    [⋮]   │ │
│ │                  │ │
│ │ [+ Jenis Buah]   │ │
│ │                  │ │
│ │ ┌──────┐         │ │
│ │ │ IMG  │         │ │
│ │ │Fuji  │         │ │
│ │ └──────┘         │ │
│ │ ┌──────┐         │ │
│ │ │ IMG  │         │ │
│ │ │Gala  │         │ │
│ │ └──────┘         │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ 🍊 Jeruk         │ │
│ │ (Collapsed)      │ │
│ └──────────────────┘ │
│                      │
│ [< Prev] [Next >]    │
└──────────────────────┘
```
