import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEmailService } from "@/lib/email/service";
import { personalizeEmail } from "@/lib/ai/personalization";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select(
        `
        *,
        campaign_leads (
          id,
          lead:leads (
            id,
            first_name,
            last_name,
            email,
            company,
            position,
            notes
          )
        )
      `
      )
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    if (campaign.status === "sent" || campaign.status === "sending") {
      return NextResponse.json(
        { error: "Campaign already sent or in progress" },
        { status: 400 }
      );
    }

    // Update campaign status to sending
    await supabase
      .from("campaigns")
      .update({
        status: "sending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    // Get user settings for API keys
    const { data: settings } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Prepare leads data
    const leads = campaign.campaign_leads.map((cl: any) => cl.lead);

    // Initialize email service
    const emailService = getEmailService(settings?.resend_api_key);

    let personalizedContent: Record<string, string> = {};

    // Generate AI personalization if enabled
    if (campaign.use_ai_personalization && settings?.openai_api_key) {
      try {
        const personalizationPromises = leads.map(async (lead: any) => {
          const personalizedEmail = await personalizeEmail(
            campaign.content,
            lead,
            settings.openai_api_key
          );
          return { leadId: lead.id, content: personalizedEmail };
        });

        const personalizationResults = await Promise.all(
          personalizationPromises
        );
        personalizedContent = personalizationResults.reduce(
          (acc, result) => ({
            ...acc,
            [result.leadId]: result.content,
          }),
          {}
        );
      } catch (error) {
        console.error("AI personalization error:", error);
        // Continue without personalization
      }
    }

    // Send emails
    const emailResults = await emailService.sendCampaignEmails(
      leads,
      {
        subject: campaign.subject,
        content: campaign.content,
      },
      personalizedContent
    );

    // Count successful sends
    const successfulSends = emailResults.filter(
      (result) => result.success
    ).length;
    const failedSends = emailResults.length - successfulSends;

    // Update campaign statistics
    await supabase
      .from("campaigns")
      .update({
        status: "sent",
        emails_sent: successfulSends,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    // Update campaign_leads status
    const leadsUpdatePromises = emailResults.map((result) =>
      supabase
        .from("campaign_leads")
        .update({
          status: result.success ? "sent" : "failed",
          sent_at: result.success ? new Date().toISOString() : null,
          error_message: result.error || null,
          message_id: result.messageId || null,
          updated_at: new Date().toISOString(),
        })
        .eq("campaign_id", params.id)
        .eq("lead_id", result.leadId)
    );

    await Promise.all(leadsUpdatePromises);

    // Send notification to Slack if configured
    if (settings?.slack_webhook) {
      try {
        await fetch(settings.slack_webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🚀 Campaign "${campaign.name}" completed!\n✅ Sent: ${successfulSends}\n❌ Failed: ${failedSends}`,
          }),
        });
      } catch (error) {
        console.error("Slack notification error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      results: {
        total: emailResults.length,
        sent: successfulSends,
        failed: failedSends,
        details: emailResults,
      },
    });
  } catch (error) {
    console.error("Error sending campaign:", error);

    // Update campaign status to failed
    const supabase = createClient();
    await supabase
      .from("campaigns")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    );
  }
}
