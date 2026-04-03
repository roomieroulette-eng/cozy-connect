import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface GroceryBillItem {
  id: string;
  billId: string;
  name: string;
  price: number;
  assignedTo: string | null;
}

export interface GroceryBillParticipant {
  id: string;
  billId: string;
  userId: string;
  userName?: string;
  amountOwed: number;
  paid: boolean;
}

export interface GroceryBill {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  splitType: "equal" | "itemized";
  createdAt: string;
  settledAt: string | null;
  items: GroceryBillItem[];
  participants: GroceryBillParticipant[];
  total: number;
}

export function useGroceryBills() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bills, setBills] = useState<GroceryBill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: billsData, error } = await supabase
        .from("grocery_bills")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const enriched: GroceryBill[] = await Promise.all(
        (billsData || []).map(async (bill: any) => {
          const [{ data: items }, { data: participants }] = await Promise.all([
            supabase.from("grocery_bill_items").select("*").eq("bill_id", bill.id),
            supabase.from("grocery_bill_participants").select("*").eq("bill_id", bill.id),
          ]);

          // Get participant + creator names
          const allUserIds = [...new Set([...(participants || []).map((p: any) => p.user_id), bill.creator_id])];
          let nameMap: Record<string, string> = {};
          if (allUserIds.length > 0) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("user_id, name")
              .in("user_id", allUserIds);
            (profiles || []).forEach((p: any) => {
              nameMap[p.user_id] = p.name || "Unknown";
            });
          }

          const mappedItems: GroceryBillItem[] = (items || []).map((i: any) => ({
            id: i.id,
            billId: i.bill_id,
            name: i.name,
            price: Number(i.price),
            assignedTo: i.assigned_to,
          }));

          const mappedParticipants: GroceryBillParticipant[] = (participants || []).map((p: any) => ({
            id: p.id,
            billId: p.bill_id,
            userId: p.user_id,
            userName: nameMap[p.user_id] || "Unknown",
            amountOwed: Number(p.amount_owed),
            paid: p.paid,
          }));

          const total = mappedItems.reduce((sum, i) => sum + i.price, 0);

          return {
            id: bill.id,
            creatorId: bill.creator_id,
            title: bill.title,
            splitType: bill.split_type as "equal" | "itemized",
            createdAt: bill.created_at,
            settledAt: bill.settled_at,
            items: mappedItems,
            participants: mappedParticipants,
            total,
          };
        })
      );

      setBills(enriched);
    } catch (err: any) {
      toast({ title: "Error loading bills", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createBill = async (
    title: string,
    splitType: "equal" | "itemized",
    items: { name: string; price: number; assignedTo?: string }[],
    participantIds: string[]
  ) => {
    if (!user) return null;

    try {
      const { data: bill, error } = await supabase
        .from("grocery_bills")
        .insert({ creator_id: user.id, title, split_type: splitType })
        .select()
        .single();

      if (error) throw error;

      // Insert items
      if (items.length > 0) {
        const { error: itemsError } = await supabase.from("grocery_bill_items").insert(
          items.map((i) => ({
            bill_id: bill.id,
            name: i.name,
            price: i.price,
            assigned_to: i.assignedTo || null,
          }))
        );
        if (itemsError) throw itemsError;
      }

      // Calculate amounts
      const total = items.reduce((sum, i) => sum + i.price, 0);
      const allParticipants = [...new Set([user.id, ...participantIds])];

      let participantInserts: { bill_id: string; user_id: string; amount_owed: number }[];

      if (splitType === "equal") {
        const perPerson = total / allParticipants.length;
        participantInserts = allParticipants.map((uid) => ({
          bill_id: bill.id,
          user_id: uid,
          amount_owed: Math.round(perPerson * 100) / 100,
        }));
      } else {
        // Itemized: sum up assigned items per person, unassigned split equally
        const assigned: Record<string, number> = {};
        let unassignedTotal = 0;

        items.forEach((i) => {
          if (i.assignedTo) {
            assigned[i.assignedTo] = (assigned[i.assignedTo] || 0) + i.price;
          } else {
            unassignedTotal += i.price;
          }
        });

        const unassignedPerPerson = unassignedTotal / allParticipants.length;

        participantInserts = allParticipants.map((uid) => ({
          bill_id: bill.id,
          user_id: uid,
          amount_owed: Math.round(((assigned[uid] || 0) + unassignedPerPerson) * 100) / 100,
        }));
      }

      const { error: partError } = await supabase.from("grocery_bill_participants").insert(participantInserts);
      if (partError) throw partError;

      toast({ title: "Bill created!", description: `"${title}" has been created.` });
      await fetchBills();
      return bill.id;
    } catch (err: any) {
      toast({ title: "Error creating bill", description: err.message, variant: "destructive" });
      return null;
    }
  };

  const markPaid = async (billId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from("grocery_bill_participants")
        .update({ paid: true })
        .eq("bill_id", billId)
        .eq("user_id", userId);

      if (error) throw error;
      toast({ title: "Marked as paid" });
      await fetchBills();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const deleteBill = async (billId: string) => {
    try {
      const { error } = await supabase.from("grocery_bills").delete().eq("id", billId);
      if (error) throw error;
      toast({ title: "Bill deleted" });
      setBills((prev) => prev.filter((b) => b.id !== billId));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const joinBill = async (billId: string) => {
    if (!user) return;
    try {
      // Check if already a participant
      const bill = bills.find((b) => b.id === billId);
      if (bill?.participants.some((p) => p.userId === user.id)) {
        toast({ title: "Already joined", description: "You're already part of this bill." });
        return;
      }

      // For equal split, recalculate amounts for everyone
      if (bill && bill.splitType === "equal") {
        const newParticipantCount = bill.participants.length + 1;
        const perPerson = Math.round((bill.total / newParticipantCount) * 100) / 100;

        // Insert self as participant
        const { error: joinError } = await supabase.from("grocery_bill_participants").insert({
          bill_id: billId,
          user_id: user.id,
          amount_owed: perPerson,
        });
        if (joinError) throw joinError;

        // Update existing participants' amounts
        for (const p of bill.participants) {
          await supabase
            .from("grocery_bill_participants")
            .update({ amount_owed: perPerson })
            .eq("id", p.id);
        }
      } else {
        // Itemized: join with 0 owed (unassigned items will be recalculated)
        const unassignedTotal = (bill?.items || [])
          .filter((i) => !i.assignedTo)
          .reduce((sum, i) => sum + i.price, 0);
        const newParticipantCount = (bill?.participants.length || 0) + 1;
        const perPerson = Math.round((unassignedTotal / newParticipantCount) * 100) / 100;

        const { error: joinError } = await supabase.from("grocery_bill_participants").insert({
          bill_id: billId,
          user_id: user.id,
          amount_owed: perPerson,
        });
        if (joinError) throw joinError;

        // Recalculate unassigned split for existing participants
        if (bill) {
          for (const p of bill.participants) {
            const assignedAmount = bill.items
              .filter((i) => i.assignedTo === p.userId)
              .reduce((sum, i) => sum + i.price, 0);
            const newOwed = Math.round((assignedAmount + perPerson) * 100) / 100;
            await supabase
              .from("grocery_bill_participants")
              .update({ amount_owed: newOwed })
              .eq("id", p.id);
          }
        }
      }

      toast({ title: "Joined!", description: "You've joined this bill." });
      await fetchBills();
    } catch (err: any) {
      toast({ title: "Error joining bill", description: err.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return { bills, loading, createBill, markPaid, deleteBill, joinBill, refetch: fetchBills };
}
