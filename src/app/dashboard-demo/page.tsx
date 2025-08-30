import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EnhancedDashboard from "@/components/EnhancedDashboard";

export default async function DashboardDemoPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <EnhancedDashboard />;
}
