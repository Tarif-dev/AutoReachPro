"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Play,
  Pause,
  BarChart3,
  Mail,
  Users,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import SendCampaignModal from "@/components/SendCampaignModal";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  total_leads: number;
  emails_sent: number;
  emails_opened: number;
  emails_replied: number;
  conversion_rate: number;
}

interface CampaignsContentProps {
  campaigns: Campaign[];
}

export default function CampaignsContent({ campaigns }: CampaignsContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sendModal, setSendModal] = useState<{
    isOpen: boolean;
    campaign: Campaign | null;
  }>({
    isOpen: false,
    campaign: null,
  });

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendCampaign = (campaign: Campaign) => {
    setSendModal({ isOpen: true, campaign });
  };

  const handleSendSuccess = (results: any) => {
    console.log("Campaign sent successfully:", results);
    // Refresh campaigns or update the UI
    window.location.reload(); // Simple refresh for now
  };

  const handleCloseSendModal = () => {
    setSendModal({ isOpen: false, campaign: null });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />;
      case "paused":
        return <Pause className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600">
              Manage your email outreach campaigns and track performance.
            </p>
          </div>
          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Campaigns list */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {campaigns.length === 0
              ? "No campaigns yet"
              : "No campaigns match your search"}
          </h3>
          <p className="text-gray-600 mb-6">
            {campaigns.length === 0
              ? "Create your first campaign to start reaching out to leads."
              : "Try adjusting your search terms or filters."}
          </p>
          {campaigns.length === 0 && (
            <Link
              href="/dashboard/campaigns/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
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
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.name}
                        </div>
                        {campaign.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {campaign.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1 capitalize">
                          {campaign.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {campaign.total_leads}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-gray-600">
                            {campaign.emails_sent} sent
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-gray-600">
                            {campaign.conversion_rate}% rate
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(campaign.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/campaigns/${campaign.id}`}
                          className="text-blue-600 hover:text-blue-500 p-1 hover:bg-blue-50 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {campaign.status !== "sent" &&
                          campaign.status !== "sending" && (
                            <button
                              onClick={() => handleSendCampaign(campaign)}
                              className="text-green-600 hover:text-green-500 p-1 hover:bg-green-50 rounded"
                              title="Send Campaign"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                        <Link
                          href={`/dashboard/campaigns/${campaign.id}/edit`}
                          className="text-gray-600 hover:text-gray-500 p-1 hover:bg-gray-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-50 rounded">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaign stats summary */}
      {campaigns.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Total Campaigns
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Total Emails Sent
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.reduce((sum, c) => sum + c.emails_sent, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Avg Response Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.length > 0
                    ? (
                        campaigns.reduce(
                          (sum, c) => sum + c.conversion_rate,
                          0
                        ) / campaigns.length
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Active Campaigns
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Campaign Modal */}
      {sendModal.campaign && (
        <SendCampaignModal
          campaign={sendModal.campaign}
          isOpen={sendModal.isOpen}
          onClose={handleCloseSendModal}
          onSuccess={handleSendSuccess}
        />
      )}
    </div>
  );
}
