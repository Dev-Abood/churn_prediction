import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChurnPredict AI - Customer Churn Prediction",
  description: "Advanced machine learning platform for customer churn prediction and analysis",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider> 
        {children}
        <Toaster closeButton  position="bottom-right" />
        </ClerkProvider>
      </body>
    </html>
    
  )
}
