# 🌱 Seed Products & Fruit Types - Complete Guide

## 🎯 Overview

Script ini akan mengisi database dengan data produk dan fruit types yang **PERSIS** sesuai dengan `lib/produk-data.ts`.

## 📦 Data yang Akan Ditambahkan

### Products (3 items):

1. **Pisang** (5 fruit types)

   - Tasty Fruit Volcana
   - Tasty Fruit Pops
   - Tasty Fruit Twin
   - Tasty Fruit Max
   - Tasty Fruit One

2. **Melon** (2 fruit types)

   - Aurora Melon
   - Fujisawa Melon

3. **Alpukat** (1 fruit type)
   - Hass Avocado

**Total:** 3 products, 8 fruit types

## 🚀 How to Run

### Step 1: Open Supabase SQL Editor

1. **Go to Supabase Dashboard**

   - https://supabase.com
   - Select project: "tastyfruit"

2. **Open SQL Editor**
   - Click: **SQL Editor** in sidebar
   - Click: **New Query**

### Step 2: Copy & Paste SQL

1. **Open file:** `scripts/seed-products-complete.sql`
2. **Copy all content** (Ctrl+A, Ctrl+C)
3. **Paste in SQL Editor** (Ctrl+V)

### Step 3: Run Query

1. **Click:** "Run" button (or press Ctrl+Enter)
2. **Wait** for execution (~5 seconds)
3. **Check results** at bottom

### Step 4: Verify Data

Query will automatically show:

- List of products
- List of fruit types
- Count summary

Expected output:

```
Products: 3
Fruit Types: 8
```

## ✅ What This Script Does

### 1. Insert Products

- Creates 3 products (Pisang, Melon, Alpukat)
- Sets all product fields exactly as in produk-data.ts
- Uses `ON CONFLICT` to update if exists

### 2. Insert Fruit Types

- Creates 8 fruit types
- Links each to correct product
- Preserves exact descriptions with HTML

### 3. Verify Data

- Shows all products
- Shows all fruit types
- Shows count summary

## 📊 Data Structure

### Product Fields:

```sql
- slug (unique identifier)
- name (display name)
- description (HTML content)
- price (in Rupiah)
- category (Buah)
- stock (quantity)
- isActive (true)
- layoutType (layout-a or layout-b)
- characterSlug (mascot identifier)
- gesture (mascot image path)
- fruitCardType (layout-a or layout-b)
- bgGradient (hex color or empty)
- fruitCardImage (card image path)
- nutrition (JSON object)
```

### Fruit Type Fields:

```sql
- slug (unique identifier)
- name (display name)
- image (product image path)
- description (HTML content)
- productId (foreign key to products)
```

## 🔍 Verify in Admin Dashboard

After running script:

### 1. Check Products List

```
http://localhost:3000/produk
```

Should show:

- Pisang
- Melon
- Alpukat

### 2. Check Product Details

```
http://localhost:3000/produk/edit/[id]
```

Should show:

- All fields filled
- Nutrition data
- Layout type
- Character slug
- etc.

### 3. Check Fruit Types

Query in SQL Editor:

```sql
SELECT
  p.name as product,
  ft.name as fruit_type,
  ft.slug
FROM fruit_types ft
JOIN products p ON ft."productId" = p.id
ORDER BY p.name, ft.name;
```

Should show all 8 fruit types linked to products.

## 📋 Data Mapping

### Pisang (layout-a)

```
Character: mr-tasty
Gesture: /assets/mascots/pisang/pisang-gesture-01.png
Card: /assets/produk/pisang/pisang-card.png
Fruit Card Type: layout-a
BG Gradient: (empty)

Fruit Types:
1. Tasty Fruit Volcana
2. Tasty Fruit Pops
3. Tasty Fruit Twin
4. Tasty Fruit Max
5. Tasty Fruit One
```

### Melon (layout-b)

```
Character: oishi-maru
Gesture: /assets/mascots/melon/melon-gesture-03.png
Card: /assets/produk/melon/melon-card.png
Fruit Card Type: layout-b
BG Gradient: #B5FE28

Fruit Types:
1. Aurora Melon
2. Fujisawa Melon
```

### Alpukat (layout-a)

```
Character: nami
Gesture: /assets/mascots/alpukat/alpukat-gesture-03.png
Card: /assets/produk/alpukat/alpukat-card.png
Fruit Card Type: layout-b
BG Gradient: (empty)

Fruit Types:
1. Hass Avocado
```

## 🔧 Troubleshooting

### Error: "duplicate key value violates unique constraint"

**Solution:** Data already exists. Script will update existing data automatically.

### Error: "relation does not exist"

**Solution:** Run schema creation first:

```bash
bunx prisma db push
```

### Error: "column does not exist"

**Solution:** Schema might be outdated. Run:

```bash
bunx prisma generate
bunx prisma db push
```

### No data showing in dashboard

**Solution:**

1. Check if data exists in database
2. Restart dev server
3. Clear browser cache

## 🧪 Test Queries

### Check Products

```sql
SELECT
  slug,
  name,
  "layoutType",
  "characterSlug",
  "fruitCardType"
FROM products;
```

### Check Fruit Types with Products

```sql
SELECT
  p.name as product,
  ft.name as fruit_type,
  ft.slug as fruit_slug
FROM fruit_types ft
JOIN products p ON ft."productId" = p.id
ORDER BY p.name, ft.name;
```

### Check Nutrition Data

```sql
SELECT
  name,
  nutrition->>'energy' as energy,
  nutrition->>'protein' as protein,
  nutrition->>'carbohydrates' as carbs
FROM products;
```

### Count Everything

```sql
SELECT
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM fruit_types) as fruit_types;
```

## ✅ Success Indicators

- [ ] SQL script runs without errors
- [ ] Shows "Products: 3" in count
- [ ] Shows "Fruit Types: 8" in count
- [ ] Products visible in `/produk` page
- [ ] All fields populated correctly
- [ ] Nutrition data displays
- [ ] Fruit types linked to products
- [ ] HTML in descriptions preserved

## 🎯 Expected Result

### In Database:

```
products table:
- pisang (with 5 fruit types)
- melon (with 2 fruit types)
- alpukat (with 1 fruit type)

fruit_types table:
- 8 fruit types total
- All linked to correct products
```

### In Admin Dashboard:

```
/produk page:
- Shows 3 products
- Each with correct image
- Each with correct description

/produk/edit/[id] page:
- All fields filled
- Nutrition data present
- Layout type correct
- Character slug correct
```

## 📚 Related Files

- **SQL Script:** `scripts/seed-products-complete.sql`
- **Original Data:** `lib/produk-data.ts` (reference)
- **Schema:** `prisma/schema.prisma`

## 🔄 Re-running Script

Script is **idempotent** - safe to run multiple times:

- Uses `ON CONFLICT DO UPDATE`
- Updates existing data
- Doesn't create duplicates

To re-run:

1. Just run the script again
2. Data will be updated to latest values

## 🎉 After Seeding

Your database will have:

- ✅ 3 complete products
- ✅ 8 fruit types
- ✅ All nutrition data
- ✅ All layout configurations
- ✅ All character slugs
- ✅ All image paths
- ✅ Exact match with produk-data.ts

---

**🎉 Ready to seed your database!**

**File:** `scripts/seed-products-complete.sql`
**Action:** Copy → Paste in Supabase SQL Editor → Run
**Time:** ~5 seconds
**Result:** Complete product data! 🚀
