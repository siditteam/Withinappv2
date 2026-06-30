import { adminNavItems } from "@within/config";
import { NavList } from "@within/ui";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-6 px-16 py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Within Admin
        </h1>
        <NavList items={adminNavItems} />
      </main>
    </div>
  );
}
