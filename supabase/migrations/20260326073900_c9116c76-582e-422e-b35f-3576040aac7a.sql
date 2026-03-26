
-- Grocery bills table
CREATE TABLE public.grocery_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  split_type TEXT NOT NULL DEFAULT 'equal' CHECK (split_type IN ('equal', 'itemized')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  settled_at TIMESTAMP WITH TIME ZONE
);

-- Bill participants
CREATE TABLE public.grocery_bill_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_id UUID NOT NULL REFERENCES public.grocery_bills(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount_owed NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(bill_id, user_id)
);

-- Bill items
CREATE TABLE public.grocery_bill_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_id UUID NOT NULL REFERENCES public.grocery_bills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  assigned_to UUID
);

-- RLS
ALTER TABLE public.grocery_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grocery_bill_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grocery_bill_items ENABLE ROW LEVEL SECURITY;

-- Bills: participants can view, creator can insert/update/delete
CREATE POLICY "Participants can view bills" ON public.grocery_bills
  FOR SELECT TO authenticated
  USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM public.grocery_bill_participants WHERE bill_id = id AND user_id = auth.uid())
  );

CREATE POLICY "Users can create bills" ON public.grocery_bills
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update bills" ON public.grocery_bills
  FOR UPDATE TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete bills" ON public.grocery_bills
  FOR DELETE TO authenticated
  USING (auth.uid() = creator_id);

-- Participants: viewable by bill participants, manageable by bill creator
CREATE POLICY "Bill participants can view participants" ON public.grocery_bill_participants
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grocery_bills
      WHERE grocery_bills.id = bill_id AND (
        grocery_bills.creator_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.grocery_bill_participants p2 WHERE p2.bill_id = grocery_bill_participants.bill_id AND p2.user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Creators can manage participants" ON public.grocery_bill_participants
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.grocery_bills WHERE id = bill_id AND creator_id = auth.uid())
  );

CREATE POLICY "Creators can update participants" ON public.grocery_bill_participants
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.grocery_bills WHERE id = bill_id AND creator_id = auth.uid())
    OR user_id = auth.uid()
  );

CREATE POLICY "Creators can delete participants" ON public.grocery_bill_participants
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.grocery_bills WHERE id = bill_id AND creator_id = auth.uid())
  );

-- Items: viewable by bill participants, manageable by bill creator
CREATE POLICY "Bill participants can view items" ON public.grocery_bill_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grocery_bills
      WHERE grocery_bills.id = bill_id AND (
        grocery_bills.creator_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.grocery_bill_participants WHERE grocery_bill_participants.bill_id = grocery_bill_items.bill_id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Creators can manage items" ON public.grocery_bill_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.grocery_bills WHERE id = bill_id AND creator_id = auth.uid())
  );

CREATE POLICY "Creators can update items" ON public.grocery_bill_items
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.grocery_bills WHERE id = bill_id AND creator_id = auth.uid())
  );

CREATE POLICY "Creators can delete items" ON public.grocery_bill_items
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.grocery_bills WHERE id = bill_id AND creator_id = auth.uid())
  );
