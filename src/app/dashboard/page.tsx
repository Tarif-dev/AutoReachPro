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

  // Fetch user profile - create if doesn't exist
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If no profile exists, create one
  if (!profile) {
    console.log("Creating missing profile for user:", user.id);

    const { data: newProfile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email!,
        full_name:
          user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        subscription_tier: "starter",
        subscription_status: "active",
        credits_remaining: 500,
        monthly_send_limit: 500,
      })
      .select()
      .single();

    if (!profileError) {
      profile = newProfile;

      // Create default email templates
      const defaultTemplates = [
        {
          user_id: user.id,
          name: "Cold Outreach - General",
          subject: "Quick question about {{company}}",
          content: `Hi {{first_name}},

I hope this email finds you well. I came across {{company}} and was impressed by your work in the {{industry}} space.

I wanted to reach out because {{personalized_reason}}.

{{value_proposition}}

Would you be open to a brief 15-minute conversation this week to discuss how this could benefit {{company}}?

Best regards,
{{sender_name}}`,
          category: "outreach",
          is_default: true,
        },
      ];

      await supabase.from("email_templates").insert(defaultTemplates);
    }
  }

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
