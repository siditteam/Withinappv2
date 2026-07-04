import type { ReactNode } from "react";

import { Sidebar } from "@/components/Sidebar";
import { getAdminSession } from "@/lib/adminAuth";
import { signOut } from "@/app/login/actions";

export default async function ConsoleLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  // Signed in but not on the admin roster: RLS would silently hide drafts
  // and reject writes anyway -- say so instead of half-working.
  if (session.mode === "signed-in" && !session.isAdmin) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            No admin access
          </h1>
          <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {session.email} is signed in but has no admin role. An existing admin can grant one by
            adding a row to admin_roles.
          </p>
          <SignOutButton />
        </div>
      </main>
    );
  }

  return (
    <>
      <Sidebar
        footer={
          session.mode === "signed-in" ? (
            <div className="flex flex-col gap-2 px-3">
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400" title={session.email}>
                {session.email}
              </p>
              <SignOutButton />
            </div>
          ) : (
            <p className="px-3 text-xs text-zinc-400 dark:text-zinc-500">Read-only preview</p>
          )
        }
      />
      <main className="min-w-0 flex-1 px-10 py-8">{children}</main>
    </>
  );
}

function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-xs font-medium text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
      >
        Sign out
      </button>
    </form>
  );
}
