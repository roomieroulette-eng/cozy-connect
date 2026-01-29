-- Create a secure view for profile previews in discovery
-- This view exposes only the fields needed for the discovery swipe cards
-- WITH (security_invoker=on) ensures the view respects RLS policies

CREATE VIEW public.profile_previews
WITH (security_invoker=on) AS
SELECT 
  user_id,
  name,
  age,
  occupation,
  city,
  neighborhoods[1] as neighborhood,  -- Only first neighborhood
  min_budget,
  max_budget,
  photos[1] as primary_photo,  -- Only first photo for preview
  personality_type,
  cleanliness,
  sleep_schedule,
  has_pets,
  pet_friendly,
  smoking,
  drinking,
  work_from_home,
  array_length(interests, 1) as interest_count,
  CASE 
    WHEN bio IS NOT NULL AND length(bio) > 100 
    THEN substring(bio from 1 for 100) || '...'
    ELSE bio
  END as bio_preview,
  onboarding_completed
FROM public.profiles
WHERE onboarding_completed = true;

-- Drop the overly permissive discovery policy
DROP POLICY IF EXISTS "Users can view completed profiles for discovery" ON public.profiles;

-- Create new restrictive policy: users can only view their own profile OR profiles of matched users
CREATE POLICY "Users can view their own or matched profiles"
ON public.profiles FOR SELECT
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.matches
    WHERE (
      (user1_id = auth.uid() AND user2_id = profiles.user_id)
      OR (user2_id = auth.uid() AND user1_id = profiles.user_id)
    )
    AND unmatched_at IS NULL
  )
);

-- Drop the existing own profile policy since we're combining them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Grant SELECT on the view to authenticated users for discovery
GRANT SELECT ON public.profile_previews TO authenticated;