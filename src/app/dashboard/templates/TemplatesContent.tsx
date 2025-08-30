"use client";

import { useState } from "react";
import { Plus, Search, Mail, Copy, Edit, Trash2, Sparkles } from "lucide-react";
import Link from "next/link";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  is_default: boolean;
  usage_count: number;
  created_at: string;
}

interface TemplatesContentProps {
  templates: EmailTemplate[];
}

export default function TemplatesContent({ templates }: TemplatesContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "outreach":
        return "bg-blue-100 text-blue-800";
      case "follow-up":
        return "bg-green-100 text-green-800";
      case "meeting":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Email Templates
            </h1>
            <p className="text-gray-600">
              Manage your email templates for consistent outreach messaging.
            </p>
          </div>
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
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
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="outreach">Outreach</option>
            <option value="follow-up">Follow-up</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>
      </div>

      {/* Templates grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {templates.length === 0
              ? "No templates yet"
              : "No templates match your search"}
          </h3>
          <p className="text-gray-600 mb-6">
            {templates.length === 0
              ? "Create your first template to streamline your outreach process."
              : "Try adjusting your search terms or filters."}
          </p>
          {templates.length === 0 && (
            <Link
              href="/dashboard/templates/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {template.name}
                  </h3>
                  {template.is_default && (
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  {!template.is_default && (
                    <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                      template.category
                    )}`}
                  >
                    {template.category}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Subject:
                  </p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded truncate">
                    {template.subject}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Preview:
                  </p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded line-clamp-3">
                    {template.content.substring(0, 120)}...
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Used {template.usage_count} times
                  </span>
                  <Link
                    href={`/dashboard/campaigns/new?template=${template.id}`}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
