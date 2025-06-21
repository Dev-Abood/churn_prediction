import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

// define web metadata
export const metadata: Metadata = {
  title: "ChurnPredict AI - Customer Churn Prediction",
  description: "Advanced machine learning platform for customer churn prediction and analysis",
}

export default function RootLayout({
  children,
}: {
  // Take react nodes as children props
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap all components in ClerkProvider */}
        <ClerkProvider> 
        {children}
        <Toaster closeButton  position="bottom-right" />
        </ClerkProvider>
      </body>
    </html>
    
  )
}
