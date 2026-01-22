import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Users, MessageCircle } from "lucide-react";
import SwipeCard from "@/components/discovery/SwipeCard";
import SwipeActions from "@/components/discovery/SwipeActions";
import FilterDrawer, { FilterOptions } from "@/components/discovery/FilterDrawer";
import MatchModal from "@/components/discovery/MatchModal";
import { mockProfiles, Profile } from "@/data/profiles";
import { useMatches } from "@/hooks/useMatches";

const Discovery = () => {
  const navigate = useNavigate();
  const { matches, createMatch } = useMatches();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedProfiles, setSwipedProfiles] = useState<
    Array<{ profile: Profile; direction: "left" | "right" }>
  >([]);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    budgetRange: [500, 2000],
    neighborhoods: [],
    petsOk: null,
    smokingOk: null,
    nightOwlOk: null,
    cleanlinessLevel: null,
    personality: null,
  });

  // Filter profiles based on current filters
  const filteredProfiles = useMemo(() => {
    return mockProfiles.filter((profile) => {
      // Budget filter
      if (
        profile.budget < filters.budgetRange[0] ||
        profile.budget > filters.budgetRange[1]
      ) {
        return false;
      }

      // Neighborhood filter
      if (
        filters.neighborhoods.length > 0 &&
        !filters.neighborhoods.includes(profile.neighborhood)
      ) {
        return false;
      }

      // Pets filter
      if (filters.petsOk === true && !profile.traits.petsOk) {
        return false;
      }
      if (filters.petsOk === false && profile.traits.pets) {
        return false;
      }

      // Smoking filter
      if (filters.smokingOk === false && profile.traits.smokes !== "never") {
        return false;
      }

      // Night owl filter
      if (
        filters.nightOwlOk === true &&
        !profile.traits.nightOwl
      ) {
        return false;
      }
      if (
        filters.nightOwlOk === false &&
        profile.traits.nightOwl
      ) {
        return false;
      }

      // Cleanliness filter
      if (
        filters.cleanlinessLevel &&
        profile.traits.clean !== filters.cleanlinessLevel
      ) {
        return false;
      }

      // Personality filter
      if (
        filters.personality &&
        profile.traits.personality !== filters.personality
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const remainingProfiles = useMemo(() => {
    const swipedIds = swipedProfiles.map((sp) => sp.profile.id);
    return filteredProfiles.filter((p) => !swipedIds.includes(p.id));
  }, [filteredProfiles, swipedProfiles]);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (remainingProfiles.length === 0) return;

      const swipedProfile = remainingProfiles[0];
      setSwipedProfiles((prev) => [
        ...prev,
        { profile: swipedProfile, direction },
      ]);

      // Simulate match (30% chance on right swipe) - in production this would check if the other user also liked
      if (direction === "right" && Math.random() > 0.7) {
        // Create match in database (using mock profile id as user id for demo)
        await createMatch(swipedProfile.id);
        setTimeout(() => {
          setMatchedProfile(swipedProfile);
          setShowMatch(true);
        }, 300);
      }
    },
    [remainingProfiles, createMatch]
  );

  const handleUndo = useCallback(() => {
    if (swipedProfiles.length === 0) return;
    setSwipedProfiles((prev) => prev.slice(0, -1));
  }, [swipedProfiles]);

  const handleSuperLike = useCallback(async () => {
    if (remainingProfiles.length === 0) return;

    const swipedProfile = remainingProfiles[0];
    setSwipedProfiles((prev) => [
      ...prev,
      { profile: swipedProfile, direction: "right" },
    ]);

    // Super like always matches - create in database
    await createMatch(swipedProfile.id);
    setTimeout(() => {
      setMatchedProfile(swipedProfile);
      setShowMatch(true);
    }, 300);
  }, [remainingProfiles, createMatch]);

  const handleCloseMatch = () => {
    setShowMatch(false);
    setMatchedProfile(null);
  };

  const visibleProfiles = remainingProfiles.slice(0, 2);

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
                RoomMatch
              </span>
            </a>

            <FilterDrawer filters={filters} onFiltersChange={setFilters} />
            
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
              {remainingProfiles.length} profiles remaining
            </span>
            <span className="flex items-center gap-1 text-primary">
              <Users className="w-4 h-4" />
              {swipedProfiles.filter((sp) => sp.direction === "right").length}{" "}
              likes sent
            </span>
          </div>

          {/* Card Stack */}
          <div className="relative aspect-[3/4] w-full">
            <AnimatePresence mode="popLayout">
              {visibleProfiles.length > 0 ? (
                visibleProfiles.map((profile, index) => (
                  <SwipeCard
                    key={profile.id}
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
                    You've seen all available roommates. Try adjusting your
                    filters or check back later!
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        budgetRange: [500, 2000],
                        neighborhoods: [],
                        petsOk: null,
                        smokingOk: null,
                        nightOwlOk: null,
                        cleanlinessLevel: null,
                        personality: null,
                      })
                    }
                  >
                    Reset Filters
                  </Button>
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
              onUndo={handleUndo}
              onSuperLike={handleSuperLike}
              canUndo={swipedProfiles.length > 0}
              disabled={remainingProfiles.length === 0}
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
