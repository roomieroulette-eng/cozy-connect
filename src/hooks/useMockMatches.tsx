import { useState, useCallback, useEffect } from "react";
import { Profile, mockProfiles } from "@/data/profiles";

export interface MockMatch {
  id: string;
  matchedProfile: Profile;
  createdAt: string;
  messages: MockMessage[];
}

export interface MockMessage {
  id: string;
  content: string;
  senderId: "user" | "match";
  createdAt: string;
}

const STORAGE_KEY = "roomieroulette_mock_matches";

export function useMockMatches() {
  const [matches, setMatches] = useState<MockMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Load matches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Rehydrate profile objects from IDs
        const rehydrated = parsed.map((match: any) => ({
          ...match,
          matchedProfile: mockProfiles.find((p) => p.id === match.profileId) || null,
        })).filter((m: MockMatch) => m.matchedProfile !== null);
        setMatches(rehydrated);
      } catch (e) {
        console.error("Error parsing mock matches:", e);
      }
    }
    setLoading(false);
  }, []);

  // Save matches to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      const toStore = matches.map((m) => ({
        id: m.id,
        profileId: m.matchedProfile.id,
        createdAt: m.createdAt,
        messages: m.messages,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }
  }, [matches, loading]);

  const createMatch = useCallback((profile: Profile): MockMatch => {
    const newMatch: MockMatch = {
      id: `match-${profile.id}-${Date.now()}`,
      matchedProfile: profile,
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setMatches((prev) => {
      // Don't add duplicate matches for the same profile
      if (prev.some((m) => m.matchedProfile.id === profile.id)) {
        return prev;
      }
      return [newMatch, ...prev];
    });
    return newMatch;
  }, []);

  const unmatch = useCallback((matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  }, []);

  const sendMessage = useCallback((matchId: string, content: string) => {
    const userMessage: MockMessage = {
      id: `msg-${Date.now()}`,
      content,
      senderId: "user",
      createdAt: new Date().toISOString(),
    };

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, messages: [...m.messages, userMessage] }
          : m
      )
    );

    // Simulate a reply after a short delay
    setTimeout(() => {
      const replies = [
        "Hey! Nice to meet you too! 👋",
        "Thanks for reaching out! When are you looking to move?",
        "Awesome! I think we'd be great roommates. Let's chat more!",
        "That sounds perfect! What's your schedule like?",
        "Cool! I'm pretty flexible with move-in dates.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const matchReply: MockMessage = {
        id: `msg-${Date.now()}-reply`,
        content: randomReply,
        senderId: "match",
        createdAt: new Date().toISOString(),
      };

      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? { ...m, messages: [...m.messages, matchReply] }
            : m
        )
      );
    }, 1000 + Math.random() * 2000);

    return true;
  }, []);

  const getMatch = useCallback(
    (matchId: string) => matches.find((m) => m.id === matchId) || null,
    [matches]
  );

  return {
    matches,
    loading,
    createMatch,
    unmatch,
    sendMessage,
    getMatch,
  };
}
