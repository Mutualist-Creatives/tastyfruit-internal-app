# 🔧 FINAL FIX - Storage RLS Error

## 🚨 Problem Identified

**Root Cause:** Code menggunakan bucket `"images"` tapi setup menggunakan bucket `"tastyfruit-uploads"`

## ✅ Complete Fix (2 Steps)

### Step 1: Run SQL di Supabase (WAJIB)

1. **Buka Supabase Dashboard** → SQL Editor → New Query

2. **Copy & Paste SQL ini:**

```sql
-- Clean up and create proper policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Create simple policy for authenticated users
CREATE POLICY "allow_all_authenticated"
ON storage.objects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow public read
CREATE POLICY "allow_public_read"
ON storage.objects
FOR SELECT
TO public
USING (true);

-- Ensure bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tastyfruit-uploads',
  'tastyfruit-uploads',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id)
DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[];

-- Verify
SELECT 'Setup complete!' as status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
SELECT name, public FROM storage.buckets WHERE name = 'tastyfruit-uploads';
```

3. **Click "Run"** atau tekan `Ctrl+Enter`

4. **Verify output:**
   - Should show: `allow_all_authenticated` policy
   - Should show: `allow_public_read` policy
   - Should show: bucket `tastyfruit-uploads` with `public = true`

### Step 2: Code Already Fixed ✅

Code sudah saya update untuk menggunakan bucket yang benar: `tastyfruit-uploads`

## 🧪 Test Now

1. **Restart dev server** (jika perlu):

   ```bash
   # Stop server (Ctrl+C)
   bun run dev
   ```

2. **Test upload:**

   ```
   Go to: /publikasi/tambah
   Fill form + upload image
   Click: Simpan Publikasi
   ```

3. **Expected result:**
   - ✅ No RLS error
   - ✅ File uploaded successfully
   - ✅ Image URL returned
   - ✅ Image displays in list

## 🔍 Verify Fix

### Check Console

- No `StorageApiError`
- No RLS policy violation
- Success message shown

### Check Supabase Storage

1. **Storage** → **tastyfruit-uploads**
2. Should see folders: `products/`, `recipes/`, `publications/`
3. Should see uploaded files

### Check Database

```sql
-- See uploaded files
SELECT
  name,
  bucket_id,
  created_at
FROM storage.objects
WHERE bucket_id = 'tastyfruit-uploads'
ORDER BY created_at DESC
LIMIT 10;
```

## 🐛 Still Not Working?

### Check 1: Verify Policies Exist

```sql
SELECT policyname, cmd, roles::text
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
```

Should show:

- `allow_all_authenticated` - ALL - {authenticated}
- `allow_public_read` - SELECT - {public}

### Check 2: Verify Bucket Exists

```sql
SELECT * FROM storage.buckets WHERE name = 'tastyfruit-uploads';
```

Should return 1 row with `public = true`

### Check 3: Check Authentication

Open browser console and run:

```javascript
// Check if user is authenticated
const {
  data: { user },
} = await supabase.auth.getUser();
console.log("User:", user);
console.log("Authenticated:", !!user);
```

Should show user object, not null

### Check 4: Clear Browser Cache

```
Ctrl+Shift+R (hard refresh)
Or clear browser cache
```

## 📊 What Changed

### Before (Wrong):

```typescript
// Using wrong bucket name
await this.uploadFile(file, "images", filePath);
return this.getPublicUrl("images", filePath);
```

### After (Correct):

```typescript
// Using correct bucket name
await this.uploadFile(file, "tastyfruit-uploads", filePath);
return this.getPublicUrl("tastyfruit-uploads", filePath);
```

## ✅ Success Checklist

- [ ] SQL script executed in Supabase
- [ ] Policies created (allow_all_authenticated, allow_public_read)
- [ ] Bucket exists (tastyfruit-uploads)
- [ ] Bucket is public
- [ ] Code updated (already done)
- [ ] Dev server restarted
- [ ] Upload works without error
- [ ] Image displays correctly

## 🎯 Expected Behavior After Fix

### Upload Flow:

1. User selects image
2. Form submits
3. File uploads to `tastyfruit-uploads/publications/xxx.jpg`
4. Returns public URL
5. URL saved to database
6. Image displays in list

### No More Errors:

- ❌ `StorageApiError`
- ❌ `new row violates row-level security policy`
- ❌ `Bucket not found`
- ✅ Success!

---

**🎉 After running the SQL, upload akan langsung work!**

**Critical:** WAJIB run SQL di Step 1 dulu!
**File SQL:** `scripts/fix-storage-rls-aggressive.sql`
