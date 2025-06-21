"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, User, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import ConfirmationModal from "@/components/confirmation-modal"
import { getUserProfile, updateUserProfile } from "./actions"

// interface for the data displayed and manipulated in this page
interface UserProfile {
  firstName: string | null
  lastName: string | null
  email: string
}

// This page just fetches user data and handles the submit changes button to update the user first and last names.
export default function SettingsPage(){
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      const profile = await getUserProfile()
      setUserProfile(profile)
      setFirstName(profile.firstName || "")
      setLastName(profile.lastName || "")
    } catch (error) {
      console.error("Error fetching user profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveClick = () => {
    setSaveModalOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append("firstName", firstName)
      formData.append("lastName", lastName)

      const result = await updateUserProfile(formData)

      if (result.success) {
        setUserProfile(result.user!)
        toast.success("Profile updated successfully!", {
          description: "Your profile information has been saved.",
        })
      } else {
        toast.error("Failed to update profile", {
          description: result.error,
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile", {
        description: "Please try again later.",
      })
    } finally {
      setIsSaving(false)
      setSaveModalOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Failed to load profile data</p>
          <Button onClick={fetchUserProfile} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and profile information</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>Update your personal information and display name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input id="email" value={userProfile.email} disabled className="bg-gray-50" />
              </div>
              <p className="text-xs text-gray-500">Email address cannot be changed from this page</p>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveClick} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details and subscription status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                <p className="text-sm text-gray-900">
                  {userProfile.firstName} {userProfile.lastName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-sm text-gray-900">{userProfile.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Plan</Label>
                <p className="text-sm text-gray-900">Pro Plan</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <p className="text-sm text-green-600 font-medium">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Confirmation Modal */}
      <ConfirmationModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleSave}
        title="Save Profile Changes"
        description="Are you sure you want to update your profile information?"
        confirmText="Save Changes"
        confirmVariant="default"
      />
    </div>
  )
}
