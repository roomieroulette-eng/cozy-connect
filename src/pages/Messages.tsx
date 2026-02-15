import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, MessageCircle } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import { useMatches, Match } from "@/hooks/useMatches";
import { useMockMatches, MockMatch } from "@/hooks/useMockMatches";
import { MatchList } from "@/components/messages/MatchList";
import { MockMatchList } from "@/components/messages/MockMatchList";
import { ConversationView } from "@/components/messages/ConversationView";
import { MockConversationView } from "@/components/messages/MockConversationView";
import { cn } from "@/lib/utils";

type SelectedConversation =
  | { type: "real"; match: Match }
  | { type: "mock"; match: MockMatch };

const Messages = () => {
  const navigate = useNavigate();
  const { matches: realMatches, loading: realLoading, unmatch: realUnmatch } = useMatches();
  const { matches: mockMatches, loading: mockLoading, unmatch: mockUnmatch, sendMessage: mockSendMessage } = useMockMatches();
  const [selected, setSelected] = useState<SelectedConversation | null>(null);

  const loading = realLoading || mockLoading;
  const totalCount = realMatches.length + mockMatches.length;

  // Keep selected in sync
  const currentSelected = (() => {
    if (!selected) return null;
    if (selected.type === "real") {
      const found = realMatches.find(m => m.id === selected.match.id);
      return found ? { type: "real" as const, match: found } : null;
    }
    const found = mockMatches.find(m => m.id === selected.match.id);
    return found ? { type: "mock" as const, match: found } : null;
  })();

  const handleMockSend = (content: string) => {
    if (currentSelected?.type === "mock") {
      mockSendMessage(currentSelected.match.id, content);
    }
  };

  const handleMockUnmatch = (matchId: string) => {
    mockUnmatch(matchId);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/discover")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Discover</span>
            </button>

            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-semibold text-foreground">
                RoomieRoulette
              </span>
            </a>

            <div className="flex items-center gap-2">
              <NotificationBell />
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Messages</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 flex">
        <div className="container mx-auto flex h-[calc(100vh-4rem)]">
          {/* Match List */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-background",
              currentSelected && "hidden md:flex"
            )}
          >
            <div className="p-4 border-b border-border">
              <h1 className="font-serif text-xl font-semibold text-foreground">
                Your Matches
              </h1>
              <p className="text-sm text-muted-foreground">
                {totalCount} {totalCount === 1 ? "match" : "matches"}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {/* Real Supabase matches first */}
              {realMatches.length > 0 && (
                <MatchList
                  matches={realMatches}
                  selectedMatchId={currentSelected?.type === "real" ? currentSelected.match.id : null}
                  onSelectMatch={(match) => setSelected({ type: "real", match })}
                  loading={false}
                />
              )}
              {/* Mock matches */}
              {mockMatches.length > 0 && (
                <MockMatchList
                  matches={mockMatches}
                  selectedMatchId={currentSelected?.type === "mock" ? currentSelected.match.id : null}
                  onSelectMatch={(match) => setSelected({ type: "mock", match })}
                  loading={false}
                />
              )}
              {/* Empty state */}
              {!loading && totalCount === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">No matches yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start swiping to find your perfect roommate!
                  </p>
                </div>
              )}
              {loading && totalCount === 0 && (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="animate-pulse text-muted-foreground">Loading matches...</div>
                </div>
              )}
            </div>
          </div>

          {/* Conversation View */}
          <div
            className={cn(
              "flex-1 flex flex-col",
              !currentSelected && "hidden md:flex"
            )}
          >
            {currentSelected?.type === "real" ? (
              <ConversationView
                match={currentSelected.match}
                onBack={() => setSelected(null)}
                onUnmatch={realUnmatch}
              />
            ) : currentSelected?.type === "mock" ? (
              <MockConversationView
                match={currentSelected.match}
                onBack={() => setSelected(null)}
                onUnmatch={handleMockUnmatch}
                onSendMessage={handleMockSend}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                  Select a conversation
                </h2>
                <p className="text-muted-foreground max-w-sm">
                  Choose a match from the list to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
