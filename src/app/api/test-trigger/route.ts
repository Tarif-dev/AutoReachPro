import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    // Test if the trigger function exists
    const { data: functions, error: funcError } = await supabase.rpc(
      "handle_new_user"
    );

    if (funcError) {
      console.log("Function test error:", funcError);
    }

    // Test if we can query the profiles table
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .limit(5);

    if (profileError) {
      return NextResponse.json({
        status: "error",
        message: "Cannot query profiles table",
        error: profileError.message,
      });
    }

    // Test if we can query email_templates table
    const { data: templates, error: templateError } = await supabase
      .from("email_templates")
      .select("*")
      .limit(5);

    if (templateError) {
      return NextResponse.json({
        status: "error",
        message: "Cannot query email_templates table",
        error: templateError.message,
      });
    }

    // Check if trigger exists by looking at pg_trigger
    const { data: triggers, error: triggerError } = await supabase
      .from("pg_trigger")
      .select("tgname")
      .eq("tgname", "on_auth_user_created")
      .limit(1);

    return NextResponse.json({
      status: "success",
      message: "Database tables are accessible",
      data: {
        profileCount: profiles?.length || 0,
        templateCount: templates?.length || 0,
        triggerExists: triggers && triggers.length > 0,
        sampleProfile: profiles?.[0] || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unexpected error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
