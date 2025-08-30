import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LeadsContent from "./LeadsContent";

export default async function LeadsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's leads
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
  }

  return <LeadsContent leads={leads || []} />;
}
