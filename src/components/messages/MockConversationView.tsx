import { useState, useRef, useEffect } from "react";
import { MockMatch, MockMessage } from "@/hooks/useMockMatches";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Send, MoreVertical, ArrowLeft, UserX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MockProfileSheet } from "./MockProfileSheet";

const MAX_MESSAGE_LENGTH = 5000;

interface MockConversationViewProps {
  match: MockMatch;
  onBack: () => void;
  onUnmatch: (matchId: string) => void;
  onSendMessage: (content: string) => void;
}

export function MockConversationView({
  match,
  onBack,
  onUnmatch,
  onSendMessage,
}: MockConversationViewProps) {
  const [newMessage, setNewMessage] = useState("");
  const [showUnmatchDialog, setShowUnmatchDialog] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [match.messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUnmatch = () => {
    onUnmatch(match.id);
    setShowUnmatchDialog(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <button
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          onClick={() => setShowProfile(true)}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={match.matchedProfile.image} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {match.matchedProfile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <h2 className="font-medium text-foreground">{match.matchedProfile.name}</h2>
            <p className="text-xs text-muted-foreground">
              Matched {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
            </p>
          </div>
        </button>
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setShowUnmatchDialog(true)}
            >
              <UserX className="h-4 w-4 mr-2" />
              Unmatch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {match.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="font-medium text-foreground mb-2">Start the conversation!</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You and {match.matchedProfile.name} have matched. Send a message to break the ice!
            </p>
          </div>
        ) : (
          <>
            {match.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === "user"}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {newMessage.length > MAX_MESSAGE_LENGTH * 0.9 && (
            <span className={`text-xs text-right ${newMessage.length >= MAX_MESSAGE_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
              {newMessage.length}/{MAX_MESSAGE_LENGTH}
            </span>
          )}
        </div>
      </div>

      {/* Unmatch Dialog */}
      <AlertDialog open={showUnmatchDialog} onOpenChange={setShowUnmatchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unmatch with {match.matchedProfile.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your match and delete the conversation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnmatch}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Unmatch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Sheet */}
      <MockProfileSheet
        open={showProfile}
        onOpenChange={setShowProfile}
        profile={match.matchedProfile}
      />
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: MockMessage; isOwn: boolean }) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={cn(
            "text-[10px] mt-1",
            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
