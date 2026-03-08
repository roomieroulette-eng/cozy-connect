import { useState, useEffect } from "react";
import { formatBudgetRange } from "@/lib/currency";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Banknote,
  Dog,
  Coffee,
  Moon,
  Sparkles,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Users,
  Home,
  Wind,
} from "lucide-react";
import { DiscoveryProfile } from "@/hooks/useDiscoveryProfiles";

interface SwipeCardProps {
  profile: DiscoveryProfile;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

const SwipeCard = ({ profile, onSwipe, isTop }: SwipeCardProps) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitX, setExitX] = useState(0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTop) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !isTop) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragDelta({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleDragEnd = () => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);

    if (Math.abs(dragDelta.x) > 100) {
      const direction = dragDelta.x > 0 ? "right" : "left";
      setExitX(dragDelta.x > 0 ? 500 : -500);
      setTimeout(() => onSwipe(direction), 200);
    } else {
      setDragDelta({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragDelta]);

  const rotation = isDragging ? dragDelta.x * 0.05 : 0;
  const likeOpacity = Math.min(Math.max(dragDelta.x / 100, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragDelta.x / 100, 0), 1);

  const getCleanlinessLabel = (level: string | null) => {
    switch (level) {
      case "very_clean": return "Very Clean";
      case "clean": return "Clean";
      case "moderate": return "Moderate";
      case "relaxed": return "Relaxed";
      default: return level || "Unknown";
    }
  };

  const getPersonalityLabel = (type: string | null) => {
    switch (type) {
      case "introvert": return "Introvert";
      case "extrovert": return "Extrovert";
      case "ambivert": return "Ambivert";
      default: return type || "Unknown";
    }
  };

  const getSleepLabel = (schedule: string | null) => {
    switch (schedule) {
      case "early_bird": return "Early Bird";
      case "night_owl": return "Night Owl";
      case "flexible": return "Flexible";
      default: return schedule || "Unknown";
    }
  };

  const budgetDisplay = formatBudgetRange(profile.minBudget, profile.maxBudget);

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? "cursor-grab active:cursor-grabbing z-10" : "z-0"}`}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 10,
        x: isDragging ? dragDelta.x : 0,
        rotate: rotation,
      }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      style={{ touchAction: "none" }}
    >
      <Card variant="profile" className="h-full overflow-hidden select-none">
        {/* Image */}
        <div className="relative h-[55%] overflow-hidden">
          {profile.primaryPhotoUrl ? (
            <img
              src={profile.primaryPhotoUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Users className="w-16 h-16 text-muted-foreground" />
            </div>
          )}

          {/* Swipe Indicators */}
          <AnimatePresence>
            {likeOpacity > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: likeOpacity, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-8 left-8 px-4 py-2 border-4 border-primary rounded-lg rotate-[-20deg]"
              >
                <span className="text-2xl font-bold text-primary">LIKE</span>
              </motion.div>
            )}
            {nopeOpacity > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: nopeOpacity, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-8 right-8 px-4 py-2 border-4 border-destructive rounded-lg rotate-[20deg]"
              >
                <span className="text-2xl font-bold text-destructive">NOPE</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent" />
        </div>

        {/* Content */}
        <div className="h-[45%] p-5 overflow-y-auto">
          {/* Name & Age */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-2xl font-semibold text-foreground">
              {profile.name}{profile.age ? `, ${profile.age}` : ""}
            </h3>
          </div>

          {/* Housing Status Badge */}
          {profile.housingStatus && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-3 ${
              profile.housingStatus === "have_place"
                ? "bg-primary/15 text-primary"
                : "bg-secondary text-secondary-foreground"
            }`}>
              <Home className="w-3.5 h-3.5" />
              <span>{profile.housingStatus === "have_place" ? "Has a place — looking for a roommate" : "Looking for a place"}</span>
            </div>
          )}

          {/* Occupation */}
          {profile.occupation && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
              <Briefcase className="w-4 h-4" />
              <span>{profile.occupation}</span>
            </div>
          )}

          {/* Location & Budget Row */}
          <div className="flex flex-wrap gap-3 mb-4">
            {profile.neighborhood && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.neighborhood}</span>
              </div>
            )}
            {budgetDisplay && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{budgetDisplay}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bioPreview && (
            <p className="text-foreground text-sm leading-relaxed mb-4">
              {profile.bioPreview}
            </p>
          )}

          {/* Lifestyle Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.hasPets && profile.hasPets !== "no" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Dog className="w-3.5 h-3.5" />
                <span>Has Pet</span>
              </div>
            )}
            {profile.petFriendly && profile.petFriendly !== "no" && profile.hasPets === "no" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Dog className="w-3.5 h-3.5" />
                <span>Pet Friendly</span>
              </div>
            )}
            {profile.drinking && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Coffee className="w-3.5 h-3.5" />
                <span>Drinks {profile.drinking}</span>
              </div>
            )}
            {profile.smoking && profile.smoking !== "never" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Wind className="w-3.5 h-3.5" />
                <span>Smokes {profile.smoking}</span>
              </div>
            )}
            {profile.sleepSchedule && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Moon className="w-3.5 h-3.5" />
                <span>{getSleepLabel(profile.sleepSchedule)}</span>
              </div>
            )}
            {profile.cleanliness && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{getCleanlinessLabel(profile.cleanliness)}</span>
              </div>
            )}
            {profile.personalityType && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>{getPersonalityLabel(profile.personalityType)}</span>
              </div>
            )}
            {profile.workFromHome && profile.workFromHome !== "no" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Home className="w-3.5 h-3.5" />
                <span>WFH</span>
              </div>
            )}
          </div>

          {/* Interest count */}
          {profile.interestCount && profile.interestCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {profile.interestCount} shared interest{profile.interestCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default SwipeCard;
