import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

export function useMessages(matchId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!matchId || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(
        (data || []).map((m) => ({
          id: m.id,
          matchId: m.match_id,
          senderId: m.sender_id,
          content: m.content,
          createdAt: m.created_at,
          readAt: m.read_at,
        }))
      );

      // Mark unread messages as read
      const unreadIds = data
        ?.filter((m) => m.sender_id !== user.id && !m.read_at)
        .map((m) => m.id);

      if (unreadIds && unreadIds.length > 0) {
        await supabase
          .from("messages")
          .update({ read_at: new Date().toISOString() })
          .in("id", unreadIds);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [matchId, user]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!matchId || !user || !content.trim()) return false;

      setSending(true);
      try {
        const { error } = await supabase.from("messages").insert({
          match_id: matchId,
          sender_id: user.id,
          content: content.trim(),
        });

        if (error) throw error;
        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        return false;
      } finally {
        setSending(false);
      }
    },
    [matchId, user]
  );

  // Subscribe to realtime updates
  useEffect(() => {
    if (!matchId) return;

    channelRef.current = supabase
      .channel(`messages:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as {
            id: string;
            match_id: string;
            sender_id: string;
            content: string;
            created_at: string;
            read_at: string | null;
          };

          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [
              ...prev,
              {
                id: newMessage.id,
                matchId: newMessage.match_id,
                senderId: newMessage.sender_id,
                content: newMessage.content,
                createdAt: newMessage.created_at,
                readAt: newMessage.read_at,
              },
            ];
          });

          // Mark as read if not sender
          if (user && newMessage.sender_id !== user.id) {
            supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [matchId, user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, sending, sendMessage, fetchMessages };
}
