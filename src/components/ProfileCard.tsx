import { Card } from "@/components/ui/card";
import { MapPin, DollarSign, Dog, Coffee, Moon, Sparkles } from "lucide-react";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  budget: string;
  bio: string;
  image: string;
  traits: {
    pets?: boolean;
    drinks?: boolean;
    nightOwl?: boolean;
    clean?: boolean;
  };
  className?: string;
}

const ProfileCard = ({
  name,
  age,
  location,
  budget,
  bio,
  image,
  traits,
  className = "",
}: ProfileCardProps) => {
  const traitIcons = [
    { key: "pets", icon: Dog, label: "Pet friendly", active: traits.pets },
    { key: "drinks", icon: Coffee, label: "Social drinker", active: traits.drinks },
    { key: "nightOwl", icon: Moon, label: "Night owl", active: traits.nightOwl },
    { key: "clean", icon: Sparkles, label: "Very clean", active: traits.clean },
  ];

  return (
    <Card variant="profile" className={`group w-full max-w-sm ${className}`}>
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={`${name}'s profile`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
          {/* Name & Age */}
          <h3 className="font-serif text-2xl font-semibold mb-1">
            {name}, {age}
          </h3>
          
          {/* Location & Budget */}
          <div className="flex items-center gap-4 text-sm opacity-90 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {budget}/mo
            </span>
          </div>
          
          {/* Bio */}
          <p className="text-sm opacity-80 line-clamp-2 mb-4">{bio}</p>
          
          {/* Trait Icons */}
          <div className="flex gap-2">
            {traitIcons.map(
              (trait) =>
                trait.active && (
                  <div
                    key={trait.key}
                    className="w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center"
                    title={trait.label}
                  >
                    <trait.icon className="w-4 h-4" />
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
