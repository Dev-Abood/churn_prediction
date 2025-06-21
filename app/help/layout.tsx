import type React from "react"
import SidebarLayout from "@/components/sidebar-layout"
// layout wrapper

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarLayout>{children}</SidebarLayout>
}
