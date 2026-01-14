# Drag and Drop Implementation Guide

## Overview

This document explains the drag-and-drop implementation for reordering products and fruit types in the Product CMS. The implementation uses `@dnd-kit` library for a modern, accessible, and performant drag-and-drop experience.

---

## Library Choice

**Library:** `@dnd-kit` (https://dndkit.com/)

**Why @dnd-kit?**

- Modern React hooks-based API
- Excellent TypeScript support
- Built-in accessibility (keyboard navigation)
- Touch device support
- Performant (uses CSS transforms)
- Modular architecture
- Active maintenance

**Packages Used:**

```json
{
  "@dnd-kit/core": "^6.x",
  "@dnd-kit/sortable": "^8.x",
  "@dnd-kit/utilities": "^3.x"
}
```

---

## Architecture

### Component Hierarchy

```
ProductListPage
├── DndContext (Products)
│   └── SortableContext (Products)
│       └── ProductSection (multiple, sortable)
│           ├── useSortable hook
│           ├── DndContext (Fruit Types)
│           │   └── SortableContext (Fruit Types)
│           │       └── FruitTypeCard (multiple, sortable)
│           │           └── useSortable hook
```

### Nested Drag-and-Drop

The implementation supports **nested drag-and-drop contexts**:

1. **Outer Context:** Products can be reordered
2. **Inner Context:** Fruit types within each product can be reordered

This is achieved by having separate `DndContext` components for products and fruit types.

---

## Implementation Details

### 1. Product Reordering

**Location:** `app/(dashboard)/produk/page.tsx`

**Key Components:**

```typescript
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
```

**Setup:**

```typescript
// Configure sensors for mouse, touch, and keyboard
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Require 8px movement before drag starts
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

// Handle drag end event
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = products.findIndex((p) => p.id === active.id);
  const newIndex = products.findIndex((p) => p.id === over.id);

  // Optimistic update
  const newProducts = arrayMove(products, oldIndex, newIndex);
  setProducts(newProducts);

  // Update order in database
  try {
    await fetch(`/api/products/${active.id}/order`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newOrder: newIndex }),
    });
    toast.success("Urutan berhasil diperbarui");
  } catch (error) {
    // Rollback on error
    setProducts(products);
    toast.error("Gagal memperbarui urutan");
  }
};
```

**Rendering:**

```typescript
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={products.map((p) => p.id)}
    strategy={verticalListSortingStrategy}
  >
    {products.map((product) => (
      <ProductSection
        key={product.id}
        product={product}
        // ... other props
      />
    ))}
  </SortableContext>
</DndContext>
```

---

### 2. Fruit Type Reordering

**Location:** `components/product-section.tsx`

**Key Differences:**

- Uses `rectSortingStrategy` instead of `verticalListSortingStrategy` (for grid layout)
- Nested inside product's collapsible content
- Separate `DndContext` to avoid conflicts with product reordering

**Setup:**

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

const handleFruitTypeDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = fruitTypes.findIndex((ft) => ft.id === active.id);
  const newIndex = fruitTypes.findIndex((ft) => ft.id === over.id);

  // Optimistic update
  const newFruitTypes = arrayMove(fruitTypes, oldIndex, newIndex);
  setFruitTypes(newFruitTypes);

  // Update order in database
  try {
    await fetch(`/api/fruit-types/${active.id}/order`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newOrder: newIndex }),
    });
    toast.success("Urutan jenis buah berhasil diperbarui");
  } catch (error) {
    // Rollback on error
    setFruitTypes(fruitTypes);
    toast.error("Gagal memperbarui urutan jenis buah");
  }
};
```

**Rendering:**

```typescript
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleFruitTypeDragEnd}
>
  <SortableContext
    items={fruitTypes.map((ft) => ft.id)}
    strategy={rectSortingStrategy}
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {fruitTypes.map((fruitType) => (
        <FruitTypeCard
          key={fruitType.id}
          fruitType={fruitType}
          // ... other props
        />
      ))}
    </div>
  </SortableContext>
</DndContext>
```

---

### 3. Sortable Items

**Location:** `components/product-section.tsx` and `components/fruit-type-card.tsx`

**Using the `useSortable` Hook:**

```typescript
const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
  useSortable({ id: product.id });

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
};
```

**Key Properties:**

- `attributes` - Accessibility attributes (aria-\*)
- `listeners` - Event handlers for drag interactions
- `setNodeRef` - Ref to attach to the draggable element
- `transform` - CSS transform for positioning
- `transition` - CSS transition for smooth animations
- `isDragging` - Boolean indicating if item is being dragged

**Applying to Component:**

```typescript
<div ref={setNodeRef} style={style}>
  {/* Drag handle */}
  <button
    {...attributes}
    {...listeners}
    className="cursor-grab active:cursor-grabbing"
  >
    <GripVertical className="size-5" />
  </button>

  {/* Rest of component */}
</div>
```

---

## Activation Constraints

### Distance Constraint

```typescript
activationConstraint: {
  distance: 8, // Require 8px movement before drag starts
}
```

**Why 8px?**

- Prevents accidental drags when clicking
- Allows normal click interactions (buttons, links)
- Still feels responsive for intentional drags

**Alternative Constraints:**

- `delay` - Time-based activation (e.g., press and hold)
- `tolerance` - Directional tolerance

---

## Collision Detection

**Algorithm:** `closestCenter`

```typescript
collisionDetection = { closestCenter };
```

**Why closestCenter?**

- Works well for both list and grid layouts
- Intuitive behavior for users
- Good performance

**Alternatives:**

- `closestCorners` - Better for complex grid layouts
- `rectIntersection` - Based on overlap area
- `pointerWithin` - Based on pointer position

---

## Sorting Strategies

### Vertical List Strategy

**Used for:** Product sections

```typescript
strategy = { verticalListSortingStrategy };
```

**Characteristics:**

- Optimized for vertical lists
- Items stack vertically
- Smooth animations

### Rectangular Strategy

**Used for:** Fruit type cards (grid layout)

```typescript
strategy = { rectSortingStrategy };
```

**Characteristics:**

- Optimized for grid layouts
- Handles multi-column layouts
- Responsive to grid changes

---

## Optimistic Updates

### Pattern

1. **Immediately update UI** (optimistic)
2. **Send API request** to persist change
3. **On success:** Show success toast
4. **On error:** Rollback UI and show error toast

### Implementation

```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = items.findIndex((item) => item.id === active.id);
  const newIndex = items.findIndex((item) => item.id === over.id);

  // Step 1: Optimistic update
  const newItems = arrayMove(items, oldIndex, newIndex);
  setItems(newItems);

  try {
    // Step 2: Persist to server
    await fetch(`/api/items/${active.id}/order`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newOrder: newIndex }),
    });

    // Step 3: Success feedback
    toast.success("Urutan berhasil diperbarui");
  } catch (error) {
    // Step 4: Rollback on error
    setItems(items);
    toast.error("Gagal memperbarui urutan");
  }
};
```

**Benefits:**

- Instant feedback (no loading state)
- Better user experience
- Graceful error handling

---

## Accessibility

### Keyboard Navigation

**Supported Keys:**

- `Space` - Pick up / drop item
- `Arrow Keys` - Move item up/down/left/right
- `Escape` - Cancel drag operation

**Implementation:**

```typescript
useSensor(KeyboardSensor, {
  coordinateGetter: sortableKeyboardCoordinates,
});
```

### Screen Reader Support

**ARIA Attributes:**

- `aria-pressed` - Indicates if item is picked up
- `aria-describedby` - Instructions for keyboard users
- `role="button"` - Drag handle is a button

**Announcements:**

- "Picked up item X"
- "Moved item X to position Y"
- "Dropped item X"

---

## Touch Device Support

### Configuration

```typescript
useSensor(PointerSensor, {
  activationConstraint: {
    distance: 8,
  },
});
```

**PointerSensor** handles:

- Mouse events
- Touch events
- Pen/stylus events

### Touch Gestures

- **Tap and hold** - Pick up item
- **Drag** - Move item
- **Release** - Drop item

### Mobile Considerations

1. **Larger drag handles** (min 44x44px for touch targets)
2. **Visual feedback** (opacity change when dragging)
3. **Haptic feedback** (if supported by device)

---

## Visual Feedback

### During Drag

```typescript
const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1, // Reduce opacity
  cursor: isDragging ? "grabbing" : "grab",
};
```

### Drag Handle

```typescript
<button
  {...attributes}
  {...listeners}
  className="cursor-grab active:cursor-grabbing hover:bg-gray-100"
>
  <GripVertical className="size-5 text-gray-400" />
</button>
```

**States:**

- **Default:** Gray grip icon
- **Hover:** Light background
- **Active:** Grabbing cursor

---

## Performance Optimization

### 1. CSS Transforms

Uses CSS `transform` instead of `top`/`left` for positioning:

- Hardware accelerated
- No layout recalculation
- Smooth 60fps animations

### 2. Activation Constraint

8px distance constraint prevents unnecessary drag operations:

- Reduces false positives
- Improves click interactions
- Better performance

### 3. Collision Detection

`closestCenter` algorithm is optimized:

- O(n) complexity
- Efficient for most use cases
- Good balance of accuracy and performance

---

## Error Handling

### Network Errors

```typescript
try {
  await fetch(`/api/items/${id}/order`, {
    method: "PATCH",
    body: JSON.stringify({ newOrder }),
  });
  toast.success("Urutan berhasil diperbarui");
} catch (error) {
  // Rollback to previous state
  setItems(previousItems);
  toast.error("Gagal memperbarui urutan. Silakan coba lagi.");
}
```

### Validation Errors

Server validates `newOrder` parameter:

```typescript
if (typeof newOrder !== "number") {
  return NextResponse.json(
    { error: "newOrder must be a number" },
    { status: 400 }
  );
}
```

---

## Testing

### Manual Testing Checklist

- [ ] Drag products to reorder
- [ ] Drag fruit types to reorder
- [ ] Keyboard navigation (Space, Arrow keys)
- [ ] Touch device support
- [ ] Error handling (network failure)
- [ ] Optimistic updates work correctly
- [ ] Rollback on error works
- [ ] Visual feedback during drag
- [ ] Accessibility (screen reader)

### Edge Cases

1. **Single item** - Drag handle should be visible but no reordering possible
2. **Network error** - Should rollback and show error message
3. **Concurrent drags** - Only one drag operation at a time
4. **Nested contexts** - Product and fruit type drags don't interfere

---

## Common Issues and Solutions

### Issue 1: Drag not working

**Symptoms:** Items don't move when dragged

**Solutions:**

- Check that `id` prop is unique
- Verify `SortableContext` items array matches rendered items
- Ensure `setNodeRef` is attached to the correct element

### Issue 2: Nested drag conflicts

**Symptoms:** Dragging fruit types also moves products

**Solution:** Use separate `DndContext` for each level:

```typescript
// Outer context for products
<DndContext onDragEnd={handleProductDragEnd}>
  {/* Inner context for fruit types */}
  <DndContext onDragEnd={handleFruitTypeDragEnd}>{/* ... */}</DndContext>
</DndContext>
```

### Issue 3: Clicks trigger drags

**Symptoms:** Clicking items starts drag operation

**Solution:** Add activation constraint:

```typescript
activationConstraint: {
  distance: 8, // Require 8px movement
}
```

### Issue 4: Poor touch performance

**Symptoms:** Laggy or unresponsive on mobile

**Solutions:**

- Use `PointerSensor` instead of separate mouse/touch sensors
- Reduce activation distance for touch devices
- Ensure drag handles are large enough (44x44px minimum)

---

## Future Enhancements

### Potential Improvements

1. **Multi-select drag** - Drag multiple items at once
2. **Drag between products** - Move fruit types between products
3. **Undo/redo** - Undo reordering operations
4. **Drag preview** - Custom drag overlay
5. **Animations** - More sophisticated animations
6. **Persistence** - Save order preferences locally

### Advanced Features

1. **Drag constraints** - Limit drag to certain areas
2. **Drop zones** - Visual drop zones
3. **Drag handles** - Multiple drag handles per item
4. **Modifiers** - Snap to grid, restrict axis

---

## Resources

### Documentation

- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [@dnd-kit Examples](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/)
- [GitHub Repository](https://github.com/clauderic/dnd-kit)

### Related Files

- `app/(dashboard)/produk/page.tsx` - Product list with drag-and-drop
- `components/product-section.tsx` - Sortable product section
- `components/fruit-type-card.tsx` - Sortable fruit type card
- `app/api/products/[id]/order/route.ts` - Product order API
- `app/api/fruit-types/[id]/order/route.ts` - Fruit type order API

---

## Summary

The drag-and-drop implementation provides:

- ✅ Intuitive reordering for products and fruit types
- ✅ Keyboard and touch device support
- ✅ Accessibility features
- ✅ Optimistic updates for instant feedback
- ✅ Graceful error handling
- ✅ Smooth animations
- ✅ Nested drag contexts without conflicts

The implementation is production-ready, accessible, and performant.
