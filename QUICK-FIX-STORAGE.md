# 🚨 Quick Fix: "Bucket not found" Error

## Problem

Saat menambah data dengan upload gambar, muncul error:

```
StorageApiError: Bucket not found
```

## ✅ Quick Solution (5 menit)

### Option 1: Create Storage Bucket (Recommended)

1. **Buka Supabase Dashboard**

   - Go to: https://supabase.com
   - Select project: "tastyfruit"

2. **Create Bucket**

   - Click: **Storage** (sidebar)
   - Click: **"New bucket"**
   - Name: `images`
   - ✅ **Check "Public bucket"**
   - Click: **"Create bucket"**

3. **Done!**
   - Refresh your app
   - Try upload again

### Option 2: Use URL Instead (Temporary)

Jika tidak ingin setup storage dulu:

1. **Skip file upload**
2. **Gunakan URL gambar** di field "Atau masukkan URL Gambar"
3. Contoh URL:
   ```
   https://via.placeholder.com/400x300
   https://picsum.photos/400/300
   https://images.unsplash.com/photo-...
   ```

## 📸 Screenshot Guide

### Create Bucket:

```
Supabase Dashboard
└── Storage
    └── [New bucket] button
        ├── Name: images
        ├── [✓] Public bucket
        └── [Create bucket]
```

## ✅ Verify It Works

After creating bucket:

1. Go to `/produk/tambah`
2. Upload an image
3. Click "Simpan Produk"
4. Should work without error!

## 🎯 Why This Happens

Storage buckets are NOT created automatically. You must create them manually in Supabase Dashboard.

## 📚 More Info

See: `scripts/setup-storage.md` for detailed guide
