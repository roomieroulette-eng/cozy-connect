import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  DollarSign,
  Dog,
  Coffee,
  Moon,
  Sparkles,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Home,
  Wind,
} from "lucide-react";
import { Profile } from "@/data/profiles";

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

const SwipeCard = ({ profile, onSwipe, isTop }: SwipeCardProps) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const getCleanlinessLabel = (level: string) => {
    switch (level) {
      case "very-clean":
        return "Very Clean";
      case "clean":
        return "Clean";
      case "moderate":
        return "Moderate";
      default:
        return "Relaxed";
    }
  };

  const getPersonalityLabel = (type: string) => {
    switch (type) {
      case "introvert":
        return "Introvert";
      case "extrovert":
        return "Extrovert";
      default:
        return "Ambivert";
    }
  };

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
          <img
            src={profile.images[currentImageIndex]}
            alt={profile.name}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Image Navigation Dots */}
          {profile.images.length > 1 && (
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-1">
              {profile.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "w-6 bg-primary-foreground"
                      : "w-1 bg-primary-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Image Navigation Buttons */}
          {profile.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev > 0 ? prev - 1 : profile.images.length - 1
                  );
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev < profile.images.length - 1 ? prev + 1 : 0
                  );
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </>
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

          {/* Compatibility Badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {profile.compatibility}% Match
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent" />
        </div>

        {/* Content */}
        <div className="h-[45%] p-5 overflow-y-auto">
          {/* Name & Age */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-2xl font-semibold text-foreground">
              {profile.name}, {profile.age}
            </h3>
          </div>

          {/* Occupation */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <Briefcase className="w-4 h-4" />
            <span>{profile.occupation}</span>
          </div>

          {/* Location & Budget Row */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.neighborhood}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
              <DollarSign className="w-3.5 h-3.5" />
              <span>${profile.budget}/mo</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>{profile.moveIn}</span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-foreground text-sm leading-relaxed mb-4">
            {profile.bio}
          </p>

          {/* Lifestyle Icons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.traits.pets && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Dog className="w-3.5 h-3.5" />
                <span>Has Pet</span>
              </div>
            )}
            {profile.traits.petsOk && !profile.traits.pets && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Dog className="w-3.5 h-3.5" />
                <span>Pet Friendly</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
              <Coffee className="w-3.5 h-3.5" />
              <span>Drinks {profile.traits.drinks}</span>
            </div>
            {profile.traits.smokes !== "never" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Wind className="w-3.5 h-3.5" />
                <span>Smokes {profile.traits.smokes}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
              <Moon className="w-3.5 h-3.5" />
              <span>{profile.traits.nightOwl ? "Night Owl" : "Early Bird"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getCleanlinessLabel(profile.traits.clean)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>{getPersonalityLabel(profile.traits.personality)}</span>
            </div>
            {profile.traits.workFromHome && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/20 text-accent-foreground text-xs">
                <Home className="w-3.5 h-3.5" />
                <span>WFH</span>
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SwipeCard;
