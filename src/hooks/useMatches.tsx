import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Match {
  id: string;
  matchedUserId: string;
  matchedUserName: string;
  matchedUserPhoto: string | null;
  createdAt: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    isRead: boolean;
    senderId: string;
  };
  unreadCount: number;
}

export function useMatches() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get all matches where user is involved
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .is("unmatched_at", null);

      if (matchesError) throw matchesError;

      if (!matchesData || matchesData.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // Get the other user's IDs
      const otherUserIds = matchesData.map((m) =>
        m.user1_id === user.id ? m.user2_id : m.user1_id
      );

      // Fetch profiles for matched users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, name, photos")
        .in("user_id", otherUserIds);

      if (profilesError) throw profilesError;

      // Fetch last messages and unread counts for each match
      const matchesWithDetails = await Promise.all(
        matchesData.map(async (match) => {
          const otherUserId =
            match.user1_id === user.id ? match.user2_id : match.user1_id;
          const profile = profiles?.find((p) => p.user_id === otherUserId);

          // Get last message
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("*")
            .eq("match_id", match.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get unread count
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("match_id", match.id)
            .neq("sender_id", user.id)
            .is("read_at", null);

          // Get signed URL for photo if exists
          let photoUrl = null;
          if (profile?.photos && profile.photos.length > 0) {
            const { data: signedData } = await supabase.storage
              .from("profile-photos")
              .createSignedUrl(profile.photos[0], 60 * 60 * 24);
            photoUrl = signedData?.signedUrl || null;
          }

          return {
            id: match.id,
            matchedUserId: otherUserId,
            matchedUserName: profile?.name || "Unknown",
            matchedUserPhoto: photoUrl,
            createdAt: match.created_at,
            lastMessage: lastMsg
              ? {
                  content: lastMsg.content,
                  createdAt: lastMsg.created_at,
                  isRead: !!lastMsg.read_at,
                  senderId: lastMsg.sender_id,
                }
              : undefined,
            unreadCount: count || 0,
          };
        })
      );

      // Sort by last message time or match time
      matchesWithDetails.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.createdAt;
        const bTime = b.lastMessage?.createdAt || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      setMatches(matchesWithDetails);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const unmatch = useCallback(
    async (matchId: string) => {
      if (!user) return false;

      try {
        const { error } = await supabase
          .from("matches")
          .update({
            unmatched_at: new Date().toISOString(),
            unmatched_by: user.id,
          })
          .eq("id", matchId);

        if (error) throw error;

        setMatches((prev) => prev.filter((m) => m.id !== matchId));
        toast({
          title: "Unmatched",
          description: "You have unmatched with this user.",
        });
        return true;
      } catch (error) {
        console.error("Error unmatching:", error);
        toast({
          title: "Error",
          description: "Failed to unmatch. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    },
    [user, toast]
  );

  const createMatch = useCallback(
    async (otherUserId: string) => {
      if (!user) return null;

      try {
        // Order user IDs to prevent duplicate matches
        const [user1_id, user2_id] = [user.id, otherUserId].sort();

        const { data, error } = await supabase
          .from("matches")
          .insert({ user1_id, user2_id })
          .select()
          .single();

        if (error) {
          // If match already exists, that's okay
          if (error.code === "23505") {
            return null;
          }
          throw error;
        }

        await fetchMatches();
        return data;
      } catch (error) {
        console.error("Error creating match:", error);
        return null;
      }
    },
    [user, fetchMatches]
  );

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, loading, fetchMatches, unmatch, createMatch };
}
