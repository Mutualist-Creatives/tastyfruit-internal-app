# 📱 Sidebar Update - Accordion Menu untuk Artikel

## 🎯 Update Overview

Menggabungkan **Publikasi** dan **Resep** ke dalam satu menu **Artikel** dengan accordion/dropdown.

## ✅ Changes Made

### Before (Flat Menu):

```
📊 Dashboard
🍎 Produk
📰 Publikasi
📖 Resep
👥 Users
```

### After (With Accordion):

```
📊 Dashboard
🍎 Produk
📄 Artikel ▼
  ├─ 📰 Publikasi
  └─ 📖 Resep
👥 Users
```

## 🎨 Features

### Accordion Behavior

- **Click "Artikel"** → Expands/collapses submenu
- **Auto-expand** → Opens automatically when on Publikasi or Resep page
- **Visual indicator** → Chevron icon shows open/closed state
- **Active state** → Highlights current page

### Visual States

#### Closed State

```
📄 Artikel ▶  (gray, collapsed)
```

#### Open State

```
📄 Artikel ▼  (blue if active, expanded)
  ├─ 📰 Publikasi (highlighted if active)
  └─ 📖 Resep (highlighted if active)
```

#### Active States

- **Parent active** → Blue background when on any artikel page
- **Child active** → Light blue background for current submenu item
- **Hover** → Gray background on hover

## 🔧 Technical Implementation

### State Management

```typescript
const [artikelOpen, setArtikelOpen] = useState(
  pathname.startsWith("/publikasi") || pathname.startsWith("/resep")
);
```

### Auto-expand Logic

- Opens automatically if current path is `/publikasi` or `/resep`
- Persists state during navigation within artikel section

### Icons Used

- **FileText** → Artikel parent menu
- **FileText** → Publikasi submenu
- **CookingPot** → Resep submenu
- **ChevronDown** → Expanded state
- **ChevronRight** → Collapsed state

## 🎯 User Experience

### Navigation Flow

1. **User clicks "Artikel"**

   - Accordion expands
   - Shows Publikasi and Resep options

2. **User clicks "Publikasi"**

   - Navigates to `/publikasi`
   - Artikel menu stays open
   - Publikasi highlighted

3. **User clicks "Resep"**

   - Navigates to `/resep`
   - Artikel menu stays open
   - Resep highlighted

4. **User clicks other menu**
   - Artikel accordion closes (optional)
   - New menu becomes active

## 📱 Responsive Design

### Desktop (Current)

- Full sidebar with accordion
- Smooth expand/collapse animation
- Clear visual hierarchy

### Mobile (Future Enhancement)

- Could collapse to hamburger menu
- Accordion still works in mobile drawer

## 🎨 Styling Details

### Parent Menu (Artikel)

```css
- Padding: px-4 py-3
- Rounded: rounded-lg
- Hover: bg-slate-200
- Active: bg-blue-100 + font-bold
- Icon size: h-5 w-5
```

### Submenu Items

```css
- Padding: px-4 py-2 (smaller)
- Font size: text-sm
- Indent: ml-4 pl-4
- Border: border-l-2 border-slate-200
- Active: bg-blue-50 + font-semibold
- Icon size: h-4 w-4 (smaller)
```

### Visual Hierarchy

```
Level 1 (Main menu)
  ├─ Larger padding (py-3)
  ├─ Larger icons (h-5 w-5)
  └─ Bold when active

Level 2 (Submenu)
  ├─ Smaller padding (py-2)
  ├─ Smaller icons (h-4 w-4)
  ├─ Smaller text (text-sm)
  ├─ Indented with border
  └─ Semi-bold when active
```

## ✅ Benefits

### Organization

- ✅ Groups related content (Publikasi + Resep)
- ✅ Reduces menu clutter
- ✅ Logical content hierarchy

### User Experience

- ✅ Intuitive navigation
- ✅ Clear visual feedback
- ✅ Auto-expand on relevant pages
- ✅ Smooth transitions

### Scalability

- ✅ Easy to add more artikel types
- ✅ Can add more accordion sections
- ✅ Maintains clean sidebar

## 🚀 Future Enhancements

### Possible Additions

1. **More Accordion Sections**

   ```
   📊 Dashboard
   🍎 Produk
   📄 Artikel ▼
     ├─ 📰 Publikasi
     ├─ 📖 Resep
     └─ 📝 Blog (new)
   ⚙️ Settings ▼
     ├─ 👥 Users
     ├─ 🔐 Roles
     └─ 🎨 Themes
   ```

2. **Collapse All Button**

   - Button to collapse all accordions
   - Useful for clean view

3. **Remember State**

   - Save accordion state to localStorage
   - Persist across sessions

4. **Keyboard Navigation**

   - Arrow keys to navigate
   - Enter to expand/collapse
   - Tab for accessibility

5. **Animation**
   - Smooth slide animation
   - Fade in/out effect
   - Height transition

## 🧪 Testing Checklist

- [ ] Click "Artikel" → Expands submenu
- [ ] Click "Artikel" again → Collapses submenu
- [ ] Navigate to `/publikasi` → Artikel auto-expands
- [ ] Navigate to `/resep` → Artikel auto-expands
- [ ] Navigate to `/produk` → Artikel stays open (or closes)
- [ ] Publikasi highlighted when on publikasi page
- [ ] Resep highlighted when on resep page
- [ ] Hover states work correctly
- [ ] Icons change (chevron right/down)
- [ ] Responsive on different screen sizes

## 📊 Menu Structure

```
Sidebar
├─ Logo
│  └─ TastyFruit Admin Panel
├─ Navigation
│  ├─ Dashboard (link)
│  ├─ Produk (link)
│  ├─ Artikel (accordion)
│  │  ├─ Publikasi (link)
│  │  └─ Resep (link)
│  └─ Users (link)
└─ Logout (button)
```

## 🎨 Color Scheme

```css
/* Default state */
text-slate-600
hover:bg-slate-200

/* Active parent */
bg-blue-100
text-primary
font-bold

/* Active child */
bg-blue-50
text-primary
font-semibold

/* Border */
border-slate-200
```

---

**🎉 Sidebar accordion is now live!**

**Features:**

- ✅ Artikel accordion menu
- ✅ Auto-expand on relevant pages
- ✅ Smooth transitions
- ✅ Clear visual hierarchy
- ✅ Intuitive navigation

**Test it:** Click "Artikel" in sidebar to see the accordion in action!
