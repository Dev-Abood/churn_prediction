import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  // If not authenticated, redirect to sign-in
  if (!userId) {
    redirect("/sign-in")
  }

  // Check if user has already completed onboarding
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    // If user exists and has firstName and lastName, redirect to dashboard
    if (user?.firstName && user?.lastName) {
      redirect("/dashboard")
    }
  } catch (error) {
    // If there's an error, allow access to onboarding page
    console.error("Error checking onboarding status:", error)
  }

  return <>{children}</>
}
