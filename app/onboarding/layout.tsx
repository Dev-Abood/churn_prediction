import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

// layout wrapper for onboarding page

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()


  //! important
  // If not authenticated, redirect to sign-in
  if(!userId){
    redirect("/sign-in")
  }

  // Check if user has already completed onboarding
  try {
    const user = await db.user.findUnique({
      where: { 
        id: userId 
      },
    })

    // If user exists and has firstName and lastName, redirect to dashboard
    if (user?.firstName && user?.lastName){
      // this validates that the user is onboarded
      redirect("/dashboard")
    }
  } catch(error){
    console.error("Error checking onboarding status:", error)
  }

  return <>{children}</>
}
