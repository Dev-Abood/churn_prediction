import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Shield,
  Brain,
  Zap,
  Target,
  ArrowRight,
  Star,
  Globe,
  Award,
} from "lucide-react";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              ChurnPredict AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
              <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-purple-100 text-purple-800 hover:bg-purple-200">
            AI-Powered Customer Analytics
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Predict Customer
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Churn{" "}
            </span>
            Before It Happens
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Harness the power of advanced machine learning to identify at-risk
            customers, boost retention rates, and maximize your revenue with
            actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">99.2%</div>
            <div className="text-gray-300">Prediction Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">45%</div>
            <div className="text-gray-300">Churn Reduction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">$2.4M</div>
            <div className="text-gray-300">Revenue Saved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">10K+</div>
            <div className="text-gray-300">Happy Customers</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Powerful Features for Smart Businesses
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to understand, predict, and prevent customer
            churn
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg w-fit mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">
                AI-Powered Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                Advanced machine learning algorithms analyze 19+ customer data
                points to predict churn with exceptional accuracy
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-lg w-fit mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">
                Confidence Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                Get detailed confidence scores for each prediction, helping you
                prioritize your retention efforts effectively
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg w-fit mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">
                Real-time Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                Monitor customer behavior patterns and churn trends with
                comprehensive analytics dashboards
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg w-fit mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">
                Instant Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                Receive actionable recommendations and key factors driving churn
                for each customer analysis
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="bg-gradient-to-r from-teal-500 to-green-500 p-3 rounded-lg w-fit mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">
                Secure & Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                Enterprise-grade security with encrypted data storage and
                complete privacy protection for your customer data
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg w-fit mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">
                Session Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                Track and manage all your prediction sessions with detailed
                history and performance metrics
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started with churn prediction in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">1</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Input Customer Data
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Enter comprehensive customer information including demographics,
              services, billing details, and usage patterns
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">2</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              AI Analysis
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our advanced machine learning model processes the data and
              identifies patterns that indicate churn risk
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">3</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Get Actionable Results
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Receive detailed predictions with confidence scores and
              personalized retention recommendations
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Trusted by Industry Leaders
          </h2>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <Globe className="h-12 w-12 text-white" />
            <Award className="h-12 w-12 text-white" />
            <Star className="h-12 w-12 text-white" />
            <Shield className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6 text-lg">
                "ChurnPredict AI helped us reduce customer churn by 40% in just
                3 months. The insights are incredibly accurate and actionable."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div>
                  <div className="text-white font-semibold">John Smith</div>
                  <div className="text-gray-400">CEO, TechCorp</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6 text-lg">
                "The confidence scores are game-changing. We now know exactly
                which customers to focus our retention efforts on."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MJ</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Maria Johnson</div>
                  <div className="text-gray-400">VP Marketing, DataFlow</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6 text-lg">
                "Easy to use, powerful insights, and excellent customer support.
                This tool has transformed our customer retention strategy."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">RW</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Robert Wilson</div>
                  <div className="text-gray-400">Director, Analytics Plus</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Reduce Customer Churn?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using ChurnPredict AI to boost
              customer retention and maximize revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="text-blue-100 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              ChurnPredict AI
            </span>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering businesses with AI-driven customer retention insights
          </p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-gray-500 mt-6">
            © 2024 ChurnPredict AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
