import { ProfileFormData } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Cigarette, Wine, Dog, Moon } from "lucide-react";

interface StepLifestyleProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}

const smokingOptions = [
  { value: "never", label: "Never" },
  { value: "socially", label: "Socially" },
  { value: "regularly", label: "Regularly" },
];

const drinkingOptions = [
  { value: "never", label: "Never" },
  { value: "socially", label: "Socially" },
  { value: "regularly", label: "Regularly" },
];

const petsOptions = [
  { value: "no", label: "No pets" },
  { value: "dog", label: "Yes - Dog" },
  { value: "cat", label: "Yes - Cat" },
  { value: "other", label: "Yes - Other" },
];

const petFriendlyOptions = [
  { value: "yes", label: "Yes, I love pets!" },
  { value: "no", label: "No pets please" },
  { value: "depends", label: "Depends on the pet" },
];

const sleepOptions = [
  { value: "early-bird", label: "Early Bird (before 10pm)" },
  { value: "night-owl", label: "Night Owl (after midnight)" },
  { value: "flexible", label: "Flexible" },
];

interface LifestyleGroupProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function LifestyleGroup({ icon, label, value, options, onChange }: LifestyleGroupProps) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid gap-2"
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
          >
            <RadioGroupItem value={option.value} id={`${label}-${option.value}`} />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function StepLifestyle({ formData, setFormData }: StepLifestyleProps) {
  return (
    <Card className="p-6 space-y-8">
      {/* Smoking */}
      <LifestyleGroup
        icon={<Cigarette className="h-4 w-4 text-primary" />}
        label="Do you smoke?"
        value={formData.smoking}
        options={smokingOptions}
        onChange={(value) => setFormData(prev => ({ ...prev, smoking: value }))}
      />

      {/* Drinking */}
      <LifestyleGroup
        icon={<Wine className="h-4 w-4 text-primary" />}
        label="Do you drink?"
        value={formData.drinking}
        options={drinkingOptions}
        onChange={(value) => setFormData(prev => ({ ...prev, drinking: value }))}
      />

      {/* Pets */}
      <LifestyleGroup
        icon={<Dog className="h-4 w-4 text-primary" />}
        label="Do you have pets?"
        value={formData.has_pets}
        options={petsOptions}
        onChange={(value) => setFormData(prev => ({ ...prev, has_pets: value }))}
      />

      {/* Pet Friendly */}
      <LifestyleGroup
        icon={<Dog className="h-4 w-4 text-primary" />}
        label="Are you okay with roommate's pets?"
        value={formData.pet_friendly}
        options={petFriendlyOptions}
        onChange={(value) => setFormData(prev => ({ ...prev, pet_friendly: value }))}
      />

      {/* Sleep Schedule */}
      <LifestyleGroup
        icon={<Moon className="h-4 w-4 text-primary" />}
        label="Sleep Schedule"
        value={formData.sleep_schedule}
        options={sleepOptions}
        onChange={(value) => setFormData(prev => ({ ...prev, sleep_schedule: value }))}
      />
    </Card>
  );
}
