"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase/server";

export interface SignInState {
  error: string | null;
}

export async function signIn(_previous: SignInState, formData: FormData): Promise<SignInState> {
  if (!supabaseConfigured) {
    redirect("/");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately vague -- don't reveal which of the two was wrong.
    return { error: "That email and password combination didn't work." };
  }

  redirect("/");
}

export async function signOut(): Promise<void> {
  if (supabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
