"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  Download,
  Bell,
  Settings,
  Search,
  Filter,
  TrendingUp,
  Users,
  Target,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import CreateCampaignModal from "@/components/CreateCampaignModal";
import CreateLeadModal from "@/components/CreateLeadModal";
import CSVImportModal from "@/components/CSVImportModal";
import SendCampaignModal from "@/components/SendCampaignModal";
import NotificationCenter, {
  NotificationBell,
} from "@/components/NotificationCenter";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { toast } from "sonner";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  position: string | null;
  status: string;
  source: string | null;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  total_leads: number;
  emails_sent: number;
  created_at: string;
}

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "campaigns" | "leads" | "analytics"
  >("overview");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [showSendCampaign, setShowSendCampaign] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  // Search and filter states
  const [leadSearch, setLeadSearch] = useState("");
  const [campaignSearch, setCampaignSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("all");

  const fetchData = async () => {
    try {
      const [leadsRes, campaignsRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/campaigns"),
      ]);

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData);
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCampaignCreated = (campaign: Campaign) => {
    setCampaigns([campaign, ...campaigns]);
    setShowCreateCampaign(false);
    toast.success("Campaign created successfully!");
  };

  const handleLeadCreated = (lead: Lead) => {
    setLeads([lead, ...leads]);
    setShowCreateLead(false);
    toast.success("Lead added successfully!");
  };

  const handleCSVImportSuccess = (importedLeads: Lead[]) => {
    setLeads([...importedLeads, ...leads]);
    setShowCSVImport(false);
  };

  const handleSendCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowSendCampaign(true);
  };

  const handleCampaignSent = () => {
    setShowSendCampaign(false);
    setSelectedCampaign(null);
    fetchData(); // Refresh data to get updated stats
  };

  // Filter functions
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      leadSearch === "" ||
      lead.first_name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.last_name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (lead.company &&
        lead.company.toLowerCase().includes(leadSearch.toLowerCase()));

    const matchesStatus =
      leadStatusFilter === "all" || lead.status === leadStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaignSearch === "" ||
      campaign.name.toLowerCase().includes(campaignSearch.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(campaignSearch.toLowerCase());

    const matchesStatus =
      campaignStatusFilter === "all" ||
      campaign.status === campaignStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Quick stats for overview
  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    qualifiedLeads: leads.filter((l) => l.status === "qualified").length,
    convertedLeads: leads.filter((l) => l.status === "converted").length,
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.status === "active").length,
    totalEmailsSent: campaigns.reduce(
      (sum, c) => sum + (c.emails_sent || 0),
      0
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AutoReachPro Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your outreach campaigns and track performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell onClick={() => setShowNotifications(true)} />
            <Link
              href="/settings"
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Settings className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              {
                id: "overview",
                name: "Overview",
                icon: <TrendingUp className="h-4 w-4" />,
              },
              {
                id: "campaigns",
                name: "Campaigns",
                icon: <Target className="h-4 w-4" />,
              },
              {
                id: "leads",
                name: "Leads",
                icon: <Users className="h-4 w-4" />,
              },
              {
                id: "analytics",
                name: "Analytics",
                icon: <BarChart className="h-4 w-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Leads"
                value={stats.totalLeads}
                subtitle={`${stats.newLeads} new`}
                color="blue"
              />
              <StatCard
                title="Active Campaigns"
                value={stats.activeCampaigns}
                subtitle={`${stats.totalCampaigns} total`}
                color="green"
              />
              <StatCard
                title="Emails Sent"
                value={stats.totalEmailsSent}
                subtitle="This month"
                color="purple"
              />
              <StatCard
                title="Converted Leads"
                value={stats.convertedLeads}
                subtitle={`${stats.qualifiedLeads} qualified`}
                color="indigo"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowCreateCampaign(true)}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Create Campaign
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setShowCreateLead(true)}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                >
                  <div className="text-center">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Add Lead
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setShowCSVImport(true)}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Import CSV
                    </p>
                  </div>
                </button>
                <Link
                  href="/settings"
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center">
                    <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Settings
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recent Campaigns
                  </h3>
                </div>
                <div className="p-6">
                  {campaigns.slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {campaigns.slice(0, 5).map((campaign) => (
                        <div
                          key={campaign.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {campaign.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {campaign.total_leads} leads •{" "}
                              {campaign.emails_sent} sent
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.status === "active"
                                ? "bg-green-100 text-green-800"
                                : campaign.status === "paused"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No campaigns yet. Create your first campaign!
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recent Leads
                  </h3>
                </div>
                <div className="p-6">
                  {leads.slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {leads.slice(0, 5).map((lead) => (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {lead.first_name} {lead.last_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {lead.email}
                            </p>
                            {lead.company && (
                              <p className="text-xs text-gray-500">
                                {lead.company}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              lead.status === "new"
                                ? "bg-blue-100 text-blue-800"
                                : lead.status === "qualified"
                                ? "bg-green-100 text-green-800"
                                : lead.status === "converted"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No leads yet. Add your first lead!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <CampaignsTab
            campaigns={filteredCampaigns}
            campaignSearch={campaignSearch}
            setCampaignSearch={setCampaignSearch}
            campaignStatusFilter={campaignStatusFilter}
            setCampaignStatusFilter={setCampaignStatusFilter}
            onCreateCampaign={() => setShowCreateCampaign(true)}
            onSendCampaign={handleSendCampaign}
          />
        )}

        {activeTab === "leads" && (
          <LeadsTab
            leads={filteredLeads}
            leadSearch={leadSearch}
            setLeadSearch={setLeadSearch}
            leadStatusFilter={leadStatusFilter}
            setLeadStatusFilter={setLeadStatusFilter}
            onCreateLead={() => setShowCreateLead(true)}
            onImportCSV={() => setShowCSVImport(true)}
          />
        )}

        {activeTab === "analytics" && <AnalyticsDashboard />}
      </div>

      {/* Modals */}
      <CreateCampaignModal
        isOpen={showCreateCampaign}
        onClose={() => setShowCreateCampaign(false)}
        onSuccess={handleCampaignCreated}
        leads={leads}
      />

      <CreateLeadModal
        isOpen={showCreateLead}
        onClose={() => setShowCreateLead(false)}
        onSuccess={handleLeadCreated}
      />

      <CSVImportModal
        isOpen={showCSVImport}
        onClose={() => setShowCSVImport(false)}
        onSuccess={handleCSVImportSuccess}
      />

      {selectedCampaign && (
        <SendCampaignModal
          isOpen={showSendCampaign}
          onClose={() => setShowSendCampaign(false)}
          campaign={selectedCampaign}
          onSuccess={handleCampaignSent}
        />
      )}

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: number;
  subtitle: string;
  color: string;
}) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p
        className={`text-2xl font-bold ${
          colorClasses[color as keyof typeof colorClasses]
        }`}
      >
        {value}
      </p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function CampaignsTab({
  campaigns,
  campaignSearch,
  setCampaignSearch,
  campaignStatusFilter,
  setCampaignStatusFilter,
  onCreateCampaign,
  onSendCampaign,
}: {
  campaigns: Campaign[];
  campaignSearch: string;
  setCampaignSearch: (value: string) => void;
  campaignStatusFilter: string;
  setCampaignStatusFilter: (value: string) => void;
  onCreateCampaign: () => void;
  onSendCampaign: (campaign: Campaign) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
        <button
          onClick={onCreateCampaign}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={campaignSearch}
            onChange={(e) => setCampaignSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <select
          value={campaignStatusFilter}
          onChange={(e) => setCampaignStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {campaign.subject}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        campaign.status === "active"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "paused"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.total_leads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.emails_sent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onSendCampaign(campaign)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Send
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No campaigns found. Create your first campaign to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadsTab({
  leads,
  leadSearch,
  setLeadSearch,
  leadStatusFilter,
  setLeadStatusFilter,
  onCreateLead,
  onImportCSV,
}: {
  leads: Lead[];
  leadSearch: string;
  setLeadSearch: (value: string) => void;
  leadStatusFilter: string;
  setLeadStatusFilter: (value: string) => void;
  onCreateLead: () => void;
  onImportCSV: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={onImportCSV}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </button>
          <button
            onClick={onCreateLead}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={leadSearch}
            onChange={(e) => setLeadSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <select
          value={leadStatusFilter}
          onChange={(e) => setLeadStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {lead.company || "-"}
                    </div>
                    {lead.position && (
                      <div className="text-sm text-gray-500">
                        {lead.position}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : lead.status === "contacted"
                          ? "bg-yellow-100 text-yellow-800"
                          : lead.status === "qualified"
                          ? "bg-green-100 text-green-800"
                          : lead.status === "converted"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.source || "Manual"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No leads found. Add your first lead to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
