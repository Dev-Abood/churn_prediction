import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // authenticate user
    const { userId } = await auth()

    if (!userId) {
      // send error if user is not logged in
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const customerData = body // get the request data

    if (!customerData) {
      // check if null
      return NextResponse.json({ error: "No customer data provided" }, { status: 400 })
    }

    // Validate required fields
    if (!customerData.customerName?.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 })
    }

    // call Flask API endpoint for prediction
    //TODO: process.env.FLASK_BASE_URL
    const flaskResponse = await fetch("http://localhost:5000/predict", {
      method: "POST", // post request
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerData }), // send in the customerData back to the app.py
    })

    if (!flaskResponse.ok) {
      // check if flask response was faulty
      const errorData = await flaskResponse.json()
      throw new Error(errorData.error || "Flask API error")
    }

    const predictionResult = await flaskResponse.json() // jsonify the response result

    // Save customer data to database using prisma ORM
    const savedCustomerData = await db.customerData.create({
      data: {
        userId: userId,
        customerName: customerData.customerName.trim(),
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

    // save prediction session to database
    const predictionSession = await db.predictionSession.create({
      data: {
        userId: userId,
        customerDataId: savedCustomerData.id,
        // manually set the prediction type to the enumeration type
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
