-- Create swipes table to track user swipe actions
CREATE TABLE public.swipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID NOT NULL,
  swiped_id UUID NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right')),
  is_super_like BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(swiper_id, swiped_id)
);

-- Enable RLS
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

-- Users can view their own swipes
CREATE POLICY "Users can view their own swipes"
ON public.swipes
FOR SELECT
USING (auth.uid() = swiper_id);

-- Users can create their own swipes
CREATE POLICY "Users can create their own swipes"
ON public.swipes
FOR INSERT
WITH CHECK (auth.uid() = swiper_id);

-- Index for quick lookups
CREATE INDEX idx_swipes_swiper ON public.swipes(swiper_id);
CREATE INDEX idx_swipes_swiped ON public.swipes(swiped_id);
CREATE INDEX idx_swipes_mutual ON public.swipes(swiped_id, swiper_id, direction);

-- Function to check if the other user already swiped right on us (mutual like)
CREATE OR REPLACE FUNCTION public.check_mutual_like(other_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM swipes
    WHERE swiper_id = other_user_id
      AND swiped_id = auth.uid()
      AND direction = 'right'
  );
END;
$$;