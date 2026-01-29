-- Add DELETE policy for matches table to allow users to permanently remove their match history
-- This addresses GDPR/privacy requirements for right to erasure
CREATE POLICY "Users can delete their matches"
ON public.matches FOR DELETE
USING (auth.uid() IN (user1_id, user2_id));

-- Add message content length constraint to prevent abuse (5000 character limit)
ALTER TABLE public.messages
ADD CONSTRAINT message_content_length
CHECK (char_length(content) <= 5000);