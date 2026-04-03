
-- Allow any authenticated user to insert themselves as a participant
DROP POLICY IF EXISTS "Creators can manage participants" ON public.grocery_bill_participants;

CREATE POLICY "Users can join bills" ON public.grocery_bill_participants
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
