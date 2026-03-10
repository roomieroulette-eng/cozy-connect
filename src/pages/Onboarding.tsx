import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { getUserFriendlyError } from "@/lib/errorHandler";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Home, ArrowLeft, ArrowRight, Check } from "lucide-react";

// Import wizard steps
import StepBasicInfo from "@/components/onboarding/StepBasicInfo";
import StepPhotos from "@/components/onboarding/StepPhotos";
import StepLocation from "@/components/onboarding/StepLocation";
import StepBudget from "@/components/onboarding/StepBudget";
import StepLifestyle from "@/components/onboarding/StepLifestyle";
import StepLivingPreferences from "@/components/onboarding/StepLivingPreferences";
import StepBio from "@/components/onboarding/StepBio";

const TOTAL_STEPS = 7;

const stepTitles = [
  "Basic Information",
  "Profile Photos",
  "Location Preferences",
  "Budget & Timeline",
  "Lifestyle Basics",
  "Living Preferences",
  "About You",
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { formData, setFormData, updateProfile, completeOnboarding, uploadPhoto, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = async () => {
    // Validate all fields on step 1
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.age || !formData.gender || !formData.occupation.trim()) {
        toast({
          title: "All fields required",
          description: "Please fill in your name, age, gender, and occupation before continuing.",
          variant: "destructive",
        });
        return;
      }
      if (formData.age < 18) {
        toast({
          title: "Age requirement",
          description: "You must be at least 18 years old.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate minimum 2 photos on step 2
    if (currentStep === 2 && formData.photos.length < 2) {
      toast({
        title: "Photos required",
        description: "Please upload at least 2 photos before continuing.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const { error } = await updateProfile(formData);
    
    if (error) {
      toast({
        title: "Error saving",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      const { error: completeError } = await completeOnboarding();
      if (completeError) {
        toast({
          title: "Error",
          description: getUserFriendlyError(completeError),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Complete! 🎉",
          description: "You're all set to find your perfect roommate.",
        });
        navigate("/discover");
      }
    }
    setSaving(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-background to-warm-100 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-warm-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl gradient-warm">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold text-foreground">
                RoomieRoulette
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Step Title */}
        <motion.div
          key={`title-${currentStep}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            {stepTitles[currentStep - 1]}
          </h1>
          <p className="text-muted-foreground">
            {currentStep === 1 && "Let's start with some basics about you."}
            {currentStep === 2 && "Add photos to help potential roommates get to know you."}
            {currentStep === 3 && "Where are you looking to live?"}
            {currentStep === 4 && "Set your budget and move-in preferences."}
            {currentStep === 5 && "Tell us about your lifestyle habits."}
            {currentStep === 6 && "What's your ideal living environment?"}
            {currentStep === 7 && "Write a short bio to introduce yourself."}
          </p>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <StepBasicInfo formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 2 && (
              <StepPhotos formData={formData} setFormData={setFormData} uploadPhoto={uploadPhoto} />
            )}
            {currentStep === 3 && (
              <StepLocation formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 4 && (
              <StepBudget formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 5 && (
              <StepLifestyle formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 6 && (
              <StepLivingPreferences formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 7 && (
              <StepBio formData={formData} setFormData={setFormData} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || saving}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            variant="hero"
            onClick={handleNext}
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </>
            ) : currentStep === TOTAL_STEPS ? (
              <>
                Complete Profile
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
