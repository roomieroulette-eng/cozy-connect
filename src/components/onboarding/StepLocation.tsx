import { ProfileFormData } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Search, X } from "lucide-react";
import { useState } from "react";

interface StepLocationProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}

const housingOptions = [
  { value: "looking", label: "Looking for a place", description: "I need to find a room/apartment" },
  { value: "have_place", label: "Have a place", description: "I have a room available" },
];

const popularNeighborhoods = [
  "Downtown", "Midtown", "Uptown", "Brooklyn Heights", "Williamsburg",
  "Chelsea", "SoHo", "East Village", "West Village", "Upper East Side",
];

export default function StepLocation({ formData, setFormData }: StepLocationProps) {
  const [neighborhoodInput, setNeighborhoodInput] = useState("");

  const addNeighborhood = (neighborhood: string) => {
    const trimmed = neighborhood.trim();
    if (trimmed && !formData.neighborhoods.includes(trimmed) && formData.neighborhoods.length < 5) {
      setFormData(prev => ({
        ...prev,
        neighborhoods: [...prev.neighborhoods, trimmed],
      }));
      setNeighborhoodInput("");
    }
  };

  const removeNeighborhood = (neighborhood: string) => {
    setFormData(prev => ({
      ...prev,
      neighborhoods: prev.neighborhoods.filter(n => n !== neighborhood),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNeighborhood(neighborhoodInput);
    }
  };

  return (
    <Card className="p-6 space-y-6">
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

      {/* Neighborhoods */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          Preferred Neighborhoods (max 5)
        </Label>
        
        {/* Selected neighborhoods */}
        {formData.neighborhoods.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.neighborhoods.map((neighborhood) => (
              <Badge
                key={neighborhood}
                variant="secondary"
                className="px-3 py-1 gap-2"
              >
                {neighborhood}
                <button
                  onClick={() => removeNeighborhood(neighborhood)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Input */}
        <Input
          placeholder="Type a neighborhood and press Enter"
          value={neighborhoodInput}
          onChange={(e) => setNeighborhoodInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={formData.neighborhoods.length >= 5}
        />

        {/* Quick add suggestions */}
        <div className="flex flex-wrap gap-2">
          {popularNeighborhoods
            .filter(n => !formData.neighborhoods.includes(n))
            .slice(0, 6)
            .map((neighborhood) => (
              <button
                key={neighborhood}
                onClick={() => addNeighborhood(neighborhood)}
                disabled={formData.neighborhoods.length >= 5}
                className="px-3 py-1 text-xs rounded-full border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
              >
                + {neighborhood}
              </button>
            ))}
        </div>
      </div>

      {/* Max Distance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Maximum Distance</Label>
          <span className="text-sm font-medium text-primary">
            {formData.max_distance} miles
          </span>
        </div>
        <Slider
          value={[formData.max_distance]}
          onValueChange={([value]) => setFormData(prev => ({ ...prev, max_distance: value }))}
          min={1}
          max={50}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 mile</span>
          <span>50 miles</span>
        </div>
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
