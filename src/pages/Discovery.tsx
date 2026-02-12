import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Users, MessageCircle } from "lucide-react";
import SwipeCard from "@/components/discovery/SwipeCard";
import SwipeActions from "@/components/discovery/SwipeActions";
import MatchModal from "@/components/discovery/MatchModal";
import { useDiscoveryProfiles, DiscoveryProfile } from "@/hooks/useDiscoveryProfiles";
import { useMatches } from "@/hooks/useMatches";

const Discovery = () => {
  const navigate = useNavigate();
  const { profiles, loading, swiping, recordSwipe } = useDiscoveryProfiles();
  const { matches } = useMatches();
  const [swipedCount, setSwipedCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<DiscoveryProfile | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [lastSwiped, setLastSwiped] = useState<DiscoveryProfile | null>(null);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (profiles.length === 0 || swiping) return;

      const currentProfile = profiles[0];
      setLastSwiped(currentProfile);
      setSwipedCount((c) => c + 1);
      if (direction === "right") setLikesCount((c) => c + 1);

      const result = await recordSwipe(currentProfile.userId, direction);

      if (result.matched) {
        setTimeout(() => {
          setMatchedProfile(currentProfile);
          setShowMatch(true);
        }, 300);
      }
    },
    [profiles, swiping, recordSwipe]
  );

  const handleSuperLike = useCallback(async () => {
    if (profiles.length === 0 || swiping) return;

    const currentProfile = profiles[0];
    setLastSwiped(currentProfile);
    setSwipedCount((c) => c + 1);
    setLikesCount((c) => c + 1);

    const result = await recordSwipe(currentProfile.userId, "right", true);

    if (result.matched) {
      setTimeout(() => {
        setMatchedProfile(currentProfile);
        setShowMatch(true);
      }, 300);
    }
  }, [profiles, swiping, recordSwipe]);

  const handleCloseMatch = () => {
    setShowMatch(false);
    setMatchedProfile(null);
  };

  const visibleProfiles = profiles.slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-semibold text-foreground">
                RoomieRoulette
              </span>
            </a>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/messages")}
              className="relative"
            >
              <MessageCircle className="w-5 h-5" />
              {matches.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {matches.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-32 min-h-screen flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-6 max-w-md">
          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-muted-foreground">
              {profiles.length} profiles remaining
            </span>
            <span className="flex items-center gap-1 text-primary">
              <Users className="w-4 h-4" />
              {likesCount} likes sent
            </span>
          </div>

          {/* Card Stack */}
          <div className="relative aspect-[3/4] w-full">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-secondary/50"
                >
                  <div className="animate-pulse text-muted-foreground">
                    Finding roommates near you...
                  </div>
                </motion.div>
              ) : visibleProfiles.length > 0 ? (
                visibleProfiles.map((profile, index) => (
                  <SwipeCard
                    key={profile.userId}
                    profile={profile}
                    onSwipe={handleSwipe}
                    isTop={index === 0}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-secondary/50"
                >
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                    No More Profiles
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You've seen all available roommates. Check back later for new profiles!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Swipe Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-8 pb-6">
          <div className="container mx-auto px-4 max-w-md">
            <SwipeActions
              onSwipe={handleSwipe}
              onUndo={() => {}}
              onSuperLike={handleSuperLike}
              canUndo={false}
              disabled={visibleProfiles.length === 0 || swiping}
            />
          </div>
        </div>
      </main>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatch}
        onClose={handleCloseMatch}
        matchedProfile={matchedProfile}
        onKeepSwiping={handleCloseMatch}
      />
    </div>
  );
};

export default Discovery;
