"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// server actions file for settings page, mainly we only need to fetch user data, and update first name and last name
// based on user edit
export async function getUserProfile(){
  try{
    const { userId } = await auth()

    if(!userId){
      // error handling for non authenticated user
      throw new Error("Not authenticated")
    }


    // Fetch current user information
    const user = await db.user.findUnique({
      where: { 
        // uniquely identify the primary key using the provided clerk id
        id: userId 
      },
      select: {
        // get only the data needed to display in the settings page
        firstName: true,
        lastName: true,
        email: true,
      },
    })

    if(!user){
      // in case no user object was returned
      throw new Error("User not found")
    }

    return user // return back this user object for the frontend to display
  } catch(error){
    // error checking
    console.error("Error fetching user profile:", error)
    throw new Error("Failed to fetch user profile")
  }
}

//! Using the predefined FormData class
export async function updateUserProfile(formData: FormData){
  try{
    // authenticate user log in
    const { userId } = await auth()

    if(!userId){
      throw new Error("Not authenticated")
    }

    // use the .get function since we're using FormData object
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string


    // error check that the first name and last name is provided
    if(!firstName?.trim() || !lastName?.trim()){
      throw new Error("First name and last name are required")
    }


    // update the user information, function to place for onSubmit

    const updatedUser = await db.user.update({
      where: { 
        id: userId 
      },
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
