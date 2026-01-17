// Supabase Database Types for Admin Panel
// Generated from schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      fathers: {
        Row: {
          id: string;
          name_ka: string;
          name_ru: string | null;
          bio_ka: string | null;
          bio_ru: string | null;
          avatar_url: string;
          profile_image_url: string | null;
          order: number | null;
          deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name_ka: string;
          name_ru?: string | null;
          bio_ka?: string | null;
          bio_ru?: string | null;
          avatar_url: string;
          profile_image_url?: string | null;
          order?: number | null;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_ka?: string;
          name_ru?: string | null;
          bio_ka?: string | null;
          bio_ru?: string | null;
          avatar_url?: string;
          profile_image_url?: string | null;
          order?: number | null;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          father_id: string;
          text_ka: string;
          text_ru: string | null;
          source_ka: string | null;
          source_ru: string | null;
          quote_date: string | null;
          tags: string[];
          is_published: boolean;
          deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          father_id: string;
          text_ka: string;
          text_ru?: string | null;
          source_ka?: string | null;
          source_ru?: string | null;
          quote_date?: string | null;
          tags?: string[];
          is_published?: boolean;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          father_id?: string;
          text_ka?: string;
          text_ru?: string | null;
          source_ka?: string | null;
          source_ru?: string | null;
          quote_date?: string | null;
          tags?: string[];
          is_published?: boolean;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          message: string;
          contact: string | null;
          language: "ka" | "ru";
          platform: "ios" | "android" | null;
          app_version: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          message: string;
          contact?: string | null;
          language: "ka" | "ru";
          platform?: "ios" | "android" | null;
          app_version?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          message?: string;
          contact?: string | null;
          language?: "ka" | "ru";
          platform?: "ios" | "android" | null;
          app_version?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      app_settings: {
        Row: {
          id: number;
          subscriber_count: number;
          updated_at: string;
        };
        Insert: {
          id?: number;
          subscriber_count?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          subscriber_count?: number;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenient type aliases
export type Father = Database["public"]["Tables"]["fathers"]["Row"];
export type FatherInsert = Database["public"]["Tables"]["fathers"]["Insert"];
export type FatherUpdate = Database["public"]["Tables"]["fathers"]["Update"];

export type Quote = Database["public"]["Tables"]["quotes"]["Row"];
export type QuoteInsert = Database["public"]["Tables"]["quotes"]["Insert"];
export type QuoteUpdate = Database["public"]["Tables"]["quotes"]["Update"];

export type Feedback = Database["public"]["Tables"]["feedback"]["Row"];
export type FeedbackUpdate = Database["public"]["Tables"]["feedback"]["Update"];

export type AppSettings = Database["public"]["Tables"]["app_settings"]["Row"];
export type AppSettingsUpdate = Database["public"]["Tables"]["app_settings"]["Update"];
