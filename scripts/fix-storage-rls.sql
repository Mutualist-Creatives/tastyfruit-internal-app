-- Fix Storage RLS Error
-- Run this in Supabase SQL Editor

-- 1. Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_select" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete" ON storage.objects;
DROP POLICY IF EXISTS "admin_full_access" ON storage.objects;

-- 2. Create simple policy for admin app (all authenticated users have full access)
CREATE POLICY "admin_full_access"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'tastyfruit-uploads')
WITH CHECK (bucket_id = 'tastyfruit-uploads');

-- 3. Verify bucket exists and is public
UPDATE storage.buckets
SET public = true
WHERE name = 'tastyfruit-uploads';

-- 4. Verify policies created
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

-- 5. Check bucket configuration
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'tastyfruit-uploads';

-- Expected output:
-- Policy: admin_full_access with cmd = ALL
-- Bucket: public = true
