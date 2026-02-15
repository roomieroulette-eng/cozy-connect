import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Notification {
  id: string;
  type: "match" | "message";
  title: string;
  body: string;
  relatedMatchId: string | null;
  readAt: string | null;
  createdAt: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(
        (data || []).map((n) => ({
          id: n.id,
          type: n.type as "match" | "message",
          title: n.title,
          body: n.body,
          relatedMatchId: n.related_match_id,
          readAt: n.read_at,
          createdAt: n.created_at,
        }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!user) return;
      const now = new Date().toISOString();

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, readAt: now } : n))
      );

      await supabase
        .from("notifications")
        .update({ read_at: now })
        .eq("id", notificationId);
    },
    [user]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    const now = new Date().toISOString();

    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: now })));

    await supabase
      .from("notifications")
      .update({ read_at: now })
      .eq("user_id", user.id)
      .is("read_at", null);
  }, [user]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    channelRef.current = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const n = payload.new as {
            id: string;
            type: string;
            title: string;
            body: string;
            related_match_id: string | null;
            read_at: string | null;
            created_at: string;
          };

          setNotifications((prev) => {
            if (prev.some((existing) => existing.id === n.id)) return prev;
            return [
              {
                id: n.id,
                type: n.type as "match" | "message",
                title: n.title,
                body: n.body,
                relatedMatchId: n.related_match_id,
                readAt: n.read_at,
                createdAt: n.created_at,
              },
              ...prev,
            ];
          });
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
