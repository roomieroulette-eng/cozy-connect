import { GroceryBill } from "@/hooks/useGroceryBills";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BillDetailSheetProps {
  bill: GroceryBill | null;
  currentUserId: string;
  onClose: () => void;
  onMarkPaid: (billId: string, userId: string) => Promise<void>;
  onDelete: (billId: string) => Promise<void>;
  onJoin: (billId: string) => Promise<void>;
}

export function BillDetailSheet({ bill, currentUserId, onClose, onMarkPaid, onDelete, onJoin }: BillDetailSheetProps) {
  if (!bill) return null;

  const isCreator = bill.creatorId === currentUserId;
  const isParticipant = bill.participants.some((p) => p.userId === currentUserId);
  const canJoin = !isParticipant && !bill.settledAt;

  return (
    <Sheet open={!!bill} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {bill.title}
            <Badge variant={bill.splitType === "equal" ? "secondary" : "outline"} className="text-xs">
              {bill.splitType === "equal" ? "Equal Split" : "Itemized"}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Created {formatDistanceToNow(new Date(bill.createdAt), { addSuffix: true })} · Total: {formatCurrency(bill.total)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Items */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Items</h3>
            <div className="space-y-2">
              {bill.items.map((item) => {
                const assignedParticipant = bill.participants.find((p) => p.userId === item.assignedTo);
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      {assignedParticipant && (
                        <div className="text-xs text-muted-foreground">
                          Assigned to {assignedParticipant.userName}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">{formatCurrency(item.price)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Participants */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Who Owes What
            </h3>
            <div className="space-y-2">
              {bill.participants.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                  <div className="flex items-center gap-2">
                    {p.paid ? (
                      <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                    ) : (
                      <Circle size={16} className="text-muted-foreground shrink-0" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {p.userId === currentUserId ? "You" : p.userName}
                      </div>
                      <div className={`text-xs ${p.paid ? "text-green-600" : "text-muted-foreground"}`}>
                        {p.paid ? "Paid" : "Unpaid"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(p.amountOwed)}
                    </span>
                    {!p.paid && (isCreator || p.userId === currentUserId) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onMarkPaid(bill.id, p.userId)}
                        className="text-xs h-7"
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join */}
          {canJoin && (
            <Button
              className="w-full gap-2"
              onClick={async () => {
                await onJoin(bill.id);
              }}
            >
              <Users size={14} />
              Join This Bill
            </Button>
          )}

          {/* Delete */}
          {isCreator && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                  <Trash2 size={14} />
                  Delete Bill
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this bill?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{bill.title}" and all its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await onDelete(bill.id);
                      onClose();
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
