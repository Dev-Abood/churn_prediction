import type React from "react"
import { checkOnboardingStatus } from "@/app/onboarding/actions"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user has completed onboarding
  await checkOnboardingStatus()

  return <>{children}</>
}
