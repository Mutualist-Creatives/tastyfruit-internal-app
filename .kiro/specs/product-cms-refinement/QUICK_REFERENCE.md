# Quick Reference Guide - Product CMS

## Quick Actions

### Products

| Action               | Steps                                      |
| -------------------- | ------------------------------------------ |
| **Add Product**      | Click "Tambah Produk" → Fill form → Save   |
| **Edit Product**     | Click ⋮ → Edit → Modify → Save             |
| **Delete Product**   | Click ⋮ → Delete → Confirm                 |
| **Toggle Status**    | Click ⋮ → Toggle Status                    |
| **Reorder Products** | Drag grip icon (⋮⋮) → Drop at new position |

### Fruit Types

| Action                  | Steps                                                         |
| ----------------------- | ------------------------------------------------------------- |
| **Add Fruit Type**      | Open product section → "Tambah Jenis Buah" → Fill form → Save |
| **View Details**        | Click on fruit type card                                      |
| **Edit Fruit Type**     | Hover card → Edit OR Click card → Edit in modal               |
| **Delete Fruit Type**   | Hover card → Delete OR Click card → Delete in modal           |
| **Reorder Fruit Types** | Drag grip icon → Drop at new position in grid                 |

### Search & Filter

| Action                 | Steps                           |
| ---------------------- | ------------------------------- |
| **Search**             | Type in search box (real-time)  |
| **Filter by Category** | Select from "Kategori" dropdown |
| **Filter by Status**   | Select from "Status" dropdown   |
| **Clear Filters**      | Click "Clear Filters" button    |

---

## Keyboard Shortcuts

### General

| Key      | Action                    |
| -------- | ------------------------- |
| `Tab`    | Navigate between elements |
| `Enter`  | Activate button/link      |
| `Space`  | Toggle checkbox/switch    |
| `Escape` | Close modal/dialog        |

### Drag & Drop

| Key             | Action                  |
| --------------- | ----------------------- |
| `Space`         | Pick up / Drop item     |
| `↑` `↓`         | Move product up/down    |
| `←` `→` `↑` `↓` | Move fruit type in grid |
| `Escape`        | Cancel drag operation   |

### Rich Text Editor

| Shortcut           | Action      |
| ------------------ | ----------- |
| `Ctrl+B` / `Cmd+B` | Bold        |
| `Ctrl+I` / `Cmd+I` | Italic      |
| `Ctrl+K` / `Cmd+K` | Insert link |
| `Ctrl+Z` / `Cmd+Z` | Undo        |
| `Ctrl+Y` / `Cmd+Y` | Redo        |

---

## Form Fields

### Product Form

| Field       | Required | Type       | Notes                     |
| ----------- | -------- | ---------- | ------------------------- |
| Name        | ✅ Yes   | Text       | 1-100 characters          |
| Category    | ✅ Yes   | Dropdown   | Apel, Jeruk, Mangga, etc. |
| Description | ❌ No    | Rich Text  | Optional                  |
| Image URL   | ❌ No    | URL/Upload | Optional                  |
| Status      | ✅ Yes   | Toggle     | Default: Active           |

### Fruit Type Form

| Field       | Required | Type      | Notes                    |
| ----------- | -------- | --------- | ------------------------ |
| Name        | ✅ Yes   | Text      | Minimum 3 characters     |
| Slug        | ✅ Yes   | Text      | Auto-generated, editable |
| Description | ❌ No    | Rich Text | Optional                 |
| Image       | ✅ Yes   | Upload    | Required, max 2MB        |

---

## API Endpoints

### Products

```
GET    /api/products              List products
POST   /api/products              Create product
GET    /api/products/:id          Get product
PUT    /api/products/:id          Update product
DELETE /api/products/:id          Delete product
PATCH  /api/products/:id/status   Toggle status
PATCH  /api/products/:id/order    Update order
```

### Fruit Types

```
GET    /api/fruit-types           List fruit types
POST   /api/fruit-types           Create fruit type
GET    /api/fruit-types/:id       Get fruit type
PATCH  /api/fruit-types/:id       Update fruit type
DELETE /api/fruit-types/:id       Delete fruit type
PATCH  /api/fruit-types/:id/order Update order
```

---

## Status Codes

| Code | Meaning      | Action                        |
| ---- | ------------ | ----------------------------- |
| 200  | Success      | Operation completed           |
| 201  | Created      | Resource created successfully |
| 400  | Bad Request  | Check validation errors       |
| 401  | Unauthorized | Login required                |
| 404  | Not Found    | Resource doesn't exist        |
| 500  | Server Error | Contact administrator         |

---

## Common Validations

### Product

- Name: 1-100 characters, required
- Category: Must be from predefined list, required
- Image URL: Valid URL or empty
- Status: Boolean (true/false)

### Fruit Type

- Name: Minimum 3 characters, required
- Slug: URL-friendly, auto-generated, required
- Image: Valid file, max 2MB, required
- Description: Optional

---

## Image Guidelines

### Recommended Specs

| Property       | Value                        |
| -------------- | ---------------------------- |
| Format         | JPG or PNG                   |
| Max Size       | 2MB                          |
| Min Dimensions | 800x600px                    |
| Aspect Ratio   | 4:3 or 1:1 (for fruit types) |
| Quality        | High (80-90%)                |

### Upload Process

1. Click upload area
2. Select file from computer
3. Wait for upload to complete
4. Preview appears
5. Save form

---

## Drag & Drop Tips

### Mouse/Trackpad

1. Hover over grip icon (⋮⋮)
2. Click and hold
3. Drag to new position
4. Release to drop
5. Wait for success notification

### Touch Device

1. Tap and hold grip icon
2. Drag with finger
3. Release to drop
4. Wait for success notification

### Keyboard

1. Tab to grip icon
2. Press Space to pick up
3. Use Arrow keys to move
4. Press Space to drop
5. Press Escape to cancel

---

## Troubleshooting Quick Fixes

| Problem             | Quick Fix                          |
| ------------------- | ---------------------------------- |
| Image not showing   | Check URL, file size, format       |
| Can't save form     | Check required fields (red border) |
| Drag not working    | Click grip icon, not card          |
| Changes not saved   | Check internet connection          |
| Product not in list | Clear filters, check pagination    |

---

## Browser Support

| Browser       | Version     | Support |
| ------------- | ----------- | ------- |
| Chrome        | 90+         | ✅ Full |
| Firefox       | 88+         | ✅ Full |
| Safari        | 14+         | ✅ Full |
| Edge          | 90+         | ✅ Full |
| Mobile Safari | iOS 14+     | ✅ Full |
| Chrome Mobile | Android 10+ | ✅ Full |

---

## Responsive Breakpoints

| Device       | Width      | Grid Columns |
| ------------ | ---------- | ------------ |
| Mobile       | < 640px    | 1 column     |
| Small Tablet | 640-768px  | 2 columns    |
| Tablet       | 768-1024px | 3 columns    |
| Desktop      | > 1024px   | 4 columns    |

---

## Component Reference

### ProductSection

**Purpose:** Collapsible section for a product

**Features:**

- Drag handle for reordering
- Edit, Delete, Toggle Status actions
- Collapsible content
- Nested fruit type grid

### FruitTypeCard

**Purpose:** Card display for fruit type

**Features:**

- Image-dominant design
- Hover overlay with actions
- Drag handle for reordering
- Click to view details

### ConfirmDialog

**Purpose:** Confirmation for destructive actions

**Features:**

- Customizable title and description
- Destructive variant styling
- Keyboard support (Escape to cancel)

### FruitTypeDetailModal

**Purpose:** Full details view for fruit type

**Features:**

- Large image display
- Full description
- Edit and Delete actions

---

## Data Structure

### Product

```typescript
{
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### FruitType

```typescript
{
  id: string;
  productId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## Categories List

Available product categories:

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

---

## Support Contacts

| Channel   | Contact                    |
| --------- | -------------------------- |
| Email     | support@tastyfruit.com     |
| Phone     | +62 xxx-xxxx-xxxx          |
| Live Chat | Click icon in bottom-right |

---

## Documentation Links

- [Full User Guide](USER_GUIDE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Drag & Drop Guide](DRAG_AND_DROP_IMPLEMENTATION.md)
- [Cleanup Summary](CLEANUP_SUMMARY.md)
- [Technical Documentation](DOCUMENTATION_SUMMARY.md)

---

## Version Info

**Current Version:** 2.0

**Last Updated:** 2024

**Changes from v1.0:**

- Card-based layout (replaced table)
- Drag & drop reordering
- Removed e-commerce fields (price, stock, SKU)
- Improved mobile experience
- Better accessibility

---

## Quick Tips

💡 **Use drag & drop** to reorder products and fruit types

💡 **Preview before saving** to see how content will look

💡 **Use filters** to find products quickly

💡 **Toggle status** instead of deleting to hide products temporarily

💡 **Optimize images** before uploading (max 2MB)

💡 **Use keyboard shortcuts** for faster navigation

💡 **Check mobile view** to ensure content looks good on all devices

---

## Emergency Procedures

### If something goes wrong:

1. **Don't panic** - Most actions can be undone
2. **Check internet connection** - Many issues are network-related
3. **Refresh the page** - Clears temporary issues
4. **Clear browser cache** - If refresh doesn't help
5. **Contact support** - If problem persists

### Data Recovery

- Deleted products: Contact administrator (may be recoverable)
- Lost changes: Check if auto-save is enabled
- Corrupted data: Contact support immediately

---

## Best Practices

✅ **DO:**

- Preview before saving
- Use descriptive names
- Optimize images before upload
- Test on mobile devices
- Use drag & drop for reordering
- Keep descriptions concise

❌ **DON'T:**

- Delete products without confirmation
- Upload huge images (> 2MB)
- Use special characters in slugs
- Leave required fields empty
- Forget to save changes
- Use all caps in names

---

This quick reference guide provides instant access to the most commonly needed information. For detailed instructions, refer to the [Full User Guide](USER_GUIDE.md).
