-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Create a more restrictive SELECT policy:
-- Users can view their own profile OR completed profiles for discovery
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view completed profiles for discovery"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  onboarding_completed = true AND
  user_id != auth.uid()
);