import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    // Check if the function exists by trying to call it directly
    // (This will fail but tell us if the function exists)
    const { data: funcData, error: funcError } = await supabase.rpc(
      "handle_new_user"
    );

    // Check if triggers exist in pg_trigger table (need admin access)
    const { data: triggers, error: triggerError } = await supabase
      .from("information_schema.triggers")
      .select("*")
      .eq("trigger_name", "on_auth_user_created");

    // Alternative: check if the function exists in pg_proc
    const { data: functions, error: procError } = await supabase
      .from("pg_proc")
      .select("proname")
      .eq("proname", "handle_new_user");

    return NextResponse.json({
      status: "debug",
      message: "Checking trigger and function status",
      data: {
        functionCallError: funcError?.message || "No error calling function",
        triggerQuery: triggers,
        triggerQueryError: triggerError?.message,
        functionExists: functions,
        functionQueryError: procError?.message,
        suggestion:
          "If function doesn't exist, the SQL schema wasn't fully deployed",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Error checking trigger status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
