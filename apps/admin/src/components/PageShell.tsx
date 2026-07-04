import type { ReactNode } from "react";

import { usingMockContent } from "@/lib/contentSource";

interface PageShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50">{title}</h1>
        {description ? <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p> : null}
      </header>
      {usingMockContent ? (
        <Note>
          Showing mock content — no Supabase project is configured. Set SUPABASE_URL and
          SUPABASE_ANON_KEY to read from a live project.
        </Note>
      ) : null}
      {children}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      {children}
    </p>
  );
}

export function EmptySection({ title, message }: { title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border border-dashed border-zinc-200 px-6 py-12 text-center dark:border-zinc-800">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{title}</p>
      {message ? <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">{message}</p> : null}
    </div>
  );
}
