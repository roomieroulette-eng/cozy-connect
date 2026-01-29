export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      matches: {
        Row: {
          created_at: string
          id: string
          unmatched_at: string | null
          unmatched_by: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          unmatched_at?: string | null
          unmatched_by?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          unmatched_at?: string | null
          unmatched_by?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          match_id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          match_id: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          match_id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          bio: string | null
          city: string | null
          cleanliness: string | null
          created_at: string
          drinking: string | null
          gender: string | null
          guest_policy: string | null
          has_pets: string | null
          housing_status: string | null
          id: string
          interests: string[] | null
          lease_duration: string | null
          max_budget: number | null
          max_distance: number | null
          min_budget: number | null
          move_in_date: string | null
          name: string | null
          neighborhoods: string[] | null
          noise_level: string | null
          occupation: string | null
          onboarding_completed: boolean | null
          personality_type: string | null
          pet_friendly: string | null
          photos: string[] | null
          sleep_schedule: string | null
          smoking: string | null
          updated_at: string
          user_id: string
          work_from_home: string | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          city?: string | null
          cleanliness?: string | null
          created_at?: string
          drinking?: string | null
          gender?: string | null
          guest_policy?: string | null
          has_pets?: string | null
          housing_status?: string | null
          id?: string
          interests?: string[] | null
          lease_duration?: string | null
          max_budget?: number | null
          max_distance?: number | null
          min_budget?: number | null
          move_in_date?: string | null
          name?: string | null
          neighborhoods?: string[] | null
          noise_level?: string | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          personality_type?: string | null
          pet_friendly?: string | null
          photos?: string[] | null
          sleep_schedule?: string | null
          smoking?: string | null
          updated_at?: string
          user_id: string
          work_from_home?: string | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          city?: string | null
          cleanliness?: string | null
          created_at?: string
          drinking?: string | null
          gender?: string | null
          guest_policy?: string | null
          has_pets?: string | null
          housing_status?: string | null
          id?: string
          interests?: string[] | null
          lease_duration?: string | null
          max_budget?: number | null
          max_distance?: number | null
          min_budget?: number | null
          move_in_date?: string | null
          name?: string | null
          neighborhoods?: string[] | null
          noise_level?: string | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          personality_type?: string | null
          pet_friendly?: string | null
          photos?: string[] | null
          sleep_schedule?: string | null
          smoking?: string | null
          updated_at?: string
          user_id?: string
          work_from_home?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      profile_previews: {
        Row: {
          age: number | null
          bio_preview: string | null
          city: string | null
          cleanliness: string | null
          drinking: string | null
          has_pets: string | null
          interest_count: number | null
          max_budget: number | null
          min_budget: number | null
          name: string | null
          neighborhood: string | null
          occupation: string | null
          onboarding_completed: boolean | null
          personality_type: string | null
          pet_friendly: string | null
          primary_photo: string | null
          sleep_schedule: string | null
          smoking: string | null
          user_id: string | null
          work_from_home: string | null
        }
        Insert: {
          age?: number | null
          bio_preview?: never
          city?: string | null
          cleanliness?: string | null
          drinking?: string | null
          has_pets?: string | null
          interest_count?: never
          max_budget?: number | null
          min_budget?: number | null
          name?: string | null
          neighborhood?: never
          occupation?: string | null
          onboarding_completed?: boolean | null
          personality_type?: string | null
          pet_friendly?: string | null
          primary_photo?: never
          sleep_schedule?: string | null
          smoking?: string | null
          user_id?: string | null
          work_from_home?: string | null
        }
        Update: {
          age?: number | null
          bio_preview?: never
          city?: string | null
          cleanliness?: string | null
          drinking?: string | null
          has_pets?: string | null
          interest_count?: never
          max_budget?: number | null
          min_budget?: number | null
          name?: string | null
          neighborhood?: never
          occupation?: string | null
          onboarding_completed?: boolean | null
          personality_type?: string | null
          pet_friendly?: string | null
          primary_photo?: never
          sleep_schedule?: string | null
          smoking?: string | null
          user_id?: string | null
          work_from_home?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
