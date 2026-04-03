
-- Update delete policy to also let users remove themselves
DROP POLICY IF EXISTS "Creators can delete participants" ON public.grocery_bill_participants;

CREATE POLICY "Creators or self can delete participants" ON public.grocery_bill_participants
FOR DELETE TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM grocery_bills WHERE grocery_bills.id = bill_id AND grocery_bills.creator_id = auth.uid())
);
