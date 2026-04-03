import { GroceryBill } from "@/hooks/useGroceryBills";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, Users } from "lucide-react";

interface BillCardProps {
  bill: GroceryBill;
  currentUserId: string;
  onClick: () => void;
}

export function BillCard({ bill, currentUserId, onClick }: BillCardProps) {
  const myParticipation = bill.participants.find((p) => p.userId === currentUserId);
  const allPaid = bill.participants.every((p) => p.paid);
  const paidCount = bill.participants.filter((p) => p.paid).length;

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow border-border/50"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground truncate">{bill.title}</h3>
            <Badge variant={bill.splitType === "equal" ? "secondary" : "outline"} className="text-xs shrink-0">
              {bill.splitType === "equal" ? "Equal" : "Itemized"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="truncate">by {bill.creatorId === currentUserId ? "You" : bill.creatorName}</span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {bill.participants.length}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDistanceToNow(new Date(bill.createdAt), { addSuffix: true })}
            </span>
            <span className="flex items-center gap-1">
              {allPaid ? (
                <CheckCircle2 size={12} className="text-green-600" />
              ) : (
                <Clock size={12} />
              )}
              {paidCount}/{bill.participants.length} paid
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-semibold text-foreground">{formatCurrency(bill.total)}</div>
          {myParticipation && (
            <div className={`text-xs ${myParticipation.paid ? "text-green-600" : "text-primary"}`}>
              You owe {formatCurrency(myParticipation.amountOwed)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
