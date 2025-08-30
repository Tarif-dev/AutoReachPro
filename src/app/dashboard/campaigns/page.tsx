import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CampaignsContent from "./CampaignsContent";

export default async function CampaignsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch campaigns
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select(
      `
      id,
      name,
      description,
      status,
      created_at,
      total_leads,
      emails_sent,
      emails_opened,
      emails_replied,
      conversion_rate
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <CampaignsContent campaigns={campaigns || []} />;
}
