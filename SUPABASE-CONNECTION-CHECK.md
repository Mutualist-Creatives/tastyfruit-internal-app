# 🔗 Supabase Connection Checklist

## ✅ Quick Check

### 1. Environment Variables

```bash
# Check if all variables are set
bun run setup:check
```

**Expected output:**

```
✅ All environment variables are set!
🚀 You can now run: bun run dev
```

### 2. Database Tables

Di Supabase SQL Editor, run:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Check data counts
SELECT
  (SELECT COUNT(*) FROM products) as products_count,
  (SELECT COUNT(*) FROM recipes) as recipes_count,
  (SELECT COUNT(*) FROM publications) as publications_count,
  (SELECT COUNT(*) FROM users) as users_count;
```

**Expected:** Tables exist dengan data

### 3. Test API Endpoints

```bash
# Start dev server
bun run dev
```

Then test these URLs in browser:

- http://localhost:3000/api/products
- http://localhost:3000/api/recipes
- http://localhost:3000/api/publications

**Expected:** JSON data returned

## 🔧 Pages Using Supabase Data

### ✅ Dashboard (`/dashboard`)

- Fetches from `/api/dashboard/stats`
- Shows: product counts, recipe counts, publication counts
- Charts with monthly data

### ✅ Products (`/produk`)

- Fetches from `/api/products`
- Features: search, filter, pagination
- CRUD: create, read, update, delete

### ✅ Recipes (`/resep`)

- Fetches from `/api/recipes`
- Shows: recipe cards with details
- CRUD: create, read, update, delete

### ✅ Publications (`/publikasi`)

- Fetches from `/api/publications`
- Shows: publication cards
- CRUD: create, read, update, delete

## 🐛 Troubleshooting

### Dashboard "Failed to load"

**Check 1: API Response**

```bash
# Open browser console (F12)
# Look for errors in Network tab
```

**Check 2: Database Connection**

```sql
-- In Supabase SQL Editor
SELECT * FROM products LIMIT 1;
SELECT * FROM recipes LIMIT 1;
SELECT * FROM publications LIMIT 1;
```

**Check 3: Environment Variables**

```bash
# Verify .env file has correct values
cat .env
```

### Empty Data

**Solution 1: Run Seed Script**

```sql
-- In Supabase SQL Editor
-- Run: scripts/supabase-seed-data.sql
```

**Solution 2: Check RLS Policies**

```sql
-- Disable RLS for testing (in Supabase Dashboard)
-- Go to Authentication > Policies
-- Or run:
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE publications DISABLE ROW LEVEL SECURITY;
```

### API Returns 500 Error

**Check 1: Database URL**

```
DATABASE_URL should be:
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
```

**Check 2: Prisma Client**

```bash
# Regenerate Prisma client
bun run db:generate
```

**Check 3: Server Logs**

```bash
# Check terminal for error messages
# Look for database connection errors
```

## 📊 Data Flow

```
User Request
    ↓
Next.js Page (Client Component)
    ↓
fetch('/api/...')
    ↓
API Route (/app/api/.../route.ts)
    ↓
Prisma Client
    ↓
Supabase PostgreSQL
    ↓
Return JSON Data
    ↓
Display in UI
```

## 🎯 Quick Test Commands

```bash
# 1. Check environment
bun run setup:check

# 2. Start server
bun run dev

# 3. Test in browser
# - Login: http://localhost:3000/login
# - Dashboard: http://localhost:3000/dashboard
# - Products: http://localhost:3000/produk
# - Recipes: http://localhost:3000/resep
# - Publications: http://localhost:3000/publikasi

# 4. Check API directly
# - http://localhost:3000/api/products
# - http://localhost:3000/api/recipes
# - http://localhost:3000/api/publications
```

## ✅ Success Indicators

- [ ] Login works
- [ ] Dashboard shows statistics
- [ ] Products page shows list
- [ ] Recipes page shows list
- [ ] Publications page shows list
- [ ] Can create new items
- [ ] Can edit items
- [ ] Can delete items
- [ ] Images upload works

## 🚀 If Everything Works

You should see:

- ✅ Dashboard with real numbers
- ✅ Product list from database
- ✅ Recipe list from database
- ✅ Publication list from database
- ✅ No "Failed to load" errors
- ✅ CRUD operations work

**Congratulations! Your Supabase connection is working!** 🎉
