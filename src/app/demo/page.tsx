import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  BarChart,
  Mail,
  Zap,
  Shield,
} from "lucide-react";

export default function DemoPage() {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Advanced Lead Management",
      description:
        "Import leads via CSV, manual entry, or web forms with intelligent deduplication",
      status: "✅ Completed",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "AI-Powered Campaigns",
      description:
        "Create personalized email campaigns with GPT-4o-mini content generation",
      status: "✅ Completed",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Automation",
      description:
        "Send campaigns with Resend integration and real-time delivery tracking",
      status: "✅ Completed",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Comprehensive Analytics",
      description:
        "Interactive charts, performance metrics, and trend analysis",
      status: "✅ Completed",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-Time Notifications",
      description:
        "Instant alerts for campaign updates, new leads, and system events",
      status: "✅ Completed",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description:
        "Multi-tenant architecture with Row Level Security and data isolation",
      status: "✅ Completed",
    },
  ];

  const techStack = [
    "Next.js 14.2.5",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "OpenAI GPT-4o-mini",
    "Resend",
    "Recharts",
    "Sonner",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4 mr-2" />
            Development Complete - Ready for Production
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AutoReachPro
            <span className="block text-blue-600">Development Complete</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your AI-powered client outreach SaaS platform is now fully
            functional with enterprise-grade features, comprehensive analytics,
            and scalable architecture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/dashboard-demo"
              className="flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Enhanced Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Original Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Implemented Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <span className="text-sm text-green-600 font-medium">
                      {feature.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Technology Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            API Endpoints Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Lead Management</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  GET /api/leads - List leads
                </li>
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  POST /api/leads - Create lead
                </li>
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  POST /api/leads/import - CSV import
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                Campaign Management
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  GET /api/campaigns - List campaigns
                </li>
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  POST /api/campaigns - Create campaign
                </li>
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  POST /api/campaigns/[id]/send - Send emails
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                Analytics & Settings
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  GET /api/analytics - Performance metrics
                </li>
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  GET /api/settings - User preferences
                </li>
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  GET /api/templates - Email templates
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Development Complete */}
        <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 AutoReachPro Development Complete!
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Your SaaS platform is now ready with all core features implemented:
            lead management, AI-powered campaigns, email automation, analytics,
            and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/dashboard-demo"
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Full Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
