import { Profile } from "@/data/profiles";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

interface MockProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
}

export function MockProfileSheet({ open, onOpenChange, profile }: MockProfileSheetProps) {
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-serif">{profile.name}'s Profile</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-4">
          {/* Photos */}
          <div className="grid grid-cols-2 gap-2">
            {profile.images.map((url, i) => (
              <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}>
                <img src={url} alt={`${profile.name} photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Name & basics */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {profile.name}, {profile.age}
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
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {profile.neighborhood}, {profile.location}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              ${profile.budget}/mo
            </Badge>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
          </div>

          {/* Lifestyle */}
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
