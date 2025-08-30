import { createClient } from "@/lib/supabase/server";

export async function createUserProfile(
  userId: string,
  email: string,
  fullName?: string
) {
  const supabase = createClient();

  try {
    // First, create the profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email: email,
        full_name: fullName || email.split("@")[0],
        subscription_tier: "starter",
        subscription_status: "active",
        credits_remaining: 500,
        monthly_send_limit: 500,
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return { success: false, error: profileError };
    }

    // Then, create default email templates
    const defaultTemplates = [
      {
        user_id: userId,
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
        user_id: userId,
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
        user_id: userId,
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
      .insert(defaultTemplates)
      .select();

    if (templatesError) {
      console.error("Templates creation error:", templatesError);
      // Don't fail the whole process if templates fail
    }

    return {
      success: true,
      profile,
      templates: templates?.length || 0,
    };
  } catch (error: any) {
    console.error("Manual profile creation failed:", error);
    return { success: false, error: error.message };
  }
}
