"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Loader2 } from "lucide-react"
import { createUser } from "@/app/onboarding/actions"

export default function OnboardingPage(){
  // since we're using server actions we can refresh the router easily
  const router = useRouter() 
  // states for tracking information
  const { user, isLoaded } = useUser()
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if(!isLoaded){
    return(
      // display loader component if loading state is true
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // handle form submit for the onboarding page
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try{
      if(!firstName.trim() || !lastName.trim()){
        // validate name fields are inputted
        throw new Error("Please provide both first name and last name")
      }

      if(!user){
        throw new Error("User not authenticated")
      }

      // call the server action to create the user in the database
      await createUser({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName,
        lastName,
      })

      // Redirect to dashboard after successful onboarding
      router.push("/dashboard")
      router.refresh()
    } catch(err){
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // JSX return code
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ChurnPredict AI</span>
          </div>
        </div>

        <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Complete Your Profile</CardTitle>
            <CardDescription className="text-gray-300">
              Please provide your name to complete the setup of your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-200">
                  First Name
                </Label>
                {/* input label to edit first name */}
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-200">
                  Last Name
                </Label>
                {/* input panel for last name */}
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {/* tracking submitting state to display a loader */}
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
            <p className="text-sm text-gray-400">This information will be used to personalize your experience</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
