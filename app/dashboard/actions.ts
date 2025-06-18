"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getDashboardData() {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Not authenticated")
    }

    // Get user data from database
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
      },
    })

    // Get all prediction sessions for stats
    const allSessions = await db.predictionSession.findMany({
      where: { userId },
      include: {
        customerData: {
          select: {
            customerName: true,
            contract: true,
            monthlyCharges: true,
            tenure: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get recent 5 sessions
    const recentSessions = allSessions.slice(0, 5)

    // Calculate stats
    const totalPredictions = allSessions.length
    const churnPredictions = allSessions.filter((session) => session.prediction === "CHURN").length
    const noChurnPredictions = totalPredictions - churnPredictions
    const avgConfidence =
      totalPredictions > 0
        ? Math.round(allSessions.reduce((acc, session) => acc + session.confidence, 0) / totalPredictions)
        : 0

    // Calculate this month's predictions
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthSessions = allSessions.filter((session) => new Date(session.createdAt) >= startOfMonth)

    return {
      user: {
        firstName: user?.firstName || "User",
        lastName: user?.lastName || "",
      },
      stats: {
        totalPredictions,
        churnPredictions,
        noChurnPredictions,
        avgConfidence,
        thisMonth: thisMonthSessions.length,
      },
      recentSessions: recentSessions.map((session) => ({
        id: session.id,
        prediction: session.prediction,
        confidence: session.confidence,
        createdAt: session.createdAt.toISOString(),
        customerName: session.customerData.customerName,
        contract: session.customerData.contract,
        monthlyCharges: session.customerData.monthlyCharges,
        tenure: session.customerData.tenure,
      })),
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to fetch dashboard data")
  }
}
