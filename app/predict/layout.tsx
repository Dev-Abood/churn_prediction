import type React from "react"
import { checkOnboardingStatus } from "@/app/onboarding/actions"

// layout wrapper

export default async function PredictLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user has completed onboarding
  await checkOnboardingStatus()

  return <>{children}</>
}
