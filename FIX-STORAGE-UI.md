# 🔧 Fix Storage RLS via Dashboard UI (No SQL!)

## Problem

```
ERROR: 42501: must be owner of table objects
new row violates row-level security policy
```

## ✅ Solution via Supabase Dashboard UI

### Method 1: Disable RLS via UI (Easiest - 1 minute)

1. **Buka Supabase Dashboard**

   - Project: "tastyfruit"

2. **Go to Storage**

   - Click: **Storage** (sidebar)
   - Click bucket: **"images"**

3. **Edit Bucket Settings**
   - Click: **⋮** (three dots) next to bucket name
   - Click: **"Edit bucket"**
   - Look for: **"Row Level Security"** or **"RLS"**
   - **Disable/Turn OFF** RLS
   - Click: **"Save"**

### Method 2: Add Policies via UI (Better for Production)

1. **Go to Storage Policies**

   - **Storage** → **Policies**
   - Or: **Authentication** → **Policies** → **storage.objects**

2. **Add New Policy**

   - Click: **"New Policy"**
   - Template: **"Enable insert for authenticated users only"**
   - Target: `storage.objects`
   - Policy name: `Allow authenticated uploads`
   - Click: **"Review"** → **"Save policy"**

3. **Add More Policies** (repeat for each):
   - **SELECT** (read): Allow public
   - **INSERT** (upload): Allow authenticated
   - **UPDATE**: Allow authenticated
   - **DELETE**: Allow authenticated

### Method 3: Use Supabase Dashboard Bucket Settings

1. **Storage** → **"images"** bucket
2. Click **"Policies"** tab
3. Click **"Add policy"**
4. Use templates:
   - ✅ "Enable read access for all users"
   - ✅ "Enable insert for authenticated users only"
   - ✅ "Enable update for authenticated users only"
   - ✅ "Enable delete for authenticated users only"

## 🎯 Quickest Solution (30 seconds)

### Via Bucket Configuration:

1. **Storage** → **images** bucket
2. Click **Configuration** or **Settings**
3. Find **"Public"** toggle
4. Make sure it's **ON** (enabled)
5. Find **"RLS"** or **"Row Level Security"**
6. **Turn it OFF** for development

## ✅ Verify It Works

After disabling RLS:

1. Refresh your app (Ctrl+F5)
2. Go to `/produk/tambah`
3. Upload an image
4. Click "Simpan Produk"
5. Should work! ✅

## 📸 Where to Find Settings

```
Supabase Dashboard
└── Storage
    └── images (bucket)
        ├── [⋮] Menu
        │   └── Edit bucket
        │       └── [Toggle] Row Level Security: OFF
        │
        └── Policies tab
            └── [Add policy] button
```

## 🔐 For Production

After development, enable RLS and add proper policies:

- Public can READ
- Authenticated can INSERT/UPDATE/DELETE

## 🐛 Still Not Working?

Try this in SQL Editor (as postgres user):

```sql
-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- If no policies exist, bucket might need recreation
```

Or contact Supabase support if permission issues persist.

## ✅ Success Indicators

After fix:

- ✅ Upload works without errors
- ✅ Image appears in Storage > images > products
- ✅ Image URL is saved to database
- ✅ Image displays in product list
