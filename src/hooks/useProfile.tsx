import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export interface ProfileFormData {
  // Step 1: Basic Info
  name: string;
  age: number | null;
  gender: string;
  occupation: string;
  
  // Step 2: Photos
  photos: string[];
  
  // Step 3: Location
  city: string;
  neighborhoods: string[];
  max_distance: number;
  housing_status: string;
  
  // Step 4: Budget
  min_budget: number | null;
  max_budget: number | null;
  move_in_date: Date | null;
  lease_duration: string;
  
  // Step 5: Lifestyle
  smoking: string;
  drinking: string;
  has_pets: string;
  pet_friendly: string;
  sleep_schedule: string;
  
  // Step 6: Living Preferences
  cleanliness: string;
  noise_level: string;
  guest_policy: string;
  personality_type: string;
  work_from_home: string;
  
  // Step 7: Bio
  bio: string;
  interests: string[];
}

const defaultFormData: ProfileFormData = {
  name: "",
  age: null,
  gender: "",
  occupation: "",
  photos: [],
  city: "",
  neighborhoods: [],
  max_distance: 10,
  housing_status: "",
  min_budget: null,
  max_budget: null,
  move_in_date: null,
  lease_duration: "",
  smoking: "",
  drinking: "",
  has_pets: "",
  pet_friendly: "",
  sleep_schedule: "",
  cleanliness: "",
  noise_level: "",
  guest_policy: "",
  personality_type: "",
  work_from_home: "",
  bio: "",
  interests: [],
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>(defaultFormData);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setFormData(defaultFormData);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setProfile(data);
      setFormData({
        name: data.name || "",
        age: data.age,
        gender: data.gender || "",
        occupation: data.occupation || "",
        photos: data.photos || [],
        city: data.city || "",
        neighborhoods: data.neighborhoods || [],
        max_distance: data.max_distance || 10,
        housing_status: data.housing_status || "",
        min_budget: data.min_budget,
        max_budget: data.max_budget,
        move_in_date: data.move_in_date ? new Date(data.move_in_date) : null,
        lease_duration: data.lease_duration || "",
        smoking: data.smoking || "",
        drinking: data.drinking || "",
        has_pets: data.has_pets || "",
        pet_friendly: data.pet_friendly || "",
        sleep_schedule: data.sleep_schedule || "",
        cleanliness: data.cleanliness || "",
        noise_level: data.noise_level || "",
        guest_policy: data.guest_policy || "",
        personality_type: data.personality_type || "",
        work_from_home: data.work_from_home || "",
        bio: data.bio || "",
        interests: data.interests || [],
      });
    }
    setLoading(false);
  };

  const updateProfile = async (data: Partial<ProfileFormData>) => {
    if (!user) return { error: new Error("Not authenticated") };

    const updateData: Record<string, unknown> = { ...data };
    
    // Convert Date to string for move_in_date
    if (data.move_in_date instanceof Date) {
      updateData.move_in_date = data.move_in_date.toISOString().split('T')[0];
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", user.id);

    if (!error) {
      setFormData(prev => ({ ...prev, ...data }));
    }

    return { error };
  };

  const completeOnboarding = async () => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("user_id", user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, onboarding_completed: true } : null);
    }

    return { error };
  };

  const uploadPhoto = async (file: File) => {
    if (!user) return { error: new Error("Not authenticated"), url: null };

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    // Validate extension server-side before upload
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      return { error: new Error("Invalid file type"), url: null };
    }
    
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(fileName, file);

    if (uploadError) {
      return { error: uploadError, url: null };
    }

    // Use signed URL since bucket is now private
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("profile-photos")
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    if (signedUrlError || !signedUrlData) {
      return { error: signedUrlError || new Error("Failed to generate URL"), url: null };
    }

    return { error: null, url: signedUrlData.signedUrl };
  };

  return {
    profile,
    loading,
    formData,
    setFormData,
    updateProfile,
    completeOnboarding,
    uploadPhoto,
    refetch: fetchProfile,
  };
}
