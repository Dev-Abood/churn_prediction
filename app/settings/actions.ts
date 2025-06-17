"use server";

interface UserForm {
  firstName: string;
  lastName: string;
}

export async function actionForm({ firstName, lastName }: UserForm) {}
