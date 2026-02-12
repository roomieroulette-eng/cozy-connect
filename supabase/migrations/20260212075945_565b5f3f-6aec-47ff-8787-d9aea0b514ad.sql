-- Fix profile_previews to not use security_invoker so discovery can read all onboarded profiles
-- The view already limits exposed fields (no full bio, no full photos array, etc.)
CREATE OR REPLACE VIEW public.profile_previews
WITH (security_invoker = off)
AS
SELECT 
  user_id,
  name,
  age,
  occupation,
  city,
  neighborhoods[1] AS neighborhood,
  min_budget,
  max_budget,
  photos[1] AS primary_photo,
  personality_type,
  cleanliness,
  sleep_schedule,
  has_pets,
  pet_friendly,
  smoking,
  drinking,
  work_from_home,
  array_length(interests, 1) AS interest_count,
  CASE
    WHEN bio IS NOT NULL AND length(bio) > 100 THEN substring(bio FROM 1 FOR 100) || '...'
    ELSE bio
  END AS bio_preview,
  onboarding_completed
FROM profiles
WHERE onboarding_completed = true;