/**
 * Hand-written to match supabase/migrations/0001_init.sql.
 * After the project is linked, regenerate with:
 *   npx supabase gen types typescript --db-url "$SUPABASE_DB_URL" > lib/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Localised text column shape. Stored as jsonb; may be partial. */
export type LocalizedJson = Partial<Record<"ru" | "ro" | "en", string>>;

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { user_id: string; role: "admin"; created_at: string };
        Insert: { user_id: string; role?: "admin" };
        Update: { role?: "admin" };
        Relationships: [];
      };
      settings: {
        Row: {
          id: boolean;
          club_name: string;
          phone: string;
          phone_secondary: string | null;
          email: string | null;
          instagram_url: string | null;
          telegram_url: string | null;
          facebook_url: string | null;
          address: LocalizedJson;
          map_url: string | null;
          working_hours: LocalizedJson;
          hours_open: string;
          hours_close: string;
          location_image_url: string | null;
          default_currency: string;
          price_range: string;
          cta_call_label: LocalizedJson;
          route_cta_label: LocalizedJson;
          book_cta_label: LocalizedJson;
          default_cta_label: LocalizedJson;
          default_cta_url: string | null;
          announcement_text: LocalizedJson;
          announcement_url: string | null;
          announcement_active: boolean;
          logo_url: string | null;
          og_image_url: string | null;
          seo_title: LocalizedJson;
          seo_description: LocalizedJson;
          og_title: LocalizedJson;
          og_description: LocalizedJson;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
        Relationships: [];
      };
      hero: {
        Row: {
          id: boolean;
          kicker: LocalizedJson;
          headline: LocalizedJson;
          subtitle: LocalizedJson;
          cta_label: LocalizedJson;
          cta_url: string;
          cta_enabled: boolean;
          video_enabled: boolean;
          poster_url: string;
          video_desktop_url: string | null;
          video_mobile_url: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["hero"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["hero"]["Row"]>;
        Relationships: [];
      };
      nav_items: {
        Row: {
          key:
            | "programs"
            | "gallery"
            | "prices"
            | "shop"
            | "schedule"
            | "coaches"
            | "contacts";
          label: LocalizedJson;
          visible: boolean;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["nav_items"]["Row"]> & {
          key: string;
        };
        Update: Partial<Database["public"]["Tables"]["nav_items"]["Row"]>;
        Relationships: [];
      };
      programs: {
        Row: {
          id: string;
          slug: string;
          title: LocalizedJson;
          description: LocalizedJson;
          image_url: string;
          badge: LocalizedJson | null;
          cta_label: LocalizedJson | null;
          cta_url: string | null;
          active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: Partial<Database["public"]["Tables"]["programs"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["programs"]["Row"]>;
        Relationships: [];
      };
      pricing_plans: {
        Row: {
          id: string;
          slug: string;
          title: LocalizedJson;
          description: LocalizedJson | null;
          price: number;
          old_price: number | null;
          currency: string;
          period: "month" | "session" | "package" | "custom";
          period_label: LocalizedJson | null;
          sessions_count: number | null;
          badge: LocalizedJson | null;
          featured: boolean;
          cta_label: LocalizedJson | null;
          cta_url: string | null;
          active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: Partial<Database["public"]["Tables"]["pricing_plans"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["pricing_plans"]["Row"]>;
        Relationships: [];
      };
      coaches: {
        Row: {
          id: string;
          name: string;
          photo_url: string | null;
          role: LocalizedJson;
          bio: LocalizedJson | null;
          experience: string | null;
          achievements: LocalizedJson | null;
          instagram_url: string | null;
          cta_url: string | null;
          active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: Partial<Database["public"]["Tables"]["coaches"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["coaches"]["Row"]>;
        Relationships: [];
      };
      schedule_slots: {
        Row: {
          id: string;
          day_of_week: number;
          time_label: string;
          by_arrangement: boolean;
          title: LocalizedJson;
          coach_id: string | null;
          level: LocalizedJson | null;
          audience: "all" | "men" | "women" | "kids";
          age_label: LocalizedJson | null;
          hall: string | null;
          note: LocalizedJson | null;
          active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: Partial<Database["public"]["Tables"]["schedule_slots"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["schedule_slots"]["Row"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author: string;
          body: LocalizedJson;
          avatar_url: string | null;
          active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          title: LocalizedJson;
          spec: LocalizedJson;
          description: LocalizedJson | null;
          price: number;
          old_price: number | null;
          currency: string;
          image_url: string;
          cta_label: LocalizedJson | null;
          cta_url: string | null;
          active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          image_url: string;
          alt: LocalizedJson;
          caption: LocalizedJson | null;
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["gallery_images"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["gallery_images"]["Row"]>;
        Relationships: [];
      };
      advertisements: {
        Row: {
          id: string;
          campaign_name: string;
          sponsor_name: string | null;
          logo_url: string | null;
          desktop_image_url: string;
          mobile_image_url: string | null;
          title: LocalizedJson;
          subtitle: LocalizedJson | null;
          cta_label: LocalizedJson | null;
          target_url: string;
          placement:
            | "after_hero"
            | "after_programs"
            | "after_gallery"
            | "after_pricing"
            | "after_schedule"
            | "before_contacts"
            | "footer";
          label_type: "advertisement" | "partner";
          start_date: string | null;
          end_date: string | null;
          priority: number;
          active: boolean;
        } & Timestamps;
        Insert: Partial<Database["public"]["Tables"]["advertisements"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["advertisements"]["Row"]>;
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: number;
          name: string;
          path: string;
          locale: string | null;
          meta: Json;
          created_at: string;
        };
        Insert: {
          name: string;
          path?: string;
          locale?: string | null;
          meta?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["analytics_events"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
