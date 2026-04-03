
-- Drop problematic policies
DROP POLICY IF EXISTS "Participants can view bills" ON public.grocery_bills;
DROP POLICY IF EXISTS "Bill participants can view participants" ON public.grocery_bill_participants;
DROP POLICY IF EXISTS "Bill participants can view items" ON public.grocery_bill_items;

-- Create a security definer function to check bill access without recursion
CREATE OR REPLACE FUNCTION public.is_bill_participant(_user_id uuid, _bill_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM grocery_bill_participants
    WHERE user_id = _user_id AND bill_id = _bill_id
  );
$$;

-- Recreate grocery_bills SELECT: creator OR participant
CREATE POLICY "Participants can view bills" ON public.grocery_bills
FOR SELECT TO authenticated
USING (auth.uid() = creator_id OR public.is_bill_participant(auth.uid(), id));

-- Recreate grocery_bill_participants SELECT: creator or participant of that bill
CREATE POLICY "Bill participants can view participants" ON public.grocery_bill_participants
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM grocery_bills WHERE grocery_bills.id = bill_id AND grocery_bills.creator_id = auth.uid())
  OR public.is_bill_participant(auth.uid(), bill_id)
);

-- Recreate grocery_bill_items SELECT
CREATE POLICY "Bill participants can view items" ON public.grocery_bill_items
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM grocery_bills WHERE grocery_bills.id = bill_id AND grocery_bills.creator_id = auth.uid())
  OR public.is_bill_participant(auth.uid(), bill_id)
);
