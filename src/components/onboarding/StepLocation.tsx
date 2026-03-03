import { ProfileFormData } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { MapPin, Home, LocateFixed } from "lucide-react";
import { useState } from "react";

interface StepLocationProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}

const housingOptions = [
  { value: "looking", label: "Looking for a place", description: "I need to find a room/apartment" },
  { value: "have_place", label: "Have a place", description: "I have a room available" },
];

export default function StepLocation({ formData, setFormData }: StepLocationProps) {
  const [detecting, setDetecting] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const address = data.address || {};
          const city = address.city || address.town || address.village || "";
          const state = address.state || "";
          setFormData(prev => ({ ...prev, city, state }));
        } catch {
          // silently fail
        } finally {
          setDetecting(false);
        }
      },
      () => setDetecting(false),
      { timeout: 10000 }
    );
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Auto-detect */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={detectLocation}
        disabled={detecting}
      >
        <LocateFixed className="h-4 w-4" />
        {detecting ? "Detecting location..." : "Use my current location"}
      </Button>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          City
        </Label>
        <Input
          id="city"
          placeholder="e.g., New York, Los Angeles, Chicago"
          value={formData.city}
          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
        />
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label htmlFor="state" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          State
        </Label>
        <Input
          id="state"
          placeholder="e.g., New York, California, Illinois"
          value={formData.state}
          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
        />
      </div>

      {/* Housing Status */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          Current Housing Status
        </Label>
        <RadioGroup
          value={formData.housing_status}
          onValueChange={(value) => setFormData(prev => ({ ...prev, housing_status: value }))}
          className="space-y-3"
        >
          {housingOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value={option.value} id={`housing-${option.value}`} className="mt-1" />
              <div>
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
}
