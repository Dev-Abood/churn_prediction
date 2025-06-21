"use server"
// server actions file

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getDashboardData(){
  try {
    // authenticate user log in
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Not authenticated")
    }

    // Get user data from database
    const user = await db.user.findUnique({
      where: {
        // Distinguish user using the clerk id provided
         id: userId 
        },
      select:{
        // name will be used for display
        firstName: true,
        lastName: true,
      },
    })

    // Get all prediction sessions for stats
    const allSessions = await db.predictionSession.findMany({
      where: { userId },
      include: {
        // include customerData object for each prediction session to display the data
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

    // get most recent 5 sessions to display in recent section
    const recentSessions = allSessions.slice(0, 5)

    // Calculate stats displayed on the dashbaord

    // TOTAL PREDICTIONS
    const totalPredictions = allSessions.length
    // CHURN PREDICTION CASES
    const churnPredictions = allSessions.filter( // filter based on churn prediction type
      (session) => session.prediction === "CHURN"
    ).length

    // NO CHURN PREDICTION CASES
    const noChurnPredictions = totalPredictions - churnPredictions

    // AVERAGE CONFIDENCE 
    const avgConfidence =
      totalPredictions > 0
        ? Math.round(allSessions.reduce(
          // total confidence / sum of total predictions
          (acc, session) => acc + session.confidence, 0) / totalPredictions
        ) : 0 // if total preidctions are zero, display 0

    // Calculate this month's predictions
    const now = new Date()
    // track start of the month vs now date
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthSessions = allSessions.filter((session) => new Date(session.createdAt) >= startOfMonth)

    return {
      // return all the data objects that will be mapped in frontend tsx
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
        // make the createdAt() time column in ISO formatting
        createdAt: session.createdAt.toISOString(),
        customerName: session.customerData.customerName,
        contract: session.customerData.contract,
        monthlyCharges: session.customerData.monthlyCharges,
        tenure: session.customerData.tenure,
      })),
    }
  } catch(error){
    // in case of any errors
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to fetch dashboard data")
  }
}
