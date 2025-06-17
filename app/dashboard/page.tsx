"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, History, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import SidebarLayout from "@/components/sidebar-layout"

interface PredictionSession {
  id: string
  timestamp: string
  prediction: "Churn" | "No Churn"
  confidence: number
  customerData: any
}

export default function DashboardPage() {
  const { user } = useUser()
  const [recentSessions, setRecentSessions] = useState<PredictionSession[]>([])

  useEffect(() => {
    // Load recent sessions from localStorage
    const sessions = localStorage.getItem("prediction_sessions")
    if (sessions) {
      setRecentSessions(JSON.parse(sessions).slice(0, 5))
    }
  }, [])

  const stats = {
    totalPredictions: recentSessions.length,
    churnPredictions: recentSessions.filter((s) => s.prediction === "Churn").length,
    avgConfidence:
      recentSessions.length > 0
        ? Math.round(recentSessions.reduce((acc, s) => acc + s.confidence, 0) / recentSessions.length)
        : 0,
  }

  return (
    <SidebarLayout>
      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.firstName || "there"}!</h2>
          <p className="text-gray-600">
            Ready to analyze customer churn? Start a new prediction or review your recent sessions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPredictions}</div>
              <p className="text-xs text-muted-foreground">Lifetime predictions made</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Predictions</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.churnPredictions}</div>
              <p className="text-xs text-muted-foreground">Customers likely to churn</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.avgConfidence}%</div>
              <p className="text-xs text-muted-foreground">Average prediction confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link href="/predict">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Plus className="h-6 w-6 text-blue-600" />
                  <CardTitle>New Prediction</CardTitle>
                </div>
                <CardDescription>Start a new churn prediction analysis for a customer</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Create New Prediction</Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link href="/sessions">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <History className="h-6 w-6 text-green-600" />
                  <CardTitle>View Sessions</CardTitle>
                </div>
                <CardDescription>Review your prediction history and past analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View All Sessions
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Predictions</CardTitle>
            <CardDescription>Your latest churn prediction sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No predictions yet</p>
                <Link href="/predict">
                  <Button>Create Your First Prediction</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${session.prediction === "Churn" ? "bg-red-100" : "bg-green-100"}`}
                      >
                        {session.prediction === "Churn" ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Prediction: {session.prediction}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(session.timestamp).toLocaleDateString()} at{" "}
                          {new Date(session.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={session.prediction === "Churn" ? "destructive" : "default"}>
                        {session.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentSessions.length >= 5 && (
                  <div className="text-center pt-4">
                    <Link href="/sessions">
                      <Button variant="outline">View All Sessions</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  )
}
