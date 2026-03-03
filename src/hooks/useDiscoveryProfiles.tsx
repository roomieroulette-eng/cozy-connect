import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface DiscoveryProfile {
  userId: string;
  name: string;
  age: number | null;
  city: string | null;
  neighborhood: string | null;
  occupation: string | null;
  primaryPhotoUrl: string | null;
  minBudget: number | null;
  maxBudget: number | null;
  bioPreview: string | null;
  personalityType: string | null;
  cleanliness: string | null;
  sleepSchedule: string | null;
  hasPets: string | null;
  petFriendly: string | null;
  smoking: string | null;
  drinking: string | null;
  workFromHome: string | null;
  interestCount: number | null;
  housingStatus: string | null;
}

export function useDiscoveryProfiles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>([]);
  const [swipedIds, setSwipedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);

  // Fetch already-swiped user IDs
  const fetchSwipedIds = useCallback(async () => {
    if (!user) return new Set<string>();

    const { data, error } = await supabase
      .from("swipes")
      .select("swiped_id")
      .eq("swiper_id", user.id);

    if (error) {
      console.error("Error fetching swipes:", error);
      return new Set<string>();
    }

    return new Set((data || []).map((s) => s.swiped_id));
  }, [user]);

  // Fetch profiles from profile_previews
  const fetchProfiles = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const swiped = await fetchSwipedIds();
      setSwipedIds(swiped);

      const { data, error } = await supabase
        .from("profile_previews")
        .select("*")
        .eq("onboarding_completed", true)
        .neq("user_id", user.id);

      if (error) throw error;

      // Filter out already-swiped profiles
      const unswiped = (data || []).filter(
        (p) => p.user_id && !swiped.has(p.user_id)
      );

      // Map to DiscoveryProfile - primary_photo already contains full URLs from the view
      const mapped: DiscoveryProfile[] = unswiped.map((p) => ({
        userId: p.user_id!,
        name: p.name || "Unknown",
        age: p.age,
        city: p.city,
        neighborhood: p.neighborhood,
        occupation: p.occupation,
        primaryPhotoUrl: p.primary_photo,
        minBudget: p.min_budget,
        maxBudget: p.max_budget,
        bioPreview: p.bio_preview,
        personalityType: p.personality_type,
        cleanliness: p.cleanliness,
        sleepSchedule: p.sleep_schedule,
        hasPets: p.has_pets,
        petFriendly: p.pet_friendly,
        smoking: p.smoking,
        drinking: p.drinking,
        workFromHome: p.work_from_home,
        interestCount: p.interest_count,
        housingStatus: (p as any).housing_status ?? null,
      }));

      setProfiles(mapped);
    } catch (error) {
      console.error("Error fetching discovery profiles:", error);
    } finally {
      setLoading(false);
    }
  }, [user, fetchSwipedIds]);

  // Record a swipe and check for mutual match
  const recordSwipe = useCallback(
    async (
      swipedUserId: string,
      direction: "left" | "right",
      isSuperLike = false
    ): Promise<{ matched: boolean }> => {
      if (!user) return { matched: false };

      setSwiping(true);
      try {
        // Insert swipe record
        const { error: swipeError } = await supabase.from("swipes").insert({
          swiper_id: user.id,
          swiped_id: swipedUserId,
          direction,
          is_super_like: isSuperLike,
        });

        if (swipeError) {
          // Duplicate swipe is okay
          if (swipeError.code !== "23505") throw swipeError;
        }

        // Remove from local list
        setSwipedIds((prev) => new Set([...prev, swipedUserId]));
        setProfiles((prev) => prev.filter((p) => p.userId !== swipedUserId));

        // Check for mutual like
        if (direction === "right") {
          const { data: isMutual, error: mutualError } = await supabase.rpc(
            "check_mutual_like",
            { other_user_id: swipedUserId }
          );

          if (mutualError) {
            console.error("Error checking mutual like:", mutualError);
            return { matched: false };
          }

          if (isMutual) {
            // Create the match
            const [user1_id, user2_id] = [user.id, swipedUserId].sort();
            const { error: matchError } = await supabase
              .from("matches")
              .insert({ user1_id, user2_id });

            if (matchError && matchError.code !== "23505") {
              console.error("Error creating match:", matchError);
              return { matched: false };
            }

            return { matched: true };
          }
        }

        return { matched: false };
      } catch (error) {
        console.error("Error recording swipe:", error);
        toast({
          title: "Error",
          description: "Failed to record swipe. Please try again.",
          variant: "destructive",
        });
        return { matched: false };
      } finally {
        setSwiping(false);
      }
    },
    [user, toast]
  );

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return {
    profiles,
    loading,
    swiping,
    recordSwipe,
    refreshProfiles: fetchProfiles,
  };
}
