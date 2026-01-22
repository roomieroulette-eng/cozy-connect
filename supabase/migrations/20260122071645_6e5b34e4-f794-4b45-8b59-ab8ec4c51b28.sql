-- Fix 1: Add DELETE policy for profiles table (GDPR compliance)
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix 2: Make profile-photos bucket private and add MIME type restrictions
UPDATE storage.buckets 
SET public = false,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    file_size_limit = 5242880
WHERE id = 'profile-photos';

-- Fix 3: Drop the permissive storage policy and add authenticated-only policy
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;

CREATE POLICY "Authenticated users can view profile photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'profile-photos');

-- Keep the existing upload policy (users can upload to their own folder)