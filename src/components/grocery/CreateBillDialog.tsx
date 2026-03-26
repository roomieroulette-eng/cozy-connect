import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Search } from "lucide-react";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";

interface BillItem {
  name: string;
  price: string;
  assignedTo?: string;
}

interface FoundUser {
  userId: string;
  name: string;
}

interface CreateBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBill: (
    title: string,
    splitType: "equal" | "itemized",
    items: { name: string; price: number; assignedTo?: string }[],
    participantIds: string[]
  ) => Promise<string | null>;
}

export function CreateBillDialog({ open, onOpenChange, onCreateBill }: CreateBillDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "itemized">("equal");
  const [items, setItems] = useState<BillItem[]>([{ name: "", price: "" }]);
  const [participants, setParticipants] = useState<FoundUser[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  const symbol = getCurrencySymbol();

  const addItem = () => setItems([...items, { name: "", price: "" }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof BillItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    try {
      // Search by profile name (case insensitive partial match)
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, name")
        .ilike("name", `%${searchEmail.trim()}%`)
        .neq("user_id", user?.id || "")
        .limit(5);

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({ title: "No users found", description: "Try a different name.", variant: "destructive" });
        return;
      }

      // Add users not already added
      const newUsers = data.filter(
        (d: any) => !participants.some((p) => p.userId === d.user_id)
      );
      if (newUsers.length > 0) {
        setParticipants([
          ...participants,
          ...newUsers.map((u: any) => ({ userId: u.user_id, name: u.name || "Unknown" })),
        ]);
        setSearchEmail("");
      } else {
        toast({ title: "Already added", description: "These users are already in the bill." });
      }
    } catch (err: any) {
      toast({ title: "Search failed", description: err.message, variant: "destructive" });
    } finally {
      setSearching(false);
    }
  };

  const removeParticipant = (userId: string) => {
    setParticipants(participants.filter((p) => p.userId !== userId));
  };

  const total = items.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    const validItems = items.filter((i) => i.name.trim() && parseFloat(i.price) > 0);
    if (validItems.length === 0) {
      toast({ title: "Add at least one item with a price", variant: "destructive" });
      return;
    }

    setSaving(true);
    const result = await onCreateBill(
      title.trim(),
      splitType,
      validItems.map((i) => ({
        name: i.name.trim(),
        price: parseFloat(i.price),
        assignedTo: i.assignedTo,
      })),
      participants.map((p) => p.userId)
    );

    if (result) {
      // Reset
      setTitle("");
      setSplitType("equal");
      setItems([{ name: "", price: "" }]);
      setParticipants([]);
      setSearchEmail("");
      onOpenChange(false);
    }
    setSaving(false);
  };

  const allParticipants: FoundUser[] = [
    { userId: user?.id || "", name: "You" },
    ...participants,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Grocery Bill</DialogTitle>
          <DialogDescription>Add items and invite people to split the cost.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Title */}
          <div>
            <Label htmlFor="bill-title">Bill Name</Label>
            <Input
              id="bill-title"
              placeholder="e.g. Weekly groceries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5"
            />
          </div>

          {/* Split Type */}
          <div>
            <Label>Split Method</Label>
            <RadioGroup
              value={splitType}
              onValueChange={(v) => setSplitType(v as "equal" | "itemized")}
              className="mt-2 flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal" className="text-sm cursor-pointer">Equal Split</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="itemized" id="itemized" />
                <Label htmlFor="itemized" className="text-sm cursor-pointer">Itemized</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Items */}
          <div>
            <Label>Items</Label>
            <div className="space-y-2 mt-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {symbol}
                    </span>
                    <Input
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", e.target.value)}
                      className="pl-7"
                    />
                  </div>
                  {splitType === "itemized" && (
                    <select
                      className="h-10 rounded-md border border-input bg-background px-2 text-sm min-w-[90px]"
                      value={item.assignedTo || ""}
                      onChange={(e) => updateItem(index, "assignedTo", e.target.value)}
                    >
                      <option value="">Split</option>
                      {allParticipants.map((p) => (
                        <option key={p.userId} value={p.userId}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2 gap-1">
              <Plus size={14} />
              Add Item
            </Button>
            {total > 0 && (
              <div className="mt-2 text-sm font-medium text-foreground">
                Total: {formatCurrency(total)}
              </div>
            )}
          </div>

          {/* Add Participants */}
          <div>
            <Label>Add People</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                placeholder="Search by name..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchUser()}
              />
              <Button type="button" variant="outline" onClick={searchUser} disabled={searching} className="shrink-0">
                <Search size={14} />
              </Button>
            </div>
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {participants.map((p) => (
                  <span
                    key={p.userId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {p.name}
                    <button
                      onClick={() => removeParticipant(p.userId)}
                      className="hover:text-destructive transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} disabled={saving} className="w-full">
            {saving ? "Creating..." : "Create Bill"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
