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

export async function createUser({ firstName, lastName }: UserInput){ // decompose elements
  try {
    // authenticate user log in
    const { userId } = await auth();

    if(!userId){
      throw new Error("Not authenticated");
    }

    if(!firstName || !lastName){
      // force first name and last name inputs
      return { error: "First name and last name are required" };
    }

    // Get user's email from Clerk
    const user = await currentUser();

    // for debugging only:
    // console.log(user);

    if(!user){
      // in case user was not found
      throw new Error("User not found");
    }

    // create or update user in database using Clerk's user ID
    await db.user.upsert({
      where: { 
        // distinguish user uniquely using clerk auth id
        id: userId 
      },
      update: {
        // update elements from the input fields
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

    return { success: true }; // return sucess state on success
  } catch(error){
    // error handling for user creation
    console.error("Error creating user:", error);
    return { error: "Failed to create user profile" };
  }
}

export async function checkOnboardingStatus(){
  // function to check if the user has completed onboarding
  try {
    const { userId } = await auth();

    if(!userId){
      // if clerk doesn't return a unique ID then surely our user is not authenticated
      return { isAuthenticated: false, isOnboarded: false };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return{
      isAuthenticated: true,
      // onboarding depends if we have the rest of the user data, especially first and last names.
      isOnboarded: !!user && !!user.firstName && !!user.lastName,
    };
  } catch(error){
    // error handling
    console.error("Error checking onboarding status:", error);
    return { isAuthenticated: false, isOnboarded: false };
  }
}

export async function getUserData(){
  // function to get the user data
  try {
    const { userId } = await auth();

    if(!userId){
      return null;
    }

    const user = await db.user.findUnique({
      where: { 
        id: userId 
      },
      // no select statement so we retreive back all the data
    });

    return user; // return user data after query
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
}
