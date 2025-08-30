import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createClient();

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not authenticated",
        },
        { status: 401 }
      );
    }

    console.log("Creating profile for user:", user.id);

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json({
        success: true,
        message: "Profile already exists",
      });
    }

    // Create the profile
    const { data: profile, error: profileError } = await supabase
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

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to create profile: ${profileError.message}`,
        },
        { status: 500 }
      );
    }

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
      {
        user_id: user.id,
        name: "Follow-up - No Response",
        subject: "Following up on {{company}}",
        content: `Hi {{first_name}},

I wanted to follow up on my previous email about helping {{company}} with {{value_proposition}}.

I understand you're busy, but I believe this could make a significant impact on your {{industry}} operations.

Would you have 10 minutes this week for a quick call?

Best regards,
{{sender_name}}`,
        category: "follow-up",
        is_default: true,
      },
      {
        user_id: user.id,
        name: "Meeting Request",
        subject: "Partnership opportunity for {{company}}",
        content: `Hi {{first_name}},

I hope you're doing well! I've been following {{company}}'s progress and I'm impressed by your recent achievements.

I believe there's a great opportunity for us to collaborate. Would you be interested in a brief call to explore how we might work together?

Looking forward to hearing from you.

Best regards,
{{sender_name}}`,
        category: "meeting",
        is_default: true,
      },
    ];

    const { data: templates, error: templatesError } = await supabase
      .from("email_templates")
      .insert(defaultTemplates);

    if (templatesError) {
      console.error("Templates creation error:", templatesError);
      // Don't fail if templates fail
    }

    return NextResponse.json({
      success: true,
      message: "Profile and templates created successfully",
      data: {
        profile,
      },
    });
  } catch (error: any) {
    console.error("Profile setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Profile setup failed: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
