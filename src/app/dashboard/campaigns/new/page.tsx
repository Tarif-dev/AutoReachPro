import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateCampaign from "@/components/CreateCampaign";

export default async function NewCampaignPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch leads for the campaign builder
  const { data: leads } = await supabase
    .from("leads")
    .select(
      "id, email, first_name, last_name, company, position, industry, status"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <CreateCampaign leads={leads || []} />;
}
