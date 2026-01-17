// Supabase Database Types for "Цитаты Отцов" Project
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
export type FeedbackInsert = Database["public"]["Tables"]["feedback"]["Insert"];

export type AppSettings = Database["public"]["Tables"]["app_settings"]["Row"];

// Server model types (matching Firestore structure for compatibility)
export interface ServerFather {
  id: string;
  name: {
    ka: string;
    ru?: string;
  };
  bio?: {
    ka?: string;
    ru?: string;
  };
  avatarUrl: string;
  profileImageUrl?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface ServerQuote {
  id: string;
  fatherId: string;
  text: {
    ka: string;
    ru?: string;
  };
  source?: {
    ka?: string;
    ru?: string;
  };
  quoteDate?: string;
  tags?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

// Transform functions: Supabase Row -> Server Model (for backward compatibility)
export function toServerFather(row: Father): ServerFather {
  return {
    id: row.id,
    name: {
      ka: row.name_ka,
      ru: row.name_ru ?? undefined,
    },
    bio: row.bio_ka || row.bio_ru
      ? {
          ka: row.bio_ka ?? undefined,
          ru: row.bio_ru ?? undefined,
        }
      : undefined,
    avatarUrl: row.avatar_url,
    profileImageUrl: row.profile_image_url ?? undefined,
    order: row.order ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deleted: row.deleted,
  };
}

export function toServerQuote(row: Quote): ServerQuote {
  return {
    id: row.id,
    fatherId: row.father_id,
    text: {
      ka: row.text_ka,
      ru: row.text_ru ?? undefined,
    },
    source: row.source_ka || row.source_ru
      ? {
          ka: row.source_ka ?? undefined,
          ru: row.source_ru ?? undefined,
        }
      : undefined,
    quoteDate: row.quote_date ?? undefined,
    tags: row.tags.length > 0 ? row.tags : undefined,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deleted: row.deleted,
  };
}
