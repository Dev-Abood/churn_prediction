import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const customerData = body

    if (!customerData) {
      return NextResponse.json({ error: "No customer data provided" }, { status: 400 })
    }

    // Call Flask API for prediction
    const flaskResponse = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerData }),
    })

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json()
      throw new Error(errorData.error || "Flask API error")
    }

    const predictionResult = await flaskResponse.json()

    // Save customer data to database
    const savedCustomerData = await db.customerData.create({
      data: {
        userId: userId,
        gender: customerData.gender,
        seniorCitizen: customerData.seniorCitizen,
        partner: customerData.partner,
        dependents: customerData.dependents,
        tenure: customerData.tenure ? Number.parseInt(customerData.tenure) : null,
        contract: customerData.contract,
        paperlessBilling: customerData.paperlessBilling,
        paymentMethod: customerData.paymentMethod,
        phoneService: customerData.phoneService,
        multipleLines: customerData.multipleLines,
        internetService: customerData.internetService,
        onlineSecurity: customerData.onlineSecurity,
        onlineBackup: customerData.onlineBackup,
        deviceProtection: customerData.deviceProtection,
        techSupport: customerData.techSupport,
        streamingTV: customerData.streamingTV,
        streamingMovies: customerData.streamingMovies,
        monthlyCharges: customerData.monthlyCharges ? Number.parseFloat(customerData.monthlyCharges) : null,
        totalCharges: customerData.totalCharges ? Number.parseFloat(customerData.totalCharges) : null,
      },
    })

    // Save prediction session to database
    const predictionSession = await db.predictionSession.create({
      data: {
        userId: userId,
        customerDataId: savedCustomerData.id,
        prediction: predictionResult.prediction === "Churn" ? "CHURN" : "NO_CHURN",
        confidence: predictionResult.confidence,
        keyFactors: predictionResult.factors || [],
        modelVersion: predictionResult.model_version || "1.0",
        apiResponseTime: predictionResult.apiResponseTime || null,
      },
    })

    return NextResponse.json({
      ...predictionResult,
      sessionId: predictionSession.id,
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process prediction" },
      { status: 500 },
    )
  }
}
