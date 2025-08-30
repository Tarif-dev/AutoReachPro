import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user stats
  const { data: leads, count: leadsCount } = await supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("user_id", user.id);

  const { data: campaigns, count: campaignsCount } = await supabase
    .from("campaigns")
    .select("*", { count: "exact" })
    .eq("user_id", user.id);

  // Calculate stats
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
  const averageResponseRate =
    totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent) * 100 : 0;

  const stats = {
    totalLeads: leadsCount || 0,
    activeLeads:
      leads?.filter(
        (lead) => lead.status === "new" || lead.status === "contacted"
      ).length || 0,
    emailsSent: totalEmailsSent,
    responseRate: averageResponseRate,
    activeCampaigns:
      campaigns?.filter((campaign) => campaign.status === "active").length || 0,
  };

  // Get recent campaigns (limit 3)
  const recentCampaigns = campaigns?.slice(0, 3) || [];

  // Get recent leads (limit 3)
  const recentLeads = leads?.slice(0, 3) || [];

  return (
    <DashboardContent
      user={user}
      profile={profile}
      stats={stats}
      recentCampaigns={recentCampaigns}
      recentLeads={recentLeads}
    />
  );
}
