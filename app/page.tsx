import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, BarChart3, Shield, Zap, ArrowRight } from "lucide-react"

export default function HomePage(){
  // Home page display
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-black p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">ChurnPredict AI</span>
            </div>
            {/* Clerk Auth buttons */}
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6">
            AI-Powered Customer Analytics
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Predict Customer Churn
            <br />
            <span className="text-gray-600">Before It Happens</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Use advanced machine learning to identify at-risk customers and boost retention rates with actionable
            insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignInButton>
                <Button size="lg" className="px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="px-8">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">99.2%</div>
              <div className="text-gray-600">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">45%</div>
              <div className="text-gray-600">Churn Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to prevent churn</h2>
            <p className="text-xl text-gray-600">Powerful features designed for modern businesses</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-lg w-fit mb-4">
                  <Brain className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-xl">AI-Powered Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced machine learning algorithms analyze customer data to predict churn with exceptional accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-lg w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-xl">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Monitor customer behavior patterns and churn trends with comprehensive analytics dashboards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-lg w-fit mb-4">
                  <Zap className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-xl">Instant Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Receive actionable recommendations and key factors driving churn for each customer analysis.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-lg w-fit mb-4">
                  <Shield className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-xl">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Enterprise-grade security with encrypted data storage and complete privacy protection.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
              <p className="text-xl text-gray-600">Get started in three simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Input Customer Data</h3>
                <p className="text-gray-600">
                  Enter comprehensive customer information including demographics, services, and billing details.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h3>
                <p className="text-gray-600">
                  Our machine learning model processes the data and identifies patterns that indicate churn risk.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Results</h3>
                <p className="text-gray-600">
                  Receive detailed predictions with confidence scores and personalized retention recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to reduce customer churn?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses using ChurnPredict AI to boost customer retention.
          </p>
          <p className="text-gray-500 mt-6">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-black p-2 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">ChurnPredict AI</span>
            </div>
            <p className="text-gray-600 mb-6">Empowering businesses with AI-driven customer retention insights</p>
            <div className="flex justify-center space-x-6 text-gray-500">
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-gray-400 mt-6">© 2024 ChurnPredict AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
