# Implementation Plan

- [-] 1. Setup and Dependencies

  - Install required shadcn/ui components (dialog, dropdown-menu)
  - Install drag-and-drop library (@dnd-kit/core, @dnd-kit/sortable)
  - Update database schema to add `order` field to products and fruit_types tables
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [x] 2. Remove Transaction-Related Fields

  - [x] 2.1 Update Product model and types to remove price and stock fields

    - Remove from TypeScript interfaces
    - Update Zod validation schemas
    - _Requirements: 4.2_

  - [x] 2.2 Update API endpoints to not return/accept price and stock

    - Modify GET /api/products response
    - Modify POST/PUT /api/products request validation
    - _Requirements: 4.2_

  - [x] 2.3 Update database queries to exclude price and stock

    - Update Supabase queries
    - Make fields optional in database if needed
    - _Requirements: 4.2_

- [x] 3. Create Core Components

  - [x] 3.1 Create ProductSection component

    - Implement collapsible section with shadcn/ui Collapsible
    - Add drag handle for reordering
    - Display product info (name, category, description, status)
    - Add action buttons (Edit, Delete, Toggle Status)
    - _Requirements: 1.2, 1.3, 1.4, 8.7_

  - [x] 3.2 Create FruitTypeCard component

    - Card layout with image-dominant design (4:3 aspect ratio)
    - Display name and truncated description
    - Implement hover overlay with action buttons
    - Add drag handle for reordering
    - _Requirements: 1.6, 1.7_

  - [x] 3.3 Create ConfirmDialog component

    - Use shadcn/ui Dialog component
    - Support destructive variant for delete actions
    - Customizable title, description, and button text
    - _Requirements: 4.5, 5.6, 8.4_

  - [x] 3.4 Create FruitTypeDetailModal component

    - Display large image and full description
    - Show Edit and Delete buttons
    - Use shadcn/ui Dialog component
    - _Requirements: 5.4_

- [x] 4. Refactor Product List Page

  - [x] 4.1 Replace table layout with card-based sections

    - Remove table HTML
    - Implement ProductSection components
    - Add collapsible behavior (first section open by default)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 4.2 Implement FruitTypeGrid within each ProductSection

    - Grid layout responsive (1-4 columns based on screen size)
    - Render FruitTypeCard components
    - Handle empty state (no fruit types yet)
    - _Requirements: 1.6, 6.2, 6.3, 6.4_

  - [x] 4.3 Update search and filter functionality

    - Keep existing SearchFilter component
    - Update to work with new card layout

    - Ensure pagination resets on search/filter

    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 4.4 Implement empty states

    - Empty state when no products exist
    - Empty state when search/filter returns no results
    - Use illustrations or icons
    - _Requirements: 1.5, 2.6_

  - [x] 4.5 Update loading skeleton

    - Create skeleton for card-based layout
    - Match ProductSection structure
    - _Requirements: 7.1_

- [x] 5. Implement Drag and Drop

  - [x] 5.1 Setup @dnd-kit for product reordering

    - Wrap ProductSectionList with DndContext
    - Make ProductSection draggable and droppable
    - Implement drag handle UI
    - _Requirements: 3.1, 3.2_

  - [x] 5.2 Implement product reorder API call

    - Create PATCH /api/products/:id/order endpoint
    - Update product order in database
    - Handle optimistic updates
    - _Requirements: 3.3, 3.6, 3.7_

  - [x] 5.3 Setup @dnd-kit for fruit type reordering

    - Wrap FruitTypeGrid with DndContext
    - Make FruitTypeCard draggable and droppable
    - Implement drag handle UI
    - _Requirements: 3.4_

  - [ ] 5.4 Implement fruit type reorder API call

  - [x] 5.4 Implement fruit type reorder API call

    - Create PATCH /api/fruit-types/:id/order endpoint
    - Update fruit type order in database
    - Handle optimistic updates
    - _Requirements: 3.5, 3.6, 3.7_

- [x] 6. Update Product Form (Add/Edit)

  - [x] 6.1 Remove price and stock fields from form

    - Remove Input components for price and stock
    - Update form validation schema
    - Update form submission logic
    - _Requirements: 4.2_

  - [x] 6.2 Update category dropdown to use fruit names

    - Update category options (Apel, Jeruk, Mangga, etc.)
    - Ensure consistency with design document
    - _Requirements: 4.2_

  - [x] 6.3 Ensure all form components use shadcn/ui

    - Verify Input, Select, Button, Label usage
    - Update styling to match design system
    - _Requirements: 8.1, 8.2, 8.5_

  - [x] 6.4 Update ProductPreview component

    - Remove price and stock from preview
    - Update layout to focus on content
    - _Requirements: 4.7_

- [ ] 7. Create Fruit Type Form Pages

  - [x] 7.1 Create add fruit type page (/produk/[productId]/jenis-buah/tambah)

    - Create page component with form
    - Implement name, slug, description, image fields
    - Add auto-slug generation from name
    - Add breadcrumb navigation
    - _Requirements: 5.1, 5.2_

  - [x] 7.2 Create edit fruit type page (/produk/[productId]/jenis-buah/edit/[id])

    - Create page component with pre-filled form
    - Reuse form component from add page
    - Load existing fruit type data
    - _Requirements: 5.5_

  - [x] 7.3 Implement fruit type form validation

    - Name: required, 3-100 chars
    - Slug: required, auto-generated, editable
    - Description: optional, rich text
    - Image: required
    - _Requirements: 5.2_

  - [x] 7.4 Create FruitTypePreview component

    - Display preview in modal
    - Show image, name, description
    - _Requirements: 5.7_

- [x] 8. Implement CRUD Operations

  - [x] 8.1 Update product delete to use ConfirmDialog

    - Replace window.confirm with ConfirmDialog component
    - Show warning about cascade delete
    - Implement cascade delete logic
    - _Requirements: 4.5_

  - [x] 8.2 Implement toggle product status

    - Add toggle button in ProductSection actions
    - Create PATCH /api/products/:id/status endpoint
    - Update UI optimistically
    - Show toast notification
    - _Requirements: 4.6_

  - [x] 8.3 Implement fruit type delete

    - Add delete button in FruitTypeCard hover overlay
    - Use ConfirmDialog for confirmation
    - Update parent section after delete
    - _Requirements: 5.6_

  - [x] 8.4 Implement fruit type detail view

    - Show FruitTypeDetailModal on card click
    - Display full image and description
    - Add Edit and Delete actions in modal
    - _Requirements: 5.4_

  - [x] 8.5 Update redirect logic after form submissions

    - Redirect to /produk after product create/edit
    - Redirect to /produk with expanded section after fruit type create/edit
    - Show success toast notifications
    - _Requirements: 4.3, 5.3_

- [x] 9. Responsive Design Implementation

  - [x] 9.1 Implement responsive grid for FruitTypeCards

    - 1 column on mobile (< 640px)
    - 2 columns on small tablets (640px - 768px)
    - 3 columns on tablets (768px - 1024px)
    - 4 columns on desktop (> 1024px)
    - _Requirements: 6.2, 6.3, 6.4_

  - [x] 9.2 Optimize ProductSection for mobile

    - Stack elements vertically on mobile
    - Ensure action buttons are touch-friendly (min 44x44px)
    - Test collapsible behavior on mobile
    - _Requirements: 6.1, 6.7_

  - [x] 9.3 Ensure forms are mobile-friendly

    - Test all form inputs on mobile
    - Ensure proper keyboard behavior
    - Test image upload on mobile
    - _Requirements: 6.5_

  - [x] 9.4 Test drag and drop on touch devices

    - Ensure touch gestures work for reordering
    - Add visual feedback for touch drag
    - _Requirements: 6.6_

- [x] 10. Error Handling and Loading States

  - [x] 10.1 Implement error states for product list

    - Show ErrorState component on fetch failure
    - Add "Coba Lagi" button
    - _Requirements: 7.3_

  - [x] 10.2 Implement form error handling

    - Show validation errors inline
    - Show API errors at top of form
    - Maintain form data on error
    - _Requirements: 7.4_

  - [x] 10.3 Implement upload error handling

    - Show specific error messages (file size, format, etc.)
    - Allow retry with different file
    - _Requirements: 7.7_

  - [x] 10.4 Implement loading states

    - Disable buttons during submission
    - Show loading spinners
    - Show upload progress for images
    - _Requirements: 7.2, 7.3_

  - [x] 10.5 Implement toast notifications

    - Success toasts for CRUD operations
    - Error toasts for failures
    - Use consistent messaging
    - _Requirements: 7.5, 7.6_

- [x] 11. Polish and Refinement

  - [x] 11.1 Add smooth transitions and animations

    - Collapsible expand/collapse animation
    - Card hover effects
    - Drag and drop visual feedback
    - _Requirements: 1.4, 1.7_

  - [x] 11.2 Implement proper focus management

    - Focus trap in modals
    - Return focus after modal close
    - Visible focus indicators
    - _Requirements: Accessibility_

  - [x] 11.3 Add keyboard navigation support

    - Tab through interactive elements
    - Enter/Space to activate buttons
    - Escape to close modals
    - _Requirements: Accessibility_

  - [x] 11.4 Optimize images

    - Use Next.js Image component where possible
    - Implement lazy loading
    - Add proper alt text
    - _Requirements: Performance, Accessibility_

  - [x] 11.5 Test and fix any remaining issues

    - Cross-browser testing
    - Mobile device testing
    - Accessibility audit
    - Performance testing
    - _Requirements: All_

- [x] 12. Documentation and Cleanup

  - [x] 12.1 Update API documentation

    - Document new endpoints
    - Document removed fields
    - Update request/response examples
    - _Requirements: All_

  - [x] 12.2 Remove unused code

    - Remove old table components
    - Remove price/stock related code
    - Clean up unused imports
    - _Requirements: All_

  - [x] 12.3 Add code comments

    - Document complex logic
    - Add JSDoc comments for components
    - Document drag and drop implementation
    - _Requirements: All_

  - [x] 12.4 Create user guide

    - Document how to use drag and drop
    - Document product and fruit type management
    - Add screenshots
    - _Requirements: All_
