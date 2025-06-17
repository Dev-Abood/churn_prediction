"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

//! it didn't work to use FormData, so I create an interface instead
interface UserInput {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export async function createUser({ id, firstName, lastName }: UserInput) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Not authenticated");
    }
    if (!firstName || !lastName) {
      return { error: "First name and last name are required" };
    }

    // Get user's email from Clerk
    const user = await currentUser();
    console.log(user);

    if (!user) {
      throw new Error("User not found");
    }

    // Create or update user in database using Clerk's user ID
    await db.user.upsert({
      where: { id: userId },
      update: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: user.emailAddresses[0]?.emailAddress || "",
      },
      create: {
        id: userId, // Use Clerk's user ID as primary key
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: user.emailAddresses[0]?.emailAddress || "",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user profile" };
  }
}

export async function checkOnboardingStatus() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { isAuthenticated: false, isOnboarded: false };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return {
      isAuthenticated: true,
      isOnboarded: !!user && !!user.firstName && !!user.lastName,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { isAuthenticated: false, isOnboarded: false };
  }
}

export async function getUserData() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
}
