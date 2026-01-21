import { ProfileFormData } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Briefcase } from "lucide-react";

interface StepBasicInfoProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

export default function StepBasicInfo({ formData, setFormData }: StepBasicInfoProps) {
  return (
    <Card className="p-6 space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          First Name
        </Label>
        <Input
          id="name"
          placeholder="Enter your first name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min={18}
          max={100}
          placeholder="Your age (must be 18+)"
          value={formData.age || ""}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            age: e.target.value ? parseInt(e.target.value) : null 
          }))}
        />
        <p className="text-xs text-muted-foreground">You must be at least 18 years old.</p>
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <Label>Gender</Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
          className="grid grid-cols-2 gap-3"
        >
          {genderOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
              <Label 
                htmlFor={`gender-${option.value}`} 
                className="font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Occupation */}
      <div className="space-y-2">
        <Label htmlFor="occupation" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Occupation / Student Status
        </Label>
        <Input
          id="occupation"
          placeholder="e.g., Software Engineer, Graduate Student"
          value={formData.occupation}
          onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
        />
      </div>
    </Card>
  );
}
