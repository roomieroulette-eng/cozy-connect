import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useGroceryBills, GroceryBill } from "@/hooks/useGroceryBills";
import { useAuth } from "@/hooks/useAuth";
import { CreateBillDialog } from "@/components/grocery/CreateBillDialog";
import { BillCard } from "@/components/grocery/BillCard";
import { BillDetailSheet } from "@/components/grocery/BillDetailSheet";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, ShoppingCart } from "lucide-react";

export default function GroceryBills() {
  const { bills, loading, createBill, markPaid, deleteBill, joinBill, leaveBill } = useGroceryBills();
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<GroceryBill | null>(null);

  const activeBills = bills.filter((b) => !b.settledAt);
  const settledBills = bills.filter((b) => b.settledAt);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground flex items-center gap-2">
              <ShoppingCart size={24} className="text-primary" />
              Grocery Bills
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Split grocery costs with your roommates
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus size={16} />
            New Bill
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bills.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Receipt size={28} className="text-primary" />
            </div>
            <h2 className="text-lg font-medium text-foreground mb-2">No bills yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Create your first grocery bill and split costs with others.
            </p>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus size={16} />
              Create First Bill
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeBills.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Active Bills
                </h2>
                <div className="space-y-3">
                  {activeBills.map((bill) => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      currentUserId={user?.id || ""}
                      onClick={() => setSelectedBill(bill)}
                    />
                  ))}
                </div>
              </div>
            )}

            {settledBills.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Settled
                </h2>
                <div className="space-y-3">
                  {settledBills.map((bill) => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      currentUserId={user?.id || ""}
                      onClick={() => setSelectedBill(bill)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateBillDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreateBill={createBill}
      />

      <BillDetailSheet
        bill={selectedBill}
        currentUserId={user?.id || ""}
        onClose={() => setSelectedBill(null)}
        onMarkPaid={markPaid}
        onDelete={deleteBill}
        onJoin={joinBill}
      />
    </div>
  );
}
