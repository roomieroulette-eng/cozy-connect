import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, ProfileFormData } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { getUserFriendlyError } from "@/lib/errorHandler";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { 
  Home, 
  Save, 
  User, 
  Camera, 
  MapPin, 
  DollarSign, 
  Coffee, 
  Sofa, 
  FileText,
  Loader2,
  Trash2,
  AlertTriangle
} from "lucide-react";

// Import reusable step components
import StepBasicInfo from "@/components/onboarding/StepBasicInfo";
import StepPhotos from "@/components/onboarding/StepPhotos";
import StepLocation from "@/components/onboarding/StepLocation";
import StepBudget from "@/components/onboarding/StepBudget";
import StepLifestyle from "@/components/onboarding/StepLifestyle";
import StepLivingPreferences from "@/components/onboarding/StepLivingPreferences";
import StepBio from "@/components/onboarding/StepBio";

const profileTabs = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "location", label: "Location", icon: MapPin },
  { id: "budget", label: "Budget", icon: DollarSign },
  { id: "lifestyle", label: "Lifestyle", icon: Coffee },
  { id: "living", label: "Living", icon: Sofa },
  { id: "bio", label: "About", icon: FileText },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user, signOut, loading: authLoading } = useAuth();
  const { 
    profile, 
    formData, 
    setFormData, 
    updateProfile, 
    uploadPhoto, 
    loading: profileLoading 
  } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile(formData);
    
    if (error) {
      toast({
        title: "Error saving",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated! ✨",
        description: "Your changes have been saved.",
      });
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("delete-account", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.error) throw res.error;
      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently removed.",
      });
      await signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    }
    setDeleting(false);
    setShowDeleteDialog(false);
    setDeleteConfirmText("");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-background to-warm-100 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-warm-100">
      <Navbar />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Your Profile
              </h1>
              <p className="text-muted-foreground">
                Manage your profile information and preferences
              </p>
            </div>
            
            <Button
              variant="hero"
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Profile Preview Card */}
        {formData.photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 flex items-center gap-6">
              <div className="relative">
                <img
                  src={formData.photos[0]}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/20"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent border-2 border-background" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {formData.name || "Your Name"}
                  {formData.age && <span className="text-muted-foreground font-normal">, {formData.age}</span>}
                </h2>
                <p className="text-muted-foreground">
                  {formData.occupation || "Your occupation"}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {formData.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {formData.city}
                    </span>
                  )}
                  {(formData.min_budget || formData.max_budget) && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${formData.min_budget || 0} - ${formData.max_budget || 0}/mo
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full flex-wrap h-auto gap-2 p-2 bg-muted/50">
            {profileTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="basic" className="mt-0">
              <StepBasicInfo formData={formData} setFormData={setFormData} />
            </TabsContent>

            <TabsContent value="photos" className="mt-0">
              <StepPhotos 
                formData={formData} 
                setFormData={setFormData} 
                uploadPhoto={uploadPhoto}
              />
            </TabsContent>

            <TabsContent value="location" className="mt-0">
              <StepLocation formData={formData} setFormData={setFormData} />
            </TabsContent>

            <TabsContent value="budget" className="mt-0">
              <StepBudget formData={formData} setFormData={setFormData} />
            </TabsContent>

            <TabsContent value="lifestyle" className="mt-0">
              <StepLifestyle formData={formData} setFormData={setFormData} />
            </TabsContent>

            <TabsContent value="living" className="mt-0">
              <StepLivingPreferences formData={formData} setFormData={setFormData} />
            </TabsContent>

            <TabsContent value="bio" className="mt-0">
              <StepBio formData={formData} setFormData={setFormData} />
            </TabsContent>
          </motion.div>
        </Tabs>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 mb-24"
        >
          <Card className="p-6 border-destructive/30 bg-destructive/5">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                  Delete Account
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data including matches, messages, and photos. This action cannot be undone.
                </p>
                <AlertDialog open={showDeleteDialog} onOpenChange={(open) => {
                  setShowDeleteDialog(open);
                  if (!open) setDeleteConfirmText("");
                }}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your account, profile, all matches, messages, and uploaded photos. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Type <span className="font-mono font-bold text-foreground">DELETE</span> to confirm:
                      </p>
                      <Input
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE"
                        className="font-mono"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "DELETE" || deleting}
                      >
                        {deleting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Deleting...
                          </span>
                        ) : (
                          "Delete My Account"
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Bottom Save Button (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border md:hidden">
          <Button
            variant="hero"
            onClick={handleSave}
            disabled={saving}
            className="w-full gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
