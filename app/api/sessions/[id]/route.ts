import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    // authenticate user log in, send an error back if not logged in
    const { userId } = await auth()

    if(!userId){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessionId = params.id

    // First, find the session to ensure it belongs to the user
    const session = await db.predictionSession.findFirst({
      where: { // validate using the clerk user id
        id: sessionId,
        userId: userId,
      },
    })

    if(!session){
      // if session is faulty or not found, display an error message
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Delete the prediction session through the ORM
    await db.predictionSession.delete({
      where: {
        id: sessionId,
      },
    })

    // delete the associated customer data if no other sessions reference it
    const otherSessions = await db.predictionSession.findMany({
      where: {
        customerDataId: session.customerDataId,
      },
    })

    if(otherSessions.length === 0){  
      await db.customerData.delete({ // delete the customerData row
        where: {
          id: session.customerDataId,
        },
      })
    }

    return NextResponse.json({ message: "Session deleted successfully" }) // return success message
  } catch(error){
    console.error("Error deleting session:", error)
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 })
  }
}
