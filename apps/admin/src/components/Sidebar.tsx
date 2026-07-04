"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@within/config";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-black">
      <Link href="/" className="px-3 text-base font-semibold tracking-tight text-black dark:text-zinc-50">
        Within Admin
      </Link>
      <nav className="mt-6">
        <ul className="flex flex-col gap-0.5">
          {adminNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-md px-3 py-1.5 text-sm ${
                    active
                      ? "bg-zinc-100 font-medium text-black dark:bg-zinc-900 dark:text-zinc-50"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
