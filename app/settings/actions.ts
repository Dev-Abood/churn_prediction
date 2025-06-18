"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getUserProfile() {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Not authenticated")
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw new Error("Failed to fetch user profile")
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Not authenticated")
    }

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string

    if (!firstName?.trim() || !lastName?.trim()) {
      throw new Error("First name and last name are required")
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    })

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update profile" }
  }
}
