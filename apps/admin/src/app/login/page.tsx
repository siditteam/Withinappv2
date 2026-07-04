import { redirect } from "next/navigation";

import { supabaseConfigured } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  // Mock mode has no accounts; the console is an open read-only preview.
  if (!supabaseConfigured) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <header className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            Within Admin
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in with your admin account. There is no self-service sign-up — accounts are
            provisioned by an existing admin.
          </p>
        </header>
        <LoginForm />
      </div>
    </div>
  );
}
