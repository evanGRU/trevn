-- ============================================
-- STORAGE BUCKET POLICIES : avatars
-- ============================================

DROP policy IF EXISTS "Allow authenticated users to upload own avatar" ON storage.objects;
DROP policy IF EXISTS "Allow authenticated users to update own avatar" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid() = owner
);

CREATE POLICY "Allow authenticated users to update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND auth.uid() = owner
)
WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() = owner
);

CREATE POLICY "Allow authenticated users to delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND auth.uid() = owner
);


-- ============================================
-- AVATARS TABLE POLICIES
-- ============================================

ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view avatars"
ON avatars
FOR SELECT
USING (true);

CREATE POLICY "Users can create their avatars"
ON avatars
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
);

CREATE POLICY "Users can delete their avatars"
ON avatars
FOR DELETE
USING (
  auth.uid() = created_by
);