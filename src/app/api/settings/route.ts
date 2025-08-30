import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: settings, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // Not found error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      openai_api_key,
      email_signature,
      timezone,
      daily_email_limit,
      auto_follow_up,
      slack_webhook,
    } = body;

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", user.id)
      .single();

    let result;
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("user_settings")
        .update({
          openai_api_key,
          email_signature,
          timezone,
          daily_email_limit,
          auto_follow_up,
          slack_webhook,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      result = { data, error };
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("user_settings")
        .insert({
          user_id: user.id,
          openai_api_key,
          email_signature,
          timezone,
          daily_email_limit,
          auto_follow_up,
          slack_webhook,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
