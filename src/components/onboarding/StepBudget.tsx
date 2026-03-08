import { ProfileFormData } from "@/hooks/useProfile";
import { getCurrencySymbol } from "@/lib/currency";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Banknote, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StepBudgetProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}

const leaseDurationOptions = [
  { value: "month-to-month", label: "Month-to-month" },
  { value: "6-months", label: "6 months" },
  { value: "1-year", label: "1 year" },
  { value: "flexible", label: "Flexible" },
];

const moveInOptions = [
  { value: "asap", label: "ASAP" },
  { value: "1-month", label: "Within 1 month" },
  { value: "2-3-months", label: "2-3 months" },
  { value: "flexible", label: "Flexible" },
];

export default function StepBudget({ formData, setFormData }: StepBudgetProps) {
  const currencySymbol = getCurrencySymbol();

  return (
    <Card className="p-6 space-y-6">
      {/* Budget Range */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Monthly Budget Range
        </Label>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-budget" className="text-sm text-muted-foreground">
              Minimum
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{currencySymbol}</span>
              <Input
                id="min-budget"
                type="number"
                min={0}
                placeholder="0"
                value={formData.min_budget || ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  min_budget: e.target.value ? parseInt(e.target.value) : null 
                }))}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-budget" className="text-sm text-muted-foreground">
              Maximum
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{currencySymbol}</span>
              <Input
                id="max-budget"
                type="number"
                min={0}
                placeholder="0"
                value={formData.max_budget || ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  max_budget: e.target.value ? parseInt(e.target.value) : null 
                }))}
                className="pl-8"
              />
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Enter your comfortable rent contribution range per month.
        </p>
      </div>

      {/* Move-in Date */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          Move-in Date
        </Label>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.move_in_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.move_in_date ? (
                format(formData.move_in_date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.move_in_date || undefined}
              onSelect={(date) => setFormData(prev => ({ ...prev, move_in_date: date || null }))}
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Quick options */}
        <div className="grid grid-cols-2 gap-2">
          {moveInOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                const date = new Date();
                if (option.value === "1-month") date.setMonth(date.getMonth() + 1);
                if (option.value === "2-3-months") date.setMonth(date.getMonth() + 2);
                if (option.value === "flexible") date.setMonth(date.getMonth() + 3);
                setFormData(prev => ({ ...prev, move_in_date: date }));
              }}
              className="px-3 py-2 text-sm rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lease Duration */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Preferred Lease Duration
        </Label>
        <RadioGroup
          value={formData.lease_duration}
          onValueChange={(value) => setFormData(prev => ({ ...prev, lease_duration: value }))}
          className="grid grid-cols-2 gap-3"
        >
          {leaseDurationOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value={option.value} id={`lease-${option.value}`} />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
}
