
DROP POLICY IF EXISTS "Participants can view bills" ON public.grocery_bills;
CREATE POLICY "Anyone can view bills" ON public.grocery_bills
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Bill participants can view participants" ON public.grocery_bill_participants;
CREATE POLICY "Anyone can view participants" ON public.grocery_bill_participants
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Bill participants can view items" ON public.grocery_bill_items;
CREATE POLICY "Anyone can view items" ON public.grocery_bill_items
FOR SELECT TO authenticated USING (true);
