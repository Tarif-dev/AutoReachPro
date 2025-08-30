import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select(
        `
        *,
        campaign_leads (
          id,
          lead:leads (
            id,
            first_name,
            last_name,
            email,
            status
          )
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(campaigns || []);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      subject,
      content,
      template_id,
      selected_leads,
      use_ai_personalization = false,
      send_time,
      timezone = "UTC",
    } = body;

    // Create campaign
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .insert({
        user_id: user.id,
        name,
        subject,
        content,
        template_id,
        use_ai_personalization,
        send_time,
        timezone,
        status: send_time ? "scheduled" : "draft",
        total_leads: selected_leads?.length || 0,
        emails_sent: 0,
        emails_opened: 0,
        emails_replied: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (campaignError) {
      return NextResponse.json(
        { error: campaignError.message },
        { status: 500 }
      );
    }

    // Add leads to campaign
    if (selected_leads && selected_leads.length > 0) {
      const campaignLeads = selected_leads.map((leadId: string) => ({
        campaign_id: campaign.id,
        lead_id: leadId,
        status: "pending",
        created_at: new Date().toISOString(),
      }));

      const { error: leadsError } = await supabase
        .from("campaign_leads")
        .insert(campaignLeads);

      if (leadsError) {
        console.error("Error adding leads to campaign:", leadsError);
        // Don't fail the whole request, just log the error
      }
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
