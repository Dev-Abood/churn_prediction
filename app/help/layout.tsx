import type React from "react"
import SidebarLayout from "@/components/sidebar-layout"

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarLayout>{children}</SidebarLayout>
}
