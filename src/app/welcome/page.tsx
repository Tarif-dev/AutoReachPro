import Link from "next/link";
import { ArrowRight, Mail, Users, BarChart3 } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              AutoReachPro
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to Your Outreach Hub
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your AI-powered client outreach platform is ready. Start building
            meaningful relationships and growing your business today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Lead Management
            </h3>
            <p className="text-gray-600">
              Organize and track all your prospects in one centralized
              dashboard.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              AI Personalization
            </h3>
            <p className="text-gray-600">
              Generate personalized emails that get responses using advanced AI.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Analytics
            </h3>
            <p className="text-gray-600">
              Track your campaign performance and optimize for better results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
