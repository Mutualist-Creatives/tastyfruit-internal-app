# 🗂️ Setup Supabase Storage

## Error: "Bucket not found"

Ini terjadi karena storage bucket belum dibuat di Supabase.

## ✅ Solution: Create Storage Bucket

### Step 1: Buka Supabase Dashboard

1. Login ke [supabase.com](https://supabase.com)
2. Pilih project **"tastyfruit"**
3. Buka **Storage** di sidebar kiri

### Step 2: Create Bucket

1. Klik **"New bucket"** atau **"Create a new bucket"**
2. Isi form:
   ```
   Name: images
   Public bucket: ✅ (CENTANG INI!)
   ```
3. Klik **"Create bucket"**

### Step 3: Verify Bucket Created

- Bucket "images" akan muncul di list
- Status: Public

## 🔧 Alternative: Disable File Upload Temporarily

Jika Anda ingin test tanpa upload gambar dulu, skip file upload dan gunakan URL saja.

### Di Form Tambah Produk:

1. **Jangan upload file**
2. **Langsung isi URL gambar** di field "Atau masukkan URL Gambar"
3. Contoh URL: `https://via.placeholder.com/400x300`

## 📝 Bucket Structure

Setelah dibuat, struktur folder akan otomatis:

```
images/
├── products/
│   ├── product-id-123.jpg
│   └── product-id-456.png
├── recipes/
│   ├── recipe-id-789.jpg
│   └── recipe-id-012.png
└── publications/
    ├── pub-id-345.jpg
    └── pub-id-678.png
```

## 🔐 Bucket Policies (Optional)

Untuk production, Anda bisa set policies:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );
```

## ✅ Test Upload

Setelah bucket dibuat:

1. Buka `/produk/tambah`
2. Upload gambar
3. Submit form
4. Check di Supabase Storage > images > products

## 🐛 Troubleshooting

### Still getting "Bucket not found"?

1. **Refresh browser** (Ctrl+F5)
2. **Check bucket name** - harus exact "images" (lowercase)
3. **Verify in Supabase** - Storage > images exists

### Upload fails with permission error?

1. **Make bucket public** - Edit bucket settings
2. **Or add RLS policies** - See policies above

### Image not showing after upload?

1. **Check bucket is public**
2. **Verify URL** - Should be: `https://[project].supabase.co/storage/v1/object/public/images/...`

## 🚨 Fix RLS Policy Error

If you get error: **"new row violates row-level security policy"**

### Quick Fix (Development):

1. **Buka SQL Editor** di Supabase
2. **Run this command:**

```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

3. **Done!** Try upload again

### Production Fix (Recommended):

Use proper policies from `scripts/fix-storage-rls.sql`

## ✅ Verify Upload Works

1. Go to `/produk/tambah`
2. Upload an image
3. Submit form
4. Check: Supabase Storage > images > products
5. Image should appear!
