import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
        // Resolve photo URLs
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

  const budgetDisplay = profile?.min_budget && profile?.max_budget
    ? `$${profile.min_budget}-$${profile.max_budget}/mo`
    : profile?.max_budget
      ? `Up to $${profile.max_budget}/mo`
      : profile?.min_budget
        ? `From $${profile.min_budget}/mo`
        : null;

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-serif">
            {profile?.name || fallbackName}'s Profile
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading profile...</div>
          </div>
        ) : profile ? (
          <div className="space-y-6 mt-4">
            {/* Photos */}
            {photoUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {photoUrls.map((url, i) => (
                  <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}>
                    <img src={url} alt={`${profile.name} photo ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Name & basics */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {profile.name}{profile.age ? `, ${profile.age}` : ""}
              </h2>
              {profile.occupation && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{profile.occupation}</span>
                </div>
              )}
            </div>

            {/* Location & Budget */}
            <div className="flex flex-wrap gap-2">
              {profile.neighborhoods && profile.neighborhoods[0] && (
                <Badge variant="secondary" className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.neighborhoods[0]}{profile.city ? `, ${profile.city}` : ""}
                </Badge>
              )}
              {budgetDisplay && (
                <Badge variant="secondary" className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {budgetDisplay}
                </Badge>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Lifestyle */}
            {traitTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Lifestyle</h3>
                <div className="flex flex-wrap gap-2">
                  {traitTags.map((trait, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/20 text-accent-foreground text-sm">
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
                <h3 className="text-sm font-medium text-foreground mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, i) => (
                    <Badge key={i} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Profile not available</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
