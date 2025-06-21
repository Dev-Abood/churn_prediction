import type React from "react"
import SidebarLayout from "@/components/sidebar-layout"

// layout wrapper

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarLayout>{children}</SidebarLayout>
}
