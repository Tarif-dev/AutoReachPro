import { NextResponse } from "next/server";
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

    // Get total counts
    const [
      { count: totalCampaigns },
      { count: totalLeads },
      { data: campaigns },
      { data: leads },
    ] = await Promise.all([
      supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase.from("campaigns").select("*").eq("user_id", user.id),
      supabase.from("leads").select("status").eq("user_id", user.id),
    ]);

    // Calculate email statistics
    const totalEmailsSent =
      campaigns?.reduce(
        (sum, campaign) => sum + (campaign.emails_sent || 0),
        0
      ) || 0;
    const totalEmailsOpened =
      campaigns?.reduce(
        (sum, campaign) => sum + (campaign.emails_opened || 0),
        0
      ) || 0;
    const totalEmailsReplied =
      campaigns?.reduce(
        (sum, campaign) => sum + (campaign.emails_replied || 0),
        0
      ) || 0;

    const openRate =
      totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent) * 100 : 0;
    const replyRate =
      totalEmailsSent > 0 ? (totalEmailsReplied / totalEmailsSent) * 100 : 0;

    // Group leads by status
    const leadsByStatus =
      leads?.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

    // Campaign performance data
    const campaignPerformance =
      campaigns?.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        emails_sent: campaign.emails_sent || 0,
        emails_opened: campaign.emails_opened || 0,
        emails_replied: campaign.emails_replied || 0,
        conversion_rate: campaign.conversion_rate || 0,
        created_at: campaign.created_at,
      })) || [];

    // Recent activity (simplified)
    const recentActivity =
      campaigns?.slice(0, 5).map((campaign) => ({
        id: campaign.id,
        type: "campaign",
        description: `Campaign "${campaign.name}" ${campaign.status}`,
        timestamp: campaign.updated_at || campaign.created_at,
      })) || [];

    const analytics = {
      totalCampaigns: totalCampaigns || 0,
      totalLeads: totalLeads || 0,
      totalEmailsSent,
      totalEmailsOpened,
      totalEmailsReplied,
      openRate,
      replyRate,
      campaignPerformance,
      leadsByStatus,
      recentActivity,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
