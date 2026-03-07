import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
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

interface MatchedProfile {
  name: string | null;
  age: number | null;
  occupation: string | null;
  city: string | null;
  neighborhoods: string[] | null;
  bio: string | null;
  photos: string[] | null;
  interests: string[] | null;
  min_budget: number | null;
  max_budget: number | null;
  personality_type: string | null;
  cleanliness: string | null;
  sleep_schedule: string | null;
  has_pets: string | null;
  pet_friendly: string | null;
  smoking: string | null;
  drinking: string | null;
  work_from_home: string | null;
  gender: string | null;
}

interface MatchedProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  fallbackName: string;
  fallbackPhoto: string | null;
}

const labelMap: Record<string, Record<string, string>> = {
  cleanliness: { very_clean: "Very Clean", clean: "Clean", moderate: "Moderate", relaxed: "Relaxed" },
  personality_type: { introvert: "Introvert", extrovert: "Extrovert", ambivert: "Ambivert" },
  sleep_schedule: { early_bird: "Early Bird", night_owl: "Night Owl", flexible: "Flexible" },
};

function getLabel(field: string, value: string | null) {
  if (!value) return null;
  return labelMap[field]?.[value] || value.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function trimName(name: string | null | undefined): string {
  return (name || "").trim();
}

export function MatchedProfileSheet({ open, onOpenChange, userId, fallbackName, fallbackPhoto }: MatchedProfileSheetProps) {
  const [profile, setProfile] = useState<MatchedProfile | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;
    
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("name, age, occupation, city, neighborhoods, bio, photos, interests, min_budget, max_budget, personality_type, cleanliness, sleep_schedule, has_pets, pet_friendly, smoking, drinking, work_from_home, gender")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setProfile(data);
        if (data.photos && data.photos.length > 0) {
          const urls = await Promise.all(
            data.photos.map(async (photo: string) => {
              if (photo.startsWith("http")) return photo;
              const { data: signed } = await supabase.storage
                .from("profile-photos")
                .createSignedUrl(photo, 60 * 60 * 24);
              return signed?.signedUrl || "";
            })
          );
          setPhotoUrls(urls.filter(Boolean));
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [open, userId]);

  const displayName = trimName(profile?.name) || trimName(fallbackName);

  const budgetDisplay = formatBudgetRange(profile?.min_budget, profile?.max_budget);

  const traitTags = profile ? [
    profile.has_pets && profile.has_pets !== "no" ? { icon: Dog, label: "Has Pet" } : null,
    profile.pet_friendly && profile.pet_friendly !== "no" && profile.has_pets === "no" ? { icon: Dog, label: "Pet Friendly" } : null,
    profile.drinking ? { icon: Coffee, label: `Drinks ${profile.drinking}` } : null,
    profile.smoking && profile.smoking !== "never" ? { icon: Wind, label: `Smokes ${profile.smoking}` } : null,
    profile.sleep_schedule ? { icon: Moon, label: getLabel("sleep_schedule", profile.sleep_schedule) } : null,
    profile.cleanliness ? { icon: Sparkles, label: getLabel("cleanliness", profile.cleanliness) } : null,
    profile.personality_type ? { icon: Users, label: getLabel("personality_type", profile.personality_type) } : null,
    profile.work_from_home && profile.work_from_home !== "no" ? { icon: Home, label: "Works from Home" } : null,
  ].filter(Boolean) as { icon: typeof Dog; label: string | null }[] : [];

  const heroPhoto = photoUrls[0] || fallbackPhoto;
  const remainingPhotos = photoUrls.slice(1);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 sm:max-w-md border-l border-border/50 overflow-hidden [&>button]:hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Loading profile...</div>
          </div>
        ) : profile ? (
          <ScrollArea className="h-full">
            {/* Hero photo with overlay info */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {heroPhoto ? (
                <div className="aspect-[3/4] max-h-[420px] w-full overflow-hidden">
                  <img
                    src={heroPhoto}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] max-h-[420px] w-full bg-muted flex items-center justify-center">
                  <span className="text-6xl font-serif text-muted-foreground/40">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

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
                  {displayName}{profile.age ? `, ${profile.age}` : ""}
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
                {profile.neighborhoods && profile.neighborhoods[0] && (
                  <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-3 py-1">
                    <MapPin className="w-3 h-3" />
                    {profile.neighborhoods[0]}{profile.city ? `, ${profile.city}` : ""}
                  </Badge>
                )}
                {budgetDisplay && (
                  <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-3 py-1">
                    <DollarSign className="w-3 h-3" />
                    {budgetDisplay}
                  </Badge>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">About</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Lifestyle tags */}
              {traitTags.length > 0 && (
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
              )}

              {/* Interests */}
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, i) => (
                      <Badge key={i} variant="outline" className="rounded-full px-3 py-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

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
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Profile not available</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
