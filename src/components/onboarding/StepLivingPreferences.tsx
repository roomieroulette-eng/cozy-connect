import { ProfileFormData } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Volume2, Users, Brain, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepLivingPreferencesProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}

const cleanlinessOptions = [
  { value: "very-clean", label: "Very Clean", description: "Spotless at all times" },
  { value: "clean", label: "Clean", description: "Regular cleaning routine" },
  { value: "moderate", label: "Moderate", description: "Reasonably tidy" },
  { value: "relaxed", label: "Relaxed", description: "Lived-in vibe" },
];

const noiseOptions = [
  { value: "quiet", label: "Quiet", description: "Library-level silence" },
  { value: "moderate", label: "Moderate", description: "Some background noise OK" },
  { value: "lively", label: "Lively", description: "Music and activity welcome" },
];

const guestOptions = [
  { value: "rarely", label: "Rarely", description: "Minimal visitors" },
  { value: "sometimes", label: "Sometimes", description: "Occasional guests" },
  { value: "often", label: "Often", description: "Frequent hangouts" },
  { value: "no-preference", label: "No Preference" },
];

const personalityOptions = [
  { value: "introvert", label: "Introvert", description: "Need alone time to recharge" },
  { value: "ambivert", label: "Ambivert", description: "Balance of both" },
  { value: "extrovert", label: "Extrovert", description: "Energized by socializing" },
];

const workFromHomeOptions = [
  { value: "always", label: "Yes, always", description: "I work from home full-time" },
  { value: "sometimes", label: "Sometimes", description: "Hybrid work schedule" },
  { value: "never", label: "No", description: "I go to an office/school" },
];

interface PreferenceCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string; description?: string }[];
  onChange: (value: string) => void;
  columns?: number;
}

function PreferenceCard({ icon, label, value, options, onChange, columns = 2 }: PreferenceCardProps) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={cn("grid gap-2", columns === 3 ? "grid-cols-3" : "grid-cols-2")}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex flex-col p-3 rounded-lg border cursor-pointer transition-colors",
              value === option.value 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={`${label}-${option.value}`} />
              <span className="text-sm font-medium">{option.label}</span>
            </div>
            {option.description && (
              <span className="text-xs text-muted-foreground mt-1 ml-6">
                {option.description}
              </span>
            )}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function StepLivingPreferences({ formData, setFormData }: StepLivingPreferencesProps) {
  return (
    <Card className="p-6 space-y-8">
      {/* Cleanliness */}
      <PreferenceCard
        icon={<Sparkles className="h-4 w-4 text-primary" />}
        label="Cleanliness Level"
        value={formData.cleanliness}
        options={cleanlinessOptions}
        onChange={(value) => setFormData(prev => ({ ...prev, cleanliness: value }))}
      />

      {/* Noise Level */}
      <PreferenceCard
        icon={<Volume2 className="h-4 w-4 text-primary" />}
        label="Noise Level Comfort"
        value={formData.noise_level}
        options={noiseOptions}
        columns={3}
        onChange={(value) => setFormData(prev => ({ ...prev, noise_level: value }))}
      />

      {/* Guest Policy */}
      <PreferenceCard
        icon={<Users className="h-4 w-4 text-primary" />}
        label="Guest Policy Preference"
        value={formData.guest_policy}
        options={guestOptions}
        onChange={(value) => setFormData(prev => ({ ...prev, guest_policy: value }))}
      />

      {/* Personality Type */}
      <PreferenceCard
        icon={<Brain className="h-4 w-4 text-primary" />}
        label="Personality Type"
        value={formData.personality_type}
        options={personalityOptions}
        columns={3}
        onChange={(value) => setFormData(prev => ({ ...prev, personality_type: value }))}
      />

      {/* Work From Home */}
      <PreferenceCard
        icon={<Laptop className="h-4 w-4 text-primary" />}
        label="Work/Study from Home?"
        value={formData.work_from_home}
        options={workFromHomeOptions}
        columns={3}
        onChange={(value) => setFormData(prev => ({ ...prev, work_from_home: value }))}
      />
    </Card>
  );
}
