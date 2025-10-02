# 🔗 TastyFruit Data Integration Guide

## 📊 Database Schema Overview

Schema baru sudah disesuaikan dengan data struktur TastyFruit yang lengkap:

### **Products Table**

- ✅ Basic info: name, description, price, category
- ✅ Product details: slug, layoutType, characterSlug, gesture
- ✅ Visual: fruitCardType, bgGradient, fruitCardImage
- ✅ Nutrition: JSON field untuk data nutrisi lengkap
- ✅ Relations: One-to-Many dengan FruitTypes

### **FruitTypes Table** (Product Variants)

- ✅ Variants seperti: Volcana, Pops, Twin, Max, One
- ✅ Each variant: name, slug, image, description
- ✅ Linked to parent product

### **Recipes Table**

- ✅ Recipe info: title, description, image, author
- ✅ Details: servings, cookingTime, difficulty
- ✅ Ingredients: JSON array dengan {name, amount, note}
- ✅ Instructions: JSON array dengan {title, description}

### **Publications Table**

- ✅ Article info: title, content (HTML), excerpt
- ✅ Meta: author, category, imageUrl
- ✅ Publishing: isPublished, publishedAt

## 🚀 Setup Steps

### 1. Run Database Schema

```bash
# Di Supabase SQL Editor, run:
scripts/supabase-schema.sql
```

### 2. Seed Sample Data

```bash
# Di Supabase SQL Editor, run:
scripts/supabase-seed-data.sql
```

### 3. Generate Prisma Client

```bash
# Close any running dev server first
# Then run:
bun run db:generate
```

### 4. Test Connection

```bash
bun run dev
```

## 📝 Data Examples

### Product with Variants (Pisang)

```json
{
  "id": "uuid",
  "slug": "pisang",
  "name": "Pisang Tasty Fruit",
  "description": "Pisang Tasty Fruit® memiliki rasa yang manis...",
  "price": 25000,
  "category": "Buah Segar",
  "layoutType": "layout-a",
  "characterSlug": "mr-tasty",
  "gesture": "/assets/mascots/pisang/pisang-gesture-01.png",
  "fruitCardType": "layout-a",
  "fruitCardImage": "/assets/produk/pisang/pisang-card.png",
  "nutrition": {
    "energy": "89 kcal",
    "totalFat": "0.3g",
    "carbohydrates": "22g",
    ...
  },
  "fruitTypes": [
    {
      "name": "Tasty Fruit Volcana",
      "slug": "tasty-fruit-volcana",
      "image": "/assets/produk/pisang/Tasty Fruit Volcana.png",
      "description": "Setiap kemasan berisikan 4-5 pisang premium..."
    },
    ...
  ]
}
```

### Recipe with Structured Data

```json
{
  "id": "uuid",
  "title": "Banana Bread",
  "servings": "6-8",
  "cookingTime": "60 minutes",
  "author": "John Doe",
  "difficulty": "Easy",
  "ingredients": [
    {
      "name": "Pisang Matang",
      "amount": "3 buah",
      "note": "Lumatkan hingga halus"
    },
    ...
  ],
  "instructions": [
    {
      "title": "Panaskan Oven",
      "description": "Siapkan oven di suhu 175°C..."
    },
    ...
  ]
}
```

### Publication with HTML Content

```json
{
  "id": "uuid",
  "title": "Pop-up booth Tasty Fruit...",
  "content": "<h2>Terobosan Baru</h2><p>Industri makanan...</p>",
  "excerpt": "Tasty Fruit hadir di Farmer's Market...",
  "author": "Tim Tasty Fruit",
  "category": "Event",
  "imageUrl": "/assets/artikel/publikasi/houses.jpg",
  "isPublished": true,
  "publishedAt": "2025-05-10T00:00:00Z"
}
```

## 🔧 API Usage Examples

### Get Products with Variants

```typescript
const products = await prisma.product.findMany({
  include: {
    fruitTypes: true,
  },
});
```

### Get Recipe with Full Details

```typescript
const recipe = await prisma.recipe.findUnique({
  where: { id: recipeId },
});

// Access structured data
const ingredients = recipe.ingredients as Array<{
  name: string;
  amount: string;
  note?: string;
}>;

const instructions = recipe.instructions as Array<{
  title: string;
  description: string;
}>;
```

### Get Publications by Category

```typescript
const publications = await prisma.publication.findMany({
  where: {
    category: "Event",
    isPublished: true,
  },
  orderBy: {
    publishedAt: "desc",
  },
});
```

## 🎯 Migration from Static Data

Jika Anda memiliki data static di `/lib/*-data.ts`, data tersebut sudah di-seed ke database. Anda bisa:

1. **Keep static files** untuk reference
2. **Use database** untuk production data
3. **Sync** jika ada perubahan

## 📚 Files Reference

- **Schema**: `scripts/supabase-schema.sql`
- **Seed Data**: `scripts/supabase-seed-data.sql`
- **Prisma Schema**: `prisma/schema.prisma`
- **Setup Guide**: `SETUP-TASTYFRUIT.md`

## ⚠️ Important Notes

1. **JSON Fields**: `nutrition`, `ingredients`, `instructions` stored as JSONB
2. **Relations**: Products have one-to-many with FruitTypes
3. **Slugs**: Used for URL-friendly identifiers
4. **HTML Content**: Publications support full HTML in content field
5. **Timestamps**: Auto-updated via triggers

## 🐛 Troubleshooting

### Prisma Generate Error

```bash
# Close dev server and any processes using node_modules
# Then retry:
bun run db:generate
```

### Connection Error

```bash
# Check environment variables
bun run setup:check

# Verify DATABASE_URL is correct
```

### Data Not Showing

```bash
# Check if seed ran successfully
# In Supabase SQL Editor:
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM recipes;
SELECT COUNT(*) FROM publications;
```
