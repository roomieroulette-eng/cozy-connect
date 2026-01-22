-- Create matches table to store mutual matches
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unmatched_at TIMESTAMP WITH TIME ZONE,
  unmatched_by UUID,
  CONSTRAINT unique_match UNIQUE (user1_id, user2_id),
  CONSTRAINT different_users CHECK (user1_id <> user2_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for matches
CREATE POLICY "Users can view their own matches"
ON public.matches FOR SELECT
USING (
  auth.uid() IN (user1_id, user2_id) 
  AND unmatched_at IS NULL
);

CREATE POLICY "Users can create matches"
ON public.matches FOR INSERT
WITH CHECK (auth.uid() IN (user1_id, user2_id));

CREATE POLICY "Users can unmatch"
ON public.matches FOR UPDATE
USING (auth.uid() IN (user1_id, user2_id))
WITH CHECK (auth.uid() IN (user1_id, user2_id));

-- RLS policies for messages
CREATE POLICY "Users can view messages in their matches"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE id = match_id 
    AND auth.uid() IN (user1_id, user2_id)
    AND unmatched_at IS NULL
  )
);

CREATE POLICY "Users can send messages in their matches"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.matches 
    WHERE id = match_id 
    AND auth.uid() IN (user1_id, user2_id)
    AND unmatched_at IS NULL
  )
);

CREATE POLICY "Users can mark messages as read"
ON public.messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE id = match_id 
    AND auth.uid() IN (user1_id, user2_id)
  )
  AND sender_id <> auth.uid()
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create index for faster queries
CREATE INDEX idx_matches_users ON public.matches(user1_id, user2_id);
CREATE INDEX idx_messages_match ON public.messages(match_id, created_at DESC);