-- AGGRESSIVE FIX for Storage RLS Error
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS temporarily to clean up
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies on storage.objects
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 4: Create ONE simple policy for everything
CREATE POLICY "allow_all_authenticated"
ON storage.objects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 5: Also allow public access (for viewing images)
CREATE POLICY "allow_public_read"
ON storage.objects
FOR SELECT
TO public
USING (true);

-- Step 6: Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tastyfruit-uploads',
  'tastyfruit-uploads',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) 
DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[];

-- Step 7: Verify setup
SELECT 'Policies:' as info;
SELECT 
  policyname,
  cmd,
  roles::text,
  CASE 
    WHEN qual = 'true'::text::pg_node_tree THEN 'true (allow all)'
    ELSE qual::text
  END as using_clause,
  CASE 
    WHEN with_check = 'true'::text::pg_node_tree THEN 'true (allow all)'
    ELSE with_check::text
  END as with_check_clause
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;

SELECT 'Bucket:' as info;
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'tastyfruit-uploads';

-- Expected output:
-- Policy 1: allow_all_authenticated - FOR ALL - TO authenticated - USING true - WITH CHECK true
-- Policy 2: allow_public_read - FOR SELECT - TO public - USING true
-- Bucket: public = true, file_size_limit = 52428800
