import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TemplatesContent from "./TemplatesContent";

export default async function TemplatesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch email templates
  const { data: templates } = await supabase
    .from("email_templates")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <TemplatesContent templates={templates || []} />;
}
