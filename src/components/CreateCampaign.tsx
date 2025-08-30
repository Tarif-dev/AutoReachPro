"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Eye, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Campaign {
  name: string;
  description: string;
  template_subject: string;
  template_content: string;
  personalization_enabled: boolean;
  schedule_type: string;
  selectedLeadIds: string[];
}

interface Lead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  position?: string;
  industry?: string;
  status: string;
}

interface CreateCampaignProps {
  leads: Lead[];
}

export default function CreateCampaign({ leads }: CreateCampaignProps) {
  const [campaign, setCampaign] = useState<Campaign>({
    name: "",
    description: "",
    template_subject: "Quick question about {{company}}",
    template_content: `Hi {{first_name}},

I hope this email finds you well. I came across {{company}} and was impressed by your work in the {{industry}} space.

I wanted to reach out because {{personalized_reason}}.

{{value_proposition}}

Would you be open to a brief 15-minute conversation this week to discuss how this could benefit {{company}}?

Best regards,
{{sender_name}}`,
    personalization_enabled: true,
    schedule_type: "immediate",
    selectedLeadIds: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "details" | "content" | "leads" | "preview"
  >("details");
  const [previewLead, setPreviewLead] = useState<Lead | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleSave = async (isDraft = true) => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create campaign
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .insert({
          user_id: user.id,
          name: campaign.name,
          description: campaign.description,
          template_subject: campaign.template_subject,
          template_content: campaign.template_content,
          personalization_enabled: campaign.personalization_enabled,
          schedule_type: campaign.schedule_type,
          status: isDraft ? "draft" : "active",
          total_leads: campaign.selectedLeadIds.length,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Add selected leads to campaign
      if (campaign.selectedLeadIds.length > 0) {
        const campaignLeads = campaign.selectedLeadIds.map((leadId) => ({
          campaign_id: campaignData.id,
          lead_id: leadId,
          status: "pending",
        }));

        const { error: leadsError } = await supabase
          .from("campaign_leads")
          .insert(campaignLeads);

        if (leadsError) throw leadsError;
      }

      router.push(
        `/dashboard/campaigns?success=${isDraft ? "saved" : "launched"}`
      );
    } catch (err: any) {
      console.error("Error saving campaign:", err);
      setError(err.message || "Failed to save campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLead = (leadId: string) => {
    setCampaign((prev) => ({
      ...prev,
      selectedLeadIds: prev.selectedLeadIds.includes(leadId)
        ? prev.selectedLeadIds.filter((id) => id !== leadId)
        : [...prev.selectedLeadIds, leadId],
    }));
  };

  const selectAllLeads = () => {
    setCampaign((prev) => ({
      ...prev,
      selectedLeadIds: leads.map((lead) => lead.id),
    }));
  };

  const clearSelection = () => {
    setCampaign((prev) => ({
      ...prev,
      selectedLeadIds: [],
    }));
  };

  const generatePreview = (lead: Lead) => {
    let subject = campaign.template_subject;
    let content = campaign.template_content;

    // Replace placeholders
    const replacements = {
      "{{first_name}}": lead.first_name,
      "{{last_name}}": lead.last_name,
      "{{company}}": lead.company || "your company",
      "{{position}}": lead.position || "your role",
      "{{industry}}": lead.industry || "your industry",
      "{{sender_name}}": "AutoReachPro Team",
      "{{personalized_reason}}": `I noticed your role as ${
        lead.position || "a professional"
      } at ${lead.company || "your company"}`,
      "{{value_proposition}}":
        "our AI-powered outreach automation platform has helped similar companies increase response rates by 300%",
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      subject = subject.replace(new RegExp(placeholder, "g"), value);
      content = content.replace(new RegExp(placeholder, "g"), value);
    });

    return { subject, content };
  };

  const tabs = [
    { id: "details", label: "Campaign Details" },
    { id: "content", label: "Email Content" },
    { id: "leads", label: `Select Leads (${campaign.selectedLeadIds.length})` },
    { id: "preview", label: "Preview" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard/campaigns"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Create New Campaign
                  </h1>
                  <p className="text-sm text-gray-600">
                    Design and launch your email outreach campaign
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSave(true)}
                  disabled={isLoading || !campaign.name.trim()}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={
                    isLoading ||
                    !campaign.name.trim() ||
                    campaign.selectedLeadIds.length === 0
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Launch Campaign</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={campaign.name}
                    onChange={(e) =>
                      setCampaign((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Q4 SaaS Outreach Campaign"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={campaign.description}
                    onChange={(e) =>
                      setCampaign((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your campaign goals..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Type
                    </label>
                    <select
                      value={campaign.schedule_type}
                      onChange={(e) =>
                        setCampaign((prev) => ({
                          ...prev,
                          schedule_type: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="immediate">Send Immediately</option>
                      <option value="scheduled">Schedule for Later</option>
                      <option value="drip">Drip Campaign</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="personalization"
                      checked={campaign.personalization_enabled}
                      onChange={(e) =>
                        setCampaign((prev) => ({
                          ...prev,
                          personalization_enabled: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="personalization"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      <span className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-1 text-blue-500" />
                        Enable AI Personalization
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={campaign.template_subject}
                    onChange={(e) =>
                      setCampaign((prev) => ({
                        ...prev,
                        template_subject: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your email subject..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use placeholders like {`{{first_name}}`}, {`{{company}}`},{" "}
                    {`{{industry}}`}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Content
                  </label>
                  <textarea
                    value={campaign.template_content}
                    onChange={(e) =>
                      setCampaign((prev) => ({
                        ...prev,
                        template_content: e.target.value,
                      }))
                    }
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Your email content..."
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    <p className="mb-1">Available placeholders:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "first_name",
                        "last_name",
                        "company",
                        "position",
                        "industry",
                        "sender_name",
                      ].map((placeholder) => (
                        <span
                          key={placeholder}
                          className="bg-gray-100 px-2 py-1 rounded text-xs font-mono"
                        >
                          {`{{${placeholder}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "leads" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Select Recipients
                    </h3>
                    <p className="text-sm text-gray-600">
                      Choose which leads to include in this campaign
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={selectAllLeads}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg divide-y">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={campaign.selectedLeadIds.includes(lead.id)}
                        onChange={() => toggleLead(lead.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {lead.first_name} {lead.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {lead.email}
                            </p>
                          </div>
                          <div className="text-right">
                            {lead.company && (
                              <p className="text-sm text-gray-600">
                                {lead.company}
                              </p>
                            )}
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                lead.status === "new"
                                  ? "bg-gray-100 text-gray-800"
                                  : lead.status === "contacted"
                                  ? "bg-blue-100 text-blue-800"
                                  : lead.status === "replied"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {lead.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "preview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Email Preview
                    </h3>
                    <p className="text-sm text-gray-600">
                      See how your email will look with real lead data
                    </p>
                  </div>
                  <select
                    value={previewLead?.id || ""}
                    onChange={(e) => {
                      const lead = leads.find((l) => l.id === e.target.value);
                      setPreviewLead(lead || null);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a lead to preview...</option>
                    {campaign.selectedLeadIds.map((leadId) => {
                      const lead = leads.find((l) => l.id === leadId);
                      return lead ? (
                        <option key={lead.id} value={lead.id}>
                          {lead.first_name} {lead.last_name} ({lead.company})
                        </option>
                      ) : null;
                    })}
                  </select>
                </div>

                {previewLead && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    {(() => {
                      const preview = generatePreview(previewLead);
                      return (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subject Line
                            </label>
                            <div className="p-3 bg-gray-50 rounded border">
                              {preview.subject}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Content
                            </label>
                            <div className="p-4 bg-gray-50 rounded border whitespace-pre-wrap">
                              {preview.content}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
