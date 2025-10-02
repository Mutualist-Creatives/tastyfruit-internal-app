# 🔧 Fix Storage RLS Error - "new row violates row-level security policy"

## 🚨 Problem

Error saat upload file di publikasi:

```
StorageApiError: new row violates row-level security policy
```

## 🎯 Root Cause

Supabase Storage RLS (Row Level Security) policy terlalu ketat atau belum dikonfigurasi dengan benar untuk authenticated users.

## ✅ Solution

### Option 1: Update RLS Policy via Supabase Dashboard (Recommended)

#### Step 1: Go to Storage Policies

1. **Supabase Dashboard** → Project "tastyfruit"
2. **Storage** → **Policies**
3. Find bucket: `tastyfruit-uploads`

#### Step 2: Update/Create Policies

**Policy 1: Allow INSERT for authenticated users**

```sql
-- Name: Allow authenticated users to upload
-- Operation: INSERT
-- Policy:
(bucket_id = 'tastyfruit-uploads'::text)
AND (auth.role() = 'authenticated'::text)
```

**Policy 2: Allow SELECT for authenticated users**

```sql
-- Name: Allow authenticated users to read
-- Operation: SELECT
-- Policy:
(bucket_id = 'tastyfruit-uploads'::text)
AND (auth.role() = 'authenticated'::text)
```

**Policy 3: Allow UPDATE for authenticated users**

```sql
-- Name: Allow authenticated users to update
-- Operation: UPDATE
-- Policy:
(bucket_id = 'tastyfruit-uploads'::text)
AND (auth.role() = 'authenticated'::text)
```

**Policy 4: Allow DELETE for authenticated users**

```sql
-- Name: Allow authenticated users to delete
-- Operation: DELETE
-- Policy:
(bucket_id = 'tastyfruit-uploads'::text)
AND (auth.role() = 'authenticated'::text)
```

### Option 2: Run SQL Script (Faster)

#### Step 1: Go to SQL Editor

1. **Supabase Dashboard** → **SQL Editor**
2. **New Query**

#### Step 2: Run This SQL

```sql
-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON storage.objects;

-- Create new policies for authenticated users
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tastyfruit-uploads'
);

CREATE POLICY "Allow authenticated users to read"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'tastyfruit-uploads'
);

CREATE POLICY "Allow authenticated users to update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tastyfruit-uploads'
)
WITH CHECK (
  bucket_id = 'tastyfruit-uploads'
);

CREATE POLICY "Allow authenticated users to delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tastyfruit-uploads'
);

-- Verify policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
```

#### Step 3: Run Query

Click **"Run"** or press `Ctrl+Enter`

### Option 3: Disable RLS (Not Recommended for Production)

⚠️ **Only for development/testing**

```sql
-- Disable RLS on storage.objects (NOT RECOMMENDED)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

## 🧪 Test the Fix

### 1. Try Upload Again

1. **Go to**: `/publikasi/tambah`
2. **Fill form** with image
3. **Click**: "Simpan Publikasi"
4. **Should work** without RLS error

### 2. Check Console

- No more `StorageApiError`
- File uploaded successfully
- Image URL returned

### 3. Verify in Supabase

1. **Storage** → **tastyfruit-uploads**
2. **Should see** uploaded files
3. **Files accessible** via URL

## 🔍 Verify Current Policies

### Check Existing Policies

```sql
-- See all storage policies
SELECT
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;
```

### Check Bucket Configuration

```sql
-- See bucket settings
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'tastyfruit-uploads';
```

## 🐛 Still Not Working?

### Check Authentication

```typescript
// In your upload code, verify user is authenticated
const supabase = createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

console.log("Current user:", user); // Should not be null
console.log("User role:", user?.role); // Should be 'authenticated'
```

### Check Bucket Exists

```sql
-- Verify bucket exists
SELECT * FROM storage.buckets WHERE name = 'tastyfruit-uploads';
```

If not exists, create it:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('tastyfruit-uploads', 'tastyfruit-uploads', true);
```

### Check File Path

Make sure file path doesn't start with `/`:

```typescript
// ❌ Wrong
const filePath = "/products/image.jpg";

// ✅ Correct
const filePath = "products/image.jpg";
```

## 📊 Complete RLS Setup

### Recommended Policy Structure

```sql
-- Policy for INSERT (upload)
CREATE POLICY "authenticated_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tastyfruit-uploads'
);

-- Policy for SELECT (read/download)
CREATE POLICY "authenticated_select"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'tastyfruit-uploads'
);

-- Policy for UPDATE (replace file)
CREATE POLICY "authenticated_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tastyfruit-uploads'
)
WITH CHECK (
  bucket_id = 'tastyfruit-uploads'
);

-- Policy for DELETE (remove file)
CREATE POLICY "authenticated_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tastyfruit-uploads'
);
```

## 🔒 Security Best Practices

### For Production

Consider more restrictive policies:

```sql
-- Only allow users to upload to their own folder
CREATE POLICY "user_folder_upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tastyfruit-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Only allow users to access their own files
CREATE POLICY "user_folder_select"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'tastyfruit-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### For Admin App (Current Use Case)

Since this is an internal admin app, simpler policies work:

```sql
-- All authenticated users can do everything
CREATE POLICY "admin_full_access"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'tastyfruit-uploads')
WITH CHECK (bucket_id = 'tastyfruit-uploads');
```

## ✅ Success Checklist

- [ ] RLS policies created/updated
- [ ] Bucket exists and is public
- [ ] User is authenticated
- [ ] File upload works without error
- [ ] Image displays correctly
- [ ] Can upload to products
- [ ] Can upload to recipes
- [ ] Can upload to publications

## 📚 Additional Resources

- [Supabase Storage RLS Guide](https://supabase.com/docs/guides/storage/security/access-control)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

**🎉 After applying this fix, file uploads should work perfectly!**

**Test**: Upload image in `/publikasi/tambah`
**Expected**: Success without RLS error
