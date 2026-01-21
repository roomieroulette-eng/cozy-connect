import { ProfileFormData } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PenLine, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepBioProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}

const interestOptions = [
  "Sports", "Cooking", "Gaming", "Reading", "Hiking", "Music",
  "Fitness", "Art", "Movies", "Photography", "Travel", "Yoga",
  "Dancing", "Tech", "Fashion", "Food", "Pets", "Gardening",
  "Meditation", "Writing",
];

const MIN_BIO_LENGTH = 150;
const MAX_BIO_LENGTH = 300;
const MAX_INTERESTS = 10;

export default function StepBio({ formData, setFormData }: StepBioProps) {
  const bioLength = formData.bio.length;
  const bioValid = bioLength >= MIN_BIO_LENGTH && bioLength <= MAX_BIO_LENGTH;

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else if (prev.interests.length < MAX_INTERESTS) {
        return { ...prev, interests: [...prev.interests, interest] };
      }
      return prev;
    });
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Bio */}
      <div className="space-y-3">
        <Label htmlFor="bio" className="flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          About You
        </Label>
        
        <Textarea
          id="bio"
          placeholder="Tell potential roommates about yourself - your hobbies, work/study, what you're looking for in a roommate, and what makes you a great person to live with..."
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          className="min-h-[150px] resize-none"
          maxLength={MAX_BIO_LENGTH}
        />

        {/* Character count */}
        <div className="flex justify-between items-center text-xs">
          <p className="text-muted-foreground">
            {bioLength < MIN_BIO_LENGTH ? (
              <span className="text-amber-500">
                {MIN_BIO_LENGTH - bioLength} more characters needed
              </span>
            ) : bioValid ? (
              <span className="text-green-500 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Great bio!
              </span>
            ) : null}
          </p>
          <p className={cn(
            "font-medium",
            bioLength < MIN_BIO_LENGTH ? "text-amber-500" : 
            bioLength > MAX_BIO_LENGTH ? "text-destructive" : "text-muted-foreground"
          )}>
            {bioLength}/{MAX_BIO_LENGTH}
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
        <h4 className="font-medium text-sm mb-2">Bio Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Mention your work/study routine</li>
          <li>• Share your hobbies and interests</li>
          <li>• Describe your ideal roommate</li>
          <li>• Be authentic and friendly!</li>
        </ul>
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Interests (select up to {MAX_INTERESTS})
        </Label>

        {/* Selected interests */}
        {formData.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {formData.interests.map((interest) => (
              <Badge
                key={interest}
                className="px-3 py-1 gap-2 bg-primary text-primary-foreground"
              >
                {interest}
                <button
                  onClick={() => toggleInterest(interest)}
                  className="hover:text-primary-foreground/70"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* All interests */}
        <div className="flex flex-wrap gap-2">
          {interestOptions
            .filter(i => !formData.interests.includes(i))
            .map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                disabled={formData.interests.length >= MAX_INTERESTS}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full border transition-colors",
                  formData.interests.length >= MAX_INTERESTS
                    ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                    : "border-border hover:border-primary hover:text-primary"
                )}
              >
                {interest}
              </button>
            ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {formData.interests.length} of {MAX_INTERESTS} interests selected
        </p>
      </div>
    </Card>
  );
}
