"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  Mail,
  Target,
  Calendar,
  Eye,
  Reply,
} from "lucide-react";

interface Analytics {
  totalCampaigns: number;
  totalLeads: number;
  totalEmailsSent: number;
  totalEmailsOpened: number;
  totalEmailsReplied: number;
  openRate: number;
  replyRate: number;
  campaignPerformance: any[];
  leadsByStatus: Record<string, number>;
  recentActivity: any[];
}

interface AnalyticsContentProps {
  analytics: Analytics;
}

export default function AnalyticsContent({ analytics }: AnalyticsContentProps) {
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatNumber = (value: number) => value.toLocaleString();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">
          Track your outreach performance and optimize your campaigns.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Campaigns
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics.totalCampaigns)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics.totalLeads)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emails Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics.totalEmailsSent)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reply Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analytics.replyRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Email Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Email Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  Emails Sent
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {formatNumber(analytics.totalEmailsSent)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  Emails Opened
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {formatNumber(analytics.totalEmailsOpened)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({formatPercentage(analytics.openRate)})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Reply className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  Emails Replied
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {formatNumber(analytics.totalEmailsReplied)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({formatPercentage(analytics.replyRate)})
                </span>
              </div>
            </div>

            {/* Progress bars */}
            <div className="space-y-3 pt-4">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Open Rate</span>
                  <span>{formatPercentage(analytics.openRate)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(analytics.openRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Reply Rate</span>
                  <span>{formatPercentage(analytics.replyRate)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(analytics.replyRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Status Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Lead Status Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.leadsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      status === "new"
                        ? "bg-gray-400"
                        : status === "contacted"
                        ? "bg-blue-400"
                        : status === "replied"
                        ? "bg-green-400"
                        : status === "qualified"
                        ? "bg-purple-400"
                        : status === "converted"
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {status}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatNumber(count)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      {analytics.campaignPerformance.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Campaign Performance
            </h3>
          </div>
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
                    Emails Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reply Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.campaignPerformance.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          campaign.status === "active"
                            ? "bg-green-100 text-green-800"
                            : campaign.status === "paused"
                            ? "bg-yellow-100 text-yellow-800"
                            : campaign.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(campaign.emails_sent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.emails_sent > 0
                        ? formatPercentage(
                            (campaign.emails_opened / campaign.emails_sent) *
                              100
                          )
                        : "0%"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.emails_sent > 0
                        ? formatPercentage(
                            (campaign.emails_replied / campaign.emails_sent) *
                              100
                          )
                        : "0%"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPercentage(campaign.conversion_rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
