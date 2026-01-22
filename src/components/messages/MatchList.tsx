import { Match } from "@/hooks/useMatches";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface MatchListProps {
  matches: Match[];
  selectedMatchId: string | null;
  onSelectMatch: (match: Match) => void;
  loading: boolean;
}

export function MatchList({
  matches,
  selectedMatchId,
  onSelectMatch,
  loading,
}: MatchListProps) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading matches...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="font-medium text-foreground mb-2">No matches yet</h3>
        <p className="text-sm text-muted-foreground">
          Start swiping to find your perfect roommate!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {matches.map((match) => (
        <button
          key={match.id}
          onClick={() => onSelectMatch(match)}
          className={cn(
            "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border",
            selectedMatchId === match.id && "bg-muted"
          )}
        >
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={match.matchedUserPhoto || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {match.matchedUserName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {match.unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {match.unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-foreground truncate">
                {match.matchedUserName}
              </span>
              <span className="text-xs text-muted-foreground">
                {match.lastMessage
                  ? formatDistanceToNow(new Date(match.lastMessage.createdAt), {
                      addSuffix: false,
                    })
                  : formatDistanceToNow(new Date(match.createdAt), {
                      addSuffix: false,
                    })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {match.lastMessage ? match.lastMessage.content : "New match! Say hi 👋"}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
