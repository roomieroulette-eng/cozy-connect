DROP VIEW IF EXISTS public.profile_previews;

CREATE VIEW public.profile_previews AS
SELECT
  user_id,
  name,
  age,
  occupation,
  city,
  neighborhoods[1] AS neighborhood,
  photos[1] AS primary_photo,
  min_budget,
  max_budget,
  personality_type,
  cleanliness,
  sleep_schedule,
  has_pets,
  pet_friendly,
  smoking,
  drinking,
  work_from_home,
  onboarding_completed,
  LEFT(bio, 120) AS bio_preview,
  COALESCE(array_length(interests, 1), 0) AS interest_count,
  housing_status
FROM public.profiles;