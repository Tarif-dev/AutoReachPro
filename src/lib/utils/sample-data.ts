// Sample data creation utility for development/testing
import { createClient } from "@/lib/supabase/client";

export async function createSampleLeads(userId: string) {
  const supabase = createClient();

  const sampleLeads = [
    {
      user_id: userId,
      email: "sarah.johnson@techstartup.com",
      first_name: "Sarah",
      last_name: "Johnson",
      company: "TechStartup Inc.",
      position: "VP of Sales",
      industry: "Technology",
      website: "https://techstartup.com",
      linkedin_url: "https://linkedin.com/in/sarahjohnson",
      status: "replied",
      source: "LinkedIn",
      notes: "Interested in AI automation tools. Follow up in 2 weeks.",
    },
    {
      user_id: userId,
      email: "mike.chen@innovate.co",
      first_name: "Mike",
      last_name: "Chen",
      company: "Innovate Co.",
      position: "CEO",
      industry: "Software",
      website: "https://innovate.co",
      linkedin_url: "https://linkedin.com/in/mikechen",
      status: "contacted",
      source: "Cold Email",
      notes: "Sent initial outreach, waiting for response.",
    },
    {
      user_id: userId,
      email: "emily.davis@growthcorp.com",
      first_name: "Emily",
      last_name: "Davis",
      company: "Growth Corp",
      position: "Marketing Director",
      industry: "Marketing",
      website: "https://growthcorp.com",
      status: "new",
      source: "Website Form",
      notes: "Downloaded our whitepaper on outreach automation.",
    },
    {
      user_id: userId,
      email: "john.smith@enterprise.com",
      first_name: "John",
      last_name: "Smith",
      company: "Enterprise Solutions",
      position: "CTO",
      industry: "Technology",
      website: "https://enterprise.com",
      phone: "+1-555-0123",
      status: "qualified",
      source: "Referral",
      notes: "High-value prospect, interested in enterprise plan.",
    },
    {
      user_id: userId,
      email: "lisa.wong@startup.io",
      first_name: "Lisa",
      last_name: "Wong",
      company: "Startup.io",
      position: "Founder",
      industry: "SaaS",
      website: "https://startup.io",
      linkedin_url: "https://linkedin.com/in/lisawong",
      status: "converted",
      source: "Conference",
      notes: "Signed up for Professional plan after demo.",
    },
  ];

  const { data, error } = await supabase.from("leads").insert(sampleLeads);

  if (error) {
    console.error("Error creating sample leads:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function createSampleCampaign(userId: string) {
  const supabase = createClient();

  const sampleCampaign = {
    user_id: userId,
    name: "Q4 SaaS Outreach Campaign",
    description: "Targeting SaaS companies for our AI automation platform",
    status: "active",
    template_subject: "Streamline your {{industry}} operations with AI",
    template_content: `Hi {{first_name}},

I noticed {{company}} is doing great work in the {{industry}} space.

Our AI automation platform has helped similar companies reduce manual work by 60% and increase efficiency significantly.

{{personalized_reason}}

Would you be interested in a quick 15-minute demo to see how this could benefit {{company}}?

Best regards,
AutoReachPro Team`,
    personalization_enabled: true,
    schedule_type: "drip",
    total_leads: 150,
    emails_sent: 127,
    emails_opened: 68,
    emails_replied: 19,
    conversion_rate: 12.6,
  };

  const { data, error } = await supabase
    .from("campaigns")
    .insert([sampleCampaign]);

  if (error) {
    console.error("Error creating sample campaign:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function createFullSampleData(userId: string) {
  console.log("Creating sample data for user:", userId);

  const leadsResult = await createSampleLeads(userId);
  if (!leadsResult.success) {
    return leadsResult;
  }

  const campaignResult = await createSampleCampaign(userId);
  if (!campaignResult.success) {
    return campaignResult;
  }

  return {
    success: true,
    message: "Sample data created successfully!",
  };
}
