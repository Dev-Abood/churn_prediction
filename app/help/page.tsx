"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageCircle, Book, Video, Mail, ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// a fixed not functional page, for looks.

const helpCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of ChurnPredict AI",
    icon: Book,
    articles: [
      "How to create your first prediction",
      "Understanding churn prediction results",
      "Setting up customer data",
      "Interpreting confidence scores",
    ],
  },
  {
    title: "Features & Tools",
    description: "Explore all available features",
    icon: Search,
    articles: [
      "Advanced prediction parameters",
      "Session history and analytics",
      "Exporting prediction results",
      "Bulk prediction processing",
    ],
  },
  {
    title: "Account & Billing",
    description: "Manage your account settings",
    icon: MessageCircle,
    articles: [
      "Updating profile information",
      "Managing subscription plans",
      "Understanding usage limits",
      "Payment and billing questions",
    ],
  },
]

const quickActions = [
  {
    title: "Contact Support",
    description: "Get help from our support team",
    icon: Mail,
    action: "mailto:support@churnpredict.ai",
    external: true,
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step guides",
    icon: Video,
    action: "/tutorials",
    external: false,
  },
  {
    title: "API Documentation",
    description: "Technical integration guides",
    icon: ExternalLink,
    action: "https://docs.churnpredict.ai",
    external: true,
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-600">Find answers to your questions and learn how to use ChurnPredict AI</p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for help articles, features, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <action.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    {action.external ? (
                      <a
                        href={action.action}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                      >
                        Open
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <Link href={action.action} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Help Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {helpCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <category.icon className="h-5 w-5 text-blue-600" />
                  <span>{category.title}</span>
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <Link
                        href={`/help/article/${article.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions and answers about ChurnPredict AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">How accurate are the churn predictions?</h3>
            <p className="text-sm text-gray-600">
              Our machine learning models achieve an average accuracy of 85-92% depending on the quality and
              completeness of your customer data. The confidence score provided with each prediction indicates the
              model's certainty.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">What data do I need to provide for predictions?</h3>
            <p className="text-sm text-gray-600">
              You'll need customer demographic information, account details, service subscriptions, and billing data.
              The more complete the data, the more accurate the prediction will be.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Can I integrate ChurnPredict AI with my existing systems?
            </h3>
            <p className="text-sm text-gray-600">
              Yes! We provide a comprehensive REST API that allows you to integrate our prediction engine with your CRM,
              billing systems, or custom applications. Check our API documentation for details.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">How is my data protected?</h3>
            <p className="text-sm text-gray-600">
              We use enterprise-grade encryption and security measures to protect your data. All predictions are
              processed securely, and we never share your customer data with third parties.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
