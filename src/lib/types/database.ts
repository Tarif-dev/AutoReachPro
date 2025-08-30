export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: "starter" | "professional" | "enterprise";
          subscription_status: "active" | "cancelled" | "past_due";
          credits_remaining: number;
          monthly_send_limit: number;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: "starter" | "professional" | "enterprise";
          subscription_status?: "active" | "cancelled" | "past_due";
          credits_remaining?: number;
          monthly_send_limit?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: "starter" | "professional" | "enterprise";
          subscription_status?: "active" | "cancelled" | "past_due";
          credits_remaining?: number;
          monthly_send_limit?: number;
        };
      };
      leads: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          email: string;
          first_name: string;
          last_name: string;
          company: string | null;
          position: string | null;
          industry: string | null;
          website: string | null;
          phone: string | null;
          linkedin_url: string | null;
          status: "new" | "contacted" | "replied" | "qualified" | "converted";
          tags: string[];
          notes: string | null;
          source: string | null;
          last_contact_date: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          email: string;
          first_name: string;
          last_name: string;
          company?: string | null;
          position?: string | null;
          industry?: string | null;
          website?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          status?: "new" | "contacted" | "replied" | "qualified" | "converted";
          tags?: string[];
          notes?: string | null;
          source?: string | null;
          last_contact_date?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          company?: string | null;
          position?: string | null;
          industry?: string | null;
          website?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          status?: "new" | "contacted" | "replied" | "qualified" | "converted";
          tags?: string[];
          notes?: string | null;
          source?: string | null;
          last_contact_date?: string | null;
        };
      };
      campaigns: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          name: string;
          description: string | null;
          status: "draft" | "active" | "paused" | "completed";
          template_subject: string;
          template_content: string;
          personalization_enabled: boolean;
          schedule_type: "immediate" | "scheduled" | "drip";
          schedule_data: any | null;
          total_leads: number;
          emails_sent: number;
          emails_opened: number;
          emails_replied: number;
          conversion_rate: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          name: string;
          description?: string | null;
          status?: "draft" | "active" | "paused" | "completed";
          template_subject: string;
          template_content: string;
          personalization_enabled?: boolean;
          schedule_type?: "immediate" | "scheduled" | "drip";
          schedule_data?: any | null;
          total_leads?: number;
          emails_sent?: number;
          emails_opened?: number;
          emails_replied?: number;
          conversion_rate?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          status?: "draft" | "active" | "paused" | "completed";
          template_subject?: string;
          template_content?: string;
          personalization_enabled?: boolean;
          schedule_type?: "immediate" | "scheduled" | "drip";
          schedule_data?: any | null;
          total_leads?: number;
          emails_sent?: number;
          emails_opened?: number;
          emails_replied?: number;
          conversion_rate?: number;
        };
      };
      campaign_leads: {
        Row: {
          id: string;
          created_at: string;
          campaign_id: string;
          lead_id: string;
          status:
            | "pending"
            | "sent"
            | "opened"
            | "replied"
            | "bounced"
            | "failed";
          sent_at: string | null;
          opened_at: string | null;
          replied_at: string | null;
          personalized_subject: string | null;
          personalized_content: string | null;
          tracking_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          campaign_id: string;
          lead_id: string;
          status?:
            | "pending"
            | "sent"
            | "opened"
            | "replied"
            | "bounced"
            | "failed";
          sent_at?: string | null;
          opened_at?: string | null;
          replied_at?: string | null;
          personalized_subject?: string | null;
          personalized_content?: string | null;
          tracking_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          campaign_id?: string;
          lead_id?: string;
          status?:
            | "pending"
            | "sent"
            | "opened"
            | "replied"
            | "bounced"
            | "failed";
          sent_at?: string | null;
          opened_at?: string | null;
          replied_at?: string | null;
          personalized_subject?: string | null;
          personalized_content?: string | null;
          tracking_id?: string | null;
        };
      };
      email_templates: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          name: string;
          subject: string;
          content: string;
          category: string | null;
          is_default: boolean;
          usage_count: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          name: string;
          subject: string;
          content: string;
          category?: string | null;
          is_default?: boolean;
          usage_count?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          name?: string;
          subject?: string;
          content?: string;
          category?: string | null;
          is_default?: boolean;
          usage_count?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CampaignLead =
  Database["public"]["Tables"]["campaign_leads"]["Row"];
export type EmailTemplate =
  Database["public"]["Tables"]["email_templates"]["Row"];
