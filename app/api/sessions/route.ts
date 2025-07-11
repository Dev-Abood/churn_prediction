import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(){
  try{
    // authenticate user log in
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // fetch all the prediction sessions for the user
    const sessions = await db.predictionSession.findMany({
      where: {
        // use the associated clerk id to distinguish the user
        userId: userId,
      },
      include: {
        // get the customerData json object as well
        customerData: true,
      },
      orderBy: {
        // order descendingly
        createdAt: "desc",
      },
    }) 

    return NextResponse.json({ sessions }) // display jsonified sessions
  } catch(error){
    // error checking if fetching didn't work
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function DELETE(){
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete all prediction sessions for the user
    await db.predictionSession.deleteMany({
      where: {
        userId: userId,
      },
    })

    // Also delete customer data for the user
    await db.customerData.deleteMany({
      where: {
        userId: userId,
      },
    })

    return NextResponse.json({ message: "All sessions cleared successfully" })
  } catch (error) {
    console.error("Error clearing sessions:", error)
    return NextResponse.json({ error: "Failed to clear sessions" }, { status: 500 })
  }
}
