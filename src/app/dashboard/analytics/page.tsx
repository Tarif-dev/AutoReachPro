import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AnalyticsContent from "./AnalyticsContent";

export default async function AnalyticsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch analytics data
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id);

  const { data: leads } = await supabase
    .from("leads")
    .select("status, created_at, last_contact_date")
    .eq("user_id", user.id);

  const { data: campaignLeads } = await supabase
    .from("campaign_leads")
    .select(
      `
      status,
      sent_at,
      opened_at,
      replied_at,
      campaign:campaigns(name, created_at)
    `
    )
    .not("campaign", "is", null);

  // Calculate analytics metrics
  const totalEmailsSent =
    campaigns?.reduce((sum, c) => sum + c.emails_sent, 0) || 0;
  const totalEmailsOpened =
    campaigns?.reduce((sum, c) => sum + c.emails_opened, 0) || 0;
  const totalEmailsReplied =
    campaigns?.reduce((sum, c) => sum + c.emails_replied, 0) || 0;

  const openRate =
    totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent) * 100 : 0;
  const replyRate =
    totalEmailsSent > 0 ? (totalEmailsReplied / totalEmailsSent) * 100 : 0;

  const analytics = {
    totalCampaigns: campaigns?.length || 0,
    totalLeads: leads?.length || 0,
    totalEmailsSent,
    totalEmailsOpened,
    totalEmailsReplied,
    openRate,
    replyRate,
    campaignPerformance: campaigns || [],
    leadsByStatus:
      leads?.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
    recentActivity: campaignLeads || [],
  };

  return <AnalyticsContent analytics={analytics} />;
}
