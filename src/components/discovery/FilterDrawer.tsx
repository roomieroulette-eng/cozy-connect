import { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { SlidersHorizontal, MapPin, DollarSign, Dog, Coffee, Moon, Sparkles, Users, X } from "lucide-react";

export interface FilterOptions {
  budgetRange: [number, number];
  neighborhoods: string[];
  petsOk: boolean | null;
  smokingOk: boolean | null;
  nightOwlOk: boolean | null;
  cleanlinessLevel: string | null;
  personality: string | null;
}

interface FilterDrawerProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const neighborhoods = [
  "Williamsburg",
  "East Village",
  "Astoria",
  "Park Slope",
  "Harlem",
  "Bushwick",
  "Chelsea",
  "SoHo",
  "Greenwich Village",
  "Upper West Side",
];

const FilterDrawer = ({ filters, onFiltersChange }: FilterDrawerProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      budgetRange: [500, 2000],
      neighborhoods: [],
      petsOk: null,
      smokingOk: null,
      nightOwlOk: null,
      cleanlinessLevel: null,
      personality: null,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      neighborhoods: prev.neighborhoods.includes(neighborhood)
        ? prev.neighborhoods.filter((n) => n !== neighborhood)
        : [...prev.neighborhoods, neighborhood],
    }));
  };

  const activeFiltersCount = [
    filters.budgetRange[0] !== 500 || filters.budgetRange[1] !== 2000,
    filters.neighborhoods.length > 0,
    filters.petsOk !== null,
    filters.smokingOk !== null,
    filters.nightOwlOk !== null,
    filters.cleanlinessLevel !== null,
    filters.personality !== null,
  ].filter(Boolean).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Filters</SheetTitle>
          <SheetDescription>
            Narrow down your roommate search
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Budget Range */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Budget Range</Label>
            </div>
            <Slider
              value={localFilters.budgetRange}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  budgetRange: value as [number, number],
                }))
              }
              min={0}
              max={5000000}
              step={5000}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(localFilters.budgetRange[0])}</span>
              <span>{formatCurrency(localFilters.budgetRange[1])}+</span>
            </div>
          </div>

          {/* Neighborhoods */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Neighborhoods</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {neighborhoods.map((neighborhood) => (
                <button
                  key={neighborhood}
                  onClick={() => toggleNeighborhood(neighborhood)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    localFilters.neighborhoods.includes(neighborhood)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {neighborhood}
                </button>
              ))}
            </div>
          </div>

          {/* Pets */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dog className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Pet Friendly</Label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    petsOk: prev.petsOk === true ? null : true,
                  }))
                }
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  localFilters.petsOk === true
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    petsOk: prev.petsOk === false ? null : false,
                  }))
                }
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  localFilters.petsOk === false
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Smoking */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Non-Smoker</Label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    smokingOk: prev.smokingOk === false ? null : false,
                  }))
                }
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  localFilters.smokingOk === false
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                Required
              </button>
              <button
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    smokingOk: prev.smokingOk === true ? null : true,
                  }))
                }
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  localFilters.smokingOk === true
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                OK
              </button>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Sleep Schedule</Label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    nightOwlOk: prev.nightOwlOk === false ? null : false,
                  }))
                }
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  localFilters.nightOwlOk === false
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                Early Bird
              </button>
              <button
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    nightOwlOk: prev.nightOwlOk === true ? null : true,
                  }))
                }
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  localFilters.nightOwlOk === true
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                Night Owl
              </button>
            </div>
          </div>

          {/* Cleanliness */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Cleanliness Level</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {["relaxed", "moderate", "clean", "very-clean"].map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      cleanlinessLevel:
                        prev.cleanlinessLevel === level ? null : level,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all ${
                    localFilters.cleanlinessLevel === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {level === "very-clean" ? "Very Clean" : level}
                </button>
              ))}
            </div>
          </div>

          {/* Personality */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Personality Type</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {["introvert", "ambivert", "extrovert"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      personality: prev.personality === type ? null : type,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all ${
                    localFilters.personality === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset All
          </Button>
          <Button variant="hero" onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
