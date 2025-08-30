"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createUserProfile } from "./create-profile";

export async function signIn(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  try {
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("full_name") as string;

    console.log("Signup attempt:", { email, fullName });

    const data = {
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    };

    const { data: authData, error } = await supabase.auth.signUp(data);

    console.log("Supabase signup response:", {
      user: authData.user?.id,
      session: authData.session?.access_token ? "present" : "null",
      error: error?.message,
    });

    if (error) {
      console.error("Signup error:", error);
      return { error: error.message };
    }

    if (authData.user) {
      console.log("User created successfully:", authData.user.id);
      return { success: true, userId: authData.user.id };
    } else {
      return { error: "Failed to create user - no user data returned" };
    }
  } catch (err: any) {
    console.error("Signup exception:", err);
    return { error: `Signup failed: ${err.message}` };
  }
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function getUser() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
