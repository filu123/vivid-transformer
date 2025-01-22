export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      habit_completions: {
        Row: {
          completed_date: string
          created_at: string
          habit_id: string
          id: string
        }
        Insert: {
          completed_date: string
          created_at?: string
          habit_id: string
          id?: string
        }
        Update: {
          completed_date?: string
          created_at?: string
          habit_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          custom_days: number[] | null
          duration_minutes: number
          duration_months: number
          frequency: Database["public"]["Enums"]["habit_frequency"]
          id: string
          start_date: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_days?: number[] | null
          duration_minutes?: number
          duration_months: number
          frequency: Database["public"]["Enums"]["habit_frequency"]
          id?: string
          start_date?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_days?: number[] | null
          duration_minutes?: number
          duration_months?: number
          frequency?: Database["public"]["Enums"]["habit_frequency"]
          id?: string
          start_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          background_color: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          image_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          background_color?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          background_color?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      priorities: {
        Row: {
          created_at: string
          date: string
          end_time: string | null
          id: string
          is_done: boolean | null
          note: string | null
          start_time: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time?: string | null
          id?: string
          is_done?: boolean | null
          note?: string | null
          start_time?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string | null
          id?: string
          is_done?: boolean | null
          note?: string | null
          start_time?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          due_date: string
          id: string
          name: string
          status: string
          tasks_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          due_date: string
          id?: string
          name: string
          status: string
          tasks_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          due_date?: string
          id?: string
          name?: string
          status?: string
          tasks_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      reminder_lists: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          background_color: string | null
          category: Database["public"]["Enums"]["reminder_category"]
          created_at: string
          due_date: string | null
          id: string
          is_completed: boolean
          list_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          background_color?: string | null
          category?: Database["public"]["Enums"]["reminder_category"]
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean
          list_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          background_color?: string | null
          category?: Database["public"]["Enums"]["reminder_category"]
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean
          list_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "reminder_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      task_labels: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          id: string
          is_done: boolean | null
          note: string | null
          project_id: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_done?: boolean | null
          note?: string | null
          project_id: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_done?: boolean | null
          note?: string | null
          project_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks_notes: {
        Row: {
          background_color: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          is_done: boolean | null
          label_id: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          user_id: string
        }
        Insert: {
          background_color?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          is_done?: boolean | null
          label_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          user_id: string
        }
        Update: {
          background_color?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          is_done?: boolean | null
          label_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_notes_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "task_labels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      habit_frequency: "daily" | "three_times" | "custom"
      reminder_category: "all" | "today" | "scheduled" | "completed"
      task_status: "pending" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
