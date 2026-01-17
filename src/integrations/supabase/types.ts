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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string
          category: string
          color_class: string | null
          content: string
          cover_image: string | null
          created_at: string
          emoji: string | null
          excerpt: string
          id: string
          published: boolean | null
          read_time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name: string
          category: string
          color_class?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          emoji?: string | null
          excerpt: string
          id?: string
          published?: boolean | null
          read_time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          category?: string
          color_class?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          emoji?: string | null
          excerpt?: string
          id?: string
          published?: boolean | null
          read_time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      career_areas_content: {
        Row: {
          career_description: string
          career_id: string
          career_name: string
          created_at: string
          icon: string | null
          id: string
          salary_range: string | null
          sort_order: number | null
          stem_area: string
          updated_at: string
          women: Json
        }
        Insert: {
          career_description: string
          career_id: string
          career_name: string
          created_at?: string
          icon?: string | null
          id?: string
          salary_range?: string | null
          sort_order?: number | null
          stem_area: string
          updated_at?: string
          women?: Json
        }
        Update: {
          career_description?: string
          career_id?: string
          career_name?: string
          created_at?: string
          icon?: string | null
          id?: string
          salary_range?: string | null
          sort_order?: number | null
          stem_area?: string
          updated_at?: string
          women?: Json
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "experiment_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      completed_experiments: {
        Row: {
          completed_at: string
          experiment_id: string
          id: string
          stem_area: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          experiment_id: string
          id?: string
          stem_area: string
          user_id: string
        }
        Update: {
          completed_at?: string
          experiment_id?: string
          id?: string
          stem_area?: string
          user_id?: string
        }
        Relationships: []
      }
      completed_lessons: {
        Row: {
          completed_at: string
          id: string
          lesson_id: number
          stem_area: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: number
          stem_area: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: number
          stem_area?: string
          user_id?: string
        }
        Relationships: []
      }
      completed_modules: {
        Row: {
          completed_at: string
          id: string
          module_id: string
          stem_area: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          module_id: string
          stem_area: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          module_id?: string
          stem_area?: string
          user_id?: string
        }
        Relationships: []
      }
      experiment_comments: {
        Row: {
          content: string
          created_at: string
          experiment_id: string
          id: string
          likes: number | null
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          experiment_id: string
          id?: string
          likes?: number | null
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          experiment_id?: string
          id?: string
          likes?: number | null
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "experiment_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiments_content: {
        Row: {
          color: string | null
          cover_image: string | null
          created_at: string
          description: string
          difficulty: string | null
          experiment_id: string
          icon: string | null
          id: string
          image: string | null
          materials: string[]
          sort_order: number | null
          stem_area: string
          step_images: string[] | null
          steps: string[]
          time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          cover_image?: string | null
          created_at?: string
          description: string
          difficulty?: string | null
          experiment_id: string
          icon?: string | null
          id?: string
          image?: string | null
          materials?: string[]
          sort_order?: number | null
          stem_area: string
          step_images?: string[] | null
          steps?: string[]
          time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string
          difficulty?: string | null
          experiment_id?: string
          icon?: string | null
          id?: string
          image?: string | null
          materials?: string[]
          sort_order?: number | null
          stem_area?: string
          step_images?: string[] | null
          steps?: string[]
          time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_path_content: {
        Row: {
          color: string | null
          created_at: string
          description: string
          difficulty: string | null
          icon: string | null
          id: string
          lessons: Json
          level_number: number
          points: number | null
          sort_order: number | null
          stem_area: string
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description: string
          difficulty?: string | null
          icon?: string | null
          id?: string
          lessons?: Json
          level_number: number
          points?: number | null
          sort_order?: number | null
          stem_area: string
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string
          difficulty?: string | null
          icon?: string | null
          id?: string
          lessons?: Json
          level_number?: number
          points?: number | null
          sort_order?: number | null
          stem_area?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      modules_content: {
        Row: {
          category: string
          color: string | null
          created_at: string
          description: string
          estimated_time: string | null
          final_project: Json | null
          icon: string | null
          id: string
          lessons: Json
          module_id: string
          sort_order: number | null
          stem_area: string
          title: string
          total_lessons: number | null
          updated_at: string
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string
          description: string
          estimated_time?: string | null
          final_project?: Json | null
          icon?: string | null
          id?: string
          lessons?: Json
          module_id: string
          sort_order?: number | null
          stem_area: string
          title: string
          total_lessons?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string
          estimated_time?: string | null
          final_project?: Json | null
          icon?: string | null
          id?: string
          lessons?: Json
          module_id?: string
          sort_order?: number | null
          stem_area?: string
          title?: string
          total_lessons?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          email: string
          id: string
          interests: string[] | null
          name: string
          profile_image: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          email: string
          id: string
          interests?: string[] | null
          name: string
          profile_image?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          created_at?: string
          email?: string
          id?: string
          interests?: string[] | null
          name?: string
          profile_image?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string
          current_lesson: number | null
          id: string
          level: number | null
          points: number | null
          stem_area: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_lesson?: number | null
          id?: string
          level?: number | null
          points?: number | null
          stem_area: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_lesson?: number | null
          id?: string
          level?: number | null
          points?: number | null
          stem_area?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_likes: { Args: { comment_id: string }; Returns: undefined }
      get_comment_user_info: {
        Args: { user_ids: string[] }
        Returns: {
          id: string
          name: string
          profile_image: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_likes: { Args: { comment_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
