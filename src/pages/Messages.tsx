import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, MessageCircle } from "lucide-react";
import { useMockMatches, MockMatch } from "@/hooks/useMockMatches";
import { MockMatchList } from "@/components/messages/MockMatchList";
import { MockConversationView } from "@/components/messages/MockConversationView";
import { cn } from "@/lib/utils";

const Messages = () => {
  const navigate = useNavigate();
  const { matches, loading, unmatch, sendMessage } = useMockMatches();
  const [selectedMatch, setSelectedMatch] = useState<MockMatch | null>(null);

  const handleSendMessage = (content: string) => {
    if (selectedMatch) {
      sendMessage(selectedMatch.id, content);
    }
  };

  const handleUnmatch = (matchId: string) => {
    unmatch(matchId);
    setSelectedMatch(null);
  };

  // Keep selectedMatch in sync with matches state
  const currentMatch = selectedMatch 
    ? matches.find(m => m.id === selectedMatch.id) || null 
    : null;

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
                RoomMatch
              </span>
            </a>

            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Messages</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 flex">
        <div className="container mx-auto flex h-[calc(100vh-4rem)]">
          {/* Match List - always visible on desktop, conditionally on mobile */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-background",
              currentMatch && "hidden md:flex"
            )}
          >
            <div className="p-4 border-b border-border">
              <h1 className="font-serif text-xl font-semibold text-foreground">
                Your Matches
              </h1>
              <p className="text-sm text-muted-foreground">
                {matches.length} {matches.length === 1 ? "match" : "matches"}
              </p>
            </div>
            <MockMatchList
              matches={matches}
              selectedMatchId={currentMatch?.id || null}
              onSelectMatch={setSelectedMatch}
              loading={loading}
            />
          </div>

          {/* Conversation View */}
          <div
            className={cn(
              "flex-1 flex flex-col",
              !currentMatch && "hidden md:flex"
            )}
          >
            {currentMatch ? (
              <MockConversationView
                match={currentMatch}
                onBack={() => setSelectedMatch(null)}
                onUnmatch={handleUnmatch}
                onSendMessage={handleSendMessage}
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
