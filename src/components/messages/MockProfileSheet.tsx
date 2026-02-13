import { Profile } from "@/data/profiles";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  DollarSign,
  Dog,
  Coffee,
  Moon,
  Sparkles,
  Briefcase,
  Users,
  Home,
  Wind,
  X,
} from "lucide-react";

interface MockProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
}

export function MockProfileSheet({ open, onOpenChange, profile }: MockProfileSheetProps) {
  const displayName = (profile.name || "").trim();

  const traitTags = [
    profile.traits.pets ? { icon: Dog, label: "Has Pet" } : null,
    profile.traits.petsOk && !profile.traits.pets ? { icon: Dog, label: "Pet Friendly" } : null,
    profile.traits.drinks !== "never" ? { icon: Coffee, label: `Drinks ${profile.traits.drinks}` } : null,
    profile.traits.smokes !== "never" ? { icon: Wind, label: `Smokes ${profile.traits.smokes}` } : null,
    profile.traits.nightOwl ? { icon: Moon, label: "Night Owl" } : { icon: Moon, label: "Early Bird" },
    { icon: Sparkles, label: profile.traits.clean.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) },
    { icon: Users, label: profile.traits.personality.replace(/\b\w/g, c => c.toUpperCase()) },
    profile.traits.workFromHome ? { icon: Home, label: "Works from Home" } : null,
  ].filter(Boolean) as { icon: typeof Dog; label: string }[];

  const heroPhoto = profile.images[0];
  const remainingPhotos = profile.images.slice(1);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 sm:max-w-md border-l border-border/50 overflow-hidden [&>button]:hidden">
        <ScrollArea className="h-full">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="aspect-[3/4] max-h-[420px] w-full overflow-hidden">
                <img
                  src={heroPhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Close button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Gradient overlay with name */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent pt-16 pb-5 px-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              >
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {displayName}, {profile.age}
                </h2>
                {profile.occupation && (
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{profile.occupation}</span>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="px-5 pb-8 space-y-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
            >
            {/* Location & Budget pills */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-3 py-1">
                <MapPin className="w-3 h-3" />
                {profile.neighborhood}, {profile.location}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-3 py-1">
                <DollarSign className="w-3 h-3" />
                ${profile.budget}/mo
              </Badge>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">About</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Lifestyle tags */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Lifestyle</h3>
              <div className="flex flex-wrap gap-2">
                {traitTags.map((trait, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    <trait.icon className="w-3.5 h-3.5" />
                    <span>{trait.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* More photos */}
            {remainingPhotos.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {remainingPhotos.map((url, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden">
                      <img src={url} alt={`${displayName} photo ${i + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            </motion.div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
